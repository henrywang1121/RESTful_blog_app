var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

//App Config
mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//Mongoose Model Config
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

/*
Blog.create({
    title: "Test Blog",
    image: "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    body: "A blog post"
})
*/


//RESTful Routes

app.get('/', function(req,res){
    res.redirect('/blogs');
})

//Index Route
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log('Error');
       } else {
           res.render('index', {blogs: blogs});
       }
    });
});

//New Route
app.get('/blogs/new', function(req, res){
    res.render('new');
});

//Create Route
app.post('/blogs', function(req, res){
   //create blog
   Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render('new');
       } else {
           res.redirect('/blogs');
       }
   });
});

//Show Route
app.get('/blogs/:id', function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect('/blogs');
       } else{
           res.render('show', {blog: foundBlog});
       }
       
   })
});

//Edit Route
app.get('/blogs/:id/edit', function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect('/blogs');
       } else {
           res.render('edit', {blog: foundBlog});
       }
   });
});

//Update Route
app.put('/blogs/:id', function(req, res){
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           res.redirect('/blogs');
       } else{
            res.redirect('/blogs/'+ req.params.id)     
       }
   });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log('Server Running'); 
});