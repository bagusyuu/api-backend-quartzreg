select 'Create Table Employee_TM';

drop table if exists "Employees";
create table "Employees" (
	id serial,
	user_id int not null,
	company_id int not null,
	employee_code varchar(100) not null,
	title varchar(100) not null,
	startAt timestamp not null,
	endAt timestamp,
	status int not null default 0,
	"createdAt" timestamp not null,
	"updatedAt" timestamp not null,
	primary key(id),
	foreign key(user_id) references "Users"(id) on delete cascade,
	foreign key(company_id) references "Companies"(id) on delete cascade
);
