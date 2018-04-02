SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS xrefUsersProjects;

SET FOREIGN_KEY_CHECKS = 1;

create table users (
    id              integer auto_increment,
    firstname       varchar(255),
    lastname		varchar(255),
    email         varchar(255),
    username        varchar(255),
    passwordHash        varchar(255),
    token varchar(255),
    primary key(id)
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
