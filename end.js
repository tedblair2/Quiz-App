const username=document.getElementById("username")
const finalScore=document.getElementById("finalScore")
const savescoreBtn=document.getElementById("savescore")

const recentScore=localStorage.getItem("recentScore")
const highscores= JSON.parse(localStorage.getItem("highscores")) || [];
finalScore.innerText=recentScore

username.addEventListener("keyup",()=>{
    savescoreBtn.disabled=!username.value
})
OnButtonClicked=e=>{
    e.preventDefault()
    const score={
        score:recentScore,
        name:username.value
    };
    highscores.push(score)
    highscores.sort((a,b)=> b.score- a.score)
    highscores.splice(5)
    localStorage.setItem("highscores",JSON.stringify(highscores))
    window.location.assign("index.html")
}
// savescoreBtn.addEventListener('save',e=>{
//     e.preventDefault();
//     const score={
//         score:Math.floor(Math.random()*100),
//         name:username.value
//     };
//     highscores.push(score)
//     console.log(highscores)
// })
