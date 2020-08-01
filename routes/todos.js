var router = require('express').Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var ToDos = require('../models/todos')

// get all tasks 
router.route('/') 
.get((req,res,next)=>{ //
    // req.user.username,
    ToDos.find({"author":req.userData.userId, "complete": false}) // find todos relevant to user
    .then(todos=> {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        const filtered = todos.map(todo => {
            return {_id: todo._id, complete: todo.complete, task: todo.task}
        })
        res.json(filtered)
    }, err => next(err))
    .catch(err => next(err))
})

// get specific task 
router.route('/:id')
.get((req,res,next)=>{
    ToDos.findOne({"_id":req.params.id})
    .then(todo => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json({_id: todo._id, task: todo.task, complete:todo.complete})
    },err => next(err))
    .catch(err=> next(err))
})

// create new task
router.post('/add',(req,res,next)=>{
    // console.log(req.userData)
    req.body.author = req.userData.userId;
    ToDos.create(req.body)
    .then(todo => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json({todoId: todo._id})
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
            const task = {_id: todo._id, task: todo.task, complete: todo.complete}
            res.json(task)
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
    ToDos.find({"author": req.userData.userId,"complete": true})
    .then(todos=> {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todos)
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = router