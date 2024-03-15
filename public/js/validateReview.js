const title = document.getElementById('cr-title')
const body = document.getElementById('cr-content')
const button = document.getElementById('cr-post')


// disable by default
button.disabled = true

// check if empty
title.addEventListener('change', validate) 
body.addEventListener('change', validate)

function validate() {
    if(title.value == "" || body.value == ""){
        button.disabled = true
    } else {
        button.disabled = false
    }
}
