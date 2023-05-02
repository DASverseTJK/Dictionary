# Dictionary

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
- Copyright (c) 2023 DASverse
- IDE    : VSCode
- DB     : MySQL using workbench
- Date   : 2023-04-11
- Author : Tae Jin Kim


## Description

This project is a dictionary that only collects words limited to 4 to 10 characters in size, excluding special characters such as -=;/][ and numbers. The project utilizes the WordsAPI library to generate random dummy words, and is developed in VSCode. MySQL is used as the database, with workbench as the interface.

- db_connection.js<br /> 
  - latest version that contains all you need
- fileAndFaker.js<br />
  - db_connection + dummyw.txt file reader code + faker api reader + put those values into 'dummyt' table, aka. Extra version of db_connection
- dummyw.txt
  - list of random words from CapitalizeMyTitle API
<br /><br />
- NPM, why Axios?
![axios vs request vs superagent](https://user-images.githubusercontent.com/131336470/233300005-aa6b14c2-c12d-4b35-90e2-d07543aab3fa.PNG) <br /><br />
 -Since our plan was gathering all the data we need, axios was chosen due to most trend activity

- *** [[[SHAPES OF FLOW CHART IS INCORRECT]]] *** Flow Chart of Program <br />
![Dictionary drawio_version2](https://user-images.githubusercontent.com/131336470/233298231-44e12372-8331-4cce-9505-80b5b8e79736.png) <br /><br />

- DB flow <br />
![dictionary_db](https://user-images.githubusercontent.com/131336470/233299982-123f0e9e-610b-4f2f-bf3a-17656e7d2207.png) <br /><br />

- Program activity with API request call
![11](https://user-images.githubusercontent.com/131336470/233300441-d471e570-98b3-45b6-98d3-c5f97733da9c.PNG) <br /><br />
![22](https://user-images.githubusercontent.com/131336470/233300452-f371f452-94da-4a9c-82ac-ac87fd6c7b9a.PNG) <br /><br />
  - Error : when a random word from DB is not in WordsAPI DB
  - Latency : how fast API is made

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

To install the necessary dependencies, run the following command:

- To request API call
```
$ npm install axios
```
- To use Faker open API library page if wish to download words from faker only
```
$ npm install faker
```

## Usage
- To run program
```
$ node filename.js
```
- MySQL Query
 -Creating Tables
```
CREATE TABLE `dummyt` (
  `dummyi` int NOT NULL AUTO_INCREMENT,
  `dummyw` varchar(15) NOT NULL,
  PRIMARY KEY (`dummyi`),
  UNIQUE KEY `dummyTcol_UNIQUE` (`dummyw`)
) ENGINE=InnoDB AUTO_INCREMENT=54760986 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

```
CREATE TABLE `wordadded` (
  `index` int NOT NULL AUTO_INCREMENT,
  `callMade` int unsigned DEFAULT NULL,
  `wordAdded` int unsigned DEFAULT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `index_UNIQUE` (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

```
CREATE TABLE `worddictionary` (
  `index` int NOT NULL AUTO_INCREMENT,
  `words` varchar(15) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY `words_UNIQUE` (`words`),
  UNIQUE KEY `index_UNIQUE` (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=16384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

```
CREATE TABLE `wordt` (
  `index` int NOT NULL AUTO_INCREMENT,
  `word` varchar(15) NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE KEY ` word_UNIQUE` (`word`)
) ENGINE=InnoDB AUTO_INCREMENT=23573 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```


 -Need to run this 4 line to transfer all data to worddictionary so that It does not create auto-increment issue
```
-- Run all of 4 lines at a time to transfer values from 'wordt' to 'worddictionary' table
delete from worddictionary where worddictionary.index < 5000000;
alter table worddictionary AUTO_INCREMENT = 1;
Insert IGNORE into worddictionary (words) select LOWER(wordt.word) from wordt WHERE char_LENGTH(wordt.word) >= 4;
select * from worddictionary order by worddictionary.index DESC;
```
 -Just couple Mysql query to your convience
```
-- Checking how many data exist in 'wordt' table
select COUNT(*) from wordt;

-- Delete all of data below 4 character from 'wordt' and 'dummyt' table
delete from wordt where wordt.index > 0 AND char_length(wordt.word) < 4;
delete from dummyt where dummyt.dummyi > 0 AND char_length(dummyt.dummyw) < 4;

-- 'wordt' list checking
select * from wordt WHERE char_LENGTH(wordt.word) >= 4 order by wordt.index DESC;
-- 'dummyt' list checking
select * from dummyt order by dummyt.dummyi DESC;

-- Checking duplication in 'wordt' table
SELECT wordt.word FROM wordt GROUP BY wordt.word HAVING count(wordt.word) > 1;

-- Inserting 'dummyt' table data to 'wordt' table
INSERT INTO dictionary.wordt (word) (SELECT dummyw FROM dictionary.dummyt );

-- selecting a random word from 'wordt' table
SELECT wordt.word FROM wordt ORDER BY RAND() limit 1;
```

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).



## Contributing

Contributions are welcome. Please submit a pull request or open an issue if you have any suggestions or would like to contribute.

## Tests

To run tests, run the following command:
```
$ 
```

## Questions

If you have any questions about this project, please feel free to contact the project owner at [tjmax0930@gmail.com].
