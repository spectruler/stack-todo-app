var express = require('express');
const bodyParser = require('body-parser')
var User = require('../models/users')
var passport = require('passport')
var jwt = require('jsonwebtoken')

var router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// post method to signup 
router.post('/signup',(req,res,next)=>{
  User.register(new User({username: req.body.username}),
      req.body.password, (err,user)=>{
          if(err){
            res.statusCode = 500
            res.setHeader('Content-Type','application/json')
            res.json({err:err})
          }else{
            passport.authenticate('local')(req,res,()=>{
              res.statusCode = 200
              res.setHeader('Content-Type','application/json')
              res.json({success:true, status:'Registration Successful!'})
            })
          }
        })
})
// user login route
router.post('/login',passport.authenticate('local'),(req,res)=>{
  res.statusCode = 200
  res.setHeader('Content-Type','application/json')
  const token = jwt.sign({username: req.user.username, userId: req.user._id},
    'Shh!! This is secret!', {expiresIn: '1h'})
  res.json({token: token, expiresIn: 3600})
})

// user logout route 
router.get('/logout',(req,res)=>{
    if(req.session){
      req.session.destroy()
      res.clearCookie('session-id')
      res.redirect('/')
    }else{
      var err = new Error('You are not logged in')
      err.status = 403
      next(err)
    }
})



module.exports = router;
