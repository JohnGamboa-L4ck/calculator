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
    if(body.classList == ''){
        body.removeAttribute('class');
    }
    updateBtnModeIcon();
};

const updateBtnModeIcon = function(){
    if(body.classList.contains('dark-mode')){
        iconDarkMode.classList.add('active');
        iconLightMode.classList.remove('active');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        iconLightMode.classList.add('active');
        iconDarkMode.classList.remove('active');
        localStorage.setItem('darkMode', 'disabled');
    }
};

updateBtnModeIcon();
btnMode.addEventListener('click', toggleDarkmode);

const divTopHolder = document.querySelector('#topHolder');
const divMainHolder = document.querySelector('#mainHolder');

const zero15 = document.querySelector('#zero15');//for testing from here
const zero11 = document.querySelector('#zero11'); //
zero15.onclick = function(){ //
    divMainHolder.innerText = '534,523,453.34555'; // 
    let x = divMainHolder.innerText;
    console.log(divMainHolder.innerText);// 
}; // 
zero11.onclick = function(){ // 
    divMainHolder.innerText = '0,000,000,000'; // 
    console.log(divMainHolder.innerText); // 
};                                             //to here

const targetNode = divMainHolder;
const config = { attributes: false, childList: true, subtree: false };
const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if(divMainHolder.textContent.length > 13){
                divMainHolder.classList.add('shrink')
            } else {
                divMainHolder.removeAttribute('class');
            }
        }
    }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

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

// let x = operate(4, '-', 2); //
// console.log(x);//

const isMaxDisplay = () => (divMainHolder.innerText.length >= 17) ? true : false; 

const calcNumbers = document.querySelectorAll('.num');

const displayNumber = function(){
    if(isMaxDisplay()) return; 

    let display = 0;
    let digitString = this.innerText;
    let rawNumbersString = divMainHolder.innerText;
    let filteredNumbersString = rawNumbersString.replace(/\,/g,'');

    if ((rawNumbersString == 0 && !rawNumbersString.includes('.')) && !rawNumbersString.includes('-')) { 
        display = digitString; }
    else if (rawNumbersString < 1 && !rawNumbersString.includes('-')) { 
        display = `${rawNumbersString}${digitString}`; }
    else { 
        let newString = filteredNumbersString += digitString;
        let readableNumberString = Number(newString).toLocaleString('en-US', { maximumFractionDigits: 5 });
        display = readableNumberString;
    }

    divMainHolder.innerHTML = display;
};

calcNumbers.forEach(function(btn){
    btn.addEventListener('click', displayNumber);
});

const log = function(){
    console.log(this.innerText);
    console.log(typeof this.innerText);
    console.log(parseInt(this.innerText));
    console.log(typeof parseInt(this.innerText));
    // console.log(this.innerText.length);
};

const calcSpecial = document.querySelectorAll('.special');

const useSpecial = function(){
    if (isMaxDisplay()) return; 
    if (divMainHolder.innerText.includes('.')) return;

    console.clear();
    
    let dot = '.';
    let hyphenMinus = '-';

    console.log(this.innerText);
    let character = this.innerText;
    let rawNumbersString = divMainHolder.innerText;
    console.log(rawNumbersString);


    if (character == dot && rawNumbersString == '0') { 
        console.log('f1');
        divMainHolder.innerText = '0.'; }
    else if (character == hyphenMinus && rawNumbersString == '0') { 
        console.log('f2');
        divMainHolder.innerText = '-0'; }
    else if (character == dot && !rawNumbersString.includes(dot)) { 
        console.log('f3');
        divMainHolder.innerText += '.'; }
    else if (character == dot && rawNumbersString === '-0') { 
        console.log('f4');
        divMainHolder.innerText = '-0.'; }


};

calcSpecial.forEach(function(btn){
    btn.addEventListener('click', useSpecial);
});

// const test = function(e){
//     console.log(e.keyCode);
// };
// window.addEventListener('keydown', test);