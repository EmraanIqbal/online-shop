const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongodbConnect = (callBack) => {
  MongoClient.connect(
    "mongodb+srv://emran:admin123@cluster0.slzge.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((result) => {
      console.log("MongoDb Connected Successfully");
      callBack(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongodbConnect;
