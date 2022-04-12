let c=0;
function menuopen(){
    document.getElementById("menuul").style.cssText="left: 0%;";
}
function menuclose(){
    document.getElementById("menuul").style.cssText="left: -70%;";
}
function logmenu(){
    c++;
    if(c%2!=0)
    {
        document.getElementById("logdiv").style.cssText="position: fixed; top: 10vh; right: 2%;";
    }
    else{
        document.getElementById("logdiv").style.cssText="position: absolute; top: -200px;";
    }
}
let question=document.getElementsByClassName("fpara");
for(let i=0;i<=question.length-1;i++)
{
    question[i].addEventListener("click",function(){
        let c=question[i].parentElement.nextElementSibling;
        if(c.style.display=="none")
        {
            question[i].firstElementChild.innerHTML="&#8722";
            c.style.display="block";

        }
        else
        {
            question[i].firstElementChild.innerHTML="&#43";
            c.style.display="none";
        }
    });
}
let time=10800;
let timer=document.getElementById("countdown");
setInterval(updatecountdown,1000);
function updatecountdown(){
    let hours=Math.floor(time/3600);
    let minutes=Math.floor((time%3600)/60);
    let seconds=Math.floor(time-3600*hours-60*minutes);
    timer.innerHTML = `${hours} : ${minutes} : ${seconds}`;
    time--;
}
let val=10800;
let t=document.getElementById("counter");
setInterval(updatecount,1000);
function updatecount(){
    let HOURS=Math.floor(val/3600);
    let MINUTES=Math.floor((val%3600)/60);
    let SECONDS=Math.floor(val-3600*HOURS-60*MINUTES);
    t.innerHTML = `TIME LEFT : ${HOURS} : ${MINUTES} : ${SECONDS}`;
    val--;
}