"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// これより下はBBS関係
app.post("/check", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  res.json( {number: bbs.length });
});

app.post("/read", (req, res) => {
  // 本来はここでDBMSに問い合わせる
  const start = Number( req.body.start );
  console.log( "read -> " + start );
  if( start==0 ) res.json( {messages: bbs });
  else res.json( {messages: bbs.slice( start )});
});

let currentId = 0;

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  bbs.push({ id: currentId++, name: name, message: message });
  res.json({ number: bbs.length });
});

app.get("/bbs", (req,res) => {
    console.log("GET /BBS");
    res.json( {test: "GET /BBS" });
});

app.post("/bbs", (req,res) => {
    console.log("POST /BBS");
    res.json( {test: "POST /BBS"});
})

app.get("/bbs/:id", (req,res) => {
    console.log( "GET /BBS/" + req.params.id );
    res.json( {test: "GET /BBS/" + req.params.id });
});

app.put("/post/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, message } = req.body;

    const post = bbs.find(mes => mes.id === id);
    if (post) {
        post.name = name || post.name;
        post.message = message || post.message;

        res.json({ success: true, message: "投稿を編集しました", post });
    } else {
        res.status(404).json({ success: false, message: "投稿が見つかりません" });
    }
});

app.delete("/post/:id", (req, res) => {
    const id = Number(req.params.id); 
    const index = bbs.findIndex(mes => mes.id === id); 

    if (index !== -1) {
        bbs.splice(index, 1);
        res.json({ success: true, message: "投稿を削除しました" });
    } else {
        res.status(404).json({ success: false, message: "投稿が見つかりません" });
    }
});

app.post("/like/:id", (req, res) => {
    const id = Number(req.params.id);
    const post = bbs.find((p) => p.id === id);
    if (post) {
        post.likes = (post.likes || 0) + 1;
        res.json({ success: true, likes: post.likes });
    } else {
        res.status(404).json({ success: false, message: "投稿が見つかりません" });
    }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
                                  