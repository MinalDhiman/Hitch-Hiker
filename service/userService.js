// logic for checking the password
const db = require("../models");
const { comparePass } = require("./bcryptService");

// const bcrypt=require('bcrypt');
const checkLogin = async (username, password) => {
  let user = await db.users.findOne({ where: { username: username } });
  let equalpass="";
  if(user){
    console.log(user);
    equalpass = await comparePass(password,user.hashedPassword);
  }
  if (user!=null && equalpass) {
    return user;
  }
  
  else return undefined;
};
module.exports = { checkLogin };