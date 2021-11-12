//All the requirements
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

// FUNCTIONS //
// Implement a function that returns a string of 6 random alphanumeric characters.
function generateRandomString() {
  let text = '';
   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   for (let i = 0; i < 6; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   return text;
}

const emailInUsers = (email) => {
  for(id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return false;
};

//-------GET REQUESTS --------/
app.get("/", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"],
    users
  };
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"],
    users
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
  urls: urlDatabase, 
  user_id: req.cookies["user_id"], 
  users
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; 
  const templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"], 
    users
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user_id: req.cookies["user_id"], 
    users
  };
  res.render("urls_registration", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    urls: urlDatabase, 
    user_id: req.cookies["user_id"], 
    users
  };
  res.render("urls_login", templateVars)
})
      
//---------POST REQUESTS -------//

app.post("/urls", (req, res) => {
  console.log(req.body);
  if (!req.cookies.user_id) {
    res.redirect("/login");    
  } else if (req.cookies.user_id) {
    const shortString = generateRandomString();
    urlDatabase[shortString] = req.body.longURL; 
    res.redirect(`/urls/${shortString}`);
  }
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
  } else if (emailInUsers(enteredEmail, users)) {
    res.status(400).send("400: Account already exists");
  } else {
    const user = {
      id: generateRandomString(), 
      email: req.body.email, 
      password: req.body.password,
    };
    users[user.id] = users;
    console.log(users);
    res.cookie("user_id", user.id);
    res.redirect('/urls');
  }
});

app.post("/login", (req, res) => {
  const enteredEmail = req.body.email; 
  const enteredPassword = req.body.password; 
  if (!enteredEmail) { 
    return res.status(403).send("403: Email not found");
  } else if (emailInUsers(enteredEmail, users)) {
    const user = emailInUsers(enteredEmail, users);
    if(enteredPassword !== users[user].password) {
      return res.status(403).send("403: Invalid Username/Password");
    } else {
      res.cookie("user_id", user);
      res.redirect('/urls');
    }
  } else {
    return res.status(400).send("Email not found")
  }
}); 

app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.body.user);
  res.redirect('urls');
});
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});