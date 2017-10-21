SET FOREIGN_KEY_CHECKS=0;

drop table if exists users;
drop table if exists projects;
drop table if exists xrefUsersProjects;

SET FOREIGN_KEY_CHECKS=1;

create table users (
    id              integer auto_increment,
    firstname       varchar(255),
    lastname		varchar(255),
    username        varchar(255),
    password        varchar(255),
    email         varchar(255),
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

