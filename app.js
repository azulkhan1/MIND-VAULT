const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model('Article', articleSchema);

//targething all articles

app.get("/articles", (req,res)=>{
    Article.find().then((foundArticles)=>{
        res.send(foundArticles);
    }) .catch((e)=>{
        console.log(e);
    })
});

app.post("/articles",function (req,res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save().then(()=>{
      console.log("created successfully !");
      res.send(newArticle);
  }).catch(err => {
      console.log(err);
  })
  });

  app.delete("/articles", function(req,res){
    Article.deleteMany({}).then(() => {
      res.send("Done 👍")
      })
      .catch(function (err)  {
        res.send(err);
      });
  });

//targeting specific articles 

app.route("/articles/:searchByTitle")
.get((req, res)=>{
    const searchedTitle = req.params.searchByTitle;
    Article.findOne({title: searchedTitle}).then(foundArticle => {
        res.send(foundArticle);
    }).catch(err => {
        console.log(err);
    });
})
.put((req, res)=>{
    const searchedTitle = req.params.searchByTitle;
    Article.replaceOne({title: searchedTitle}, {title: req.body.title, content: req.body.content}, {overwrite:true}).then(updatedArticle => {
        res.send(updatedArticle);
    }).catch(err => {
        console.log(err);
    });
})
.patch((req, res) =>{
    const searchedTitle = req.params.searchByTitle;
    Article.updateOne({title: searchedTitle}, {$set: req.body}).then((updateStatus)=>{
        res.send(updateStatus);
    }).catch(err => {
        console.log(err);
    });
})
.delete((req, res) => {
    const searchedTitle = req.params.searchByTitle;
    Article.deleteOne({title: searchedTitle}).then((deletedItem)=>{
        console.log(Object.keys(deletedItem), typeof(deletedItem), deletedItem.deletedCount, deletedItem.acknowledged);
        res.send(deletedItem)
    }).catch(err => {
        console.log(err);
    });
});

app.listen(3000, function(){
    console.log("listening on port 3000")
})