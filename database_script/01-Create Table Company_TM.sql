select 'Create Table Company_TM';

drop table if exists Companies;
create table Companies (
	id serial unique,
	tdp int unique not null primary key,
	name varchar(100) not null,
	email varchar (355) UNIQUE NOT NULL,
	address varchar(100),
	createdAt timestamp,
	updatedAt timestamp
);
