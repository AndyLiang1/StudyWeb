
module.exports = {
  "development": {
    "username": 'root',
    "password": 'password',
    "database": 'dev_studyweb',
    "host": 'localhost',
    "dialect": 'mysql', // dialect has to be explictly supplied as of v4.0.0
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }

}