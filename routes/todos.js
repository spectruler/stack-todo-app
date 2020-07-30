var router = require('express').Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var ToDos = require('../models/todos')

// get all tasks 
router.route('/') 
.get((req,res,next)=>{ //
    console.log(req.user)
    ToDos.find({"author": req.user.username,"complete": false}) // find todos relevant to user
    .then(todos=> {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todos)
    }, err => next(err))
    .catch(err => next(err))
})

// create new task
router.post('/add',(req,res,next)=>{
    req.body.author = req.user.username
    ToDos.create(req.body)
    .then(todo => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todo)
    },err => next(err))
    .catch(err => next(err))
})

// update task
router.put('/edit/:todoId',(req,res,next)=>{
    ToDos.findByIdAndUpdate(req.params.todoId, {$set:req.body},
        {new: true})
        .then(todo => {
            res.statusCode = 200
            res.setHeader('Content-Type','application/json')
            res.json(todo)
        },err=> next(err))
        .catch(err => next(err))
})

// delete task
router.delete('/remove/:todoId',(req,res,next)=>{
    ToDos.findByIdAndRemove(req.params.todoId)
    .then(resp => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err))

})

// get all completed tasks
router.get('/completed', (req,res,next) => {
    ToDos.find({"author": req.user.username,"complete": true})
    .then(todos=> {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todos)
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = router