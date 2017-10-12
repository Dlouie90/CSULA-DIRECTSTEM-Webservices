
CREATE DATABASE directstem;

USE directstem;

CREATE TABLE Users (
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
	PRIMARY KEY (email)
);
insert into Users values ('adam@ajberman.com','root'),('jguo@calstatela.edu','root');

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