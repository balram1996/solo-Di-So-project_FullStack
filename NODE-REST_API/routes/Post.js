const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User")
//create a post
router.post("/",async (req,res)=>{
  const newPost = new Post(req.body)
  try{
    const savePost = await newPost.save();
    res.status(200).send(savePost)
  } catch(err){
      res.status(500).send(err.message);
  }
});

//update a post
router.put("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
           await post.updateOne({$set:req.body});
          return res.status(200).send("post has been updated")
        } else{
          return  res.status(403).send("you can update only your post")
        }
    } catch(err){
        res.status(500).send(err.message)
    }
    
});

//delete a post
router.delete("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
           await post.deleteOne();
          return res.status(200).send("post has been deleted")
        } else{
          return  res.status(403).send("you can delete only your post")
        }
    } catch(err){
        res.status(500).send(err.message)
    }
    
});

//like a post and dislike
router.put("/:id/like", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).send("the post has been liked")
        } else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).send("the post been disliked")
        }
    } catch(err){
        res.status(500).send(err.message)
    }
    
});

// get a post
router.get("/:id", async(req,res)=>{
    try{
      const post = await Post.findById(req.params.id);
     return res.status(200).send(post)
    } catch(err){
       return res.status(500).send(err.message)
    }
});

//get timeline posts
router.get("/timeline/all" , async(req,res)=>{

    try{
      const currentUser = await User.findById(req.body.userId);
      const userPost = await Post.find({userId:currentUser._id});
      const friendPosts = await Promise.all(
          currentUser.followings.map((friendId)=>{
             return Post.find({userId:friendId})
          })
      );
      res.status(200).send(userPost.concat(...friendPosts))
    }catch(err){
      res.status(500).send(err.message)
    }
});

module.exports = router;
