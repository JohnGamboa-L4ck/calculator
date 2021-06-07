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
const calcOperators = document.querySelectorAll('.operator');
const calcEqualTo = document.querySelector('#equal');

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

const resetLocal = function (){
    localStorage.setItem('firstNumber', '');
    localStorage.setItem('operator', '');
    localStorage.setItem('secondNumber', '');
    localStorage.setItem('operatorCounter', 0);
    localStorage.setItem('arrayHolder', JSON.stringify([]));
    localStorage.setItem('displayHolder', localStorage.getItem('arrayHolder'));
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

const isFalsyExceptZero = (value) => (!value && value !== 0) ? true : false;

const cleanString = function(string){
    return string
        .replace(/[\[][\"]/g, '')
        .replace(/[\"][\,][\"]/g, ' ')
        .replace(/[\"][\]]/g, '');
};

const selectOperator = function(){
    console.clear();
    // if (this.innerText == localStorage.getItem('operator')) { return; }
    let operator = this.innerText;
    let localFirstNumber = localStorage.getItem('firstNumber');
    let localSecondNumber = localStorage.getItem('secondNumber');
    let localOperator = localStorage.getItem('operator');
    let counter = Number(localStorage.getItem('operatorCounter'));

    let rawNumbersString = divMainHolder.innerText;
    let parsedArray = JSON.parse(localStorage.getItem('arrayHolder'));
    
    console.log('Operator clicked: ', operator);
    console.log('Number on main screen: ', rawNumbersString);
    console.log('counter: ', counter);
    console.log('localStorage firstNumber: ', localFirstNumber);
    console.log('localStorage operator: ', operator);
    console.log('parsedArray: ', parsedArray);

    if(localFirstNumber == ''){
        console.log('if ONE');

        localStorage.setItem('operatorCounter', counter += 1 );
        localStorage.setItem('firstNumber', rawNumbersString);
        localStorage.setItem('operator', operator);

        divTopHolder.innerText = `${rawNumbersString} ${operator}`;
        divMainHolder.innerText = '0';
    } 
    else if ( localOperator != operator && rawNumbersString == '0') {
        console.log('if TWO');
        localStorage.setItem('operator', operator);
        divTopHolder.innerText = `${localFirstNumber} ${operator}`;
    } else if (!isFalsyExceptZero(localFirstNumber) && isFalsyExceptZero(localSecondNumber)){
        console.log('if THREE');
        localStorage.setItem('operatorCounter', counter += 1 );
        localStorage.setItem('secondNumber', rawNumbersString);
        parsedArray.push(localFirstNumber, localOperator, rawNumbersString, operator);
        localStorage.setItem('arrayHolder', JSON.stringify(parsedArray));

        localStorage.setItem('displayHolder', cleanString(localStorage.getItem('arrayHolder')));
        divTopHolder.innerText = localStorage.getItem('displayHolder');
        divMainHolder.innerText = '0';
    }
    else { //this else should not be able to change the localStorage firstNumber and operator
        console.log('if FOUR');
        localStorage.setItem('operatorCounter', counter += 1 );
        parsedArray.push(rawNumbersString, operator);
        localStorage.setItem('arrayHolder', JSON.stringify(parsedArray));

        localStorage.setItem('displayHolder', cleanString(localStorage.getItem('arrayHolder')));
        divTopHolder.innerText = localStorage.getItem('displayHolder');
        divMainHolder.innerText = '0';
    }

};

calcOperators.forEach(function(btn){
    btn.addEventListener('click', selectOperator);
});

const add = (fNum, sNum) => fNum + sNum;
const subtract = (fNum, sNum) => fNum - sNum;
const multiply = (fNum, sNum) => fNum * sNum;
const divide = (fNum, sNum) => fNum / sNum;

const solve = function(...numbers) {
    console.log('Solve function!!!!!');
    // code here //replace "÷" with "/" then solve
    resetLocal();
};

const operate = function(fNum, operator, sNum) {
    if (Number(localStorage.getItem('operatorCounter')) > 1) { 
        solve(JSON.parse(localStorage.getItem('arrayHolder')));
        return; 
    } 
    //maybe just create another operate function that will take localStorage.setItem('arrayHolder') as an argument
    //then return
    if ((isFalsyExceptZero(fNum) || isFalsyExceptZero(sNum)) || !operator) { return 'ERROR'; }
    if (typeof fNum != 'number' || typeof sNum != 'number') { return 'Syntax ERROR 1'}
    if ((operator !== '+' && operator !== '-') && (operator !== 'x' && operator !== '÷'))
    { return 'Syntax ERROR 2'; }
    
    let operation = 0;
    if (operator === '+'){ operation = add; }
    else if (operator === '-'){ operation = subtract; }
    else if (operator === 'x'){ operation = multiply; } 
    else { operation = divide; }     

    // resetLocal();//added on june 7 //might not be needed here
    return operation(fNum, sNum);
};

calcEqualTo.addEventListener('click', operate); //operate()

// let x = operate(4, '+', 2); //
// console.log(x);//

// const test = function(e){
//     console.log(e.keyCode);
// };
// window.addEventListener('keydown', test);