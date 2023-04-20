/**
 * Copyright (c) 2023 DASverse
 * Description:  Dictionary that only collects 4 ~ 10 character limited sized words excluding special characters, such as ‘-=’;/][ ’, and numbers
 * Library for random dummy words : WordsAPI
 * IDE    : VSCode
 * DB     : MySQL using workbench
 * Date   : 2023-04-11
 * Author : Tae Jin Kim
 * 
 * Problem : Argument + Auto_Increment mysql issue ==> Running 1 time using argument has no index gap in my mysql DB, but running multiple times using arguments,
                                                       creates auto_increment skipping because new execution starts from where it left from previous index.
 *               
                                                       
 * Solution : Create another table and user wordt table as backup table just like dummy table or set auto-increment = 1 to fill up the gap
 *            - However, setting auto-increment = 1 can cause poetntial issue with data integrity and referential integrity, so it is recommended to use backup table.
 *            - Therefore, there is a thrid table, WordDictionary.
 * 
 * result : Faker ==> 1,227 words, 
 *          capitalize my title ==> 2,234 words (dumyw.txt file)
 *          WordsAPI ==> a lot. (~6000 so far, 2023-04-17)
 *  
 *          TOTAL ==> 11,706 ( 2023-04-18 12:18 pm )
 * */

import { createConnection } from 'mysql';
import axios from 'axios';

// creating connection to 'Dictrionary' database from workbench
var con = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'testpw',
    database: 'dictionary'   
});

// *[1] Generate only 12 random words from difctionary whenever program randomly selects
var sql = `SELECT worddictionary.words FROM worddictionary ORDER BY RAND() LIMIT 12`;

