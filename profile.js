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

// var periods_today = [];
fetch("./timetables/" + name + ".json")
  .then((response) => response.json())
  // .then((json) => {
  //   periods_today = json;
  //   return json;
  // })
  .then((json) => writeData(json));

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
