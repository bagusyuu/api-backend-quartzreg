select 'Create Table Friendship_TM';

drop table if exists Friendship_TM;
create table Friendship_TM (
	id serial,
	user_id int not null,
	friend_id int not null,
	createdAt timestamp not null,
	updatedAt timestamp not null,
	primary key(id),
	foreign key(user_id) references user_tm(id) on delete cascade,
	foreign key(friend_id) references user_tm(id) on delete cascade,
);