// connecting connection
con.connect(function(err) {
    // exception handling; if there is any errors, throw error
    if (err) throw err;

    /**
     * === RunProgram() ===
     * Words from WordsAPI : 1) Using the API from basic plan of RapidAPI, grab the WordsAPI's api and store those english vocabs into dummyt table from dictionary database
     *                           2) Getting random a word from wordt table from DB and put the random word into typeOf endpoint to get multiple english words to store
     *                           3) Second step requires 1~2 api calls; calling typeOf + repeating process if the random word does not have any typeOf results
     *                           4) Everything is auto generated after executing program
     *  At the end of query, data from dummyt is being stored into second dummy table: wordt.
     *  The main database wordDictionary will store data via workbench to avoid auto_increment, meaning both of dummyt and wordt table have gaps between index.
     */
    var totalCount = 0;
    let executionCount = 1;
    let aftT = 0;
    let b4T = 0;

    con.query(`select COUNT(*) from dictionary.wordt`, function (err, result, fields) {
        if (err) throw err;
        b4T = parseInt(result[0]['COUNT(*)']);    
    });

    function runProgram() {
        // Indicator that program will execute.
        console.log('[', new Date(), ']',     "Program executed");
        console.log('-------------------------------------------------------------------------------------------------------------------------------');
        console.log('');
        
        // =======================================  Your program logic STARTs here  ===================================================================================
        console.log("Connection Made, now program will generate 12 results " + "\r\n");
        
        // global variable to calculate how many words are added
        var afterCount;
        var beforeCount;

        /** 
         * Getting stored number of word from wordt DB to set value of afterCount and beforeCount
         * Because program needs to be synchronized in order to get before and after, Promise is being used for program to wait until previous steps end.
         */
        async function getCount() {
            return new Promise ((resolve, reject) => {
                con.query(`SELECT COUNT(*) FROM dictionary.wordt`, (error, results, fields) => {
                    if (error) reject(error);
                    // results[0] == row data from dictionary.wordt
                    // ==> Counting how many rows are in wordt table.
                    resolve(results[0]['COUNT(*)']);
                    console.log("Before Count: " + results[0]['COUNT(*)']);
                    beforeCount = results[0]['COUNT(*)'];
                })
            });  
        }
        
        // ------------------------------------------------------------------------------------------------------------------------------------------------------
        // *[1] sql will ==> Generate only 12 random words from dictionary.worddictionary whenever program randomly selects
        con.query(sql, function(err, result, fields) {  
            /** Global variable to use apply random word from wordt DB to typeOf endpoint */
            var randomWord;

            /** 
             * Generating random words from wordt DB duo to efficiency and reducing API call request
             * Limit output to 1 row to get only one random word
             * */ 
            async function getRandomWord() {
                    return new Promise ((resolve, reject) => {
                        con.query(`SELECT wordt.word FROM wordt ORDER BY RAND() LIMIT 1`, (error, results, fields) => {
                            if (error) reject (error);
                            beforeCount = getCount();
                            // only obtaining word that we need to use in TypeOf endpoint to auto-generate list of words
                            resolve(results[0].word);
                        })
                    });  
            }
            
            // -------------------------------------------------------------------------------------------
            /** 
             * === Generating TypeOf ===
             * From randomWord global variable above, request typeOf words from WordsAPI server
             * If there is no match for typeOf, 
             *      call getTypeOf function again to re-generate random word from wordt DB to see if there is any typeOf words as recursive function
             * If there is match for typeOf, 
             *      print out list of words and ends recursive function.
             * */
            (async function getTypeOf() {
                // From randomWord, generate typeOf possible words: 0 to ~20
                // Used await to make sure that program can obtain the amount of words rows from DB table to compare with afterCount to see how many are added 
                // Where beforeCount happens
                randomWord = await getRandomWord();
                const options = {
                    method: 'GET',
                    // randomWord is coming from getRandomWord: random word endpoint API from WordsAPI
                    url: `https://wordsapiv1.p.rapidapi.com/words/${randomWord}/typeOf`,
                    params: {
                        // output is restricted with 10 letters
                        // However restricting more causes error, so filtering special character is not being applied here.
                        lettersMin : 1,
                        lettersMax : 10
                    },
                    headers: {
                        // Given from RapidAPI 
                        'X-RapidAPI-Key': '23d8fd1ae0mshd1c1a502dc62452p11f6fejsn3c18991aa9fb',
                        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
                    }, 
                };
                
                /**  
                 * There are many unexpected possibilities of getting words from typeOf using random word,
                 *      so this request will make sure that program is getting any values from typeOf
                 * However, if there is no matched data using random data, program cannot grantees how many API calls will be made: usually 1 ~ 2
                 * getTyeOf() function is being used for recursive function to keep calling the method to get matched data
                 */
                // stopper when API call exceed set time
                if(executionCount > 10) { 
                    console.log("exceed");
                    // con.query(`INSERT INTO wordadded (callMade, wordAdded) VALUES(${executionCount}, ${totalCount})`);
                    // console.log
                    // console.log(`Total count: ${totalCount}`);
                    // const myArray = [
                    //     { TotalAdded : totalCount, b4T, aftT}
                    //     // {BeforeCount: b4T},
                    //     // {AfterCount: aftT},
                    // ];
                    // console.table(myArray);
                    return;
                }
                axios.request(options).then(async function (response) {
                    // API call counter 
                    executionCount++;   

                    // If there is not data found using random word, do it again!
                    if (response.data.typeOf.length == 0) {
                        console.log(`No Match Found for ${randomWord}... Retrying...`)
                        // recursive to ~execute again~
                        getTypeOf();
                    } else {
                        console.log('Matched typeOf : ' + response.data.typeOf);
                        // If program received data from WordsAPI, filter out the words and put those filtered values into DB.
                        for (var i = 0; i < response.data.typeOf.length-1; i++) {
                            if (response.data.typeOf[i].length <= 10 && (response.data.typeOf[i].search(/[^a-zA-Z]+/) === -1) && response.data.typeOf[i].length >= 4) {
                                // making sure previous steps are done so that DB does not store any bad random words
                                await new Promise ((resolve, reject) => {
                                    con.query(`INSERT IGNORE INTO dictionary.dummyt (dummyw) VALUES("${response.data.typeOf[i]}" )`, (error, result, fields) => {        
                                        if (error) reject(error);
                                        resolve();
                                    });
                                }); 
                            }
                        }
                    }

                    // Transfer all filtered data into the word table, wordt, so that database can have correct data and stay in right order of incrementation.
                    con.query(`INSERT IGNORE INTO dictionary.wordt (word) (SELECT dummyw FROM dictionary.dummyt )`);

                    /** 
                    * By selecting all the counts from wordt table after inserting all information from dummy,
                    * program will be able to calculate total amount of words that are added (afterCount - beforeCount)
                    * beforeCount is being made from "getCount() => getRandomWords() => getTypeOf()"
                    * afterCount is being made from end of "getTypeOf"
                    */
                    con.query(`SELECT COUNT(*) FROM dictionary.wordt`, (error, results, fields) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log("After Count: " + results[0]['COUNT(*)']);
                            afterCount = results[0]['COUNT(*)'];
                            // store afterCount value with global value to use printing out result table at the end of execution.
                            aftT = afterCount;    
                            if(isNaN(afterCount - beforeCount)) {} 
                            else{
                                console.log("=======================================================================")
                                console.log("new words added: " + (afterCount - beforeCount));
                                console.log("=======================================================================")
                                totalCount += (afterCount - beforeCount);
                            }
                        }
                    });
                }).catch(function (error) {
                    console.log  ("================================================================================");
                    console.error("|| Following Word Not Found ||" + randomWord + "|| " + error.message );
                    console.log  ("================================================================================");
                });
            })();
            
            /**
             * (format1)
             * printing out 12 random results as Wallet word format
             * word1 word2 word3 word4 word5 word6
             * word7 word8 word9 word10 word11 word12
             */
            // for(let i = 0; i < 12; i++) {
            //     if (i == 6) { console.log(""); }
            //     process.stdout.write(result[i].words + " ");
            // }
            // console.log(""); console.log("");
            
            // Instead of printing out words into wallet form, table is being used for better visual
            // However, the format is needed, we can always use the format above (format1)
            console.table(result);
        }); // con.query
        
    } // runProgram
    // =======================================  Your program logic ENDs here  ===================================================================================
    
    /**
     * Every time program repeats, execution counts goes up by 1
     * Shows users execution time and date ==> "Execution 3/4 at    [ 2023-04-13T00:32:49.061Z ] "
     * */
    // Letting users know how many counts are done and how many counts are left.
    function runInterval() {
        return new Promise((resolve, reject) => {
            // Here is API request call limit set by programmer as hard code
            let repeatCount = 10;

            const intervalId = setInterval(() => {
                    // executionCount++;
                    console.log('-------------------------------------------------------------------------------------------------------------------------------');
                    console.log( '[', new Date(),     ']', `API Call Made ${executionCount}/${repeatCount}`);

                    // repeating whole program
                    runProgram();

                    // stopper when API request meets limit
                    if (executionCount === repeatCount) {
                        // clearInterval() ==> global method that cancels a timed, repeating action which was previously established by a call to setInterval()
                        // If you want to stop the executing timer and finish remaining code, use clearInterval
                        // else you can set a flag to indicate the program should stop here not finishing remaining program. Just like process.exit(1), but do not recommand using exit(1), just set a flag.
                        resolve(totalCount);
                        clearInterval(intervalId);
                    } // When program can't find matched word and try to request one more time as recursive, this else if statement automatically stops from exceeding limit
                    else if(executionCount > repeatCount) {
                        clearInterval(intervalId);
                        
                    }
            // runs every 3 seconds
            }, 3000);
        });
    }
    
    // wait until runInterval ends, so that program store data into DB and print out the result of whole execution
    runInterval()
    .then((totalCount) => {
        // Index is auto-incremented and store how many calls are made within number of stored word data
        con.query(`INSERT INTO wordadded (callMade, wordAdded) VALUES(${executionCount}, ${totalCount})`);
        console.log
        console.log(`Total count: ${totalCount}`);
        
        // Array table that will print out result as table for better visual
        const myArray = [{ TotalAdded : totalCount, b4T, aftT}];
        console.table(myArray);
    })
    .catch((err) => {
        console.error(err);
    });
}); // con.connect

