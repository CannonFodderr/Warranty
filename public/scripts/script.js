let viewBtn = document.querySelectorAll('.viewBtn');
let viewCnt = document.querySelectorAll('.viewCnt');


for(let i = 0; i < viewBtn.length; i++){
    viewBtn[i].addEventListener('click', ()=>{
        viewCnt.forEach((cnt) => {
            cnt.classList.remove('showMe');
        })
        viewCnt[i].classList.toggle('showMe');       
    });
}




