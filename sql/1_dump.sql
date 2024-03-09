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

INSERT INTO event (name, date) values ('Pool Party', '2024-09-24'), ('Wedding Party', '2024-10-24'), ('Bday Party', '2024-11-24');
INSERT INTO guest (name, event_id) values ('Max Martini', 1), ('Leonardo Hafner', 1), ('Camila Lins', 1), ('Sandro Macena', 1), ('Caio Almeida', 1);
UPDATE event SET active = true WHERE id in (1,2);
UPDATE guest SET active = true WHERE id in (1,2,3);