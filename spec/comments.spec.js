process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const seedDB = require('../seed/seed');
const db_url = require('../config/db_config')
const { articleData, commentData, topicData, userData } = require('../seed/testData/index');
let articles, comments, topics, users;

describe('/api', function() {
  // IMPORTANT: database takes longer than 2 seconds to seed
  this.timeout(5000);

  before(() => mongoose.connect(db_url))
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
  Requests to /api/comments
  */
  describe('/comments', () => {
    /*
    Requests to /api/comments/:comment_id
    */
    describe('/:comment_id', () => {
      /*
      PATCH requests to /api/comments/:comment_id
      */
      it('PATCH request with a valid comment id and "vote" query of "up" returns that comment with a vote count incremented by 1 and status 200', () => {
        return request
          .patch(`/api/comments/${comments[0]._id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(comments[0].votes + 1);
          })
      });
      it('PATCH request with a valid comment id and "vote" query of "down" returns that comment with a vote count decremented by 1 and status 200', () => {
        return request
          .patch(`/api/comments/${comments[0]._id}?vote=down`)
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(comments[0].votes - 1);
          })
      });
      it('PATCH request with a valid comment id and invalid "vote" query string returns an error and status 400', () => {
        const voteParam = 'foobar'
        return request
          .patch(`/api/comments/${comments[0]._id}?vote=${voteParam}`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`${voteParam} is not a valid vote parameter`);
          })
      });
      it('PATCH request with a comment id that does not exist returns an error and status 404', () => {
        const tmpCommentId = mongoose.Types.ObjectId();
        return request
          .patch(`/api/comments/${tmpCommentId}?vote=up`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`comment_id ${tmpCommentId} does not exist`);
          })
      });
      it('PATCH request with an invalid comment id returns an error and status 400', () => {
        const tmpCommentId = 'foobar';
        return request
          .patch(`/api/comments/${tmpCommentId}?vote=up`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpCommentId}" at path "_id" for model "comments"`);
          })
      });
      /*
      DELETE requests to /api/comments/:comment_id
      */
      it('DELETE request with a valid comment_id deletes that comment and returns it with a status 200', () => {
        return request
          .delete(`/api/comments/${comments[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.deleted).to.be.an('object')
            expect(res.body.deleted.body).to.equal(comments[0].body)
            // having deleted the comment, trying to delete the same comment should result in a 404...
            return request
              .delete(`/api/comments/${comments[0]._id}`)
              .expect(404)
              .then(res => {
                expect(res.body.msg).to.equal(`comment_id ${comments[0]._id} does not exist`);
              })
          })
      });
      it('DELETE request with a comment_id that does not exist returns an error and status 404', () => {
        const tmpCommentId = mongoose.Types.ObjectId();
        return request
          .delete(`/api/comments/${tmpCommentId}`)
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal(`comment_id ${tmpCommentId} does not exist`);
          })
      });
      it('DELETE request with an invalid comment_id returns an error and status 400', () => {
        const tmpCommentId = 'foobar';
        return request
          .delete(`/api/comments/${tmpCommentId}`)
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(`Cast to ObjectId failed for value "${tmpCommentId}" at path "_id" for model "comments"`);
          })
      });
    });
  });
});