SET FOREIGN_KEY_CHECKS=0;

drop table if exists Service;
drop table if exists Node;
drop table if exists Input;
drop table if exists Output;
drop table if exists RefServiceXNode;
drop table if exists RefChildrenNodes;

SET FOREIGN_KEY_CHECKS=1;



CREATE TABLE Service (
   ID int(11) NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (ID)
 ); 

CREATE TABLE Node (
   ID int(11) NOT NULL AUTO_INCREMENT,
   xPos int(11) NOT NULL,
   yPos int(11) NOT NULL,
   PRIMARY KEY (ID)
 );

CREATE TABLE Input (
   maID int(11) DEFAULT NULL,
   inID int(11) DEFAULT NULL,
   KEY maID (maID),
   KEY inID (inID),
   FOREIGN KEY (maID) REFERENCES Node (ID),
   FOREIGN KEY (inID) REFERENCES Node (ID)
 );

CREATE TABLE Output (
   maID int(11) DEFAULT NULL,
   outID int(11) DEFAULT NULL,
   KEY maID (maID),
   KEY outID (outID),
   FOREIGN KEY (maID) REFERENCES Node (ID),
   FOREIGN KEY (outID) REFERENCES Node (ID)
 );

CREATE TABLE RefServiceXNode (
   nID int(11) NOT NULL,
   sID int(11) NOT NULL,
   UNIQUE KEY nID (nID),
   KEY sID (sID),
   FOREIGN KEY (nID) REFERENCES Node (ID),
   FOREIGN KEY (sID) REFERENCES Service (ID)
 );

CREATE TABLE RefChildrenNodes (
   pID int(11) DEFAULT NULL,
   cID int(11) DEFAULT NULL,
   UNIQUE KEY pID (pID),
   UNIQUE KEY cID (cID),
   FOREIGN KEY (pID) REFERENCES Node (ID),
   FOREIGN KEY (cID) REFERENCES Node (ID)
 );