const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Require the path module

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/DashboardDB", {useNewUrlParser: true, useUnifiedTopology: true});

const TestSchema = {
    // _id: String,
    heading: String,
    desc: String,
    link: String
}

const test1=mongoose.model("urls", TestSchema);

app.get("/form",function(req,res){
    res.sendFile(__dirname + "/form.html");
});

app.get("/index",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
    let newTest= new test1({
        // _id: req.body._id,
        heading: req.body.heading,
        desc: req.body.desc,
        link: req.body.link
    })
    newTest.save();
    res.redirect("/");
});
app.get("/",function(req,res){
    res.sendFile(__dirname + "/dashboard.html");
});
app.get("/data",(req,res)=>{
    test1.find({}).then((docs)=>{
        console.log(docs);
    res.json(docs)});
});

app.post("/delete/:_id",(req,res)=>{
    
    const id = req.params._id;
    test1.deleteOne({_id: id})
    .then(() =>{
        res.send({ message: "success"});
    })
    .catch((err) => {
        res.status(500).send({message: "error" , error: err})
    });
});

app.listen(5000, function(){
    console.log("Server is running at port 5000");
})