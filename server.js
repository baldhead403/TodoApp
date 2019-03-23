const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// Get Models
const Todo = require('./models/todoModel')

// Get Routes
const todoRoutes = express.Router()

//Connect to MongoDb
mongoose
.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true})
.then(() => console.log('MongoDb Connected...'))
.catch(err => console.log(err))

const connection = mongoose.connection

connection.once('open', () => {
    console.log('MongoDb Connected...')
})

app.use(bodyParser.json())

app.use('/todos', todoRoutes)

todoRoutes.route('/').get((req,res) => {
    Todo.find(function (err,todos) {
        if(err){
            console.log(err)
        }else{
            res.json(todos)
        }
    })
})

todoRoutes.route('/:id').get((req,res) => {
    const id = req.params.id
    Todo.findById(function (err,todos) {
            res.json(todos)
    })  
})

todoRoutes.route('/add').post((req,res) => {
    const todo =  new Todo(req.body) 

    todo.save().then(todo => {
        res.status(200).json({'todo': 'todo added'})
    })
    .catch(err => {
        res.status(400).send('adding failed')
    })
})

todoRoutes.route('/update/:id').post((req,res) => {
    
    Todo.findById(req.params.id,(err,todo) => {
        if(!todo){
            res.status(404).send('Data is not found')
        } else {
            todo.todo_description = req.body.todo_description
            todo.todo_responsible = req.body.todo_responsible
            todo.todo_priority = req.body.todo_priority
            todo.todo_completed = req.body.todo_completed

            todo.save().then(todo => {
                res.json('Todos Updated')
            })
            .catch(err => {
                res.status(404).send('Update not possible')
            })
        }   
        
    })  
})



const port = process.env.Port || 5000

app.listen(port, () => {
    console.log('server is running on port ' + port)
})