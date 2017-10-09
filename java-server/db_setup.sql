
CREATE DATABASE directstem;

USE directstem;

CREATE TABLE Users (
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
	PRIMARY KEY (email)
);

insert into Users values ('adam@ajberman.com','root'),('jguo@calstatela.edu','root');
-- old cwsman schema
/*

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
*/
CREATE TABLE nodes (
	id int NOT NULL,
	x int,
	y int,
	composition boolean,
	url varchar(255)
);
CREATE TABLE parameters (
	id int NOT NULL,
	name varchar(255),
	dtype varchar(255)
);
CREATE TABLE returns (
	id int NOT NULL,
	name varchar(255),
	dtype varchar(255)
);
CREATE TABLE children (
	id int NOT NULL,
	childid int NOT NULL
);
CREATE TABLE edges (
	id int NOT NULL,
	srcid int NOT NULL,
	name varchar(255),
	withname varchar(255)
);
CREATE TABLE compedges (
	id int NOT NULL,
	srcid int NOT NULL,
	name varchar(255),
	withname varchar(255)
);
CREATE TABLE childedges (
	id int NOT NULL,
	destid int NOT NULL,
	name varchar(255),
	withname varchar(255)
);
CREATE TABLE inputs (
	id int NOT NULL,
	name varchar(255),
	val varchar(255)
);
CREATE TABLE outputs (
	id int NOT NULL,
	name varchar(255),
	val varchar(255)
);
CREATE TABLE results (
	id int NOT NULL,
	guid varchar(255),
	name varchar(255),
	val varchar(255),
	failed boolean
);