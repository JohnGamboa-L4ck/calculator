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
    let operator = this.innerText;
    let rawNumbersString = divMainHolder.innerText;

    let localFirstNumber = localStorage.getItem('firstNumber');
    let counter = Number(localStorage.getItem('operatorCounter'));
    localStorage.setItem('operatorCounter', counter += 1 );

    divMainHolder.innerText = '0';

    if(localFirstNumber == ''){
        localStorage.setItem('firstNumber', rawNumbersString);
        localStorage.setItem('operator', operator);
        divTopHolder.innerText = `${rawNumbersString} ${operator}`; 
    return; } 

    let localSecondNumber = localStorage.getItem('secondNumber');
    let localOperator = localStorage.getItem('operator');
    let parsedArray = JSON.parse(localStorage.getItem('arrayHolder'));
    
    if (!isFalsyExceptZero(localFirstNumber) && isFalsyExceptZero(localSecondNumber)){
        localStorage.setItem('secondNumber', rawNumbersString);
        parsedArray.push(localFirstNumber, localOperator, rawNumbersString, operator); }
    else { parsedArray.push(rawNumbersString, operator); }

    localStorage.setItem('arrayHolder', JSON.stringify(parsedArray));
    localStorage.setItem('displayHolder', cleanString(localStorage.getItem('arrayHolder')));
    divTopHolder.innerText = localStorage.getItem('displayHolder');
};

calcOperators.forEach(function(btn){
    btn.addEventListener('click', selectOperator);
});

const removeComma = (string) => string.replace(/\,/g, ''); 
const replaceFalseOperator = (string) => string.replace(/\×/g, '*').replace(/\÷/g, '/'); 

const stringToNumber = function(string){
    let item = string;
    if((string !== '+' && string !== '-') && (string !== '*' && string !== '/')){
        item = Number(string);
    }
    return item;
};

const add = (fNum, sNum) => fNum + sNum;
const subtract = (fNum, sNum) => fNum - sNum;
const multiply = (fNum, sNum) => fNum * sNum;
const divide = (fNum, sNum) => fNum / sNum;

//delete later on
console.success = (message) => { 
    console.log('%c' + message, 'color: green; font-weight:bold; font-size: 1.5rem;') 
}

const solve = function(array) {
    // if(!array) return 'ERROR'; 
    // console.log('array: ',array);
    // let newArray = array
    //     .map(removeComma)
    //     .map(replaceFalseOperator)
    //     .map(stringToNumber);
    // console.log('newArray form',newArray);
    array = [-10, "+", 20.5, "-", 0.5, "/", 5, "*", 50];//temporary array //rename variable later: array to newArray
    //100 //5.5
    console.log(array);
    console.log('arraylength:',array.length);
    let loop = 1;  
    let solved = 0;
    let zeroIndexValueHolder = 0;
    console.log('LOOOOOOOOP START------------------');
    while (array.length != 1){
        console.success(`LOOP Number: ${loop}`);
        console.log('Array count: ', array.length);
        console.table(array);
        
        if(solved === 0){

            let firstEquation = 0;
            if(array[1] == '*'){
                firstEquation = array[0] * array[2];
            } else if ( array[1] == '/'){
                firstEquation = array[0] / array[2];
            } else if ( array[1] == '+'){
                firstEquation = array[0] + array[2];
            } else if (array[1] == '-') {
                firstEquation = array[0] - array[2];
            }
            zeroIndexValueHolder = firstEquation;
            
        }else {
            if(array[1] == '*'){
                zeroIndexValueHolder = array[0] * array[2];
            } else if ( array[1] == '/'){
                zeroIndexValueHolder = array[0] / array[2];
            } else if ( array[1] == '+'){
                zeroIndexValueHolder = array[0] + array[2];
            } else if (array[1] == '-') {
                zeroIndexValueHolder = array[0] - array[2];
            }
        }
        loop++;
        solved++;
        array[0] = zeroIndexValueHolder;
        if(array.length !== 1){
            array.splice(1,1);
            array.splice(1,1);
        }
        console.log('Solved: ', solved)
        console.log('zeroIndexValueHolder Value: ', zeroIndexValueHolder);
        console.log('First item: ',array[0]);

        console.table(array);
        console.log('Array count: ',array.length);
    }
    console.log('LOOOOOOOOP END------------------');
    let total = zeroIndexValueHolder.toString().toLocaleString();
    return total;
    divTopHolder.innerText = total;
    resetLocal();
};

console.log(solve());



const operate = (fNum, operator, sNum) => {
    if (Number(localStorage.getItem('operatorCounter')) > 1) { 
        let parsedArray = JSON.parse(localStorage.getItem('arrayHolder'));
        parsedArray.push(divMainHolder.innerText);
        // console.log(parsedArray);
        solve(parsedArray);
    return; } 

    if (!operator) {
        fNum = Number(localStorage.getItem('firstNumber'));
        operator = localStorage.getItem('operator');
        sNum = Number(divMainHolder.innerText);
    };  
    
    if ((isFalsyExceptZero(fNum) || isFalsyExceptZero(sNum)) || !operator) { return 'ERROR'; }
    if (typeof fNum != 'number' || typeof sNum != 'number') { return 'Syntax ERROR 1'}
    if ((operator !== '+' && operator !== '-') && (operator !== '×' && operator !== '÷'))
    { return 'Syntax ERROR 2'; }

    let operation = 0;
    if (operator === '+') { operation = add; }
    else if (operator === '-') { operation = subtract; }
    else if (operator === '×') { operation = multiply; } 
    else { operation = divide; }     

    divTopHolder.innerText = '';
    divMainHolder.innerText = operation(fNum, sNum).toLocaleString();
    resetLocal();
    return operation(fNum, sNum);
};
calcEqualTo.addEventListener('click', operate);


// const test = function(e){
//     console.log(e.keyCode);
// };
// window.addEventListener('keydown', test);