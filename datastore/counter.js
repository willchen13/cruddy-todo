const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  /*

  All todo entries are identified by an auto-incrementing id. Currently, that id is a counter stored in memory. Your first goal is to save the current state of the counter to the hard drive, so it's persisted between server restarts. Do this by rewriting getNextUniqueId to make use of the provided readCounter and writeCounter functions.

  */

  // read the counter value from the text file
  readCounter((err, data) => {
    if (err) {
      callback('error while reading counter file');
    } else {
      counter = data + 1;
      // now that we've incremented the counter variable, we need to update the local storage
      // text file to contain that counter
      writeCounter(counter, (err, data) => {
        if (err) {
          throw ('error writing the counter');
        } else {
          callback(null, zeroPaddedNumber(counter));
        }
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
