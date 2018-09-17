const User = require('../models/User');

const getUserByUsername = (req, res, next) => {
  User.findOne({ username: req.params.username }, '-_id -__v')
  .then(user => {
    if (!user) throw {msg: `username ${req.params.username} does not exist`, status: 404}
    else res.status(200).send({ user })
  })
  .catch(next)
};

module.exports = { getUserByUsername };