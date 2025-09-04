

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 単語リスト
const words = [
  "saito","uehasi","jimura","uno","hayakawa","fujii","maegawa","usui",
  "yamamoto","higuti","ruuku","igawa","fumuro","matui","ootani","kawaguti",
  "akane","sugai"
];

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

// 効果音
const correctSound = new Audio("correct.mp3");
const clickSound   = new Audio("click.mp3");
const errorSound   = new Audio("error.mp3");

// BGM
const bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.volume = 0.2;

// 新しい単語をセット
function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  currentIndex = 0;
}

// ランク判定
function getRankMessage(score) {
  if (score >= 1500) return { rank: "S", message: "給食の人" };
  if (score >= 1200) return { rank: "A", message: "校長" };
  if (score >= 900)  return { rank: "B", message: "教頭" };
  if (score >= 600)  return { rank: "C", message: "教員" };
  if (score >= 300)  return { rank: "D", message: "事務職員" };
  return { rank: "E", message: "ニート" };
}

// 効果音安全再生
function playSound(sound) {
  const s = sound.cloneNode();
  s.play();
}

// ゲーム開始
function startGame() {
  score = 0;
  timeLeft = timeLimit;
  gameState = "playing";
  setNewWord();

  // BGM再生（ユーザー操作後のみ）
  if (bgm.paused) {
    bgm.currentTime = 0;
    bgm.play();
  }

  lastTime = performance.now();
  requestAnimationFrame(updateTime);
}

// タイマー更新
let lastTime = performance.now();
function updateTime(now) {
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  if (gameState === "playing") {
    timeLeft -= delta;
    if (timeLeft <= 0) {
      gameState = "gameover";
      timeLeft = 0;
    }
  }

  requestAnimationFrame(updateTime);
}

// キー入力イベント
document.addEventListener("keydown", (e) => {
  playSound(clickSound);
  const key = e.key;

  if (gameState === "start") {
    if (key === "Enter") startGame();

  } else if (gameState === "playing") {
    if (key === currentWord[currentIndex]) {
      currentIndex++;
      if (currentIndex === currentWord.length) {
        score += 100;
        setNewWord();
        playSound(correctSound);
      }
    } else {
      playSound(errorSound);
    }

  } else if (gameState === "gameover") {
    if (key === "Enter") startGame();
  }
});

// タッチでもゲーム開始
canvas.addEventListener("touchstart", () => {
  if (gameState === "start" || gameState === "gameover") {
    startGame();
  }
});

// ゲームループ
function gameLoop() {
  // 背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (gameState === "start") {
    ctx.fillStyle = "white";
    ctx.font = "36px sans-serif";
    ctx.fillText("Typing Game", 90, 150);

    ctx.fillStyle = "yellow";
    ctx.font = "24px sans-serif";
    ctx.fillText("Press Enter or Tap to Start", 40, 220);

  } else if (gameState === "playing") {
    // 単語表示
    ctx.fillStyle = "white";
    ctx.font = "32px sans-serif";
    ctx.fillText(currentWord, 100, 200);

    // 入力済み部分
    ctx.fillStyle = "lime";
    ctx.fillText(currentWord.substring(0, currentIndex), 100, 200);

    // スコア
    ctx.fillStyle = "yellow";
    ctx.font = "20px sans-serif";
    ctx.fillText("給料: " + score + "万円", 10, 30);

    // タイマー
    ctx.fillStyle = "red";
    ctx.fillText("Time: " + Math.ceil(timeLeft), 310, 30);

  } else if (gameState === "gameover") {
    const result = getRankMessage(score);

    ctx.fillStyle = "white";
    ctx.font = "40px sans-serif";
    ctx.fillText(result.message, 130, 160);

    ctx.fillStyle = "yellow";
    ctx.font = "28px sans-serif";
    ctx.fillText("給料: " + score + "万円", 130, 210);

    ctx.fillStyle = "cyan";
    ctx.font = "36px sans-serif";
    ctx.fillText("役職: " + result.rank, 130, 260);

    ctx.fillStyle = "white";
    ctx.font = "20px sans-serif";
    ctx.fillText("Press Enter or Tap to Retry", 60, 320);
  }

  requestAnimationFrame(gameLoop);
}

// ゲームループ開始
gameLoop();



















