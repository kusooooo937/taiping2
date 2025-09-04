const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 単語リスト
const words = ["saito","uehasi","jimura","uno","hayakawa","fujii","maegawa","usui","yamamoto","higuti","ruuku","igawa","fumuro","matui","ootani","kawaguti","akane","sugai"];
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

// 音楽
const correctSound = new Audio("correct.mp3");
const clickSound = new Audio("click.mp3");
const errorSound = new Audio("error.mp3");

// 新しい単語をセット
function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  currentIndex = 0;
}

// ランク判定
function getRankMessage(score) {
  if (score >= 1500) return { rank: "給食の人", message: "食でみんなを支配！" };
  if (score >= 1200) return { rank: "校長", message: "学校の頂点！" };
  if (score >= 900)  return { rank: "教頭", message: "校長を支える縁の下の力持ち！" };
  if (score >= 600)  return { rank: "教員", message: "授業に全力投球！" };
  if (score >= 300)  return { rank: "事務職員", message: "裏方で学校を支える！" };
  return { rank: "ニート", message: "出直してきなさい！" };
}

// キー入力イベント
document.addEventListener("keydown", (e) => {
  clickSound.currentTime = 0;
  clickSound.play();
  const key = e.key;

  if (gameState === "start") {
    if (key === "Enter") startGame();
  } else if (gameState === "playing") {
    if (key === currentWord[currentIndex]) {
      currentIndex++;
      if (currentIndex === currentWord.length) {
        score += 100;
        setNewWord();
        correctSound.currentTime = 0;
        correctSound.play();
      }
    } else {
      errorSound.currentTime = 0;
      errorSound.play();
    }
  } else if (gameState === "gameover") {
    if (key === "Enter") startGame();
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
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.fillText("Typing Game", 90, 150);

    ctx.font = "24px sans-serif";
    ctx.fillStyle = "yellow";
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
    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.fillText(result.rank, 130, 160);

    ctx.fillStyle = "yellow";
    ctx.font = "28px sans-serif";
    ctx.fillText("給料: " + score + "万円", 130, 210);

    ctx.fillStyle = "cyan";
    ctx.font = "24px sans-serif";
    ctx.fillText(result.message, 80, 260);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press Enter to Retry", 110, 320);
  }

  requestAnimationFrame(gameLoop);
}

// ループ開始
gameLoop();

















