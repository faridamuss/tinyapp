const { assert } = require('chai');

const { findUserByEmail, emailAlreadyRegistered, filterURLByUserid, generateRandomString } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
const testUrl = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};
describe('findUserByEmail', function() {
  it('should return a user with a valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
});

describe('emailAlreadyRegistered', function() {
  it('should return true if email is already being used', function() {
    const emailExists = emailAlreadyRegistered("user@example.com", testUsers);
    const expectedOutput = true;
    assert.equal(emailExists, expectedOutput);
  });
  it('should return false if email is not being used', function() {
    const emailExists = emailAlreadyRegistered("newuser@example.com", testUsers);
    const expectedOutput = false;
    assert.equal(emailExists, expectedOutput);
  });
});

describe('filterURLByUserid', function() {
  it('should return the links accociated with userID', function() {
    const userLinks = filterURLByUserid(testUsers["userRandomID"], testUrl);
    const expectedOutput = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "userRandomID"
      }
    };
    assert.equal(JSON.stringify(userLinks), JSON.stringify(expectedOutput));
  });
});

describe('generateRandomString', function() {
  it('should return a string with six characters', function() {
    const randomStringLength = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(randomStringLength, expectedOutput);
  });

  it('should not return the same string when called multiple times', function() {
    const firstRandomString = generateRandomString();
    const secondRandomString = generateRandomString();
    assert.notEqual(firstRandomString, secondRandomString);
  });
});
