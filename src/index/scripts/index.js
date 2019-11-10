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
document.querySelector('#createCard').addEventListener('click', fetchCard);
//cache-then-network
function fetchCard(e) {
  let imgUrl = '/src/assets/imgs/img2.jpg';
  let txtUrl = 'https://jsonplaceholder.typicode.com/users' ;
  let fetchConfig = {
    method: 'GET',
    mode: 'cors'
  }
  fetch(txtUrl,fetchConfig) //when we have net 
  .then(res => res.json())
  .then(data => {
    networkDataFetched = true ;
    clearCards() ;
    createCard(imgUrl,data[0].name);
    //we should call createCard() two times one for fetch and one for cache
    //because we want to update UI totally(get new data)
  })
  .catch(msg => console.error(msg))
  //fetch and reading from cache are both async so there is no difference 
  //that first we use fetch then read from cache or reverse.
  if('caches' in window){ //it should be totally separate from 'fetch'
    caches.match(txtUrl)
    //if we dont have 'txtUrl' we still execute .then here 
    .then(cacheResp=>{
      if(cacheResp) return cacheResp.json() ;  
    })
    .then(data=>{
      if(!networkDataFetched) {
        //because its async code we need to place this 'if' exactly here and if we place in inside top 'then' can cause some problems
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
