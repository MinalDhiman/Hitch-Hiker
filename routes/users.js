var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const database = require("../models");

const multer = require('multer');
const uploader = multer({dest: "uploads"});

/* TO SYNC OUR DATABASE TO ALL THE MODELS */
database.sequelize.sync();

/* GET USERS LISTING. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* UPDATE USER DETAILS */
router.post('/update', uploader.single('picture'), async(req,res,next) => {
  const details = req.body;
  const userid = req.session.userid;

  console.log(details);
  console.log(userid);

  const user = await database.users.findOne({where: {user_id: userid}});

  if(!user){
    res.json({message: `user with ${userid} doesn't exist`});
    return;
  }

  if(details.password !== undefined && details.password !== ""){
    const hashedPassword = await bcrypt.hash(details.password,10);
    user.hashed_password = hashedPassword;
  }

  if(details.gender !== undefined && details.gender !== "")
    user.gender = details.gender;
  if(details.mobile !== undefined && details.mobile !== "")
    user.mobile = details.mobile;
  if(details.email!== undefined && details.email !== "")
    user.email = details.email;
  if(details.pic !== undefined && details.pic !== "")
    user.pic = req.file.path;
  if(details.profiletext !== undefined && details.profiletext !== "")
    user.profile_text = details.profiletext;

  const updated=await user.save();
  res.render('index', {message: "Successfully updated"});
});

/* GET THE UPDATE USER FORM */
router.get('/update', async(req,res,next) => {
  res.render('updateaccount');
});

module.exports = router;
