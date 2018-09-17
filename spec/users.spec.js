process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const seedDB = require('../seed/seed');
const { articleData, commentData, topicData, userData } = require('../seed/testData/index');
let articles, comments, topics, users;

describe('/api', function() {
  // IMPORTANT: database takes longer than 2 seconds to seed
  this.timeout(5000);

  // this ensures that the db is re-seeded before every it block
  beforeEach(() => {
    return seedDB(articleData, commentData, topicData, userData)
    .then(docs => {
      [articles, comments, topics, users] = docs;
    })
  })

  // this disconnects from the db after all the tests
  after(() => mongoose.disconnect())

  /*
  Requests to /api/users
  */
  describe('/users', () => {
    /*
    Requests to /api/users/:username
    */
    describe('/:username', () => {
      /*
      GET requests to /api/users/:username
      */
      it('GET request with a username that exists returns that user and status 200', () => {
        return request
          .get(`/api/users/${users[0].username}`)
          .expect(200)
          .then(res => {
            expect(res.body.user.username).to.equal(users[0].username);
            expect(res.body.user.name).to.equal(users[0].name);
            expect(res.body.user.avatar_url).to.equal(users[0].avatar_url);
          })
      });
      it('GET request with a username that does not exist returns an error and status 404', () => {
        const tmpUsername = 'foobar';
        return request
          .get(`/api/users/${tmpUsername}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`username ${tmpUsername} does not exist`)
          })
      });
    });
  });
});