CREATE DATABASE IF NOT EXISTS `Bank`;
USE `Bank`;

CREATE TABLE IF NOT EXISTS `Customer` (
  `customerID` INT,
  `firstName` VARCHAR(20),
  `lastName` VARCHAR(20),
  `income` INT,
  `birthDate` DATE,
  PRIMARY KEY (`customerID`)
);

CREATE TABLE IF NOT EXISTS `Account` (
  `accNumber` INT,
  `type` VARCHAR(20),
  `balance` INT,
  `branchNumber` INT,
  PRIMARY KEY (`accNumber`),
  FOREIGN KEY (`branchNumber`) REFERENCES Branch
);

CREATE TABLE IF NOT EXISTS `Branch` (
  `branchNumber` INT,
  `branchName` VARCHAR(20),
  `managerSIN` INT,
  `budget` INT,
  PRIMARY KEY (`branchNumber`),
  FOREIGN KEY (`managerSIN`) REFERENCES Employee
);

CREATE TABLE IF NOT EXISTS `Owns` (
  `customerID` INT,
  `accNumber` INT,
  FOREIGN KEY (`customerID`) REFERENCES Customer,
  FOREIGN KEY (`accNumber`) REFERENCES Account
);

CREATE TABLE IF NOT EXISTS `Transactions` (
  `transNumber` INT,
  `accNumber` INT,
  `amount` INT,
  PRIMARY KEY (`transNumber`),
  FOREIGN KEY (`accNumber`) REFERENCES Account
);

CREATE TABLE IF NOT EXISTS `Employee` (
  `sin` INT,
  `firstName` VARCHAR(20),
  `lastName` VARCHAR(20),
  `salary` INT,
  `branchNumber` INT,
  PRIMARY KEY (`sin`),
  FOREIGN KEY (`branchNumber`) REFERENCES Branch
);

