const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 単語リスト
const words = ["apple", "banana", "cherry", "orange", "grape", "melon"];
let currentWord = "";
let currentIndex = 0;
let score = 0;

// 制限時間（秒）
let timeLimit = 30;
let timeLeft = timeLimit;

// ゲーム状態
let gameState = "start"; 
// "start" → タイトル画面
// "playing" → ゲーム中
// "gameover" → ゲームオーバー

// 新しい単語をセット
function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  currentIndex = 0;
}

// ランク判定
function getRank(score) {
  if (score >= 15) return "S";
  if (score >= 12) return "A";
  if (score >= 9) return "B";
  if (score >= 6) return "C";
  if (score >= 3) return "D";
  return "E";
}

// キー入力イベント
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (gameState === "start") {
    // スタート画面 → Enterキーで開始
    if (key === "Enter") {
      startGame();
    }
  } else if (gameState === "playing") {
    // ゲーム中の入力処理
    if (key === currentWord[currentIndex]) {
      currentIndex++;
      if (currentIndex === currentWord.length) {
        score+=100;
        setNewWord();
      }
    }
  } else if (gameState === "gameover") {
    // ゲームオーバー → Enterキーでリトライ
    if (key === "Enter") {
      startGame();
    }
  }
});

// ゲーム開始
function startGame() {
  score = 0;
  timeLeft = timeLimit;
  gameState = "playing";
  setNewWord();

  // タイマー開始
  let timer = setInterval(() => {
    if (gameState === "playing") {
      timeLeft--;
      if (timeLeft <= 0) {
        gameState = "gameover";
        clearInterval(timer);
      }
    } else {
      clearInterval(timer);
    }
  }, 1000);
}

// ゲームループ
function gameLoop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    // タイトル画面
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.fillText("Typing Game", 90, 150);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "yellow";
    ctx.fillText("Press Enter to Start", 90, 220);

  } else if (gameState === "playing") {
    // 単語
    ctx.fillStyle = "white";
    ctx.font = "32px sans-serif";
    ctx.fillText(currentWord, 100, 200);

    // 入力済み部分を緑で表示
    ctx.fillStyle = "lime";
    ctx.fillText(currentWord.substring(0, currentIndex), 100, 200);

    // スコア
    ctx.fillStyle = "yellow";
    ctx.font = "20px sans-serif";
    ctx.fillText("給料: " + score + "万円", 10, 30);

    // タイマー
    ctx.fillStyle = "red";
    ctx.fillText("Time: " + timeLeft, 310, 30);

  } else if (gameState === "gameover") {
    // ゲームオーバー画面
    ctx.fillStyle = "red";
    ctx.font = "40px sans-serif";
    ctx.fillText("退職", 90, 160);

    ctx.fillStyle = "yellow";
    ctx.font = "28px sans-serif";
    ctx.fillText("給料: " + score + "万円", 130, 210);

    const rank = getRank(score);
    ctx.fillStyle = "cyan";
    ctx.font = "36px sans-serif";
    ctx.fillText("役職: " + rank, 130, 260);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press Enter to Retry", 110, 320);
  }

  requestAnimationFrame(gameLoop);
}

// ループ開始
gameLoop();














