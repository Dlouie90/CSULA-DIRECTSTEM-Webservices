SET FOREIGN_KEY_CHECKS=0;

drop table if exists users;
drop table if exists projects;
drop table if exists xrefUsersProjects;
drop table if exists Service;
drop table if exists Node;
drop table if exists Input;
drop table if exists Output;
drop table if exists RefServiceXNode;
drop table if exists RefChildrenNodes;
drop table if exists RefNeighbors;

SET FOREIGN_KEY_CHECKS=1;



CREATE TABLE Service (
   ID int(11) NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (ID)
 ); 

CREATE TABLE Node (
   ID int(11) NOT NULL AUTO_INCREMENT,
   xPos int(11) NOT NULL,
   yPos int(11) NOT NULL,
   Title VARCHAR(30) NOT NUll,
   PRIMARY KEY (ID)
 );

CREATE TABLE Input (
   maID int(11) DEFAULT NULL,
   inID int(11) DEFAULT NULL,
   KEY maID (maID),
   KEY inID (inID),
   FOREIGN KEY (maID) REFERENCES Node (ID)
   	  ON DELETE CASCADE,
   FOREIGN KEY (inID) REFERENCES Node (ID)
   	  ON DELETE CASCADE
 );

CREATE TABLE Output (
   maID int(11) DEFAULT NULL,
   outID int(11) DEFAULT NULL,
   KEY maID (maID),
   KEY outID (outID),
   FOREIGN KEY (maID) REFERENCES Node (ID)
   	  ON DELETE CASCADE,
   FOREIGN KEY (outID) REFERENCES Node (ID)
   	  ON DELETE CASCADE
 );

CREATE TABLE RefServiceXNode (
   nID int(11) NOT NULL,
   sID int(11) NOT NULL,
   UNIQUE KEY nID (nID),
   KEY sID (sID),
   FOREIGN KEY (nID) REFERENCES Node (ID)
   	  ON DELETE CASCADE,
   FOREIGN KEY (sID) REFERENCES Service (ID)
   	  ON DELETE CASCADE
 );

CREATE TABLE RefChildrenNodes (
   pID int(11) DEFAULT NULL,
   cID int(11) DEFAULT NULL,
   UNIQUE KEY cID (cID),
   FOREIGN KEY (pID) REFERENCES Node (ID)
   ON DELETE RESTRICT,
   FOREIGN KEY (cID) REFERENCES Node (ID)
   	  ON DELETE CASCADE
 );
 
 CREATE TABLE RefNeighbors (
   maID int(11) DEFAULT NULL,
   neID int(11) DEFAULT NULL,
   FOREIGN KEY (maID) REFERENCES Node (ID)
      ON DELETE CASCADE,
   FOREIGN KEY (neID) REFERENCES Node (ID)
	  ON DELETE CASCADE
 );

create table users (
    id              integer auto_increment,
    firstname       varchar(255),
    lastname		varchar(255),
    username        varchar(255),
    passwordHash        varchar(255),
    email         varchar(255),
    token char(64),
    primary key(id)
);

create table projects (
	id		integer auto_increment,
    title	varchar(255),
    description varchar(255),
    primary key(id)
);
create table xrefUsersProjects (
	userid	integer,
    projectid integer,
    
    foreign key(userid) references users(id),
    foreign key(projectid) references projects(id)
);


 
 
Insert into Node (xPos,yPos, Title) VALUES (1,2, 'Eat');
Insert into Node (xPos,yPos, Title) Values (2,3, 'Love');
Insert into Node (xPos,yPos, Title) values (3,4, 'Pop');
Insert into Node (xPos,yPos, Title) values (4,4, 'Shut');
Insert into Node (xPos,yPos, Title) values (5,8, 'Cool');
Insert into Node (xPos,yPos, Title) values (6,7, 'Neat');

Insert into Service () values ();
Insert into Service () values ();
Insert into Service () values ();

Insert into Refservicexnode (nID,sID) Values (4,2);
Insert into RefServicexNode (nID,sID) VALUES (1,2);
Insert into RefServicexNode (nID,sID) VALUES (3,1);
Insert into RefServicexNode (nID,sID) VALUES (2,3);

Insert into RefChildrenNodes (pID,cID) Values (1,2);
Insert into RefChildrenNodes (pID,cID) Values (1,3);
Insert into Refchildrennodes (pID,cID) values (1,4);

Insert into RefNeighbors (maID,neID) Values (1,5);
Insert into RefNeighbors (maID,neID) Values (1,6);
Insert into RefNeighbors (maID,neID) Values (5,1);
Insert into RefNeighbors (maID,neID) Values (5,6);
Insert into RefNeighbors (maID,neID) Values (6,1);
Insert into RefNeighbors (maID,neID) Values (6,5);

Insert into RefNeighbors (maID,neID) Values (2,3);
Insert into RefNeighbors (maID,neID) Values (2,4);
Insert into RefNeighbors (maID,neID) Values (3,2);
Insert into RefNeighbors (maID,neID) Values (3,4);
Insert into RefNeighbors (maID,neID) Values (4,2);
Insert into RefNeighbors (maID,neID) Values (4,3);

Insert into Input (maID,inID) values (2,3);
Insert into Input (maID,inID) values (2,4);

Insert into Output (maID,outID) values (4,2);
Insert into Output (maID,outID) values (3,2);

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Shay', 'Nguyen', 'shay', '1234','shay@nguyen.com');

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Leanne', 'Graham', 'leanne', '1234','leanne@graham.com');

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Ervin', 'Howell', 'ervin', '1234','ervin@howell.com');