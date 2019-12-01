importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
importScripts('./utilities/idb.js') ;
importScripts('./utilities/idbUtilities.js') ;
let DYNAMIC_CACHE = 'dynamic-v1' ; //this is manages 
let offlineFallback = '/404.html' ;
let syncUserTable = 'sync-userTable' ;
let syncUserTag = 'sync-userData' ;
let cacheThenNetworkURLs = [ //urls that contains dynamic data
    'https://jsonplaceholder.typicode.com/users'
];
//cache static assets 
workbox.precaching.precacheAndRoute([]);
//provide offline fallback page 
workbox.routing.registerRoute(
    function(urlData){
        return (urlData.event.request.headers.get('accept').includes('text/html')) ;
    },
    function(args) { 
        return caches.match(args.event.request)
        .then(cacheRes=>{
            if(cacheRes) return cacheRes ;      
            else { 
                return fetch(args.event.request)
                .catch(msg=>{
                    return caches.match('./offline.html')
                    .then(res=>{
                        if(res) return res ;
                        else console.log('not') ;
                    })
                }) ;
            }
        });
    }
);
//cache dynamic content via indexDB(of course we can use cache api too)
cacheThenNetworkURLs.forEach(url => {
    workbox.routing.registerRoute(
        url,
        function (args) { //we have args.event , ...
            return fetch(args.event.request)
                .then(fetchRes => {
                    let cloneRes = fetchRes.clone();
                    cloneRes.json()
                        .then(dataArray => {
                            return indexDbClear('users')
                                .then(() => dataArray.forEach(data => {
                                    indexDbWrite('users', data)
                                }))
                        })
                        .catch(msg => console.error(msg));
                    return fetchRes;
                })
                .catch(msg => console.error(msg))
        }
    );
})
//bg-sync
self.addEventListener('sync',e=>{
    switch(e.tag){
        case syncUserTag:
            e.waitUntil(
                indexDbReadAll(syncUserTable)
                .then(dataArray=>{
                    dataArray.forEach(data=>{
                        fetch('https://jsonplaceholder.typicode.com/users',{
                            method: 'post',
                            header:{
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                id: data.id,
                                name: data.name ,
                                imgSrc: data.imgSrc
                            })
                        })
                        .then(res=>{
                            if(res.ok){
                                console.log(`${data.id} gets deleted from indexDB`)
                                indexDbDelete(syncUserTable,data.id) ;
                            }
                        })
                        .catch(msg=>console.error(msg)) ;
                    })
                })  
                .catch(msg=>console.error(msg)) 
            );
            break ;
        default :
            console.error('we dont have corresponding tag related to current "sync" event') ;
    }
});
//push-notification
self.addEventListener('notificationclick',e=>{
    let notification = e.notification ;
    switch(e.action){ 
        case 'confirm':
            e.waitUntil(
                clients.matchAll()
                .then(clis=>{
                    let client = clis.find(c=>c.visibilityState=='visible')
                    if(client){
                        client.navigate('http://127.0.0.1:3500/src/form.html') ;
                        client.focus() ;
                    } 
                    else client.openWindow('http://127.0.0.1:3500/src/about.html') ;
                })
            )     
            notification.close() ;
            break ;
        case 'cancel':
            console.log('click on cancel',notification) ;
            notification.close() ;
            break ;
        default :
            console.error('action is not handled inside notificationclick event')
    }
})
self.addEventListener('notificationclose',e=>{
    console.log(`user close the ${e.notification}`)
})
self.addEventListener('push',e=>{
    let data = null ;
    if(e.data) data = JSON.parse(e.data.text()) ; 
    let notificationConfig = {
        body: data.content ,
        icon: '/src/assets/icons/icon-96x96.png'
    };
    e.waitUntil(
        self.registration.showNotification(data.title,notificationConfig) 
    )
})
