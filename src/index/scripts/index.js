let dynamicContentCacheName = 'dynamic-content-v3';
let networkDataFetched = false ;
let cardsWrapper = document.querySelector('.cards') ;
let notificationConfig = {
  body: 'this is first notification',
  icon: '/src/assets/icons/icon-96x96.png', 
  image: '/src/assets/imgs/img1.jpg',
  badge: '/src/assets/icons/icon-96x96.png',
  dir: 'rtl',
  vibrate: [100,50,200],
  tag: 'tag1',
  renotify: true ,
  actions: [ 
    {action:'confirm',title:'confirm',icon:'/src/assets/icons/icon-96x96.png'},
    {action:'cancel',title:'cancel',icon:'/src/assets/icons/icon-96x96.png'} 
  ]
}
if('Notification' in window) document.querySelector('#notificationRequest').addEventListener('click',requestNotification) ;
function requestNotification(e){
  Notification.requestPermission()
  .then(choice=>{
    if(choice!='granted') console.error('user does not allow notification') ;
    else {
      if('serviceWorker' in navigator) { //decide use push or not
        navigator.serviceWorker.ready
        .then(sw=>{
          if('pushManager' in sw) configPushSub(); //push notification  
          else swNotification('sw notification without push',notificationConfig) ;//notification api without push but via sw
        })
      }
      else vanillaNotification('vanilla notification',notificationConfig) ; //normal notification api without push or even sw
    }
  })
  .catch(msg=>console.error(msg)) ;
}
function vanillaNotification(title,config){
  new Notification(title,notificationConfig) ;
}
function swNotification(title,config){//notification api with sw but not push
  navigator.serviceWorker.ready
    .then(sw=>sw.showNotification(title,config))
    .catch(msg=>console.error(msg)) 
}
function configPushSub(){
  let swReg = null ;
  navigator.serviceWorker.ready
  .then(sw=>{
    swReg = sw ;
    return sw.pushManager.getSubscription() ;
  })
  .then(sub=>{
    if(sub){//work with current sub

    }
    else {//need to create a new sub 
      let vapidPublic = "BF1FDxITZQS-Vr_7jfV7JZY02VrLziO8OxrNS-8tsy8NnimY4RhScn94zufc6a-HVmCTEZ9Lo9YKuP7E-0kMpiI" ;
      return swReg.pushManager.subscribe({ //create new sub
        userVisibleOnly: 'true',
        applicationServerKey: urlBase64ToUint8Array(vapidPublic)
        //vapidPublic is in base64 format and we need to convert it to uInt8 if we want to pass to subscription
        //urlBase64ToUint8Array is inside utilities.js
      });
    }   
  })
  .then(newSub=>{ //store new sub inside server
      //newSub is js object that contains 'endpoint','keys' and 'keys' it self 
      //is object that contains 'p256dh','auth' 
      //with privateKey and auth and p256dh we can identify different things 
      return fetch('https://jsonplaceholder.typicode.com/users',{
        //we need to create subscription table inside db and store infos there
        //here we just store new sub to the server and anytime that we want to send notification 
        //we go through all subscriptions and for each of them we send notification
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
  })
  .then(subRes=>{
    if(subRes.ok){
      swNotification('push notification subscribe successfully',notificationConfig) ;
      //this is not push notification and we just send normal notification that give some info to user 
      //push notification will send via server and we need to listen to 'push' event inside sw 
    } 
  })
  .catch(msg=>console.error(msg)) ;
}
//server.js :
// let webpush = require('web-push') ;
// function postNewArticle(){ //after we post new article we want to notify users
//   //store article properties inside db 
//   .then(()=>{
//     webpush.setVapidDetails('mailto:something@gmail.com','<public-key>','<private-key>')
//     //not need to convert base64 to UInt8
//     return <reference-to-subscriptions-table>;
//   })
//   .then((subscriptions)=>{
//     subscriptions.forEach(sub=>{ //each sub is user
//       let pushConfig = {
//         endpoint: <end-point from subscriptions table> ,
//         keys:{
//           auth: <keys.auth from subscriptions table> ,
//           p256dh: <keys.p256dh from subscriptions table>
//         }
//       }
//       webpush.sendNotification(pushConfig,JSON.stringify({
//         title: 'new POST',
//         content: 'new post added'
//       })) ;
//       //we send notification but not show it just yet and we need listen to push event
//     })
//   })
// }
function showPrompt(evt) {
  promptEvent.prompt();
  promptEvent.userChoice
    .then(choice => {
      if (choice.outcome == 'dismissed') console.error('user not add app to home screen');
      else console.log('user add our app to home screen');
    })
}
document.querySelector('#createCard').addEventListener('click',fetchCard);
function fetchCard(e) {
  let imgUrl = '/src/assets/imgs/img2.jpg';
  let txtUrl = 'https://jsonplaceholder.typicode.com/users' ;
  let fetchConfig = {
    method: 'GET',
    mode: 'cors'
  }
  fetch(txtUrl,fetchConfig) 
  .then(res => res.json())
  .then(dataArray => {
    networkDataFetched = true ;
    clearCards() ;
    dataArray.forEach(data=>createCard(imgUrl,data.name)) ;
  })
  .catch(msg => console.error(msg))
  if('indexedDB' in window){ 
    indexDbReadAll('users')
    .then(dataArray=>{
      if(!networkDataFetched){
        clearCards() ;
        dataArray.forEach(data=>createCard(imgUrl,data.name)) ;
      }
    })
    .catch(msg=>console.error(msg)) 
  }
}
function clearCards(){
  while(cardsWrapper.hasChildNodes()) cardsWrapper.removeChild(cardsWrapper.lastChild) ;
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
