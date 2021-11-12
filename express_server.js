const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
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
}

//Set up GET requests:

const getUserByEmail = function(email) {
  const values = Object.values(users); 
  for (const user of values) {
    if (user.email === email) {
      return user;
    }
  }
  return null; 
};

app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user: req.cookies["user"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user: req.cookies["user"],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username:req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const templateVars = {
    shortURL, 
    longURL: urlDatabase[shortURL],
    user: req.cookies["user"]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
const templateVars = {
  user: req.cookies["user"],
}
res.render("urls_registration", templateVars);
});

//POST requests:  
app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  urlDatabase[shortString] = req.body.longURL;
  res.redirect(`/urls/${shortString}`);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id; 
  const longURL = req.body.newURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
}); 

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password; 

  if (!enteredEmail || !enteredPassword) {
    res.status(400).send("400: Invalid email/password");
  }

  const user = {
    id: generateRandomString(), 
    email: req.body.email, 
    password: req.body.password,
  };
  users[user.id] = users;
  res.cookie("user", user);
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  res.cookie('user', req.body.user);
  res.redirect('/urls');
}); 

app.post("/logout", (req, res) => {
  res.clearCookie('user', req.body.user);
  res.redirect('urls');
});
      
//Listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
      
// Implement a function that returns a string of 6 random alphanumeric characters.
function generateRandomString() {
  return Math.random().toString(36).substr(2,6);
};