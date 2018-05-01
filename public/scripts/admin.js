var elem = document.querySelector('.fixed-action-btn');
  var instance = M.FloatingActionButton.init(elem);

var adminMenu = document.getElementById('adminMenu');

setTimeout(()=>{
  adminMenu.classList.remove('pulse');
}, 3000)
