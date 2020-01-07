const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, data) => {
    if (err) {
      console.log('ID didnt exist');
    } else {
      items[data] = text;
      var todo = items[data];
      fs.writeFile(path.join(exports.dataDir, `${data}.txt`), text, (err) => {
        if (err) {
          throw ('didnt create a file');
        } else {
          callback(null, {id: data, text: text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  var result = '';
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading files from directory');
    } else {
      result = _.map(files, file => ({id: file.slice(0, -4), text: file.slice(0, -4)}));
      callback(null, result);
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  var todoPath = path.join(exports.dataDir, `${id}.txt`);
  // check if file exists
  fs.stat(todoPath, (err) => {
    if (err) {
      callback(new Error(`Error accessing ${id}.txt in update`));
    } else {
      // no issues accessing file, so we can update it
      fs.writeFile(todoPath, text, (err) => {
        if (err) {
          callback(new Error(`Writing to ${id}.txt in update`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  var todoPath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(todoPath, (err) => {
    if (err) {
      callback(new Error(`Error deleting file ${id}.txt`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
