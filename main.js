"use strict";
const body = document.querySelector('body');
const btnMode = document.querySelector('#mode');
const iconLightMode = document.querySelector('#lightMode');
const iconDarkMode = document.querySelector('#darkMode');
let darkMode = localStorage.getItem('darkMode');

if(darkMode === 'enabled'){
    body.classList.add('dark-mode');    
}

const toggleDarkmode = function(){
    body.classList.toggle('dark-mode');
    if (body.classList == '') { body.removeAttribute('class'); }
    updateBtnModeIcon();
};

const updateBtnModeIcon = function(){
    if(body.classList.contains('dark-mode')){
        iconDarkMode.classList.add('active');
        iconLightMode.classList.remove('active');
        localStorage.setItem('darkMode', 'enabled'); } 
    else {
        iconLightMode.classList.add('active');
        iconDarkMode.classList.remove('active');
        localStorage.setItem('darkMode', 'disabled');
    }
};

updateBtnModeIcon();
btnMode.addEventListener('click', toggleDarkmode);

const divTopHolder = document.querySelector('#topHolder');
const divMainHolder = document.querySelector('#mainHolder');

const targetNode = divMainHolder;
const config = { attributes: false, childList: true, subtree: false };
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if(divMainHolder.textContent.length > 13) { 
                divMainHolder.classList.add('shrink') } 
            else { divMainHolder.removeAttribute('class'); }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

const isMaxDisplay = () => ( divMainHolder.innerText.length >= 17) ? true : false; 

const calcNumbers = document.querySelectorAll('.num');
const calcSpecial = document.querySelectorAll('.special');
const calcDelete = document.querySelectorAll('.delete');

const displayNumber = function(){
    if(isMaxDisplay()) return; 

    let digitString = this.innerText;
    let rawNumbersString = divMainHolder.innerText;
    let filteredNumbersString = rawNumbersString.replace(/\,/g,'');

    if (rawNumbersString.includes('.')) {
        divMainHolder.innerHTML = `${rawNumbersString}${digitString}`; }
    else { 
        let newString = filteredNumbersString += digitString;
        let readableNumberString = Number(newString).toLocaleString();
        divMainHolder.innerHTML = readableNumberString;
    }
};

calcNumbers.forEach(function(btn){
    btn.addEventListener('click', displayNumber);
});

const useSpecial = function(){
    if (isMaxDisplay()) return; 
    
    let dot = '.';
    let intChanger = '±';
    let character = this.innerText;
    let rawNumbersString = divMainHolder.innerText;

    if (character == intChanger && rawNumbersString.includes('-')) { 
        let newValue = rawNumbersString.replace(/\-/g,'');
        divMainHolder.innerText = newValue; }
    else if (character == intChanger) { 
        divMainHolder.innerText = `-${rawNumbersString}`;
    }

    if (divMainHolder.innerText.includes('.')) { return; }
    else if (character == dot && !rawNumbersString.includes(dot)) { 
        divMainHolder.innerText += dot; 
    }
};

calcSpecial.forEach(function(btn){
    btn.addEventListener('click', useSpecial);
});

const useDelete = function(){
    if (divMainHolder.innerText == '0' || divMainHolder.innerText == '-0') { return; };

    let button = this.innerText;
    let rawNumbersString = divMainHolder.innerText;
    let filteredNumbersString = rawNumbersString.replace(/\,/g,'');

    if (button == 'C' && !filteredNumbersString.includes('.')) { 
        let newValue = filteredNumbersString.slice(0, -1); 
        divMainHolder.innerText = Number(newValue).toLocaleString(); } 
    else if (button == 'C') {
        let newValue = filteredNumbersString.slice(0, -1); 
        divMainHolder.innerText = newValue; } 
    else { 
        divMainHolder.innerText = '0';
    }
};

calcDelete.forEach(function(btn){
    btn.addEventListener('click', useDelete);
});

const add = (fNum, sNum) => fNum + sNum;
const subtract = (fNum, sNum) => fNum - sNum;
const multiply = (fNum, sNum) => fNum * sNum;
const divide = (fNum, sNum) => fNum / sNum;

const isFalsyExceptZero = (value) => (!value && value !== 0) ? true : false;

const operate = (fNum, operator, sNum) => {
    if ((isFalsyExceptZero(fNum) || isFalsyExceptZero(sNum)) || !operator) { return 'ERROR'; }

    let operation = 0;
    if(typeof fNum != 'number' || typeof sNum != 'number'){ return 'Syntax ERROR 1'}
    else if ((operator !== '+' && operator !== '-') && (operator !== 'x' && operator !== '÷')){
        return 'Syntax ERROR 2'; }
    else if (operator === '+'){ operation = add; }
    else if (operator === '-'){ operation = subtract; }
    else if (operator === 'x'){ operation = multiply; } 
    else { operation = divide; }     

    return operation(fNum, sNum);
};

const calcOperators = document.querySelectorAll('.operator');

const selectOperator = function(){
    let operator = this.innerText;
    console.log(operator);

    // resume here??
};

calcOperators.forEach(function(btn){
    btn.addEventListener('click', selectOperator);
});

// let x = operate(4, '-', 2); //
// console.log(x);//

// const test = function(e){
//     console.log(e.keyCode);
// };
// window.addEventListener('keydown', test);