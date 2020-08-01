const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ToDoSchema = new Schema({
    task:{
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('ToDo',ToDoSchema)