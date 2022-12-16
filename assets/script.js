//Global variables 
var latlonapi = 'https://api.openweathermap.org/geo/1.0/direct?q='; 
var city = ''; 
var apikey = '&appid=c04b3b1cca89bdcac938506e9ec8708a'; 
var formbutton = document.getElementById('btn'); 
var inputcity = document.getElementById('city'); 
var lat =''; 
var lon =''; 
var cityname =''; 
var date = new Date();  
var tommorow = new Date(date); 
var cleancurrentdate = date.toLocaleDateString();
var cardsection = document.getElementById('cardsection')
var prevsearch = []; 




///button click on dom generated previous city buttons /// 
document.addEventListener('click', function(event) {
  if (event.target.matches('#prevbtn')) {
    event.preventDefault();
    tommorow = new Date(date); 
        city = event.target.value; 
        console.log(event.target.value)
        cardsection.innerHTML=""; 
        getlatlon(); 
  } else {
    formbutton.addEventListener('click',formsubmit); ////button click on form submit///
  }
})


///function for form submit ///// 
function formsubmit(e){
  e.preventDefault();
  tommorow = new Date(date); 
   city = inputcity.value; 
    prevsearch.unshift(inputcity.value); 
    var cardsection = document.getElementById('cardsection'); 
  cardsection.innerHTML=""; 
  prevsearchbuttons(); 
  getlatlon(); 
}

///function to build the previous search buttons /// 
function prevsearchbuttons(){
  var buttons = document.createElement('button'); 
  buttons.classList.add('btn'); 
  buttons.classList.add('btn-primary');
  buttons.classList.add('m-1'); 
  buttons.setAttribute('id', 'prevbtn'); 
  buttons.innerHTML=inputcity.value; 
  buttons.value=inputcity.value; 
  document.getElementById('previoussearch').appendChild(buttons);
      
}; 
///function to get API data for lat/lon ///// 
async function getlatlon() {
  var response = await fetch(latlonapi+city+apikey); 
  var latlondata = await response.json(); 
  lat = latlondata[0].lat; 
  lon = latlondata[0].lon; 
  cityname = latlondata[0].name; 
getweather(); 
}

///function to get weather infomration after determining the lat/lon to use//// 
async function getweather() {
  var deconsapi = 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=imperial&appid=c04b3b1cca89bdcac938506e9ec8708a';
  var response = await fetch(deconsapi); 
  var weatherdata = await response.json(); 
  updatepage(); 



function updatepage(){
  ///adds all of today's weather facts to the top under the city name
  //city name //
  document.getElementById('cityname').classList.add('text-white'); 
  document.getElementById('cityname').textContent = cityname+' ('+cleancurrentdate+')'; 
 
  //current temp // 
  document.getElementById('currentweather').classList.add('text-white'); 
  document.getElementById('currentweather').classList.add('text-center'); 
  document.getElementById('currentweather').textContent = 'Current Temp: '+ Math.trunc(weatherdata.list[0].main.temp)+' °F'; 
  
  //current winds// 
  document.getElementById('currentwind').classList.add('text-white'); 
  document.getElementById('currentwind').classList.add('text-center'); 
  document.getElementById('currentwind').textContent = 'Current Wind: '+ Math.trunc(weatherdata.list[0].wind.speed)+' MPH'; 

  //current humidiity// 
  document.getElementById('currenthumidity').classList.add('text-white'); 
  document.getElementById('currenthumidity').classList.add('text-center'); 
  document.getElementById('currenthumidity').textContent = 'Current Humidity: '+ Math.trunc(weatherdata.list[0].main.humidity)+' %'; 


  // for loop to build the next 5 days weather cards 
  for (let i = 4; i <23; i +=4){
  var card = document.createElement('card'); 
  tommorow.setDate(tommorow.getDate()+1); 
  var cleantommorowdate = tommorow.toLocaleDateString(); 

  ///create the card container///
  var temp = 'Temp: '+ Math.trunc(weatherdata.list[i].main.temp)+' °F';  
  var wind = 'Wind: '+ Math.trunc(weatherdata.list[i].wind.speed)+' MPH'; 
  var humidity = 'Humidity: '+ Math.trunc(weatherdata.list[i].main.humidity)+' %'; 
  var emoji = ''; 
  
  ///pick emoji for the card based on the cloud % in the API//// 
  if ((weatherdata.list[i].clouds.all === 100)){ ///if all clouds then cloud emoji///
    emoji ='&#127773'; 
  } else if ((weatherdata.list[i].clouds.all > 50)){
    emoji ='&#127780';  ///if > 50% clouds then partly cloudy emoji///
  } else {
    emoji ='&#9925'; ////else sun emoji // 
  }

  //add the card to the page 
  document.getElementById('cardsection').appendChild(card);
  card.style.cssText += 'background-color:#0275d8;color:white; text-align: left;width: 155px; height: 230px;margin: 10px; ';
  card.innerHTML = cleantommorowdate+'<br><br>'+emoji+'<br><br>'+temp+'<br><br>'+wind+'<br><br>'+humidity; 
}}
}

