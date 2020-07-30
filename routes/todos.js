var router = require('express').Router()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var ToDos = require('../models/todos')

router.route('/') 
.get((req,res,next)=>{ //
    ToDos.find({author: req.user}) // find todos relevant to user
    .then(todos=> {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todos)
    }, err => next(err))
    .catch(err => next(err))
})

router.post('/add',(req,res,next)=>{
    ToDos.create(req.body)
    .then(todo => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(todo)
    },err => next(err))
    .catch(err => next(err))
})

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

router.delete('/remove/:todoId',(req,res,next)=>{
    ToDos.findByIdAndRemove(req.params.todoId)
    .then(resp => {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err))

})