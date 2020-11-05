const express = require('express');
const port = 8000;
const db = require('./config/mongoose');
const app = express();

const path = require('path');
const Todo = require('./models/todo');
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//IN CSS
app.use(express.static('assets'));
app.get('/', function (req, res) {
    Todo.find({}, function (err, todos) {
        if (err) {
            console.log('error', err);
            return;
        }
        return res.render('home',
            {
                title: "TODO APP",
                todo_list: todos
            }
        );
    });    
});

// IN DATABASE
app.post('/create-todo', function (req, res) {
    Todo.create({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        }, function (err, newtodo) {
            if (err) {
                console.log('error in creating task', err);
                return;
            }
            return res.redirect('back');
        }
    )
});

//  DELETE SINGLE TASK FROM DATABASE
app.get('/delete_todo_single', function(req, res) {
    let id = req.query.id;
    Todo.findByIdAndDelete(id, function(err){
        if(err) {
            console.log("error");
            return;
        }
        return res.redirect('back');
    });
});

//  DELETE THE MULTIPLE ITEM FROM DATABASE
app.post('/delete-todo', function(req, res) {
    let ids = req.body.task;
    //single task deleted
    if (typeof(ids) == "string") {
        Todo.findByIdAndDelete(ids, function(err) {
            if (err) { 
                console.log("error in deleting"); 
                return; 
            }
        });
    } else {    // multiple task deleted
        for (let i = 0; i < ids.length; i++) {
            Todo.findByIdAndDelete(ids[i], function (err) {
                if (err) { 
                    console.log("error in deleting");
                    return; 
                }
            });
        }
    }
    return res.redirect('back');
});

// SERVER
app.listen(port, function(err) {
    if(err) {
        console.log("Error in setting up the express server!");
    }
    console.log("Express server is up and running on port:", port);
});