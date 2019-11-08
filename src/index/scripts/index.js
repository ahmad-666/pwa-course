function showPrompt(evt){
  promptEvent.prompt() ; 
  //show prompt for both android and desktop
  promptEvent.userChoice
  .then(choice=>{
    //console.log(choice.outcome) ;
    if(choice.outcome == 'dismissed') console.error('user not add app to home screen') ;
    else console.log('user add our app to home screen') ;  
  })
}
document.querySelector('#createCard').addEventListener('click',fetchCard);
function fetchCard(e){
  let fetchConfig = {
    method: 'GET',
    mode: 'cors'
  }
  fetch('https://jsonplaceholder.typicode.com/users',fetchConfig)
  .then(res=>res.json())
  .then(data=>{
    createCard('/src/assets/imgs/img1.jpg',data[0].name) ;
  })
  .catch(msg=>console.error(msg))
}
function createCard(imgSrc,text){
  let card = document.createElement('div');
  card.classList.add('card') ;
  let img = document.createElement('img') ;
  img.setAttribute('src',imgSrc) ;
  let p = document.createElement('p') ;
  p.textContent = text ;
  card.appendChild(img);
  card.appendChild(p);
  document.body.appendChild(card) ;
}