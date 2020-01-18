const mongoose = require("mongoose");
const getSecret = require("./secret");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

mongoose.connect(getSecret("dbUri"));
let db = mongoose.connection;
const ObjectID = require('mongodb').ObjectID;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/", (req, res) => {
  res.json({ message: "Connected To API" });
});

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


router.get("/getDataById/:id", (req, res) => {
  Data.findOne({"id": req.params.id },(err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ data: data });
  });
});

function findId(id){
  return "5def7ca51d12434c64300783";
}

router.post("/updateLikeById/", (req, res) => {
  var update;
  const {id} = req.body;
  Data.findOne({"id": id },(err, data) => {
    if (err) return res.json({ success: false, error: err });
        update = data;
        update["likes"] = update["likes"] + 1;
        var _id = update["_id"];
        Data.findByIdAndUpdate(_id, update, err => {
            if (err) return res.json({ success: false, error: err });
            return res.json({ success: true });
          });
        //return res.json({ data: myData });
  });

/*  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });*/
})

router.post("/hitLike",(req, res) => {
  const {id} = req.body;
  Data.findOneAndUpdate({ _id: ObjectID(id) },
   { $inc: { likes: 1 }}
);
});

router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});



router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true,"body":req.body});
  });
});

router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, quote, author, likes } = req.body;

if ((!id && id !== 0) || !quote || !author) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.quote = quote;
  data.id = id;
  data.author = author;
  data.likes = likes;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON UHH PORT ${API_PORT}`));
