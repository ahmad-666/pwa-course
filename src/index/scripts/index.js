let dynamicContentCacheName = 'dynamic-content-v3';
let networkDataFetched = false ;
let cardsWrapper = document.querySelector('.cards') ;
function showPrompt(evt) {
  promptEvent.prompt();
  promptEvent.userChoice
    .then(choice => {
      if (choice.outcome == 'dismissed') console.error('user not add app to home screen');
      else console.log('user add our app to home screen');
    })
}
//document.querySelector('#createCard').addEventListener('click', fetchCard);
document.querySelector('#createCard').addEventListener('click',unregisterServiceWorkers);
function unregisterServiceWorkers(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations()
    .then(sws=>{
      sws.forEach(sw=>{
        sw.unregister() ;
      })
    })
    .catch(msg=>console.error(msg)) ;
  }
}
//cache-then-network
function fetchCard(e) {
  let imgUrl = '/src/assets/imgs/img2.jpg';
  let txtUrl = 'https://jsonplaceholder.typicode.com/users' ;
  let fetchConfig = {
    method: 'GET',
    mode: 'cors'
  }
  fetch(txtUrl,fetchConfig) 
  .then(res => res.json())
  .then(data => {
    networkDataFetched = true ;
    clearCards() ;
    createCard(imgUrl,data[0].name);
  })
  .catch(msg => console.error(msg))
  if('caches' in window){ 
    caches.match(txtUrl)
    .then(cacheResp=>{
      if(cacheResp) return cacheResp.json() ;  
    })
    .then(data=>{
      if(!networkDataFetched) {
        clearCards() ;
        createCard(imgUrl,data[0].name);
      }
    })
    .catch(()=>{;})
  }
}
function clearCards(){
  while(cardsWrapper.hasChildNodes()){
    cardsWrapper.removeChild(cardsWrapper.lastChild) ;
  }
}
function createCard(imgSrc, text) {
  let card = document.createElement('div');
  card.classList.add('card');
  let img = document.createElement('img');
  img.setAttribute('src', imgSrc);
  let p = document.createElement('p');
  p.textContent = text;
  card.appendChild(img);
  card.appendChild(p);
  cardsWrapper.appendChild(card);
}
