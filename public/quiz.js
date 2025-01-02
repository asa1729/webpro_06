"use strict";

let currentQuizIndex = 0;
let score = 0;
let quizzes = [];

// クイズをサーバーから取得
fetch("/quizzes")
    .then(response => response.json())
    .then(data => {
        quizzes = data;
        showQuiz();
    })
    .catch(error => console.error("Error loading quizzes:", error));

// クイズを表示
function showQuiz() {
    const quizContainer = document.querySelector("#quiz-container");
    const resultContainer = document.querySelector("#result");
    const nextButton = document.querySelector("#next-button");
    const retryButton = document.querySelector("#retry-button");

    resultContainer.textContent = "";
    nextButton.style.display = "none";
    retryButton.style.display = "none"; // リトライボタンを隠す

    if (currentQuizIndex >= quizzes.length) {
        quizContainer.innerHTML = `<h2>クイズ終了！スコア: ${score} / ${quizzes.length}</h2>`;
        retryButton.style.display = "block"; // クイズ終了後に「もう一度挑戦」ボタンを表示
        return;
    }

    const quiz = quizzes[currentQuizIndex];
    quizContainer.innerHTML = `
        <h2>${quiz.question}</h2>
        <ul>
            ${quiz.options.map((option, index) =>
                `<li><button class="option-button" data-index="${index}">${option}</button></li>`
            ).join('')}
        </ul>
    `;

    // 選択肢のボタンにイベントリスナーを追加
    document.querySelectorAll(".option-button").forEach(button => {
        button.addEventListener("click", () => {
            const answerIndex = Number(button.getAttribute("data-index"));
            checkAnswer(quiz.id, answerIndex);
        });
    });
}

// 回答をサーバーに送信して結果を表示
function checkAnswer(id, answer) {
    fetch("/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, answer }),
    })
        .then(response => response.json())
        .then(data => {
            const resultContainer = document.querySelector("#result");
            if (data.correct) {
                resultContainer.textContent = "正解！";
                score++;
            } else {
                resultContainer.textContent = "不正解...";
            }
            document.querySelector("#next-button").style.display = "block";
        })
        .catch(error => console.error("Error submitting answer:", error));
}

// 次の問題に進む
document.querySelector("#next-button").addEventListener("click", () => {
    currentQuizIndex++;
    showQuiz();
});

// もう一度挑戦ボタンを押した場合
document.querySelector("#retry-button").addEventListener("click", () => {
    currentQuizIndex = 0; // 最初の問題に戻す
    score = 0; // スコアをリセット
    showQuiz(); // クイズを再表示
});