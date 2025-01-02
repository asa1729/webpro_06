"use strict";
const express = require('express');
const app = express();
const path = require('path');

// クイズデータ（仮のデータ）
const quizzes = [
    {
        id: 1,
        question: "JavaScriptの創始者は？",
        options: ["Brendan Eich", "Linus Torvalds", "Guido van Rossum"],
        correctAnswer: 0
    },
    {
        id: 2,
        question: "HTMLの最初のバージョンは？",
        options: ["HTML4", "HTML5", "XHTML"],
        correctAnswer: 0
    },
    {
        id: 3,
        question: "ハードウェアにおける'RAM'とはなんの略？",
        options: ["Read And Memory", "Random Access Memory", "Rapid Access Module"],
        correctAnswer: 1
    },
    {
        id: 4,
        question: "OSI参照モデルのネットワーク層ではなんという単位でデータをやり取りする？",
        options: ["セグメント", "データグラム", "パケット"],
        correctAnswer: 2
    },
    {
        id: 5,
        question: "ブルーバック合成のように単色背景を透明化させる合成方法をなんというか",
        options: ["アンシャープマスク", "レンダリング", "キーイング"],
        correctAnswer: 2
    }
];

// 静的ファイルを提供する (クライアント用のHTML/JS/CSSファイルなど)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log("Serving index.html");
    res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

// クイズ一覧を取得するエンドポイント
app.get('/quizzes', (req, res) => {
    res.json(quizzes);
});

// 回答を受け取るエンドポイント
app.post('/answer', express.json(), (req, res) => {
    const { id, answer } = req.body;
    const quiz = quizzes.find(q => q.id === id);

    if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
    }

    // 正解か不正解かを返す
    const correct = quiz.correctAnswer === answer;
    res.json({ correct });
});

// ルートエンドポイントを設定
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'quiz.html')); // quiz.html を送信
});

// サーバーのポートを設定して起動
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});