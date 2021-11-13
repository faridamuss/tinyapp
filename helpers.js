//generates a random 6 character string
const generateRandomString = function() {
  let randomString = "";
  return randomString += Math.floor((1 + Math.random()) * 0x10000).toString(6).substring(1);
};

// filters urls by userid so only the users owned links are shown
const filterURLByUserid = function(nameID, urlDatabase) {
  let filterURLs = {};
  for (let url in urlDatabase) {
    if (nameID && nameID.id === urlDatabase[url].userID) {
      filterURLs[url] = urlDatabase[url];
    }
  }
  return filterURLs;
};

//finds user by email to login user
const findUserByEmail = function(email, users) {
  return Object.values(users).find(user => user.email === email);
};

//checks if email is already registered to database
const emailAlreadyRegistered = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  filterURLByUserid,
  findUserByEmail,
  emailAlreadyRegistered
};