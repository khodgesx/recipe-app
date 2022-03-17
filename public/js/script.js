// TOGGLE NAV BAR
const toggleMe = (e) => {
    e.preventDefault();
    console.log('toggle listening');
    document.querySelector('.burger i').classList.toggle('fa-bars');

    document.querySelector('.burger i').classList.toggle('fa-times');

    document.querySelector('.nav-list').classList.toggle('open');
    document.querySelector('.nav-list').classList.toggle('close');
    
}


document.querySelector('.burger').addEventListener('click', toggleMe);





let counter = document.querySelector('.counter');
