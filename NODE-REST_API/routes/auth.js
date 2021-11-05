const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt");
//register
router.post ("/register" , async function(req,res){
    
    try{
      //generate new password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(req.body.password,salt);  

       // create new User
         const newuser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        //save user return response
       return res.status(200).send(newuser);
    } catch(err){
      return res.status(400).send(err.message)
    }
});

//LOGIN
router.post("/login",async (req,res)=>{
  try{
    const user = await User.findOne({email:req.body.email});
    if(!user){
          return res.status(404).send("user not found")
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
      return res.status(400).send("wrong password")
    }
    return res.status(200).send(user)
    
  }catch(err){
    return res.status(400).send(err.message)
  }
       
})

module.exports = router