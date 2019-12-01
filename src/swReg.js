let promptEvent = null ;
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw(workbox).js')
    .then(function(sw){
    })
    .catch(function(msg){
        console.error(msg) ;
    })
}
window.addEventListener('beforeinstallprompt',function(evt){
    evt.preventDefault() ;
    promptEvent = evt ;
    document.querySelector('#showPrompt').addEventListener('click',showPrompt) ;
    return false ;
})