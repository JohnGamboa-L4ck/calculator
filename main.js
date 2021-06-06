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

// let localFirstNumber = localStorage.getItem('firstNumber');
// let localOperator = localStorage.getItem('operator');
// let localSecondNumber = localStorage.getItem('secondNumber');
// let localOperatorCounter = localStorage.getItem('operatorCounter');

const resetLocal = function (){
    localStorage.setItem('firstNumber', '');
    localStorage.setItem('operator', '');
    localStorage.setItem('secondNumber', '');
    localStorage.setItem('operatorCounter', '0');
};
resetLocal();

const useDelete = function(){
    if ((divMainHolder.innerText == '0' && this.innerText == 'C')
        || (divMainHolder.innerText == '-0' && this.innerText == 'C'))
    { return; }

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
        divTopHolder.innerText = '';
        divMainHolder.innerText = '0';
        resetLocal();
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
    if (localStorage.getItem('operatorCounter') == '0') { return; }
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

// let x = operate(4, '-', 2); //
// console.log(x);//

const calcOperators = document.querySelectorAll('.operator');

const selectOperator = function(){
    console.clear();
    if (this.innerText == localStorage.getItem('operator')) { return; }
    let operator = this.innerText;
    console.log(operator);
    let localFirstNumber = localStorage.getItem('firstNumber');
    let localOperator = localStorage.getItem('operator');

    let rawNumbersString = divMainHolder.innerText;
    console.log(localFirstNumber);

    if(localFirstNumber == ''){
        console.log('run 1');
        divTopHolder.innerText = `${rawNumbersString} ${operator}`;
        divMainHolder.innerText = '0';
        localStorage.setItem('firstNumber', rawNumbersString);
        localStorage.setItem('operator', operator);
    } else if ( localOperator !== operator && rawNumbersString == '0') {
        console.log('run 2');
        divTopHolder.innerText = `${localFirstNumber} ${operator}`;
        localStorage.setItem('operator', operator);
    } else { //not sure if I should use else or if else // prolly else
        console.log('run 3');
        //topHolder (0 + 0) +   OR ['0', '+', '0', '+'] then store in a localStrorage //don't touch useDelete
    }

};

calcOperators.forEach(function(btn){
    btn.addEventListener('click', selectOperator);
});

// const test = function(e){
//     console.log(e.keyCode);
// };
// window.addEventListener('keydown', test);