// Register the service worker
if ("serviceWorker" in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener("load", async () => {
    // Try to register the service worker.
    try {
      // Capture the registration for later use, if needed
      let reg = await navigator.serviceWorker.register("./sw.js");
      console.log("Service worker registered! 😎", reg);
    } catch (err) {
      console.log("😥 Service worker registration failed: ", err);
    }
  });
}

var all = document.getElementById("all");
var infoBoxes = document.getElementsByClassName("infoBox");
let cardSections1 = [...document.getElementsByClassName("cardLeft")];
let cardSections2 = [...document.getElementsByClassName("cardRight2")];
var cardSections = [];
for (let i = 0; i < cardSections1.length; i++) {
  cardSections.push(cardSections1[i]);
  if (i < cardSections2.length) {
    cardSections.push(cardSections2[i]);
  }
}
var a_tags = document.getElementsByTagName("a");
var popup = document.getElementById("PUR");
var closeButton = document.getElementById("closePop");
var cards = document.getElementsByClassName("card");

const now = new Date(Date.now());
const day = (now.getDay() - 1 + 7) % 7;

var ordered_names = [
  "justus",
  "emily",
  "neha",
  "naveen",
  "arsha",
  "georgy",
  "rohan",
];

var nick_names = {
  neha: "ജേഹാ",
  georgy: "വാഴ",
  justus: "ജ്യൂസ്",
  arsha: "അക്കൂസ്",
  teena: "കിംച്ചി",
  rohan: "ഇഡ്‌ലി",
  naveen: "ബബ്ബൂസ്",
  yami: "ബിരിയാണി",
  emily: "നെല്ലിക്ക",
};

var periods_today = {
  neha: [],
  georgy: [],
  justus: [],
  arsha: [],
  teena: [],
  rohan: [],
  naveen: [],
  yami: [],
  emily: [],
};

var balls = {
  neha: [],
  georgy: [],
  justus: [],
  arsha: [],
  teena: [],
  rohan: [],
  naveen: [],
  yami: [],
  emily: [],
};

colors = {
  light: [
    { primary: "#25a18e", secondary: "#88ebb4", tertiary: "#88ebb4" },
    { primary: "#ff9f1c", secondary: "#ffe8d6", tertiary: "#ffbe69db" },
    { primary: "#4d4d96", secondary: "#ececec", tertiary: "#9b9ebf" },
    { primary: "#e73a49", secondary: "#e58aa7", tertiary: "#f0a2c499" },
    { primary: "#a1bb10", secondary: "#d6f060", tertiary: "#cded6ea3" },
  ],
  dark: [
    { primary: "#313131", secondary: "#000000", tertiary: "#434343b8" },
    { primary: "#801336", secondary: "#230e23", tertiary: "#5d101b" },
    { primary: "#9a3800", secondary: "#490915", tertiary: "#191919" },
    { primary: "#460033", secondary: "#160434", tertiary: "#2d0b3cac" },
    { primary: "#092635", secondary: "#245745", tertiary: "#1b4242" },
  ],
};

function switchLightDark(toggleButton) {
  let iconClassList = toggleButton.children[0].classList;
  let capsule = document.getElementById("themeCapsule");

  // TODO: switch freename font color?
  if (iconClassList.contains("fa-moon")) {
    localStorage.setItem("mode", "dark");
    iconClassList = "fa-solid fa-sun";
    capsule.style.background = "white";
    capsule.children[0].style.color = "black";
  } else {
    localStorage.setItem("mode", "light");
    iconClassList = "fa-solid fa-moon";
    capsule.style.background = "black";
    capsule.children[0].style.color = "white";
  }
  setColor();
}

function setColor(ballIdx) {
  var idx = 0;

  // set initial values
  if (localStorage.getItem("currentTheme") === null) {
    localStorage.setItem("mode", "light");
    localStorage.setItem("currentTheme", idx);
  }

  var color_list = colors[localStorage.getItem("mode")];

  var colorBalls = document.getElementById("colorCapsule").children;
  if (arguments.length == 0) {
    idx = localStorage.getItem("currentTheme");
    for (const [i, ball] of Object.entries(colorBalls)) {
      ball.children[0].style.background = color_list[i].primary;
      ball.children[1].style.background = color_list[i].secondary;
    }
  } else {
    localStorage.setItem("currentTheme", ballIdx);
    idx = ballIdx;
  }

  let color_set = color_list[idx];
  for (const name of ["primary", "tertiary", "secondary"]) {
    document.documentElement.style.setProperty("--" + name, color_set[name]);
  }

  let themeCapsule = colorBalls[0].parentElement.parentElement.children[0];
  for (const [i, ball] of Object.entries(colorBalls)) {
    if (idx != i) {
      ball.children[0].classList.remove("cTopBorder");
      ball.children[1].classList.remove("cDownBorder");
    } else {
      ball.children[0].classList.add("cTopBorder");
      ball.children[1].classList.add("cDownBorder");
      if (localStorage.getItem("mode") == "dark") {
        ball.children[0].style.borderColor = "white";
        ball.children[1].style.borderColor = "white";
        themeCapsule.firstElementChild.classList = "fa-solid fa-sun";
      } else {
        ball.children[0].style.borderColor = "black";
        ball.children[1].style.borderColor = "black";
        themeCapsule.firstElementChild.classList = "fa-solid fa-moon";
      }
    }
  }
}

