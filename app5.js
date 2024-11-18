const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 2 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  if(hand == cpu){
    judgement = 'あいこ';
    total += 1;
  }
  else if((hand == 'グー' && num == 2) || (hand == 'チョキ' && num == 3) || (hand == 'パー' && num == 1)){
    judgement = '勝ち';
    win += 1;
    total += 1;
  }
  else{
    judgement = '負け';
    total += 1;
  }
  // 今はダミーで人間の勝ちにしておく
  //let judgement = '勝ち';
  //win += 1;
  //total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

function encount(corr, left){
  choose = Math.floor( Math.random() * 5 + 1 );
  if(choose == 1){
    mon = 'ピカチュウ'; corr[0] = 255; corr[1] = 20; return choose;
  }
  else if(choose == 2){
    mon = 'モココ'; corr[0] = 190; corr[1] = 26; return choose;
  }
  else if(choose == 3 && (50 - left[0] + 30 - left[1] + 20 - left[2]) >= 20){
    mon = 'ニョロトノ'; corr[0] = 120; corr[1] = 41; return choose;
  }
  else if(choose == 4 && (50 - left[0] + 30 - left[1] + 20 - left[2]) >= 20){
    mon = 'ダンバル'; corr[0] = 45; corr[1] = 52; return choose;
  }
  else if(choose == 5 && (50 - left[0] + 30 - left[1] + 20 - left[2]) >= 50){
    mon = 'ファイヤー'; corr[0] = 3; corr[1] = 165; return choose;
  }
  else{
    return encount(corr, left);
  }
}

let mon = 'ピカチュウ';
let poke = 1;
let corr = Array(2).fill(0);
corr = [255, 20];
let cri_point = 0;
let inc = 0;
let all_inc = 0;
let cri_judge = Array(4).fill(5);
let left = Array(3).fill(0);
left = [50, 30, 20];
let actionType = 1;

app.get("/pokemon", (req, res) => {
  const ball = req.query.ball;
  let count = [
    Number(req.query.count_pika) || 0,
    Number(req.query.count_moko) || 0,
    Number(req.query.count_nyor) || 0,
    Number(req.query.count_danb) || 0,
    Number(req.query.count_fire) || 0
  ];
  
  let k = 4; t = 1;
  let a = 0; b = 0; c = 0; d = 0;
  let critical = '';
  const cri = Math.floor( Math.random() * 255 + 1 );
  let num = new Array(4);
  for(let v = 0; v < 4; v++)
    num[v] = Math.floor( Math.random() * 65535 + 1 );
  
  switch(Number(ball)){
    case 1: t = 1; --left[0]; actionType = 3; break;
    case 2: t = 1.5; --left[1]; actionType = 3; break;
    case 3: t = 2; --left[2]; actionType = 3; break;
    case 4: actionType = 4; inc = 1; break;
    case 5: actionType = 2; break;
    case 6: {
      actionType = 1; 
      count = [0, 0, 0, 0, 0]; 
      left = [50, 30, 20]; 
      cri_point = 0; 
      all_inc = 0; 
      cri_judge = [0, 0, 0, 0]; 
      break;
    }
  }

  if(count[0] > all_inc && count[1] > all_inc && count[2] > all_inc && count[3] > all_inc){
    cri_point += 1.5;
    all_inc = 100;
  }
  if(count[0] >= cri_judge[0]){
    cri_point += 1.5;
    cri_judge[0] += 5;
  }
  else if(count[1] >= cri_judge[1]){
    cri_point += 1.5;
    cri_judge[1] += 5;
  }
  else if(count[2] >= cri_judge[2]){
    cri_point += 2.5;
    cri_judge[2] += 5;
  }
  else if(count[3] >= cri_judge[3]){
    cri_point += 3;
    cri_judge[3] += 5;
  }

  a = (corr[1] * 4096 * corr[0] * t) / (corr[1] * 3);
  b = 65535 / Math.sqrt(Math.sqrt(1044480 / a));
  c = (b * cri_point) / (4096);

  if(inc){
    poke = encount(corr, left);
  }

  if(cri < c){
    critical = '捕獲クリティカル！';
    k = 1;
  }
  if(actionType != 4 && actionType != 2){
    for(let u = 0; u < k; u++){
      if(num[u] < b) d += 1;
      else break;
    }
  }
  if(d == k){
    if(poke == 5){
      actionType = 5;
    }
    judgement = `やった!${mon}を捕まえた！`
    count[poke - 1]++;
    inc = 1;
  }
  else{
    judgement = `だめだ!${mon}がボールから出てしまった！`
    inc = 0;
  }
  
  const display = {
    judgement: judgement,
    mon: mon,
    critical: critical,
    count_pika: count[0],
    count_moko: count[1],
    count_nyor: count[2],
    count_danb: count[3],
    count_fire: count[4],
    left_mon: left[0],
    left_sup: left[1],
    left_hyp: left[2],
    cri_point: cri_point,
    all_inc: all_inc,
    cri_judge,
    a: a,
    b: b,
    c: c,
    cri: cri,
    num: num,
    actionType: actionType
  }
  res.render( 'pokemon', display );
});

let win = 0; // 勝ち数の初期化
let lose = 0; // 負け数の初期化

app.get("/fig", (req, res) => {
  const player = Number(req.query.player || 0); // プレイヤーが叫ぶ数字
  const player_f = Number(req.query.player_f || 0); // プレイヤーが上げる指
  const turn = Number(req.query.turn || 0); // 現在のターン（デフォルトは0）
  const cpu_number = Math.floor(Math.random() * 5); // 相手の叫ぶ数字（0～4）
  const cpu_finger = Math.floor(Math.random() * 3); // 相手の指の本数（0～2）

  let result = ""; 

  // 最初のゲームを開始する場合（初期化）
  if (turn == 0) {
    return res.render("fig", {
      win: win,
      lose: lose,
      turn: 1,
      result: null,
      cpu_number: null,
      cpu_finger: null,
    });
  }

  if (turn % 2 == 1) {
    if (player == player_f + cpu_finger) {
      result = "あなたの勝ち！";
      win++;
    } else {
      result = "失敗！";
    }
  } else {
    if (cpu_number == player_f + cpu_finger) {
      result = "あなたの負け！";
      lose++;
    } else {
      result = "失敗！";
    }
  }

  const display = {
    win: win,
    lose: lose,
    turn: turn + 1, // 次のターン
    result: result,
    cpu_number: turn % 2 === 0 ? cpu_number : null, 
    cpu_finger: turn % 2 === 0 ? cpu_finger : null, 
  };

  res.render("fig", display);
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
