const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const hostname="localhost";
const port=3001;

const app=express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/dishes',(req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
});

app.get('/dishes',(req,res,next)=>{
    res.end("Will Send all the dishes to you");
});

app.post('/dishes',(req,res,next)=>{
    res.end("Will add the dish "+req.body.name+" with details"+req.body.description);
});

app.put('/dishes',(req,res,next)=>{
    res.statusCode=403;
    res.end("Put Operation Not Supported");
});

app.delete('/dishes',(req,res,next)=>{
    res.end("Delete All the Dishes");
});

app.get('/dishes/:dishId',(req,res,next)=>{
    res.end("Will Send details of the dish: "+req.params.dishId);
});

app.post('/dishes/:dishId',(req,res,next)=>{
    res.statusCode=403;
    res.end("Put Operation Not Supported "+req.params.dishId);
});

app.put('/dishes/:dishId',(req,res,next)=>{
    res.write('Updating the dish '+req.params.dishId);
    res.end("Will update the dish "+req.body.name+" with details "+req.body.description);
});

app.delete('/dishes/:dishId',(req,res,next)=>{
    res.end("Deleting Dish"+req.params.dishId);
});

app.use(express.static(__dirname+'/public'));

app.use((req,res,next)=>{
    console.log(req.headers);
    res.statusCode=200;
    res.setHeader('Content-Type',"text/html");
    res.end("<html><body><h1>Hello, World</h1></body></html>");
});

const server = http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server is up & running at http://${hostname}:${port}`);
})