const router = require("express").Router();
const Upload = require("../models/Upload");
const User = require("../models/User");

//create a post
router.post("/", async (req,res)=>{
    const newPost = new Upload(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err){
        res.status(500).json(err);
    }
});

//update a post
router.put("/:id", async (req,res)=>{
    try{
        const post = await Upload.findById(req.params.id);
        if(post.userId ===req.body.userId){
            await post.updateOne({$set:req.body});
            res.status(200).json("the post has been updated");
        } else{
            res.status(403).json("You can update only your posts");
        }
    } catch(err){
        res.status(500).json(err);
    }
});

//delete a post
router.delete("/:id", async(req,res)=>{
    try{
        const post = await Upload.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("Your post is deleted");
        } else{
            res.status(403).json("You can only delete your posts");
        }
    } catch(err){
        res.status(500).json(err);
    }
});

//get a post
router.get("/:id", async (req,res)=>{
    try{
         const post = await Upload.findById(req.params.id);
         res.status(200).json(post);
    } catch(err){
        res.status(500).json(err);
    }
});

//get timelines posts
router.get("/timeline/all", async (req,res)=>{
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts =  await Promise.all(
            currentUser.followings.map(async (friendId) => {
              const post = await Upload.find({ userId: friendId });
              return post;
            })
          )
        res.json(userPosts.concat(...friendPosts))
    } catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;