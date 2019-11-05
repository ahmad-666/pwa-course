self.addEventListener('install',function(evt){
    console.log('sw has been installed',evt) ;
});
self.addEventListener('activate',function(evt){
    console.log('sw has been activated',evt) ;
    return self.clients.claim() ; //make sure our code wont fail 
});
self.addEventListener('fetch',function(evt){
    //we can control any fetch events(get/post) here 
    //we can block certain fetch events,intercept them and change them,...
    //console.log('fetching',evt) ;
    //console.log(evt.request) ; //object that contains https request
    //has properties like headers:{},method:"GET",mode:"no-cors",
    //url: "http://127.0.0.1:3500/src/index/styles/index.css"
    //evt.respondWith() says respond each fetch request with what 
    //we can get evt.request to fetch
    //we can respond it with promise(fetch)
    //evt.respondWith(null) ; //this line block all fetch request 
    //evt.respondWith(fetch(evt.request)) ; //just like normal
})