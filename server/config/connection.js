const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/googlebooks');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://my_mongodb_server.com:27017/googlebooks');

module.exports = mongoose.connection;
