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

CREATE TABLE Input (
  maID INT(11) DEFAULT NULL,
  inID INT(11) DEFAULT NULL,
  KEY maID (maID),
  KEY inID (inID),
  FOREIGN KEY (maID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  FOREIGN KEY (inID) REFERENCES Node (ID)
    ON DELETE CASCADE
);

CREATE TABLE Output (
  maID  INT(11) DEFAULT NULL,
  outID INT(11) DEFAULT NULL,
  KEY maID (maID),
  KEY outID (outID),
  FOREIGN KEY (maID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  FOREIGN KEY (outID) REFERENCES Node (ID)
    ON DELETE CASCADE
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

CREATE TABLE RefChildrenNodes (
  pID INT(11) DEFAULT NULL,
  cID INT(11) DEFAULT NULL,
  UNIQUE KEY cID (cID),
  FOREIGN KEY (pID) REFERENCES Node (ID)
    ON DELETE RESTRICT,
  FOREIGN KEY (cID) REFERENCES Node (ID)
    ON DELETE CASCADE
);

CREATE TABLE RefNeighbors (
  maID INT(11) DEFAULT NULL,
  neID INT(11) DEFAULT NULL,
  FOREIGN KEY (maID) REFERENCES Node (ID)
    ON DELETE CASCADE,
  FOREIGN KEY (neID) REFERENCES Node (ID)
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

INSERT INTO RefChildrenNodes (pID, cID) VALUES (1, 2);
INSERT INTO RefChildrenNodes (pID, cID) VALUES (1, 3);
INSERT INTO Refchildrennodes (pID, cID) VALUES (1, 4);

INSERT INTO RefNeighbors (maID, neID) VALUES (1, 5);
INSERT INTO RefNeighbors (maID, neID) VALUES (1, 6);
INSERT INTO RefNeighbors (maID, neID) VALUES (5, 1);
INSERT INTO RefNeighbors (maID, neID) VALUES (5, 6);
INSERT INTO RefNeighbors (maID, neID) VALUES (6, 1);
INSERT INTO RefNeighbors (maID, neID) VALUES (6, 5);

INSERT INTO RefNeighbors (maID, neID) VALUES (2, 3);
INSERT INTO RefNeighbors (maID, neID) VALUES (2, 4);
INSERT INTO RefNeighbors (maID, neID) VALUES (3, 2);
INSERT INTO RefNeighbors (maID, neID) VALUES (3, 4);
INSERT INTO RefNeighbors (maID, neID) VALUES (4, 2);
INSERT INTO RefNeighbors (maID, neID) VALUES (4, 3);

INSERT INTO Input (maID, inID) VALUES (2, 3);
INSERT INTO Input (maID, inID) VALUES (2, 4);

INSERT INTO Output (maID, outID) VALUES (4, 2);
INSERT INTO Output (maID, outID) VALUES (3, 2);

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Shay', 'Nguyen', 'shay', '1234', 'shay@nguyen.com');

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Leanne', 'Graham', 'leanne', '1234', 'leanne@graham.com');

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Ervin', 'Howell', 'ervin', '1234', 'ervin@howell.com');