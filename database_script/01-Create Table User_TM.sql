select 'Create Table User_TM';

drop table if exists "Users";
create table "Users" (
	id serial unique,
	ktp varchar(100) unique not null primary key,
	name varchar(100) not null,
	email varchar (355) UNIQUE NOT NULL,
	address varchar(100),
	phone varchar(100),
	"createdAt" timestamp,
	"updatedAt" timestamp
);
