CREATE USER 'webdev'@'%' IDENTIFIED WITH mysql_native_password BY 'webdev@2024';
GRANT SELECT, INSERT, UPDATE, /*DELETE,*/ SHOW VIEW /*ALL PRIVILEGES*/ ON webdev.guest TO 'webdev'@'%';
GRANT SELECT, SHOW VIEW ON webdev.event TO 'webdev'@'%';
FLUSH PRIVILEGES;