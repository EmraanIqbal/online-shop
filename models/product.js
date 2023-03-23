const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const pa = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(pa, (err, fileContenet) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContenet));
    }
  });
};

module.exports = class Products {
  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(pa, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
