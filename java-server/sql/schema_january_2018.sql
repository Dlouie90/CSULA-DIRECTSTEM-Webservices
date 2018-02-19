SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS xrefUsersProjects;
DROP TABLE IF EXISTS Service;
DROP TABLE IF EXISTS Node;
DROP TABLE IF EXISTS Input;
DROP TABLE IF EXISTS Output;
DROP TABLE IF EXISTS RefServiceXNode;
DROP TABLE IF EXISTS RefChildrenNodes;
DROP TABLE IF EXISTS RefNeighbors;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE Service (
  ID INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID)
);

CREATE TABLE Node (
  ID          INT(11)      NOT NULL AUTO_INCREMENT,
  xPos        INT(11)      NOT NULL,
  yPos        INT(11)      NOT NULL,
  Title       VARCHAR(30)  NOT NULL,
  description VARCHAR(100) NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE EDGES (
  ID       INT(11) NOT NULL AUTO_INCREMENT,
  sourceID INT(11) NOT NULL,
  destID   INT(11) NOT NULL,
  FOREIGN KEY (sourceID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  FOREIGN KEY (destID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  PRIMARY KEY (ID)
);

CREATE TABLE RefServiceXNode (
  nID INT(11) NOT NULL,
  sID INT(11) NOT NULL,
  UNIQUE KEY nID (nID),
  KEY sID (sID),
  FOREIGN KEY (nID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  FOREIGN KEY (sID) REFERENCES Service (ID)
    ON DELETE CASCADE
);

CREATE TABLE users (
  id        INTEGER AUTO_INCREMENT,
  firstname VARCHAR(255),
  lastname  VARCHAR(255),
  username  VARCHAR(255),
  password  VARCHAR(255),
  email     VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE projects (
  id          INTEGER AUTO_INCREMENT,
  title       VARCHAR(255),
  description VARCHAR(255),
  PRIMARY KEY (id)
);
CREATE TABLE xrefUsersProjects (
  userid    INTEGER,
  projectid INTEGER,

  FOREIGN KEY (userid) REFERENCES users (id),
  FOREIGN KEY (projectid) REFERENCES projects (id)
);


INSERT INTO Node (xPos, yPos, Title) VALUES (1, 2, 'Eat');
INSERT INTO Node (xPos, yPos, Title) VALUES (2, 3, 'Love');
INSERT INTO Node (xPos, yPos, Title) VALUES (3, 4, 'Pop');
INSERT INTO Node (xPos, yPos, Title) VALUES (4, 4, 'Shut');
INSERT INTO Node (xPos, yPos, Title) VALUES (5, 8, 'Cool');
INSERT INTO Node (xPos, yPos, Title) VALUES (6, 7, 'Neat');

INSERT INTO Service () VALUES ();
INSERT INTO Service () VALUES ();
INSERT INTO Service () VALUES ();

INSERT INTO Refservicexnode (nID, sID) VALUES (4, 2);
INSERT INTO RefServicexNode (nID, sID) VALUES (1, 2);
INSERT INTO RefServicexNode (nID, sID) VALUES (3, 1);
INSERT INTO RefServicexNode (nID, sID) VALUES (2, 3);

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Bob', 'Dole', 'bob1337', '1234', 'bob@gmail.com');
INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Hongsuk', 'Choi', 'choi', '1234', 'choi@gmail.com');
INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Ice', 'Bear', 'icebear', '1234', 'icebear@gmail.com');

INSERT INTO PROJECTS (title, description)
VALUES ('Project 101', 'A cool project');
INSERT INTO PROJECTS (title, description)
VALUES ('Project 555', 'Has 5 stuff');
INSERT INTO PROJECTS (title, description)
VALUES ('Project 911', 'Call 911');
INSERT INTO PROJECTS (title, description)
VALUES ('Project 1337', 'Leet Project');
INSERT INTO PROJECTS (title, description)
VALUES ('Project 666', 'The devil''s project');