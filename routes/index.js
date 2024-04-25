// routes/index.js

var express = require('express');
var router = express.Router();
const database = require("../models");
const { checkLogin } = require('../service/userService');
const { hashPass, comparePass } = require('../service/bcryptService');
const multer = require('multer'); // Import multer

// Configure multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination directory for file uploads
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname); // Generate a unique filename
  }
});
const uploader = multer({ storage: storage }); // Create multer instance

/* TO SYNC OUR DATABASE TO ALL THE MODELS */
database.sequelize.sync();

/* GET HOME PAGE */
router.get('/', function(req, res, next) {
  res.render('index', { message: '' });
});

/* LOGIN FUNCTIONALITY */
router.post('/home', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  let user = await checkLogin(username, password);
  if (user) {
    // success 
    req.session.username = username;
    req.session.logintime = new Date();
    req.session.userid = user.user_id;

    res.render('home', { username: username, picture: user.picture });
  } else res.render('index', { message: 'Invalid credentials' });
});

/* GET THE CREATE ACCOUNT PAGE */
router.get("/create", async(req,res,next) => {
  res.render('createaccount');
})

/* CREATE A NEW USER IN THE DATABASE */
router.post("/create", uploader.single('picture'), async(req,res,next)=>{
  const user = req.body;
  const password = user.password;

  const hashedPassword = await hashPass(password);
  const newUser = {
    username: user.username,
    hashedPassword: hashedPassword,
    gender: user.gender,
    mobile: user.mobile,
    email: user.email,
    // picture: req.file.path,
    profile_text: user.profiletext
  };

  const userSaved = await database.users.create(newUser);
  res.render('index', { message: 'Account created successfully' });
})

/* CHECK IF A USERNAME IS AVAILABLE */
router.get('/check/:username', async(req,res,next) => {
  const name = req.params.username;
  const user = await database.users.findOne({where: {username: name}});

  if(user){
    res.json({available: false});
  }
  else res.json({available: true});
})
router.get("/create", async(req,res,next) => {
  res.render('createaccount');
})

/* LOGOUT FUNCTIONALITY */
router.get('/logout', async function(req, res, next){
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
