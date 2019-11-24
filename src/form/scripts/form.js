let form = document.forms['myForm'] ;
let name = form.querySelector('#name') ;
let email = form.querySelector('#email') ;
let syncUserTable = 'sync-userTable' ;
let syncUserTag = 'sync-userData' ;
let imgSrc = '/src/assets/imgs/img2.jpg' ;
function sendDataFallback(){ 
    //when we don't use bg-sync we send normal http request or store something inside db
    fetch('https://jsonplaceholder.typicode.com/users',{
        method: 'post',
        header:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            id:new Date().toISOString(),
            name: name.value ,
            imgSrc
        })
    })
    .then(res=>{
        //clearCards() ;
        createCard(imgSrc,name.value) ;
    })
    .catch(msg=>console.error(msg)) ;
}
form.addEventListener('submit',e=>{
    e.preventDefault(); //we want to store data inside indexDB
    if(name.value.trim() == '' || email.value.trim() == ''){
        alert('fill the form') ;
        return ;
    }
    if('serviceWorker' in navigator && 'SyncManager' in window){
        navigator.serviceWorker.ready //only execute this when we install/active sw 
        .then(sw=>{
            let userData = {
                id: new Date().toISOString() ,
                name: name.value ,
                imgSrc
            }
            indexDbWrite(syncUserTable,userData)
            .then(()=>{
                return sw.sync.register(syncUserTag) ; //register sync task 
            })
            .then(()=>{
                //something we want to do when we successfully store sync data inside indexDB 
                //and register sync task
                alert('your data was saved for syncing') ;
            })
        })
        .catch(msg=>console.error(msg)) ;
    }
    else sendDataFallback() ; //for browsers that does not support bg-sync 
    //because we use e.preventDefault() if we don't provide fallback approach 
    //for these browsers we don't do anything 
})