importScripts('./utilities/idb.js') ;
importScripts('./utilities/idbUtilities.js') ;
let STATIC_CACHE = 'static-v17' ;
let DYNAMIC_CACHE = 'dynamic-v17' ;
let offlineFallback = '/src/404.html' ;
let dynamicCacheMaxItems = 5 ;
let cacheThenNetworkURLs = [ //urls that contains dynamic data
    'https://jsonplaceholder.typicode.com/users'
] 
let staticCachingAssets = [
    '/src/',
    '/src/index.html',
    offlineFallback ,
    '/src/utilities/idb.js',
    '/src/utilities/idbUtilities.js',
    '/src/libraries/fontawesome/all.min.css',
    '/src/framework.css',
    '/src/init.css', 
    '/src/index/styles/index.css',
    '/src/index/scripts/index.js',
    '/src/assets/icons/icon-144x144.png',
    '/src/assets/imgs/img1.jpg',
    '/src/assets/fonts/iransans.ttf'
] ;


function trimCache(cacheName,maxItems){
    caches.open(cacheName)
    .then(cache=>{
        cache.keys()
        .then(keys=>{
            if(keys.length>maxItems){
                cache.delete(keys[0])
                .then(()=>trimCache(cacheName,maxItems))
                .catch(msg=>console.error(msg)) ;
            }
        })
        .catch(msg=>console.error(msg)) ;
    })
    .catch(msg=>console.error(msg)) ;
}
self.addEventListener('install',function(evt){
    console.log('sw has been installed',evt) ;
    evt.waitUntil(
        caches.open(STATIC_CACHE)
        .then(cache=>{
            cache.addAll(staticCachingAssets)   
        })
        .catch(msg=>console.error(msg))
    )  
});
self.addEventListener('activate',function(evt){
    console.log('sw has been activated',evt) ;
    evt.waitUntil(
        caches.keys()
        .then(keys=>{
            return Promise.all(keys.filter(key=>{
                if(key!=STATIC_CACHE && key!=DYNAMIC_CACHE) return caches.delete(key) ;
            }))     
        })
        .catch(msg=>console.error(msg))
    )
    return self.clients.claim() ; 
});
//combine multiple strategies
self.addEventListener('fetch',function(evt){
    let approach = 'cache-with-network-fallback' ; 
    for(let i=0;i<cacheThenNetworkURLs.length;i++){
        let url = cacheThenNetworkURLs[i] ;
        if(url==evt.request.url){
            approach = 'cache-then-network' ;
            break ;
        }
    }
    switch(approach){
        case 'cache-with-network-fallback' :
            evt.respondWith(
                caches.match(evt.request)
                .then(cacheRes=>{
                    if(cacheRes) return cacheRes ; //find inside cache         
                    else { //not find inside cache 
                        return fetch(evt.request)
                        .then(fetchRes=>{ //have net access
                            return caches.open(DYNAMIC_CACHE)   
                            .then(cache=>{
                                trimCache(DYNAMIC_CACHE,dynamicCacheMaxItems) ;
                                cache.put(evt.request.url,fetchRes.clone()) ;
                                return fetchRes ;
                            })     
                            .catch(msg=>console.error(msg)) ;  
                        })
                        .catch(msg=>{//does not have net access
                                return caches.open(STATIC_CACHE)
                                .then(cache=>{
                                    return cache.match(offlineFallback)
                                    .then(offlineRes=>{
                                        if(evt.request.headers.get('accept').includes('text/html')){
                                            return offlineRes ;
                                        }
                                    })
                                })
                                .catch(msg=>console.error(msg)) 
                        }) ;
                    }
                })
            )              
            break ;
        case 'cache-then-network' :
            evt.respondWith(
                fetch(evt.request)
                .then(fetchRes=>{
                    let cloneRes = fetchRes.clone() ;
                    cloneRes.json()
                    .then(dataArray=>{
                        return indexDbClear('users')
                        .then(()=>dataArray.forEach(data=>{
                            indexDbWrite('users',data)
                        }))
                    })
                    .catch(msg=>console.error(msg)) ;
                    return fetchRes ;
                })
                .catch(msg=>console.error(msg)) 
            ) ;      
            break ;
        default :
            console.error(`there is no corresponding approach for ${evt.request.url}`) ;
    }
})



