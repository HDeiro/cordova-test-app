const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const body = $('body');
const tablist = $$('.tab');

tablist.forEach(tab => tab.addEventListener('click', event => {
    let tab = event.srcElement;

    //Add Theme to body
    body.classList.remove('theme-1', 'theme-2', 'theme-3');
    let themeToBeAdded = tab.attributes['data-theme'].value;
    body.classList.add(themeToBeAdded);

    //Add active to tab
    tablist.forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');
}));