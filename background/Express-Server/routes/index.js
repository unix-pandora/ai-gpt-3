var express = require("express");
var router = express.Router();

const test = require("./settle/test");
const robot = require("./settle/robot");

let bodyParser = require("body-parser");
let jsonParser = bodyParser.json();

router.get("/test", (err, res) => {
  var query = test.query();
  res.json(query);
});

router.post("/test1", jsonParser, (req, res, next) => {
  console.dir(req.body);
  res.json({
    code: 0,
    msg: "提交成功",
  });
});

router.get("/test-query", (req, res, next) => {
  console.dir(req.query);
  let params = req.query;

  res.json({
    code: 0,
    msg: "成功",
    params,
  });
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/generate", async (req, res) => {
  console.dir(req.body);
  let text = robot.robot(req.body);
  res.json({ text });
});

module.exports = router;
