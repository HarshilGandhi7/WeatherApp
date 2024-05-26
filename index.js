//variables initialization start
const user_tab=document.querySelector("[user_weather]");
const other_tab=document.querySelector("[search_weather]");
const grant_location_container=document.querySelector("[grant_location_container]");
const loading_page=document.querySelector("[loading_page]");
const search_weather_page=document.querySelector("[search_weather_page]");
const weather_details=document.querySelector("[weather_details]");
const form_search=document.querySelector("[form_search]");
const error_not_found=document.querySelector(".error_not_found");
//variables initialization end

let curr_tab=user_tab;
const API_KEY="6c557bc9502223b4baa0d34be2d0475e";
curr_tab.classList.add("current_tab");
getSessionStorage();

user_tab.addEventListener('click',()=>{switchedtab(user_tab)});
other_tab.addEventListener('click',()=>{switchedtab(other_tab)});

function switchedtab(clickedtab){

    if(clickedtab!=curr_tab){
        weather_details.classList.remove("active");
        error_not_found.classList.remove("active");
        curr_tab.classList.remove("current_tab");
        curr_tab=clickedtab;
        curr_tab.classList.add("current_tab");
        if(user_tab!=curr_tab){
            //clicked tab is search_tab
            search_weather_page.classList.add("active");
            weather_details.classList.remove("active");
        }else{
            //clicked tab is user_tab
            error_not_found.classList.remove("active");
            search_weather_page.classList.remove("active");
            loading_page.classList.add("active");
            getSessionStorage();
        }    
    }
}

const search_form_city=document.querySelector("[search_form_city]");

form_search.addEventListener("submit",async (e)=>{
    e.preventDefault();
    error_not_found.classList.remove("active");
    weather_details.classList.remove("active");
    const city=search_form_city.value;
    if(city==""){
        return ;
    }else{
        loading_page.classList.add("active");
        await weather_city_details(city);
    }
});

async function weather_city_details(city){
    if(city==""){
        error_not_found.classList.remove("active");
        return;
    }else{
            const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data=await response.json();
            renderWeatherdetails(data);
    }
}

function getSessionStorage(){
    const coordinates=sessionStorage.getItem("userdata");
    if(!coordinates){
        //coordinates not available
        grant_location_container.classList.add("active");
    }else{
        //local coordinates available so pass latitudes,longitudes to call renderWeatherinfo
        const local_coordinates=JSON.parse(coordinates);
        renderWeatherInfo(local_coordinates);
    }
}

const Grant_access_btn=document.querySelector("[Grant_access_btn]");

Grant_access_btn.addEventListener('click',()=>{
  const coordinates=sessionStorage.getItem("userdata");
  if(!coordinates){
    //coordinates not found;
    getLocation();
  }else{
    //coordinates already stored in sessionStorage
    const local_coordinates=JSON.parse(coordinates);
    renderWeatherInfo(local_coordinates);
  }

});


function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        loading_page.classList.remove("active");
        grant_location_container.classList.add("active");
      alert( "Geolocation is not supported by this browser.");
    }
}
  
function showPosition(position) {
    const local_coordinates={
        lat: position.coords.latitude,
        log :position.coords.longitude,
    };
    grant_location_container.classList.remove("active");
    loading_page.classList.add("active");
    sessionStorage.setItem("userdata",JSON.stringify(local_coordinates));
    renderWeatherInfo(local_coordinates);
}

async function renderWeatherInfo(coordinates){
    const {lat,log}= coordinates;
    try{
        const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${log}&appid=${API_KEY}&units=metric`);
        const data =await response.json();
        renderWeatherdetails(data);
    } 
    catch{
        alert("Not able to fetch data");
    }
}

function renderWeatherdetails(data){

    const requiredFields = ['name', 'sys', 'weather', 'main', 'wind', 'clouds'];
    for (const field of requiredFields) {
        if (!data[field]) {
            weather_details.classList.remove("active");
            loading_page.classList.remove("active");
            error_not_found.classList.add("active");
            return;
        }
    }
    const city_location=document.querySelector("[city_location]");
    const country_image=document.querySelector("[country_image]");
    const weather_icon=document.querySelector("[weather_icon]");
    const data_weather=document.querySelector("[data_weather]");
    const weather_temp=document.querySelector("[weather_temp]");
    const wind_data=document.querySelector("[wind_data]");
    const humidity_data=document.querySelector("[humidity_data]");
    const clouds_data=document.querySelector("[clouds_data]");
    city_location.innerHTML=data?.name;
    country_image.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weather_icon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    data_weather.innerHTML=data?.weather?.[0]?.description;
    weather_temp.innerHTML=data?.main?.temp+" °C";
    wind_data.innerHTML=data?.wind?.speed+"m/s";
    humidity_data.innerHTML=data?.main?.humidity+"%";
    clouds_data.innerHTML=data?.clouds?.all+"%";
    error_not_found.classList.remove("active");
    loading_page.classList.remove("active");
    weather_details.classList.add("active");
}

