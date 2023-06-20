const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());

const corsOptions = {
  origin: ["https://vishnu-blog-fe.onrender.com"]
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", function (req, res) {

    const message = "Hello world from nodejs";
    res.json(message)

});

app.listen(3001, () => {
    console.log('Server is listening on port 3001');
  });