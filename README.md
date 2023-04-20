# Project Name

## Description

This project is a dictionary that only collects 4 ~ 10 character limited sized words excluding special characters, such as ‘-=’;/][ ’, and numbers. The project utilizes the WordsAPI library for random dummy words, and is developed in VSCode. MySQL is used as the database using workbench.

## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

To install the necessary dependencies, run the following command:
npm install axios

## Usage

To use this project, simply run it and start querying for words. The project also provides a backup table to ensure data integrity and referential integrity.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

Contributions are welcome. Please submit a pull request or open an issue if you have any suggestions or would like to contribute.

## Tests

To run tests, run the following command:
npm test

## Questions

If you have any questions about this project, please feel free to contact the project owner at [INSERT YOUR EMAIL HERE].

## Author

- Tae Jin Kim

## Date

- 2023-04-11

## Problem

- Argument + Auto_Increment mysql issue ==> Running 1 time using argument has no index gap in my mysql DB, but running multiple times using arguments, creates auto_increment skipping because new execution starts from where it left from previous index.

## Solution

- Create another table and user wordt table as backup table just like dummy table or set auto-increment = 1 to fill up the gap
- However, setting auto-increment = 1 can cause potential issues with data integrity and referential integrity, so it is recommended to use backup table.
- Therefore, there is a third table, WordDictionary.

## Result

- Faker ==> 1,227 words
- Capitalize my title ==> 2,234 words (dumyw.txt file)
- WordsAPI ==> a lot. (~6000 so far, 2023-04-17)
- TOTAL ==> 11,706 ( 2023-04-18 12:18 pm )

## License and Table

MIT License

