function showPrompt(evt){
  promptEvent.prompt() ; 
  //show prompt for both android and desktop
  promptEvent.userChoice
  .then(choice=>{
    console.log(choice.outcome) ;
    //if(choice.outcome == 'dismissed') console.error('user not add app to home screen') ;
    //else console.log('user add our app to home screen') ;  
  })
}