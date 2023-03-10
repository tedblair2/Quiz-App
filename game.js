function log(print){
    console.log(print)
}
const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const counter=document.getElementById("questionCounter")
const scoretxt=document.getElementById("score")
const progressbar=document.getElementById("progress-bar-full")
const game=document.getElementById("game")
const loader=document.getElementById("loader")

let currentquestion={};
let availableQuestions=[];
let score=0;
let accepptingAnswers=false;
let questionCounter=0;
let questions=[]
const arr=getQuestions= async()=>{
    try{
        const res=await fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
        const data=await res.json()
        questions=data.results.map(loadedquiz=>{
            const formattedquiz={
                question:loadedquiz.question
            }
            const answeredChoices=[...loadedquiz.incorrect_answers]
            formattedquiz.answer=Math.floor(Math.random()*3) + 1;  //create index for correct answer
            answeredChoices.splice(formattedquiz.answer-1,0,loadedquiz.correct_answer) /*add correct answer at index from above */

            answeredChoices.forEach((quizchoice,index)=>{
                formattedquiz["choice"+(index+1)]=quizchoice
            })
            return formattedquiz
        })
        startGame()

        return data
    }catch(err){
        console.error(err)
    }
}
getQuestions()

const MAX_QUESTIONS=3
const CORRECT_BONUS=10

startGame=()=>{
    score=0
    questionCounter=0
    availableQuestions=[...questions]
    getNewQuestion()
    game.classList.remove("hidden")
    loader.classList.add("hidden")
}

getNewQuestion=()=>{
    if(availableQuestions.length==0 || questionCounter>=MAX_QUESTIONS){
        localStorage.setItem('recentScore',score)
        return window.location.assign("./end.html")
    }
    questionCounter++;
    counter.innerText=`Question ${questionCounter}/${MAX_QUESTIONS}`
    progressbar.style.width=`${(questionCounter/MAX_QUESTIONS) * 100}%`
    const questionIndex=Math.floor(Math.random() * availableQuestions.length)
    currentquestion=availableQuestions[questionIndex]
    question.innerText=currentquestion.question

    choices.forEach(choice=>{
        const number=choice.dataset['number']
        choice.innerText=currentquestion['choice'+number]
    })
    availableQuestions.splice(questionIndex,1)
    accepptingAnswers=true
}
incemenentScore=(num)=>{
    score +=num
    scoretxt.innerText=score
}
choices.forEach(choice=>{
    choice.addEventListener('click',e=>{
        if(!accepptingAnswers) return
        accepptingAnswers=false
        const selectedChoice=e.target
        const selectedAnswer=selectedChoice.dataset['number']
        const classToApply= selectedAnswer==currentquestion.answer ? "correct" : "incorrect"

        selectedChoice.parentElement.classList.add(classToApply)

        if(classToApply==="correct"){
            incemenentScore(CORRECT_BONUS)
        }

        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        },1000)
    })
})
