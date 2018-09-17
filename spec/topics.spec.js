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
  // after(() => mongoose.disconnect())

  /*
  Requests to /api/topics
  */
  describe('/topics', () => {
    /*
    GET requests to /api/topics/
    */
    it('GET request returns an array of topics and status 200', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array')
          expect(res.body.topics).to.have.length(2)
          expect(res.body.topics[0].title).to.equal('Mitch')
          expect(res.body.topics[1].slug).to.equal('cats')
        })
    });
    /*
    Requests to /api/topics/:topic_slug/articles
    */
    describe('/:topic_slug/articles', () => {
      /*
      GET requests to /api/topics/:topic_slug/articles
      */
      it('GET request with a topic_slug that exists returns an array of articles for the given topic and status 200', () => {
        return request
          .get(`/api/topics/${topics[0].slug}/articles`)
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.an('array')
            expect(res.body.articles).to.have.length(2)
            expect(res.body.articles[0].title).to.equal('Living in the shadow of a great man')
          })
      });
      it('GET request with a topic_slug that does not exist returns an error and status 404', () => {
        const tmpTopicSlug = 'foobar'
        return request
          .get(`/api/topics/${tmpTopicSlug}/articles`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`topic slug ${tmpTopicSlug} does not exist`)
          })
      });
      /*
      POST requests to /api/topics/:topic_slug/articles
      */
      it('POST request with a valid topic_slug and article body adds a new article, and returns that article with a status 201', () => {
        const newArticle = {
          title: 'Test article',
          body: 'This is the body of the test article',
          created_by: users[0]._id
        };
        return request
          .post(`/api/topics/${topics[0].slug}/articles`)
          .send(newArticle)
          .expect(201)
          .then(res => {
            expect(res.body.article).to.be.an('object');
            expect(res.body.article).to.have.keys(
              ['__v', '_id', 'belongs_to', 'body', 'created_at', 'created_by', 'title', 'votes']
            );
            expect(res.body.article.title).to.equal(newArticle.title);
            expect(res.body.article.body).to.equal(newArticle.body);
          })
      });
      it('POST request with a topic_slug that does not exist returns an error and status 404', () => {
        const tmpTopicSlug = 'foobar'
        const newArticle = {
          title: 'Test article',
          body: 'This is the body of the test article',
          created_by: users[0]._id
        };
        return request
          .post(`/api/topics/${tmpTopicSlug}/articles`)
          .send(newArticle)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`topic slug ${tmpTopicSlug} does not exist`)
          })
      });
      it('POST request with a valid topic_slug and a malformed body returns an error and status 400', () => {
        const newArticle = {
          foobar: 'Test article',
          body: 'This is the body of the test article',
          created_by: users[0]._id
        };
        return request
          .post(`/api/topics/${topics[0].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal('articles validation failed: title: Path `title` is required.')
          })
      });
      it('POST request with a body containing user_id that does not exist returns an error and status 404', () => {
        const tmpUserId = mongoose.Types.ObjectId();
        const newArticle = {
          title: 'Test article',
          body: 'This is the body of the test article',
          created_by: tmpUserId
        };
        return request
          .post(`/api/topics/${topics[0].slug}/articles`)
          .send(newArticle)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`username ${tmpUserId} does not exist`)
          })
      });
      it('POST request with a body containing an invalid user_id returns an error and status 400', () => {
        const tmpUserId = 'foobar';
        const newArticle = {
          title: 'Test article',
          body: 'This is the body of the test article',
          created_by: tmpUserId
        };
        return request
          .post(`/api/topics/${topics[0].slug}/articles`)
          .send(newArticle)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpUserId}" at path "_id" for model "users"`)
          })
      });
    });
  });
});