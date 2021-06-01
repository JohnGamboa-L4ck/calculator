const body = document.querySelector('body');
const btnMode = document.querySelector('#mode');
const iconLightMode = document.querySelector('#lightMode');
const iconDarkMode = document.querySelector('#darkMode');

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
    } else {
        iconLightMode.classList.add('active');
        iconDarkMode.classList.remove('active');
    }
};
updateBtnModeIcon();

btnMode.addEventListener('click', toggleDarkmode);