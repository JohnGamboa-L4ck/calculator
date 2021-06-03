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

const add = (fNum, sNum) => fNum + sNum;
const subtract = (fNum, sNum) => fNum - sNum;
const multiply = (fNum, sNum) => fNum * sNum;
const divide = (fNum, sNum) => fNum / sNum;

const operate = (fNum, operator, sNum) => {
    let operation;
    if(operator === '+'){ operation = add; }
        else if (operator === '-'){ operation = subtract; }
        else if (operator === 'x'){ operation = multiply; } 
        else if (operator === '÷'){ operation = divide; } 
        else { return; }      

    return operation(fNum, sNum);
};

let x = operate(4, '÷', 2);
console.log(x);

// const test = function(e){
//     console.log(e.keyCode);
// };

btnMode.addEventListener('click', toggleDarkmode);
// window.addEventListener('keydown', test);