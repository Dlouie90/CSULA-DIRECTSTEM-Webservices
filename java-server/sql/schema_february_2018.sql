SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS xrefUsersProjects;

SET FOREIGN_KEY_CHECKS = 1;

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
  id   INTEGER AUTO_INCREMENT,
  data LONGTEXT,
  PRIMARY KEY (id)
);
CREATE TABLE xrefUsersProjects (
  userid    INTEGER,
  projectid INTEGER,

  FOREIGN KEY (userid) REFERENCES users (id),
  FOREIGN KEY (projectid) REFERENCES projects (id)
);

INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Bob', 'Dole', 'bob1337', '1234', 'bob@gmail.com');
INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Hongsuk', 'Choi', 'choi', '1234', 'choi@gmail.com');
INSERT INTO users (firstName, lastName, username, password, email)
VALUES ('Ice', 'Bear', 'icebear', '1234', 'icebear@gmail.com');

