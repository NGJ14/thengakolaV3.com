var all = document.getElementById("all");
var profilePage = document.getElementById("profilePage");
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
var avatars = document.getElementsByClassName("avatar");
var popup = document.getElementById("PUR");
var closeButton = document.getElementById("closePop");
var cards = document.getElementsByClassName("card");

const now = new Date(Date.parse("2024-04-09T15:30:00.000+05:30"));
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

function closePopup() {
  all.classList.remove("blurr");
  window.onscroll = function () {};
  Array.from(cardSections).forEach((el) => {
    el.style.pointerEvents = "auto";
  });
  Array.from(avatars).forEach((el) => {
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
  Array.from(avatars).forEach((el) => {
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

function goHome() {
  profilePage.style.display = "none";
  all.style.display = "block";
}

function openProfilePage(name) {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  let img_src = "./images/avatars/" + name + ".webp";
  all.style.display = "none";
  profilePage.style.display = "block";
  profilePage.getElementsByTagName("img")[0].setAttribute("src", img_src);
  profilePage.getElementsByClassName("nameTitle")[0].innerHTML =
    nick_names[name];
  var dayTables = profilePage.getElementsByClassName("dayBox");
  for (let i = 0; i < 5; i++) {
    let dayTable = dayTables[i];
    dayTable.innerHTML = dayTable.firstElementChild.outerHTML;
    for (let period of periods_today[name][i]) {
      dayTable.innerHTML +=
        `<div class="dayCell"><div class="dayData">` +
        period["venue"] +
        `</div><div class="dayData">` +
        period["title"] +
        `</div><div class="dayData">` +
        createTimeString(period["timings"]) +
        `</div></div>`;
    }
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
  img.onclick = function () {
    openProfilePage(name);
  };

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
