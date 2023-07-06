require("dotenv").config();
const express = require("express");
const querystring = require('querystring');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

const corsOptions = {
  origin: ["https://vishnu-blog-fe.onrender.com"]
  // origin: ["http://localhost:3000"]
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongodbCred = process.env.MONGO_DB_CRED;

mongoose.connect(mongodbCred, { useNewUrlParser: true });

const db = mongoose.connection;

const WrittenBlog = new mongoose.Schema({
  Content: String,
  Heading: String,
  Paragraph: String,
  Filename: String,
  Image: String,
  Postdate: String,
});

const WrittenBlogSchema = mongoose.model("WrittenBlog", WrittenBlog);

app.get("/test", function (req, res) {
  const message = "Hello world from nodejs";
  res.json(message)
  const now = new Date();
  console.log(now.getDate() + ' ' + now.toLocaleString('en-US', { month: 'short' }) + ' ' + now.getFullYear());
});

let blogFromDB = [];

app.get("/v1/api/blogs/:filename", function (req, res) {

  const fileName = encodeURIComponent(req.params.filename);

  console.log(fileName);

  Promise.all([
    WrittenBlogSchema.find({Filename: fileName}, { _id: 0, Heading: 0, Paragraph: 0, Image: 0, Postdate: 0, })
  ])
    .then(([blogRecord]) => {
      blogFromDB = blogRecord.map((doc) => doc);
      const response = {blogFromDB}
      console.log(response);
      res.json(response)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error searching for blog')
    })

});

let allblogFromDB;

app.get("/v1/api/allblogs", function (req, res) {
  Promise.all([
    WrittenBlogSchema.find({}, { _id: 0, Content: 0 })
  ]
  )
    .then(([allblogRecord]) => {
      allblogFromDB = allblogRecord.map((doc) => doc);
      const response = {allblogFromDB}
      // console.log(response);
      res.json(response)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error searching for blog')
    })
});

app.post("/v1/api/writtenblogs", function (req, res) {

  const writtenBlogContent = req.body.finalContent;
  const writtenHeading = req.body.heading;
  const writtenParagraph = req.body.paragraph;
  const writtenImage = req.body.imageSrc;

  const fileName = req.body.heading;

  const now = new Date();

  const timestamp = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

  const modifiedFileNameToRemoveQuestion = fileName.replace("?", "__question__");

  const modifiedFileName = encodeURIComponent(modifiedFileNameToRemoveQuestion);

  const modifiedFileNameFinal = `${modifiedFileName}_${timestamp}`;

  const postedDate = now.getDate() + ' ' + now.toLocaleString('en-US', { month: 'short' }) + ' ' + now.getFullYear();

  const writtenBlogsFinal = new WrittenBlogSchema({
    Content: writtenBlogContent,
    Heading: writtenHeading,
    Paragraph: writtenParagraph,
    Filename: modifiedFileNameFinal,
    Image: writtenImage,
    Postdate: postedDate,
  })

  writtenBlogsFinal.save();

});

app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});