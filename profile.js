const name = new URLSearchParams(window.location.search).get("name");

const nick_names = {
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

function syncColors() {
  if (localStorage.getItem("currentTheme") === null) {
    localStorage.setItem("mode", "light");
    localStorage.setItem("currentTheme", idx);
  }

  let idx = localStorage.getItem("currentTheme");
  let mode = localStorage.getItem("mode");
  let color_set = colors[mode][idx];
  for (const name of ["primary", "tertiary", "secondary"]) {
    document.documentElement.style.setProperty("--" + name, color_set[name]);
  }

  if (mode == "dark") {
    document.getElementsByClassName("titleBar")[0].style.color =
      "rgba(255, 255, 255, 0.765)";
    for (e of document.getElementsByClassName("dayData")) {
      e.style.color = "rgba(255, 255, 255, 0.765)";
    }
  } else {
    document.getElementsByClassName("titleBar")[0].style.color = "black";
    for (e of document.getElementsByClassName("dayData")) {
      e.style.color = "black";
    }
  }
}

function writeData(periods) {
  let img_src = "./images/avatars/" + name + ".webp";
  document.getElementsByTagName("img")[0].setAttribute("src", img_src);

  document.getElementsByClassName("nameTitle")[0].innerHTML = nick_names[name];

  var dayTables = profilePage.getElementsByClassName("dayBox");
  for (let i = 0; i < 5; i++) {
    let dayTable = dayTables[i];
    dayTable.innerHTML = dayTable.firstElementChild.outerHTML;
    for (let period of periods[i]) {
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

fetch("./timetables/" + name + ".json")
  .then((response) => response.json())
  .then((json) => writeData(json))
  .then(syncColors());
