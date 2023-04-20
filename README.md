# Dictionary

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT) 
- Copyright (c) 2023 DASverse
- IDE    : VSCode
- DB     : MySQL using workbench
- Date   : 2023-04-11
- Author : Tae Jin Kim


## Description

This project is a dictionary that only collects 4 ~ 10 character limited sized words excluding special characters, such as `-=;/][`, and numbers. The project utilizes the WordsAPI library for random dummy words, and is developed in VSCode. MySQL is used as the database using workbench.

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
```
-- Run all of 4 lines at a time to transfer values from 'wordt' to 'worddictionary' table
delete from worddictionary where worddictionary.index < 5000000;
alter table worddictionary AUTO_INCREMENT = 1;
Insert IGNORE into worddictionary (words) select LOWER(wordt.word) from wordt WHERE char_LENGTH(wordt.word) >= 4;
select * from worddictionary order by worddictionary.index DESC;
```

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
$ npm test
```

## Questions

If you have any questions about this project, please feel free to contact the project owner at [INSERT YOUR EMAIL HERE].
