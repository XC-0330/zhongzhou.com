// 全局变量存储数据
let poems = [];
let weather = [];
let news = [];
let characters = {};
let leaderboard = {};

// 日期格式化
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// 根据日期生成伪随机数，用来固定每日内容
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 根据日期获取每日索引
function getDailyIndex(arr) {
  const dateStr = formatDate(new Date());
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i);
  }
  return Math.floor(seededRandom(seed) * arr.length);
}

// 显示每日古诗词
function showDailyPoem() {
  if (!poems.length) return;
  const idx = getDailyIndex(poems);
  const poem = poems[idx];
  const el = document.getElementById("daily-poem");
  el.innerHTML = `<strong>每日古诗词：</strong>《${poem.title}》 - ${poem.author}<br/>${poem.content.join("<br/>")}`;
}

// 显示每日天气
function showDailyWeather() {
  if (!weather.length) return;
  const idx = getDailyIndex(weather);
  const w = weather[idx];
  const el = document.getElementById("daily-weather");
  el.innerHTML = `<strong>今日天气：</strong>${w.day}，${w.condition}，气温：${w.temp}`;
}

// 显示每日新闻
function showDailyNews() {
  if (!news.length) return;
  const idx = getDailyIndex(news);
  const n = news[idx];
  const el = document.getElementById("daily-news");
  el.innerHTML = `<strong>今日新闻：</strong>${n.title}<br/>${n.content}`;
}

// 搜索人物
function searchCharacter() {
  const input = document.getElementById("search-input").value.trim();
  const el = document.getElementById("character-info");
  if (!input) {
    el.innerHTML = "<em>请输入人物名字</em>";
    return;
  }
  const info = characters[input];
  if (!info) {
    el.innerHTML = `<em>未找到人物：${input}</em>`;
    return;
  }
  el.innerHTML = `<h3>${info.name}</h3>
                  <p><strong>身份：</strong>${info.status}</p>
                  <p><strong>简介：</strong>${info.description}</p>`;
}

// 渲染榜单
function renderLeaderboards() {
  const qingyunEl = document.getElementById("qingyun-list");
  const chongxiaoEl = document.getElementById("chongxiao-list");

  qingyunEl.innerHTML = "";
  chongxiaoEl.innerHTML = "";

  leaderboard.qingyun.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${idx + 1}. ${item}`;
    qingyunEl.appendChild(li);
  });

  leaderboard.chongxiao.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${idx + 1}. ${item}`;
    chongxiaoEl.appendChild(li);
  });
}

// 初始化，加载所有数据文件
async function init() {
  try {
    const [poemRes, weatherRes, newsRes, charRes, boardRes] = await Promise.all([
      fetch("data/poems.json"),
      fetch("data/weather.json"),
      fetch("data/news.json"),
      fetch("data/characters.json"),
      fetch("data/leaderboard.json"),
    ]);

    poems = await poemRes.json();
    weather = await weatherRes.json();
    news = await newsRes.json();
    characters = await charRes.json();
    leaderboard = await boardRes.json();

    showDailyPoem();
    showDailyWeather();
    showDailyNews();
    renderLeaderboards();

  } catch (e) {
    console.error("数据加载失败:", e);
  }
}

// 页面加载完成后执行初始化
window.onload = init;
