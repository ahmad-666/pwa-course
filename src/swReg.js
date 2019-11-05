let promptEvent = null ;
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js')
    .then(function(sw){
        //console.log('sw has been register')
        // console.log(sw) ; //object contains info about sw
        // console.log(sw.active.scriptURL) ; //url of sw itself
        // console.log(sw.active.state) ; //'activated',...
        // console.log(sw.scope) ;  //scope of sw(pages inside this url being control by sw)
        // console.log(sw.pushManager) ; //object about push-notification
        // console.log(sw.sync) ; //object about bg-sync 
    })
    .catch(function(msg){
        console.error(msg) ;
    })
}
window.addEventListener('beforeinstallprompt',function(evt){
    //right before we meet all criteria and banner wants to show
    //we disable it and show it on another time 
    //before we meed criteria if should disable or remove button and 
    //if user install our app we should also disable or remove button
    evt.preventDefault() ;
    promptEvent = evt ;
    document.querySelector('#showPrompt').addEventListener('click',showPrompt) ;
    return false ;
})