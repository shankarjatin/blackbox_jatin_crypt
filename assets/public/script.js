let c = 0;
function menuopen() {
  document.getElementById("menuul").style.cssText = "left: 0%;";
}
function menuclose() {
  document.getElementById("menuul").style.cssText = "left: -70%;";
}

let question = document.getElementsByClassName("fpara");
for (let i = 0; i <= question.length - 1; i++) {
  question[i].addEventListener("click", function () {
    let c = question[i].parentElement.nextElementSibling;
    if (c.style.display == "none") {
      question[i].firstElementChild.innerHTML = "&#8722";
      c.style.display = "block";
    } else {
      question[i].firstElementChild.innerHTML = "&#43";
      c.style.display = "none";
    }
  });
}
let kk = 0;
