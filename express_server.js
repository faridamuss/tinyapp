const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { generateRandomString, filterURLByUserid, findUserByEmail, emailAlreadyRegistered } = require("./helpers");

//database for users and urls
const urlDatabase = {};
const users = {};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

//gets home page/register page
app.get("/", (req, res) => {
  res.redirect("/register");
});

//gets url page and any urls if any
app.get("/urls", (req, res) => {
  const userLinks = filterURLByUserid(users[req.session.user_id], urlDatabase);
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(401).send('you are not logged in, please log in');
  }
  let templateVars = {
    urls: userLinks,
    user: users[req.session.user_id]
  };
  res.render('urls_index', templateVars);
});

//gets create url page
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect('/login');
  }
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

//gets register page
app.get("/register", (req, res) => {
  let templateVars = {
      user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

//gets login page
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

//gets shortURL edit page
app.get("/urls/:shortURL", (req, res) => { 
  const userLinks = filterURLByUserid(users[req.session.user_id], urlDatabase);

  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send('this short url does not exist');
    return;
  }
  if (req.session.user_id !== urlDatabase[shortURL].userID) {
    res.status(401).send('you do not have authorization');
    return;
  }
  for (link in userLinks) {
    if (link === shortURL) {
      let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL]["longURL"],
        user: users[req.session.user_id],
      };
      res.render("urls_show", templateVars);
    }
  }
});

//gets to original longURL site with shortURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    if (longURL === undefined) {
      res.status(302);
    } else {
      res.redirect(longURL);
    }
  } else {
    res.status(404).send("The short URL you are trying to access does not correspond with a long URL at this time.");
  }
});

//adds new longURL with shortURL to url page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

//deletes url by shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const userLinks = filterURLByUserid(users[req.session.user_id], urlDatabase);
  const shortURL = req.params.shortURL;
  for (link in userLinks) {
    if (link === shortURL) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    } else {
      res.send("You do not have authorization to delete this short URL.");
    }
  }
});

//edits url
app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const userUrls = filterURLByUserid(users[req.session.user_id], urlDatabase);
  if (Object.keys(userUrls).includes(req.params.id)) {
    const shortURL = req.params.id;
    urlDatabase[shortURL].longURL = req.body.newURL;
    res.redirect('/urls');
  } else {
    res.status(401).send("You do not have authorization to edit this short URL.");
  }
}); 

//Login user
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("email or password cannot be blank");
  }
  let user = findUserByEmail(email, users);
  
  if (!user) {
    return res.status(401).send('you are not registered, please create an account');
  }
  if (!bcrypt.compareSync(password, user['password'])) {
    return res.status(400).send('password does not match');
  }
  req.session.user_id = user["id"];
  res.redirect('/urls');
});

//register a new user
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("email or password cannot be blank");
  } else if (emailAlreadyRegistered(email, users)) {
    res.status(400).send("Please try a different email, this email is already registered with an account");
  }
  const id = Math.floor(Math.random() * 2000) + 1;
  users[id] = {
    id: id,
    email: email,
    password: bcrypt.hashSync(password, 10),
  };
  req.session.user_id = id;
  res.redirect('/urls');
});

//logout user
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

//what port its on
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});