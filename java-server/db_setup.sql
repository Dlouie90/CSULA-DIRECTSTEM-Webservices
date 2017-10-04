
CREATE DATABASE directstem;

USE directstem;

CREATE TABLE Users (
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
	PRIMARY KEY (email)
);

insert into Users values ('adam@ajberman.com','root'),('jguo@calstatela.edu','root');

CREATE TABLE graphs (
	id int NOT NULL,
	x int,
	y int,
	title varchar(255),
	description varchar(255),
	type varchar(255),
	domain varchar(255),
	path varchar(255),
	isInput boolean,
	isOutput boolean,
	root boolean
);

CREATE TABLE children (
	parentid int NOT NULL,
	childid int NOT NULL
);

CREATE TABLE neighbors ( 
	fromid int NOT NULL,
	toid int NOT NULL
);

CREATE TABLE parameters (
	id int NOT NULL,
	name varchar(255),
	datatype varchar(255),
	description varchar(255)
);

CREATE TABLE returnvalues (
	id int NOT NULL,
	name varchar(255),
	datatype varchar(255),
	description varchar(255)
);