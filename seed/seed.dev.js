const mongoose = require('mongoose');
const seedDB = require('./seed');
const { articleData, commentData, topicData, userData } = require('./devData/index');
const db_url = require('../config/db_config');

mongoose.connect(db_url)
  .then(() => seedDB(articleData, commentData, topicData, userData))
  .then(() => mongoose.disconnect())
  .catch(console.log)