let viewBtn = document.querySelectorAll('.viewBtn');
let viewCnt = document.querySelectorAll('.viewCnt');
let closeBTN = document.querySelectorAll('.closeCard')


for(let i = 0; i < viewBtn.length; i++){
    viewBtn[i].addEventListener('click', ()=>{
        viewCnt.forEach((cnt) => {
            cnt.classList.remove('showMe');
        })
        viewCnt[i].classList.add('showMe');       
    });
    closeBTN[i].addEventListener('click', ()=>{
        viewCnt[i].classList.remove('showMe');
    });
}





