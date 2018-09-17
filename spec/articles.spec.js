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
  Requests to /api/articles
  */
  describe('/articles', () => {
    /*
    GET requests to /api/article
    */
    it('GET request returns an array of articles and status 200', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles).to.be.an('array');
          expect(res.body.articles).to.have.length(4);
        })
    });
    /*
    Requests to /api/articles/:article_id
    */
    describe('/:article_id', () => {
      /*
      GET requests to /api/articles/_article_id
      */
      it('GET request with a valid article_id returns that article and status 200', () => {
        return request
          .get(`/api/articles/${articles[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article).to.be.an('object');
            expect(res.body.article.title).to.equal(articles[0].title);
            expect(res.body.article.topic).to.equal(articles[0].topic);
            expect(res.body.article.body).to.equal(articles[0].body);
          })
      });
      it('GET request with an article_id that does not exist returns an error and status 404', () => {
        const tmpArticleId = mongoose.Types.ObjectId();
        return request
          .get(`/api/articles/${tmpArticleId}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`article_id ${tmpArticleId} does not exist`);
          })
      });
      it('GET request with an invalid article_id returns an error and status 400', () => {
        const tmpArticleId = 'foobar'
        return request
          .get(`/api/articles/${tmpArticleId}`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpArticleId}" at path "_id" for model "articles"`);
          })
      });
      /*
      PATCH requests to /api/articles/:article_id
      */
      it('PATCH request with a valid article id and "vote" query of "up" returns that article with a vote count incremented by 1 and status 200', () => {
        return request
          .patch(`/api/articles/${articles[0]._id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(articles[0].votes + 1);
          })
      });
      it('PATCH request with a valid article id and "vote" query of "down" returns that article with a vote count decremented by 1 and status 200', () => {
        return request
          .patch(`/api/articles/${articles[0]._id}?vote=down`)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(articles[0].votes - 1);
          })
      });
      it('PATCH request with a valid article id and invalid "vote" query string returns an error and status 400', () => {
        const voteParam = 'foobar'
        return request
          .patch(`/api/articles/${articles[0]._id}?vote=${voteParam}`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`${voteParam} is not a valid vote parameter`);
          })
      });
      it('PATCH request with an article id that does not exist returns an error and status 404', () => {
        const tmpArticleId = mongoose.Types.ObjectId();
        return request
          .patch(`/api/articles/${tmpArticleId}?vote=up`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`article_id ${tmpArticleId} does not exist`);
          })
      });
      it('PATCH request with an invalid article id returns an error and status 400', () => {
        const tmpArticleId = 'foobar';
        return request
          .patch(`/api/articles/${tmpArticleId}?vote=up`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpArticleId}" at path "_id" for model "articles"`);
          })
      });
      /*
      requests to /api/articles/:article_id/comments
      */
      describe('/comments', () => {
        /*
        GET requests to /api/articles/:article_id/comments
        */
        it('GET request with a valid article_id returns the comments for that article and status 200', () => {
          return request
            .get(`/api/articles/${articles[0]._id}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments[0].body).to.equal(comments[0].body);
            })
        });
        it('GET request with an article_id that does not exist returns an error and status 404', () => {
          const tmpArticleId = mongoose.Types.ObjectId();
          return request
            .get(`/api/articles/${tmpArticleId}`)
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(`article_id ${tmpArticleId} does not exist`);
            })
        });
        it('GET request with an invalid article_id returns an error and status 400', () => {
          const tmpArticleId = 'foobar'
          return request
            .get(`/api/articles/${tmpArticleId}/comments`)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpArticleId}" at path "belongs_to" for model "comments"`);
            })
        });
        /*
        POST requests to /api/articles/:article_id/comments
        */
        it('POST request with a valid article_id, user_id and comment body add a new comment, returning the comment and status 201', () => {
          const newComment = {
            body: 'Test body for a new comment',
            created_by: users[0]._id
          }
          return request
            .post(`/api/articles/${articles[0]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.be.an('object')
              expect(res.body.comment).to.have.keys(['__v', '_id', 'belongs_to', 'body', 'created_at', 'created_by', 'votes'])
              expect(res.body.comment.body).to.equal(newComment.body)
            })
        });
        it('POST request with an article_id that does not exist returns an error and status 404', () => {
          const tmpArticleId = mongoose.Types.ObjectId();

          const newComment = {
            body: 'Test body for a new comment',
            created_by: users[0]._id
          }
          return request
            .post(`/api/articles/${tmpArticleId}/comments`)
            .send(newComment)
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(`article_id ${tmpArticleId} does not exist`);
            })
        });
        it('POST request with an invalid article_id returns an error and status 400', () => {
          const tmpArticleId = 'foobar'

          const newComment = {
            body: 'Test body for a new comment',
            created_by: users[0]._id
          }
          return request
            .post(`/api/articles/${tmpArticleId}/comments`)
            .send(newComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpArticleId}" at path "_id" for model "articles"`);
            })
        });
        it('POST request with a comment body containing a username that does not exist returns an error and status 404', () => {
          const tmpUserId = mongoose.Types.ObjectId();
          
          const newComment = {
            body: 'Test body for a new comment',
            created_by: tmpUserId
          }
          return request
            .post(`/api/articles/${articles[0]._id}/comments`)
            .send(newComment)
            .expect(404)
            .then(res => {
              expect(res.body.msg).to.equal(`user_id ${tmpUserId} does not exist`);
            })
        });
        it('POST request with a comment body containing an invalid username returns an error and status 400', () => {
          const tmpUserId = 'foobar'
          
          const newComment = {
            body: 'Test body for a new comment',
            created_by: tmpUserId
          }
          return request
            .post(`/api/articles/${articles[0]._id}/comments`)
            .send(newComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpUserId}" at path "_id" for model "users"`);
            })
        });
        it('POST request with a malformed comment body returns an error and status 400', () => {
          const newComment = {
            foobar: 'Test body for a new comment',
            created_by: users[0]._id
          }
          return request
            .post(`/api/articles/${articles[0]._id}/comments`)
            .send(newComment)
            .expect(400)
            .then(res => {
              expect(res.body.msg).to.equal('comments validation failed: body: Path `body` is required.')
            })
        });
      });
    });
  });
});