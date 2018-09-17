# Northcoders News API

This is the API for the Northcoders News app, built using MongoDB and Express.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
MongoDB
```

### Installing

Run `npm i` in order to install the required Node packages.

Ensure that Mongo is running in the background by typing `mongod` in a terminal window.

In a second terminal window, run `npm run seed:dev` to seed the database.

Then, run `node listen.js` to start the web server.

Finally, navigate to http://localhost:9090/ in a browser window to access the API documentation.

## Running the tests

Run `npm t` in order to run the tests using Mocha.

## Built With

* [Express](http://expressjs.com/) - Minimalist web framework for Node.js
* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [Mongoose](https://mongoosejs.com/) - Elegant mongodb object modeling for node.js

## Authors

* [Paul Acklam](https://github.com/packlam)

## Acknowledgments

* [Northcoders](https://northcoders.com/)