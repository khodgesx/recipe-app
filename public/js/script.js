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



// const doubleBackBtn = document.querySelector('.double-back')
// let currentUrl = window.location.href;
// let previousUrl = history.back();

// console.log(currentUrl)
// console.log(previousUrl)

// const backMeUp = () => {
//     while (currentUrl === previousUrl) {    
        
//         // <a class="back-button double-back" href="javascript:history.back(-1)">Back</a>
//         // i++;
//     }
// }

// doubleBackBtn.addEventListener('click', backMeUp)