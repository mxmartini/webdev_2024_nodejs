USE webdev;

CREATE TABLE event (
    id int not null primary key auto_increment,
    name varchar(255) not null,
    date date,
    active boolean default false,
    createdAt datetime not null default NOW(),
    updatedAt datetime
);

CREATE TABLE guest (
    id int not null primary key auto_increment,
    name varchar(255) not null,
    age tinyint,
    address text,
    active boolean default false,
    event_id int not null,
    createdAt datetime not null default NOW(),
    updatedAt datetime,
    FOREIGN KEY (event_id) REFERENCES event (id)
);

INSERT INTO event (name) values ('DEMO');
INSERT INTO guest (name, event_id) values ('Max Martini', 1), ('Leonardo Hafner', 1), ('Camila Lins', 1), ('Sandro Macena', 1);
UPDATE guest SET active = true WHERE id = 1;