
// =-=-=-=-=- Express -=-=-=-=- //
var express = require('express');
var app = express();

// =-=-=-=-=- Mongoose -=-=-=-=- //
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restfulTaskApi', {useNewUrlParser: true}); // name of DataBase!!!!

//Use Native Promises
mongoose.Promise = global.Promise;

// Require path
var path = require('path');

// Integrate body-parser with our App

const bodyParser = require("body-parser");

// -=-=-=-=-=-=-=-=-=-=-=-=- Use static folder directory -=-=-=-=-=-=-=-=-=-//
//app.use(express.static(path.join(__dirname, 'static'))); dup
// app.use(express.static(__dirname + "/static"));Altered for static anglar files
app.use(express.static( __dirname + '/public/dist/public' ));

// -=-=-=-=-=-=-=-=-=-=-=-=- // Setting our View Engine location -=-=-=-=-=-=-=-=-=-//
//app.set('views', path.join(__dirname, './views')); now in json

// -=-=-=-=-=-=-=-=-=-=-=-=- Setting up SCHEMAs -=-=-=-=-=-=-=-=-=-//
//var Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
    title: {type: String, required: [true, "titles must be longer than 1 chars"], minlength: [1, "titles must be at least 1 chars long"]}, //validations added so that no empty fields are permitted
    desc: {type: String, default: "", required: [true, "descriptions must be longer than 1 chars"], minlength: [1, "descriptions must be at least 1 chars long"]}, //validations added so that no empty fields are permitted
    comp: {type: Boolean, required: [false, "false is not, true means that it is done"]}, 
    },{ timestamps: true });

//-=-=-=-=-=- Store models in variables
mongoose.model("Task", TaskSchema); // make collection

// -=-=-=-=- Set models by passing the schemas -=-=-=-=--=//

var Task = mongoose.model("Task"); //store collection inside

// ================================== ROUTES!!! ===============================//

app.use(bodyParser.json());

//GET ALL -

app.get('/tasks', function(req, res){
    Task.find({}, function(err, data){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
        }
        else {
            // respond with JSON
            console.log('Success - get in app.get - get all');
            res.json({message: "Success", data: data})
        }
    })
})

//GET by Id
app.get('/tasks/:id', function(req, res){
    Task.findById(req.params.id, function(err, data){
        if(err){
            console.log("Returned error Getting by ID", err);
             // respond with JSON
            res.json({message: "Returned error Getting by ID", error: err})
         }
         else {
             // respond with JSON
             console.log('Success - get in app.get - get by id!');
             res.json({message: "Success", data: data})
         }
    })
})

//POST -

app.post('/tasks/', function(req, res){
    console.log("Posting in a new Task: ", req.body);
    Task.create(req.body, function(err, data){
        if(err){
            // handle the error from creating a blog
            //console.log("Something went wrong in - saving task/post", err);
            res.json({message: "Error - Posting in a  new Task", error: err})
        }
        else {
            console.log('Success - Posting in app.post - new Task!');
            res.json({message: "Success!", data:data})
        }
    })    
})

//PUT by id -
app.put('/tasks/:id', function(req, res){
    console.log("ADDing in a name: ", req.body);
    //Task.create(req.body, function(err, data){
    Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}, function(err, data){
        if(err){
            // handle the error from creating a blog
            console.log("Something went wrong in - app.put Putting in an ID", err);
            res.json({message: "Error", error: err})
        }
        else {
            console.log('Success - Posting app.put in a Task by ID!');
            res.json({message: "Success!", data:data})
        }
    })
})

//DELETE by id ?
app.delete('/tasks/:id', function(req, res){
    console.log("deleting by id, in a name: ", req.body);
    Task.findByIdAndDelete(req.params.id, function(err, data){
        if(err){
            // handle the error from creating a blog
            console.log("Something went wrong in - app.delete Deleting by ID", err);
            res.json({message: "Error", error: err});
        }
        else {
            console.log('successfully Deleted!');
            res.json({message: "Success!", data:data});
        }
    })    
})

// this route will be triggered if any of the routes above did not match
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});


// -=-=-=-=-=-=-=-Setting our Server to Listen on Port: 8000 -=-=-=-=-
app.listen(8000, function() {
    console.log("Board is running, listening on port 8000");
    });  



