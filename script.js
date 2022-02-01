// used api from open map weather

const apiKey = '499d81a5a82a769d370cd8d1bffd9c86';
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button");

const arrowBack = wrapper.querySelector("header i");


let api;

inputField.addEventListener("keyup",e => {
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
        // inputField.value = "";
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }
    else{
        alert("Your browser not support geolocation api");
    }
})

function onSuccess(position){
    const {latitude , longitude} = position.coords; // getting lattitude and longitude
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();

}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    // getting api response and returning it with parsing into js obj 
    // in next then func it is calling weatherDetails func with api result as an argument;


    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}


function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isnt a Valid City Name`;
    }
    else{
        const {feels_like,temp,humidity} = info.main;
        const cityName = info.name;
        const countryName = info.sys.country;
        const {description} = info.weather[0];
        let main = info.weather[0].main;

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${cityName} , ${countryName}`;;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        if(main == "Mist"){
            main = "Haze";
        }
        wrapper.querySelector("img").src = `Images/${main}.svg`

        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click",() => {
    wrapper.classList.remove("active");
    inputField.value = "";    
})
