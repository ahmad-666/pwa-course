//getStyle------------------------------------------------------------------------
let getStyle = (elm,prop) => window.getComputedStyle(elm,null).getPropertyValue(prop) ;
//convert em to px and revers inside js
//get px,em as string(10px,10em) and also return string
function pxToEm(px,elm){
    px = parseFloat(px) ;
    let fontSize = parseFloat(getStyle(elm,'font-size')) ;
    return `${px/fontSize}em` ;
}
function emtoPx(em,elm){
    em = parseFloat(em) ;
    let fontSize = parseFloat(getStyle(elm,'font-size')) ;
    return `${em*fontSize}px` ;
}
//getChildIndex------------------------------------------------------------------------
let getChildIndex = (parent,targetChild) => {
    let index = null ;
    let children = parent.children ;
    children = [...children] ;
    for(let i=0 ; i<children.length ; i++){
        let child = children[i] ;
        if(child == targetChild) {
            index = i ;
            break ;
        }
    }
    return index ;
}
//getActiveIndex------------------------------------------------------------------------
let getActiveIndex = parent => {
    let activeIndex = null ;
    let children = parent.children ;
    children = [...children] ;
    for(let i=0 ; i<children.length ; i++){
        let child = children[i] ;
        if(child.classList.contains('active')){
            activeIndex= i ;
            break ;
        }
    }
    return activeIndex ;
}
//docHandler------------------------------------------------------------------------
//we must call docHandler inside cb function of event so we have access to e.stopPropagation()  
//and we must call it
//sometimes we must create another docHandler for our special needs
function docHandler(container,others){
    //others are elements like BlackFilter,BarsMenu,... that we want to change
    //their css classes if we click outside of container
	//we should use  e.stopPropagation() on other eventListener too
    document.container = container ;
    document.others = [] ;
    others.forEach(other => {
        document.others.push(other) ;
    });
    document.addEventListener('click',docClick);
}
function docClick(e){
    e.stopPropagation();  
    let container = document.container ;
    let clickedElm = e.target ;
    if(!container.contains(clickedElm)){
        container.classList.remove('show') ;
        document.others.forEach(other => {
            other.classList.remove('show') ;
        })
        document.body.classList.remove('disableScroll') ;
        document.removeEventListener('click',docClick);
    }
}
//docHandler v2------------------------------------------------------------------------
//in bellow version there is no need for using e.stopPropagation() so we can call it anywhere 
function docHandler2(container,others){
    //others are elements like BlackFilter,BarsMenu,... that we want to change
    //their css classes if we click outside of container
    document.container = container ;
    document.others = [] ;
    others.forEach(other => document.others.push(other));
    setTimeout(()=>document.addEventListener('click',docClick2),100)
}
function docClick2(e){
    let container = document.container ;
    let clickedElm = e.target ;
    if(!container.contains(clickedElm)){
        container.classList.remove('show') ;
        document.others.forEach(other => other.classList.remove('show')) ;
        document.body.classList.remove('disableScroll') ;
        document.removeEventListener('click',docClick);
    }
}

