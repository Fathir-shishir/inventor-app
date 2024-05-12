Requirements:

NodeJS
Microsoft SQL server (with admin rights)
PHP 8.1
sqlsrv driver for PHP
Installation:

Create the database with the database-creator-[creation-date].sql
Add the end-user to the created database with read/write access
Create a .env file for development, it has to contain the following:
DB_HOST (the hostname of the Microsoft SQL server)
DB_USER (the end-user's username for the database)
DB_PASSWORD (the password of the end-user for the database)
DEV (a boolean, if it is set to true, it will return the error to the frontend, if it is false, the errors only can be seen in the php error logs)
Start the application:

Open the app base directory with VS code (or with your prefered code editor)
Open a terminal, and in the root directory of the applicaiton start the PHP server with php -S localhost:8005
Open another terminal and navigate to the app folder, and run the application with npm start
Open your preferred browser and navigate to localhost:8005 you can log in with admin/admin as username/password
