CREATE DATABASE IF NOT EXISTS `School`;
USE `School`;

CREATE TABLE IF NOT EXISTS `Student` (
  `studentID` INT AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `dateOfBirth` DATE NOT NULL,
  `grade` INT NOT NULL,
  PRIMARY KEY (`studentID`)
);

CREATE TABLE IF NOT EXISTS `Teacher` (
  `teacherID` INT AUTO_INCREMENT,
  `firstName` VARCHAR(50) NOT NULL,
  `lastName` VARCHAR(50) NOT NULL,
  `specialization` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`teacherID`)
);

CREATE TABLE IF NOT EXISTS `Class` (
  `classID` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `teacherID` INT,
  PRIMARY KEY (`classID`),
  FOREIGN KEY (`teacherID`) REFERENCES Teacher
);

CREATE TABLE IF NOT EXISTS `Enrollment` (
  `studentID` INT,
  `classID` INT,
  FOREIGN KEY (`studentID`) REFERENCES Student,
  FOREIGN KEY (`classID`) REFERENCES Class
);

