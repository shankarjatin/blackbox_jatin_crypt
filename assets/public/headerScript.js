function headingHandler() {
  let heading = document.getElementsByClassName("heading");
  let heading2 = document.getElementsByClassName("heading-side");
  console.log(heading);
  //   if (window.location.pathname == "/game") {
  // heading[0].innerHTML = "Crypthunt";
  // heading[0].classList.add("font_primary");
  // heading2[0].classList.add("font_secondary");
  // heading2[0].innerHTML = "Blackbox";
  // heading2[0].href = "/blackbox";
  //   } else if (window.location.pathname == "/blackbox") {
  // heading[0].innerHTML = "Blackbox";
  // heading2[0].classList.add("font_primary");
  // heading2[0].innerHTML = "Crypthunt";
  // heading[0].classList.add("font_secondary");
  // heading[0].href = "/blackbox";
  //   }
}
headingHandler();

function removeTableRows() {
  //remove previously existing table rows
  var elements = document.getElementsByClassName("cryptrow");
  for (var i = elements.length - 1; i >= 0; i--) {
    var element = elements[i];
    if (element.tagName == "TR") {
      element.parentNode.removeChild(element);
    }
  }
}

function addTableRowCrypthunt(Array) {
  var table = document.getElementById("crypt-table");
  removeTableRows();

  //add new rows
  for (let i = 0; i < Array.length; i++) {
    // Create a new table row element
    var row = document.createElement("tr");
    row.classList.add("cryptrow");
    // Create new table cells
    var rank = document.createElement("td");
    var team = document.createElement("td");
    var level = document.createElement("td");
    rank.classList.add("cryplColumn");
    team.classList.add("cryplColumn");
    level.classList.add("cryplColumn");

    // Set the content of each cell
    rank.textContent = Array[i].rank;
    team.textContent = Array[i].team_name;
    level.textContent = Array[i].level;

    // Append the new cells to the new row
    row.appendChild(rank);
    row.appendChild(team);
    row.appendChild(level);

    // Append the new row to the table
    table.appendChild(row);

    if (
      window.location.pathname == "/game" ||
      window.location.pathname == "/blackbox"
    ) {
      chbg(1); //close the hints tab if open
    }
  }
}

function addTableRowBlackbox(Array) {
  var table = document.getElementById("crypt-table");
  removeTableRows();

  //add new rows
  for (let i = 0; i < Array.length; i++) {
    // Create a new table row element
    var row = document.createElement("tr");
    row.classList.add("cryptrow");
    // Create new table cells
    var rank = document.createElement("td");
    var team = document.createElement("td");
    var level = document.createElement("td");
    rank.classList.add("cryplColumn");
    team.classList.add("cryplColumn");
    level.classList.add("cryplColumn");

    // Set the content of each cell
    rank.textContent = Array[i].rank;
    team.textContent = Array[i].team_name;
    level.textContent = Array[i].blackbox_level;

    // Append the new cells to the new row
    row.appendChild(rank);
    row.appendChild(team);
    row.appendChild(level);

    // Append the new row to the table
    table.appendChild(row);

    if (
      window.location.pathname == "/game" ||
      window.location.pathname == "/blackbox"
    ) {
      chbg(1); //close the hints tab if open
    }
  }
}

function addTableRowOriginal(Array) {
  document.getElementById("score").innerHTML = "Score";
  var table = document.getElementById("crypt-table");
  removeTableRows();

  //add new rows
  for (let i = 0; i < Array.length; i++) {
    // Create a new table row element
    var row = document.createElement("tr");
    row.classList.add("cryptrow");
    // Create new table cells
    var rank = document.createElement("td");
    var team = document.createElement("td");
    var score = document.createElement("td");
    rank.classList.add("cryplColumn");
    team.classList.add("cryplColumn");
    score.classList.add("cryplColumn");

    // Set the content of each cell
    rank.textContent = Array[i].rank;
    team.textContent = Array[i].team_name;
    score.textContent = Array[i].score;

    // Append the new cells to the new row
    row.appendChild(rank);
    row.appendChild(team);
    row.appendChild(score);

    // Append the new row to the table
    table.appendChild(row);

    if (
      window.location.pathname == "/game" ||
      window.location.pathname == "/blackbox"
    ) {
      chbg(1); //close the hints tab if open
    }
  }
}

let ct = 0;
function leaderClick(chk_close) {
  // below condition to force close in any case
  // console.log(document.getElementById("wrapper"));
  // console.log(document.getElementById("background-blur-outer"))
  if (chk_close == 1) {
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("background-blur-outer").style.display = "none";
    ct = 0;
  } else {
    let wrapper = document.getElementById("wrapper");
    if (
      window.location.pathname == "/game" ||
      window.location.pathname == "/blackbox"
    ) {
      chbg(1); //close the hints tab if open
    }
    if (ct == 1) {
      wrapper.style.display = "none";
      document.getElementById("background-blur-outer").style.display = "none";

      ct = 0;
    } else {
      document.getElementById("background-blur-outer").style.display =
        ct == 0 ? "block" : "none";

      wrapper.style.display = ct == 0 ? "block" : "none";
      ct = ct == 0 ? 1 : 0;
    }
    overallClick();
  }
}

function overallClick() {
  let heading = document.getElementById("leaderboard_heading");
  heading.innerHTML = "Overall";
  let crypmenu = (document.getElementById("crptH").style.color = "#ffff");
  let blackmenu = (document.getElementById("BbH").style.color = "#ffff");
  let overallmenu = (document.getElementById("overallH").style.color =
    "#EE3FA2");

  axios.get("/original_leaderboard").then((res) => {
    result = res.data.result;
    addTableRowOriginal(result);
  });
}

function crypthuntClick() {
  let level = document.getElementById("score");
  level.innerHTML = "LEVEL";

  let crypmenu = (document.getElementById("crptH").style.color = "#EE3FA2");
  let blackmenu = (document.getElementById("BbH").style.color = "#ffff");
  let overallmenu = (document.getElementById("overallH").style.color = "#ffff");

  let heading = document.getElementById("leaderboard_heading");
  heading.innerHTML = "Crypthunt";
  let wrapper = document.getElementById("wrapper");
  axios.get("/crypthunt_leaderboard").then((res) => {
    result = res.data.result;
    addTableRowCrypthunt(result);
  });
}

function blackboxClick() {
  let crypmenu = (document.getElementById("crptH").style.color = "#ffff");
  let blackmenu = (document.getElementById("BbH").style.color = "#EE3FA2");
  let overallmenu = (document.getElementById("overallH").style.color = "#ffff");

  let level = document.getElementById("score");
  level.innerHTML = "LEVEL";
  let heading = document.getElementById("leaderboard_heading");
  heading.innerHTML = "Blackbox";
  let wrapper = document.getElementById("wrapper");

  axios.get("/blackbox_leaderboard").then((res) => {
    result = res.data.result;
    addTableRowBlackbox(result);
  });
}
function logmenu() {
  c++;
  if (c % 2 != 0) {
    document.getElementById("logdiv").style.cssText =
      "position: fixed; top: 60px; right: 2%;";
  } else {
    document.getElementById("logdiv").style.cssText =
      "position: absolute; top: -200px;";
  }
}
