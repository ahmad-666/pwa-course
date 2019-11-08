let staticCacheName = 'static-v13' ;
let dynamicCacheName = 'dynamic-v13' ;
//each time we change something inside sw.js then new sw will be installed 
//but if we change something outside of sw then we still read from cache(old files)
//so we need to change cache version
let staticCachingAssets = [
    '/src/',
    //key names must match exact url here e.g if we open our site via http://127.0.0.1:3500/src/
    //then caching just '/src/index.html' is not enough(we can still open http://127.0.0.1:3500/src/index.html)
    //but not http://127.0.0.1:3500/src/ so we need to cache '/src/' manually too 
    //if we open site via http://127.0.0.1:3500/ we need only to cache '/'
    '/src/index.html',
    //if dont add .html files then caching any .css,.js,images,... is nonsense because first we must read 
	//.html file and then read other assets from it 
    '/src/libraries/fontawesome/all.min.css',
    //there is no need to always work with '/' to point to root folder and something like :
	//cache.add('../src/') it true too 
    '/src/framework.css',
    '/src/init.css', 
    '/src/index/styles/index.css',
    '/src/index/scripts/index.js',
    '/src/assets/icons/icon-144x144.png',
    '/src/assets/imgs/img1.jpg',
    '/src/assets/fonts/iransans.ttf'
    //there is no need to cache fonts really but we should know that sometimes even when we cache something we still 
    //have problem with it and its because inside that caching file we load other assets(like fontAwesome)
    //for these times we can use dynamic caching.
]
self.addEventListener('install',function(evt){
    console.log('sw has been installed',evt) ;
    evt.waitUntil(
        //inside sw we always work with async code and sometimes we need to be sure we perform some action 
        //and then we want to perform new action so we can access to <evt>.waitUntil(...) and here we will be sure that 
        //first we cache static assets then we activate sw and do other things. 
		//we pass our code as arg inside 'waitUntil' not as function(same for <evt>.respondWith)
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
    return self.clients.claim() ; //make sure our code wont fail 
});
self.addEventListener('fetch',function(evt){
    //we can control(intercept) any fetch events(get/post) and assets here 
    //we can block certain fetch events,intercept them and change them,...
    evt.respondWith(
        //we need to check if we have certain asset inside cache or not 
        caches.match(evt.request)
        //when we want to send http request we can use both string url or http request object like inside fetch function 
		//but when we want to retrieve or check something we can only work with http request object(evt.request)
		//so caches.match(<str>) is wrong 
        .then(cacheResp=>{
            //even if we dont find match we still execute .then but cacheResp is empty 
            if(cacheResp){//find request inside cache
                return cacheResp ; //retrieve from cache 
            }
            else{//does not find request inside cache
                return fetch(evt.request) //retrieve from net 
                .then(res=>{
                    return caches.open(dynamicCacheName)
                    .then(cache=>{
                        cache.put(evt.request.url,res.clone()) ;
                        //now anything that its not inside cache will be caching too
                        //with interact with app we fetch more things with dynamic caching 
                        console.log(res) ;
                        return res ;
                        //if we dont return then we just put req inside dynamic caching and dont return anythong to user
                    })
                })
                .catch((msg)=>{console.error(msg) ;})//for catch any error
            }
        })
    );
})

