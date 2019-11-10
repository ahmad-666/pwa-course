let staticCacheName = 'static-v17' ;
let dynamicCacheName = 'dynamic-v17' ;
let offlineFallback = '/src/404.html' ;
let staticCachingAssets = [
    '/src/',
    '/src/index.html',
    offlineFallback ,
    '/src/libraries/fontawesome/all.min.css',
    '/src/framework.css',
    '/src/init.css', 
    '/src/index/styles/index.css',
    '/src/index/scripts/index.js',
    '/src/assets/icons/icon-144x144.png',
    '/src/assets/imgs/img1.jpg',
    '/src/assets/fonts/iransans.ttf'
]
self.addEventListener('install',function(evt){
    console.log('sw has been installed',evt) ;
    evt.waitUntil(
        caches.open(staticCacheName)
        .then(cache=>{
            cache.addAll(staticCachingAssets)   
        })
        .catch(msg=>console.log(msg))
    )  
});
self.addEventListener('activate',function(evt){
    console.log('sw has been activated',evt) ;
    evt.waitUntil(
        caches.keys()
        .then(keys=>{
            return Promise.all(keys.filter(key=>{
                if(key!=staticCacheName && key!=dynamicCacheName) return caches.delete(key) ;
            }))     
        })
        .catch(msg=>console.error(msg))
    )
    return self.clients.claim() ; 
});
//cache-then-network
self.addEventListener('fetch',function(evt){
    //we should know that pre-caching has nothing to do with 'fetch' 
    //event and its all about 'install' event 
    //inside 'fetch' event we will say respond each request with what 
    //evt.request is http-request object
    //we should be careful that we should not just store something inside cache and we must return its response too
    evt.respondWith(
        caches.open(dynamicCacheName)
        .then(cache=>{
            return fetch(evt.request)
            .then(res=>{
                //res is http-response object 
                cache.put(evt.request.url,res.clone()) ;
                //now we add anything even pre-cached-static files to 
                //dynamic cache and we can add some filtering here 
                return res ;    
            })       
        })
        .catch(msg=>console.log('cache cant be open'))   
    );
})