function closePopup() {
  all.classList.remove("blurr");
  window.onscroll = function () {};
  Array.from(cardSections).forEach((el) => {
    el.style.pointerEvents = "auto";
  });
  Array.from(a_tags).forEach((el) => {
    el.style.pointerEvents = "auto";
  });

  popup.style.display = "none";
  closeButton.style.display = "none";
}

function openPopup(e, name) {
  all.classList.add("blurr");
  scrollTop = window.scrollY || document.documentElement.scrollTop;
  (scrollLeft = window.scrollX || document.documentElement.scrollLeft),
    (window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    });

  Array.from(cardSections).forEach((el) => {
    el.style.pointerEvents = "none";
  });
  Array.from(a_tags).forEach((el) => {
    el.style.pointerEvents = "none";
  });
  e.stopImmediatePropagation();

  let img_src = "./images/avatars/" + name + ".webp";
  popup.getElementsByTagName("img")[0].setAttribute("src", img_src);
  popup.style.display = "block";
  closeButton.style.display = "block";

  let list = popup.getElementsByClassName("popDayBox")[0];
  let ball_row = popup.getElementsByClassName("statusBallVertical")[0];
  list.innerHTML = ``;
  ball_row.innerHTML = ``;
  for (const [i, period] of periods_today[name][day].entries()) {
    list.innerHTML +=
      `<div class='popCell'>` +
      period["venue"] +
      ` - ` +
      period["title"] +
      ` - ` +
      createTimeString(period["timings"]).substring(0, 5) +
      `</div>`;
    ball_row.innerHTML +=
      `<div class="statusBall2 ` + balls[name][i] + `"></div>`;
  }
}

function createTimeString(timings) {
  let timeString = "";
  if (timings.length > 0) {
    timeString += timings[0].toString().padStart(2, "0") + ":";
    timeString += timings[1].toString().padStart(2, "0") + "-";
    timeString += timings[2].toString().padStart(2, "0") + ":";
    timeString += timings[3].toString().padStart(2, "0");
  }
  return timeString;
}

function setData(index, name) {
  fetch("./timetables/" + name + ".json")
    .then((response) => response.json())
    .then((json) => {
      periods_today[name] = json;
      return json;
    })
    .then((json) => writeData(index, name, json[day]));
}

function writeData(index, name, periodsToday) {
  let card = cards[index];
  let infoBox = infoBoxes[index];
  let box = cardSections[index];

  let img_src = "./images/avatars/" + name + ".webp";
  let img = card.getElementsByTagName("img")[0];
  img.setAttribute("src", img_src);
  card
    .getElementsByTagName("a")[0]
    .setAttribute("href", "./profile.html?name=" + name);

  box.onclick = function (e) {
    openPopup(e, name);
  };

  var period = {
    title: "",
    venue: "",
    timings: [],
  };

  var status = "free";
  var show_period = {};
  var i = 0;
  for (i = 0; i < periodsToday.length; i++) {
    period = periodsToday[i];
    let lab = period["title"].substr(-1) == "L";
    let timings = period["timings"];

    let start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      timings[0],
      timings[1],
      0
    );
    let end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      timings[2],
      timings[3],
      0
    );

    if (end >= now) {
      if (status == "free") {
        show_period = period;
      }

      if (start <= now) {
        status = "busy";
        balls[name].push(" ongoing" + (lab ? " lab" : ""));
      } else {
        status = "waiting";
        balls[name].push(" pending" + (lab ? " lab" : ""));
      }
    } else {
      balls[name].push(" completed" + (lab ? " lab" : ""));
    }
  }

  if (status == "free") {
    infoBox.innerHTML = `<div class="freeName">` + nick_names[name] + `</div>`;
    infoBox.style.background = "none";
    infoBox.style.boxShadow = "none";
  } else {
    infoBox.getElementsByClassName("location")[0].innerHTML =
      `<i class="fa-solid fa-location-dot"></i>&nbsp` + show_period["venue"];
    infoBox.getElementsByClassName("subject")[0].innerHTML =
      show_period["title"];
    infoBox.getElementsByClassName("time")[0].innerHTML = createTimeString(
      show_period["timings"]
    );
  }
  let ball_row = card.getElementsByClassName("cardTop")[0];
  ball_row.innerHTML = ``;
  for (let ball of balls[name]) {
    ball_row.innerHTML += `<div class="statusBall ` + ball + `"></div>`;
  }
}

for (const [index, name] of ordered_names.entries()) {
  setData(index, name);
}
