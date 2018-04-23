let otherStoreSelector = document.getElementById('otherStore');
let otherStoreInput = document.getElementById('otherStoreInput');
let stores = document.querySelectorAll('.store');

otherStoreSelector.addEventListener('click', ()=>{
    otherStoreInput.style.display = "block";
});

for(let i = 0; i < stores.length; i++){
    stores[i].addEventListener('click', ()=>{
        otherStoreInput.style.display = "none";
    });
}