//checkEllipse------------------------------------------------------------------------
function Ellipse(ellipse){
    this.ellipse = ellipse ;
    this.parent = this.ellipse.parentElement ;
    this.textAlign = this.ellipse.getAttribute('data-align') ;
    this.checkThreshold() ;
}
Ellipse.prototype.checkThreshold = function(){
    let threshold = parseFloat(window.getComputedStyle(this.parent,null).getPropertyValue('max-height')) ;
    if(this.parent.scrollHeight > threshold) {
        this.ellipse.style.display = 'block' ;
        this.parent.style.textAlign = 'justify' ;
    }
    else{
        this.parent.style.textAlign = this.textAlign ;
    }
}
//fixMenu------------------------------------------------------------------------
function fixMenu(menu,imgChange,img,beforeFixImg,afterFixImg){
    //we should set imgChange to true if we want to change imgAddress when we have fix Menu
    window.addEventListener('scroll',checkFixMenu) ;
    function checkFixMenu(){
        if(window.scrollY>menu.offsetHeight) {
            menu.classList.add('fix') ;
            if(imgChange) img.setAttribute('src',beforeFixImg) ;
        }
        else{
            menu.classList.remove('fix') ;
            if(imgChange) img.setAttribute('src',afterFixImg) ;
        }
    }
}
//AnimateCounter------------------------------------------------------------------------
function AnimateCounter(elm){
    this.elm = elm ;
    this.min = parseInt(this.elm.getAttribute('data-min')); 
    this.max = parseInt(this.elm.getAttribute('data-max')); 
    this.interval = parseInt(this.elm.getAttribute('data-interval')) ;
    this.time = parseInt(this.elm.getAttribute('data-time')); 
    this.stepsNum = Math.ceil(this.time/this.interval);
    this.step = Math.floor((this.max-this.min)/this.stepsNum) ;
    this.animate() ;
}
AnimateCounter.prototype.animate = function(){
    let currentVal = this.min ;
    let currStep = 0 ;
    let clear = setInterval(()=>{
        currStep++ ;
        if(currStep<this.stepsNum){
            if(currStep == this.stepsNum-1){
                currentVal=this.max;
            }
            else{
                currentVal+=this.step;
            }
            this.elm.textContent = currentVal ;
        }
        else clearInterval(clear) ;      
    },this.interval) ;
}
//Rand------------------------------------------------------------------------
let getRandInt = (min,max) => Math.floor(Math.random()*(max-min+1)+min) ;
let getRandFloat = (min,max) => Math.random()*(max-min)+min ;
//get Number/alphanumeric------------------------------------------------------------------------
function getNumArray(min,max){//return array of number between [min,max]
    let res = [] ;
    for(let i=0 ; i<=max-min ;i++){
        res.push(min+i) ;
    }
    return res ;
}
function getAlphaNumArray(){
    let num = '0123456789' ;
    let alphaLow = 'abcdefghijklmnopqrstuvwxyz' ;
    let alphaUp = alphaLow.toUpperCase() ;
    let special = `!@#$%^&*?`
    let allStr = num+alphaLow+alphaUp+special ;
    return allStr.split('') ;
}
//shuffleArray------------------------------------------------------------------------
function shuffleArray(arr){//randomize arr
    let res = [] ;
    for(let i=0 ; i<arr.length ; i++){
        let random = arr[getRandInt(0,arr.length-1)] ;
        let unique = res.every(elm=>elm!=random) ;
        if(unique) res.push(random) ;
        else i-- ;    
    }
    return res ;
}
//Timer------------------------------------------------------------------------
function Timer(min,sec,timerElm){
    this.initMin = min ;
    this.initSec = sec ;
    this.min = min ;
    this.sec = sec ;
    this.timerElm = timerElm ;
    if(this.timerElm) {
        this.minElm = this.timerElm.querySelector('.min') ;
        this.secElm = this.timerElm.querySelector('.sec') ;
        this.validateTime() ;
    }
    this.clearTimer = setInterval(this.start.bind(this),1000) ;
}
Timer.prototype.start = function(){
    this.min = parseInt(this.min) ;
    this.sec = parseInt(this.sec) ;
    if(this.sec-1>=0) this.sec-- ;   
    else{
        this.sec = 59 ;
        if(this.min-1>=0) this.min-- ;      
        else{
            this.sec = '00' ;
            this.min = '00' ;
            //timer ends here and we can call cb function 
            //to alert ending of timer
            clearInterval(this.clearTimer) ;
            return ;
        }
    }
    this.validateTime() ;
    //for add '0' if min/sec gets bellow 10
    //for set timerElm
}
Timer.prototype.validateTime = function(){
    if(this.min<10) this.min = `0${this.min}` ;
    if(this.sec<10) this.sec = `0${this.sec}` ;
    if(this.timerElm){
        this.minElm.textContent = this.min ;
        this.secElm.textContent = this.sec ;
    }
}
Timer.prototype.resetTimer = function(){
    this.min = this.initMin ;
    this.sec = this.initSec ;
    this.validateTime() ;
    clearInterval(this.clearTimer) ;
    this.clearTimer = setInterval(this.start.bind(this),1000) ;
}
//findMinMax------------------------------------------------------------------------
function heightMinMax(minmax,elms){
    //minmax can be 'min','max'
    //elms are array of elements(DOM elements) we need to check them 
    //lookFor can be name css property like 'height'
    elms = [...elms] ;
    let res = null ;
    let compareArray = [] ;
    elms.forEach(elm => compareArray.push(elm.scrollHeight));    
    if(minmax == 'min'){
        compareArray.sort((a,b)=>{
            if(a>b) return 1;
            else return -1;
        })
    }
    else if(minmax == 'max'){
        compareArray.sort((a,b)=>{
            if(a<b) return 1 ;
            else return -1 ;
        });
    }
    res = compareArray[0] ;
    return res ;
}
//find which <option> is clicked inside <select>
function findOption(select,cb){
    let options = select.querySelectorAll('option') ;
    let selectedOption = null ;
    select.addEventListener('change',e=>{
        for(let i=0 ; i<options.length ; i++){
            let option = options[i];
            if(select.value == option.value){
                selectedOption = option ;
                cb(selectedOption) ;
                break ;
            }
        }
    })
    return selectedOption ;
}
//converts---------------------------------
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
//exports------------------------------------------------------------------------
