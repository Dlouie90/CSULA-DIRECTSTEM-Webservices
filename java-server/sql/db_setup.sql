
CREATE DATABASE IF NOT EXISTS directstem;

USE directstem;

/* USERS */
DROP TABLE IF EXISTS  users;
CREATE TABLE users (
	id        INTEGER AUTO_INCREMENT NOT NULL,
	firstName VARCHAR(255) NOT NULL,
	lastName  VARCHAR(255) NOT NULL,
	password  VARCHAR(255) NOT NULL,
	email     VARCHAR(255) NOT NULL UNIQUE,
	description TEXT NULL,
	PRIMARY KEY (id)
);

INSERT INTO users (firstName, lastName, password, email)
VALUES ('Shay', 'Nguyen', 'shay', 'shay@nguyen.com');

INSERT INTO users (firstName, lastName, password, email)
VALUES ('Leanne', 'Graham', 'leanne', 'leanne@graham.com');

INSERT INTO users (firstName, lastName, password, email)
VALUES ('Ervin', 'Howell', 'ervin', 'ervin@howell.com');


CREATE TABLE nodes (
	id int NOT NULL,
	description varchar(255),
	composition boolean,
	service int,
	compedge int,
	outp varchar(255)
);
CREATE TABLE services (
	id int NOT NULL,
	url varchar(255),
	title varchar(255),
	description varchar(255),
	ret varchar(255)
);
CREATE TABLE serviceparameters (
	id int NOT NULL,
	i int,
	val varchar(255)
);
CREATE TABLE children (
	id int NOT NULL,
	childid int NOT NULL
);
CREATE TABLE edges (
	id int NOT NULL,
	srcid int NOT NULL,
	paramNo int
);
CREATE TABLE childedges (
	id int NOT NULL,
	destid int NOT NULL,
	paramNo int,
	inputNo int
);
CREATE TABLE inputs (
	id int NOT NULL,
	i int,
	val varchar(255)
);
CREATE TABLE results (
	id int NOT NULL,
	guid varchar(255),
	val varchar(255),
	failed boolean
);