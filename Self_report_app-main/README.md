## Self Report app 

A full stack app made with deno, postgres, and ejs templates. Done as a school project.

Link to online demo: https://wsd-project-es2.herokuapp.com/


### Instructions to run the application: 

1. In case you run database locally run these commands (in the following order) in your postgres command line. Otherwise move to step 2.

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(320) NOT NULL,
password CHAR(60) NOT NULL
);

CREATE TABLE reports (
id SERIAL PRIMARY KEY,
date DATE NOT NULL,
sleep NUMERIC(100, 1),
sport NUMERIC(100, 1),
study NUMERIC(100, 1),
quality INTEGER,
eating INTEGER,
mood INTEGER NOT NULL,
is_Morning boolean NOT NULL,
user_id INTEGER REFERENCES users(id)
);

2. Put your own postgres database credentials into the .env file.

3. Navigate to root of the project folder.
4. Run the following command to start the app
   'deno run --unstable --allow-all app.js'
5. The app should be running now, open http://localhost:7777/ in your browser.

