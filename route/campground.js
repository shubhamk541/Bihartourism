var express  = require("express");
var router   = express.Router();
var Campground= require("../models/campground.js");

//INDEX Route==================

router.get("/",isUserlogin,function(req,res)
{
   Campground.find({},function(err,campgrounddata)
   {
      if(err)
      console.log(err);
      else
      res.render("campground/campgrounds",{campgrounds:campgrounddata});
   });
  
});
router.post("/",isUserlogin,function(req,res)
{
   
   Campground.create(req.body.campground,function(err,campgrounddata)
   {
      if(err)
      console.log(err);
      else
      {
         campgrounddata.author.username=(req.user.username);
         campgrounddata.author.id=(req.user.id);
         campgrounddata.save();
         
         console.log(campgrounddata);
         res.redirect("/campgrounds");
      }
      
   });
  
});
router.get("/new",isUserlogin,function(req, res) {
   res.render("campground/newcampgrounds");
    
})
//AS comment is referenced by objects so we have to populate that=====
router.get("/:id",isUserlogin,function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err,campgrounddata)
   {
      console.log(req.params.id);
      if(err)
      res.send("Campgrounds not found!!!!!!!!!!!");
      else
      
      {
        
      res.render("campground/showcampground",{data:campgrounddata});}
      
   });
});

//Edit  and Update Campground===============

router.get("/:id/edit",checkUser,function(req,res)
{
   Campground.findById(req.params.id,function(err,data)
   {
      if(err)
      res.send(err);
      else
       res.render("campground/edit",{campground:data});
 });
  
});
router.put("/:id",checkUser,function(req,res)
{
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedData)
   {
      if(err)
      res.render("campground/edit");
      else
   
      res.redirect("/campgrounds/"+req.params.id);
   });
   
});


//Delete Route

router.delete("/:id",function(req,res)
{
   Campground.findByIdAndRemove(req.params.id,function(err,data)
   {
      
      if(err)
      res.redirect("/campgrounds/"+req.params.id);
      else
      res.redirect("/campgrounds");
   });
   
});
//Middleware for edit delete owner of the post==========
function checkUser(req,res,next)
{
   if(req.isAuthenticated())
   {
      Campground.findById(req.params.id,function(err, campground) {
          if(err)
          res.send("Not Login");
          else
          {
             if(campground.author.id.equals(req.user._id))
             {
               return next();
             }
             else
             res.send("No permission");
          }
      });
   }
   else
   res.redirect("back");
}



// Middleware fun to check user exist or not========
function isUserlogin(req,res,next)
{
   if(req.isAuthenticated())
   return next();
   res.redirect("/login");
}
module.exports=router;