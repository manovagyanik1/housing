
### Installation and setup

Dependencies
  - Postgres 9.6
  - Node 9.8

Database setup
  - create database ```rental```
  - create user with username ```rental```
  - assign password to user ```rental```
  - start postgres on default port ```5432```

Setup Database

```$xslt
$ create database rental;
$ create user rental;
$ ALTER USER rental WITH PASSWORD 'rental';
$ grant all privileges on database rental to rental;

```
Install the Node
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
$ source ~/.bashrc
$ nvm install 9.8.0
$ npm i pm2 -g
```

Install and run the API module
```
$ cd project
$ npm i
$ NODE_ENV=production ./node_modules/.bin/sequelize db:migrate
$ NODE_ENV=production ./node_modules/.bin/sequelize db:seed:all
$ NODE_ENV=production node ./bin/www
```


API Documentation:
```angular2html
/api-docs/
```


