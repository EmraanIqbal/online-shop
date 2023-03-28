const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongodbConnect = (callBack) => {
  MongoClient.connect(
    "mongodb+srv://emran:admin123@cluster0.slzge.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("MongoDb Connected Successfully");
      _db = client.db();
      callBack();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found!";
};

exports.mongodbConnect = mongodbConnect;
exports.getDb = getDb;
