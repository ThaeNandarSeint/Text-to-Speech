// choose
const choosewrapper = document.querySelector('#choose-wrapper')
const textbtn = document.querySelector('#textBtn')
const textwrapper = document.querySelector('#text-wrapper')
const speechbtn = document.querySelector('#speechBtn')
const speechwrapper = document.querySelector('#speech-wrapper')

textbtn.addEventListener('click', ()=>{
    textwrapper.classList.remove('d-none')
    speechwrapper.classList.add('d-none')
})
speechbtn.addEventListener('click', ()=>{
    textwrapper.classList.add('d-none')
    speechwrapper.classList.remove('d-none')
})

// text-to-speech
const textarea = document.querySelector('textarea')
const speechBtn = document.querySelector('button')
const voiceList = document.querySelector('select')

let synth = speechSynthesis
let isSpeaking = true;

function voices(){
    for(let voice of synth.getVoices()){
        let selected = voice.name === "Google US English" ? 'selected' : ''
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`
        voiceList.insertAdjacentHTML('beforeend', option)
    }
}

synth.addEventListener('voiceschanged', voices)

function textToSpeech(text){
    let utterance = new SpeechSynthesisUtterance(text)
    for(let voice of synth.getVoices()){
        if(voice.name === voiceList.value){
            utterance.voice = voice
        }
    }
    synth.speak(utterance)
}

speechBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(textarea.value !== ""){
        if(!synth.speaking){
            textToSpeech(textarea.value)
        }
        if(textarea.value.length > 80){
            if(isSpeaking){
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech"
            }else{
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech"
            }
            setInterval(()=>{
                if(!synth.speaking && !isSpeaking){
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech"
                }
            })
        }else{
            speechBtn.innerText = "Convert To Speech";
        }
    }
})

// speech-to-text
var speechRecognition = window.webkitSpeechRecognition

var recognition = new speechRecognition()

var textbox = $("#textbox")

var instruction = $('#instruction')

var content = ''

recognition.continuous = true
// recognition is started
recognition.onstart = function(){
    instruction.text('Voice recognition is on!')
}

recognition.onspeechend = function(){
    instruction.text('No Activity!')
}

recognition.onerror = function(){
    instruction.text('Try Again!')
}

recognition.onresult = function(event){
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript
    content += transcript
    textbox.val(content)
}

$('#start-btn').click((event)=>{
    if(content.length){
        content += ''
    }
    recognition.start()
})
textbox.on('input',()=>{
    content = $(this).val
})