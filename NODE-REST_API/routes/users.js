const router = require("express").Router();
const bcrypt = require("bcrypt");
const { findById } = require("../models/User");
const User = require("../models/User");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
   // console.log(req.user.isAdmin)
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).send(err.message);
      };
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body
        });
       return res.status(200).send("Account has been updated");
      } catch (err) {
        return res.status(500).send(err.message);
      };
  } else {
    return res.status(401).send("you can update only your account");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
     // console.log(req.user.isAdmin)
      
      try {
          const user = await User.findByIdAndDelete(req.params.id);
         return res.status(200).send("Account has been deleted");
        } catch (err) {
          return res.status(500).send(err.message);
        };
    } else {
      return res.status(401).send("you can delete only your account");
    }
  });

//get a user
router.get("/:id", async(req,res)=>{
    try{
       const user = await User.findById(req.params.id);
       const{password,updatedAt,...other} = user._doc
       return res.status(200).send(other)
    } catch(err){
        return res.status(500).send(err.message);
    }
});

//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}});
               return res.status(200).send("user has been followed")
            }else{
                return res.status(403).send("you already follow this user")
            }
        } catch(err){
          return  res.status(500).send(err.message);
        }
    }else{
        return res.status(403).send("you cant follow yourself")
    }
});

//unfollow user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId!==req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}});
               return res.status(200).send("user has been unfollowed")
            }else{
                return res.status(403).send("you not follow this user")
            }
        } catch(err){
          return  res.status(500).send(err.message);
        }
    }else{
        return res.status(403).send("you cant unfollow yourself")
    }
});

module.exports = router;
