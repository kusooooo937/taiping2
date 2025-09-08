const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 単語リスト
const words = ["saito","uehasi","jimura","uno","hayakawa","fujii","maegawa","usui","yamamoto","higuti","ruuku","igawa","fumuro","matui","ootani","kawaguti","akane","sugai"];

let currentWord = "";
let currentIndex = 0;
let score = 0;

// 制限時間
let timeLimit = 30;
let timeLeft = timeLimit;

// ゲーム状態
let gameState = "start"; // start, playing, gameover

// 効果音
const correctSound = new Audio("correct.mp3");
const clickSound = new Audio("click.mp3");
const gameoverSound = new Audio("gameover.mp3");

// 新しい単語
function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  currentIndex = 0;
}

// ランク判定（学校役職風）
function getRankMessage(score) {
  if (score >= 1500) return { rank: "校長先生", message: "学校の頂点に立ちました！" };
  if (score >= 1200) return { rank: "教頭先生", message: "みんなを支える存在です！" };
  if (score >= 900)  return { rank: "担任の先生", message: "クラスをまとめています！" };
  if (score >= 600)  return { rank: "生徒会役員", message: "学校の人気者です！" };
  if (score >= 300)  return { rank: "クラス委員", message: "責任感が育っています！" };
  return { rank: "新入生", message: "これからの成長に期待！" };
}

// キー入力
document.addEventListener("keydown", (e) => {
  clickSound.currentTime = 0;
  clickSound.play();

  const key = e.key;

  if (gameState === "start" && key === "Enter") {
    startGame();
  } else if (gameState === "playing") {
    if (key === currentWord[currentIndex]) {
      currentIndex++;
      if (currentIndex === currentWord.length) {
        score += 100;
        setNewWord();
        correctSound.currentTime = 0;
        correctSound.play();
      }
    }
  } else if (gameState === "gameover" && key === "Enter") {
    startGame();
  }
});

// ゲーム開始
function startGame() {
  score = 0;
  timeLeft = timeLimit;
  gameState = "playing";
  setNewWord();

  let timer = setInterval(() => {
    if (gameState === "playing") {
      timeLeft--;
      if (timeLeft <= 0) {
        gameState = "gameover";
        gameoverSound.play();
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
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.fillText("Typing Game", 90, 150);
    ctx.fillStyle = "yellow";
    ctx.font = "24px sans-serif";
    ctx.fillText("Press Enter to Start", 90, 220);
  } else if (gameState === "playing") {
    ctx.fillStyle = "white";
    ctx.font = "32px sans-serif";
    ctx.fillText(currentWord, 100, 200);

    ctx.fillStyle = "lime";
    ctx.fillText(currentWord.substring(0, currentIndex), 100, 200);

    ctx.fillStyle = "yellow";
    ctx.font = "20px sans-serif";
    ctx.fillText("給料: " + score + "万円", 10, 30);

    ctx.fillStyle = "red";
    ctx.fillText("Time: " + timeLeft, 310, 30);
  } else if (gameState === "gameover") {
    const result = getRankMessage(score);

    ctx.fillStyle = "red";
    ctx.font = "40px sans-serif";
    ctx.fillText("GAME OVER", 90, 120);

    ctx.fillStyle = "white";
    ctx.font = "28px sans-serif";
    ctx.fillText(result.message, 60, 170);

    ctx.fillStyle = "yellow";
    ctx.font = "28px sans-serif";
    ctx.fillText("給料: " + score + "万円", 110, 220);

    ctx.fillStyle = "cyan";
    ctx.font = "36px sans-serif";
    ctx.fillText("役職: " + result.rank, 110, 270);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press Enter to Retry", 90, 320);
  }

  requestAnimationFrame(gameLoop);
}

// ループ開始
gameLoop();

