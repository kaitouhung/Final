const mongoose = require('mongoose');
require('dotenv').config();

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connect MongoDB successfully');
  } catch (error) {
    console.log(`Connect MongoDB failure: ${error.message}`);
  }
};

module.exports = {
  connectMongo,
};
