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
workbox.precaching.precacheAndRoute([
  {
    "url": "about/styles/about.css",
    "revision": "6b41cb5d6e0d071fac67f4c4993859d5"
  },
  {
    "url": "assets/imgs/img1.jpg",
    "revision": "37c01fbf0d8a3a553ff83fc5ffb05b5a"
  },
  {
    "url": "assets/imgs/img2.jpg",
    "revision": "cc25023046581c94dbe00dfea5ddb729"
  },
  {
    "url": "colors.css",
    "revision": "b778906a14fd6eaaa0a6388c9459c934"
  },
  {
    "url": "fonts.css",
    "revision": "8a54e2525ce5e09df21c672682f5f368"
  },
  {
    "url": "form.html",
    "revision": "4dbfd8d427ee24ad5871ce7094dd892e"
  },
  {
    "url": "form/scripts/form.js",
    "revision": "6d201f53db93eddfbcce9753c14c3830"
  },
  {
    "url": "framework.css",
    "revision": "50ad0fac0c17f11a22b5f09bfd19b9ee"
  },
  {
    "url": "index.html",
    "revision": "c2ae4db739e0b44e9de7b3d461983e7d"
  },
  {
    "url": "index/scripts/index.js",
    "revision": "82c0e675f0d8339d9d778981518e9089"
  },
  {
    "url": "index/styles/index.css",
    "revision": "4a66230cf4ee800b56433d1bf0162e07"
  },
  {
    "url": "init.css",
    "revision": "6c273f9b6428c263a712bc621b0689aa"
  },
  {
    "url": "libraries/fontawesome/all.min.css",
    "revision": "75025fc21912338f3edf1525b374f23c"
  },
  {
    "url": "libraries/webfonts/fa-brands-400.svg",
    "revision": "a5a8a66847a0fa86485fc5530a1fa6a9"
  },
  {
    "url": "libraries/webfonts/fa-regular-400.svg",
    "revision": "88f0c5bd0da36b4a5d3cadbb793254cd"
  },
  {
    "url": "libraries/webfonts/fa-solid-900.svg",
    "revision": "6c36adff85a9daa51869d2ce16609c9f"
  },
  {
    "url": "mixins.css",
    "revision": "58c870277752b8706393f89a9f6cc7d7"
  },
  {
    "url": "offline.html",
    "revision": "8d26574c02f1175a71b6eb5cf1e40697"
  },
  {
    "url": "sw(non-workbox).js",
    "revision": "ef655aad267fa40a4be0289aeddb4e09"
  },
  {
    "url": "swReg.js",
    "revision": "6e6ecacfc05f28f7fba0b80007a2b9d0"
  },
  {
    "url": "swWorkboxInit.js",
    "revision": "9d5b5ab4bbafe6ae560ff2ed6bdf99a0"
  },
  {
    "url": "utilities/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "utilities/idbUtilities.js",
    "revision": "3adda472ce10bb75d738f5c80c58620e"
  },
  {
    "url": "utilities/scripts/arrows.js",
    "revision": "10413bc7d844ee7392268b89a70f44c0"
  },
  {
    "url": "utilities/scripts/autoSlider.js",
    "revision": "61ed05e4745da012c07ba486cdafa845"
  },
  {
    "url": "utilities/scripts/collapse.js",
    "revision": "3d57215cdd44dab7b3b588e58a8bb993"
  },
  {
    "url": "utilities/scripts/comments1.js",
    "revision": "06196e72df98cc79ee264300d6004019"
  },
  {
    "url": "utilities/scripts/Form forgetPass1.js",
    "revision": "32e60774b115750afbda36a01b021064"
  },
  {
    "url": "utilities/scripts/Form login1.js",
    "revision": "6905a609bc1a6c2ea552112a2afee8f0"
  },
  {
    "url": "utilities/scripts/Form signup1.js",
    "revision": "d54bc55f57dff1b26d764882c97eaca4"
  },
  {
    "url": "utilities/scripts/form.js",
    "revision": "7d584ccf57ec5cf04950e3593c215e67"
  },
  {
    "url": "utilities/scripts/modal.js",
    "revision": "23e156af468995447e865ee6287e3f3f"
  },
  {
    "url": "utilities/scripts/movingLine.js",
    "revision": "1350c663c5ea2bb2cf77b3c65c545843"
  },
  {
    "url": "utilities/scripts/productSlider.js",
    "revision": "f4e6856e72d656b2ce3e82fec2de3ca0"
  },
  {
    "url": "utilities/scripts/select2.js",
    "revision": "4664a7dda867e89fa9f2a6400f8f0fb3"
  },
  {
    "url": "utilities/scripts/sliderCarousel.js",
    "revision": "af382e37665ae5c9fc1a49d43f9038e5"
  },
  {
    "url": "utilities/scripts/sliderFade.js",
    "revision": "1ea11c5a24ccb9c3d76dbc9aa0f33b55"
  },
  {
    "url": "utilities/scripts/sliderMove.js",
    "revision": "816f1563b7d5ff38acafcc118b9bac92"
  },
  {
    "url": "utilities/scripts/tabs.js",
    "revision": "ef544ef8d1f449ffafd6b0153a010e84"
  },
  {
    "url": "utilities/scripts/timeline.js",
    "revision": "399dff6f8c3cfbfe2695ae6b325ab8b3"
  },
  {
    "url": "utilities/scripts/toolTip.js",
    "revision": "6eb8fb12407aea6c90d801b6b50ae5c7"
  },
  {
    "url": "utilities/scripts/topSlider.js",
    "revision": "255003a7d562263f1feb25708a591e4e"
  },
  {
    "url": "utilities/scripts/verticalSlider.js",
    "revision": "edb555cd0da391b52f6c8f9246e7c525"
  },
  {
    "url": "utilities/styles/arrows.css",
    "revision": "7ceca8331f065755812fb20ee3d92fee"
  },
  {
    "url": "utilities/styles/autoSlider.css",
    "revision": "714582c219abb2972ef00eb8b719275f"
  },
  {
    "url": "utilities/styles/collapse.css",
    "revision": "03dd9410e0367445a85fe06c0790c3e1"
  },
  {
    "url": "utilities/styles/comments1.css",
    "revision": "706e92f73478f6301bbe6006b81924ad"
  },
  {
    "url": "utilities/styles/Form ForgetPass1.css",
    "revision": "37dd4b537c11db87239e1f4ab00f8db5"
  },
  {
    "url": "utilities/styles/Form Login1.css",
    "revision": "a914ca2c8edcf44d80095c5b6b43c004"
  },
  {
    "url": "utilities/styles/Form Signup1.css",
    "revision": "e96b24cb218cfad6498f937fc1a5f337"
  },
  {
    "url": "utilities/styles/form.css",
    "revision": "5dccf76bf516fbe609bb0a52315f52c7"
  },
  {
    "url": "utilities/styles/movingLine.css",
    "revision": "a16fbebddf9d1ddd5cfefe98c3b0515c"
  },
  {
    "url": "utilities/styles/productSlider.css",
    "revision": "c5f3a9dad13ba974a43bb606459ad19f"
  },
  {
    "url": "utilities/styles/select2.css",
    "revision": "65b2ec91218559365561aa9d04ae38f8"
  },
  {
    "url": "utilities/styles/sliderCarousel.css",
    "revision": "825024b012a9abaff7b70837c0b99e64"
  },
  {
    "url": "utilities/styles/sliderFade.css",
    "revision": "2a5a7872c346720e835f4b0e48130e29"
  },
  {
    "url": "utilities/styles/sliderMove.css",
    "revision": "087cf9c8d5908f220b01f97174c317b4"
  },
  {
    "url": "utilities/styles/tabs.css",
    "revision": "6f3b8651f79c606fca73875aca429e69"
  },
  {
    "url": "utilities/styles/timeline.css",
    "revision": "1b2764bc40620f2cb207cd7d7d9e4b83"
  },
  {
    "url": "utilities/styles/toolTip.css",
    "revision": "c6992e162459976a2deb40ad679174e8"
  },
  {
    "url": "utilities/styles/topSlider.css",
    "revision": "d7f56f890624107b5b8487416812dd73"
  },
  {
    "url": "utilities/styles/verticalSlider.css",
    "revision": "b36983e198018d0e7c20594abda32fe3"
  },
  {
    "url": "utilities/utilities.js",
    "revision": "e3e21da8db6b18276a623bf0b58957a8"
  },
  {
    "url": "variables.css",
    "revision": "207a5e618d42a1e4de9f9fb00fc8a163"
  }
]);
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
