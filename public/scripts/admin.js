let elem = document.querySelector('.fixed-action-btn');
let instance = M.FloatingActionButton.init(elem);

if(document.getElementById('adminMenu')){
  let adminMenu = document.getElementById('adminMenu');

  setTimeout(()=>{
    adminMenu.classList.remove('pulse');
  }, 3500)
}

if(document.querySelector('#timeSinceCreated')){
  let timeColor = document.getElementById('timeSinceCreated');
  if(timeColor.innerHTML < 14){
    timeColor.style.color = "green";
  } else if(timeColor.innerHTML >= 14 && timeColor.innerHTML < 30) {
    timeColor.style.color = "orange";
  } else {
    timeColor.style.color = "red";
    timeColor.style.fontWeight = "bold";
  }
}