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
$ delete from worddictionary where worddictionary.index < 5000000;
$ alter table worddictionary AUTO_INCREMENT = 1;
$ Insert IGNORE into worddictionary (words) select LOWER(wordt.word) from wordt WHERE char_LENGTH(wordt.word) >= 4;
$ select * from worddictionary order by worddictionary.index DESC;
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
