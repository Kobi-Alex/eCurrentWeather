
$(function () {
    $('#today-tab').click();

    $('#today-tab').click(function () {
        selectTab = true;
        $('.weather-content').load("http://localhost/weather/Today/today.html",
            function () {
                var data = getCoordinats();
                getWeather(data.lat, data.lon);
            });
        });
        
        $('#city').change(function () {
            if (selectTab == true) $('#today-tab').click();
        });
    });
    
    
    function getDayStyle(data) {
        var dt = parseInt(getCurrentTime(data.list[0].dt).slice(0, 2));
        if (dt >= 18) {
            $('body').css('background-color', '#002046');
            $('.styleColor').css('background-color', '#b8b8b8');
        }
        else if (dt >= 6 && dt < 18) {
            $('body').css('background-color', '#dddbdb83');
            $('.styleColor').css('background-color', 'white');
        }
    }
    
    
    function getWeather(lat, lon) {
        $.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=ua&APPID=f4be7ab06d3fa3bc50d6779421c37954`,
            function (data, status) {
                console.log(status);
                console.log(data);
                currentWeatherInformation(data);
            }).fail(function () { setErrorContent(); });
            
            $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=f4be7ab06d3fa3bc50d6779421c37954`,
            function (data, status) {
                // console.log(status);
                // console.log(data);
                hourlyWeatherInformation(data, 0);
            }).fail(function () { setErrorContent(); });
            
    $.get(`http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&land=ua&APPID=f4be7ab06d3fa3bc50d6779421c37954`,
        function (data, status) {
            // console.log(status);
            // console.log(data);
            nearbyplacesWeatherInformation(data);
        }).fail(function () { setErrorContent(); });
}

function nearbyplacesWeatherInformation(data) {

    for (let i = 0; i < 4; i++) {

        $('.nearby-content').append(`<div class="cityW_${i + 1} m-0 p-0 bg-light nearby rounded-sm row my-2"></div>`);

        let icon = data.list[i].weather[0].icon;
        var icon_url = "http://openweathermap.org/img/w/" + icon + ".png";

        $(`.cityW_${i + 1}`).append(`<div class="col-4 m-auto ">${(data.list[i].name)}</div>`);
        $(`.cityW_${i + 1}`).append(`<div class="col-4 m-auto text-right"><img class="mt-1" src="${icon_url}"></img></div>`);
        $(`.cityW_${i + 1}`).append(`<div class="col-4 m-auto text-right">${convertKelvinToCelsius(data.list[i].main.temp)} &deg;C</div>`);
    }
}

function currentWeatherInformation(data) {

    var wtype = data.weather[0].main;
    let icon = data.weather[0].icon;
    var icon_url = "http://openweathermap.org/img/w/" + icon + ".png";
    let tempC = convertKelvinToCelsius(data.main.temp);
    let feels_like = convertKelvinToCelsius(data.main.feels_like);
    let sunrise = getCurrentTime(data.sys.sunrise);
    let sunset = getCurrentTime(data.sys.sunset);
    var day_time = getDuration(sunrise, sunset);
    var dt = getCurrentDate(data.dt, 0);

    $('#date').html(dt);

    $('#wicon').attr("src", icon_url);
    $('#wtype').html(wtype);

    $('#temp h1').html(tempC + '&deg;C');
    $('#temp h6').html('Real Feel ' + feels_like + '&deg;');

    $('#sunrise').html(sunrise + ' AM');
    $('#sunset').html(sunset + ' PM');
    $('#duration').html(day_time + ' hr');
}


function hourlyWeatherInformation(data, index) {

    var currentWeekDay;
    if (index == 0) currentWeekDay = 'TODAY';
    else currentWeekDay = getCurrentWeekDay(data.list[index].dt, 2);
    
    $('.hourly-content').append(`<div class="hourly-header flex-fill text-left ml-4"></div>`);
    $('.hourly-header').append(`<p class='font-weight-bold pb-3'>${currentWeekDay}</p>`);
    $('.hourly-header').append(`<p class='text-secondary pb-3'></p>`);
    $('.hourly-header').append(`<p class='text-secondary pb-3'>Forecast</p>`);
    $('.hourly-header').append(`<p class='text-secondary pb-3'>Temp (&deg;C)</p>`);
    $('.hourly-header').append(`<p class='text-secondary pb-3'>RealFeel</p>`);
    $('.hourly-header').append(`<p class='text-secondary'>Wind (km/h)</p>`);
    
    for (let i = index; i < index + 6 && i < data.list.length; i++) {
        
        $('.hourly-content').append(`<div class="columnW_${i + 1} flex-fill"></div>`);
        
        let icon = data.list[i].weather[0].icon;
        var icon_url = "http://openweathermap.org/img/w/" + icon + ".png";
        
        $(`.columnW_${i + 1}`).append(`<p>${(data.list[i].dt_txt).slice(11, 16)}</p>`);
        $(`.columnW_${i + 1}`).append(`<img src="${icon_url}"></img>`);
        $(`.columnW_${i + 1}`).append(`<p>${data.list[i].weather[0].main}<hr></p>`);
        $(`.columnW_${i + 1}`).append(`<p>${convertKelvinToCelsius(data.list[i].main.temp)}<hr></p>`);
        $(`.columnW_${i + 1}`).append(`<p>${convertKelvinToCelsius(data.list[i].main.feels_like)}<hr></p>`);
        $(`.columnW_${i + 1}`).append(`<p>${Math.floor(data.list[i].wind.speed * 3.6)} ${getCardinalDirection(data.list[i].wind.deg)}</p>`);
    }
    getDayStyle(data);
}


function getCurrentDate(unix, flag) {
    var date = new Date(unix * 1000);

    switch (flag) {
        case 0:
            {
                optionsDate = {
                    year: 'numeric',
                    month: 'numeric',
                    day: '2-digit'
                };
            } break;
        case 1:
            {
                optionsDate = {
                    month: 'short',
                    day: '2-digit'
                };
            } break;
    }
    return date.toLocaleString('en-US', optionsDate).toUpperCase();
}

function getCurrentTime(unix) {
    var date = new Date(unix * 1000);
    optionsDate = {
        hour: '2-digit',
        minute: '2-digit'
    }
    return date.toLocaleString('uk', optionsDate);
}

function convertKelvinToCelsius(value) {
    return Math.round(value - 273.15);
}

function getDuration(firstDate, secondDate) {

    let getDate = (string) => new Date(0, 0, 0, string.split(':')[0], string.split(':')[1]);
    let different = (getDate(secondDate) - getDate(firstDate));

    let hours = Math.floor((different % 86400000) / 3600000);
    let minutes = Math.round(((different % 86400000) % 3600000) / 60000);
    return hours + ':' + minutes;
}

function getCardinalDirection(deg) {
    var val = Math.floor((deg / 22.5) + 0.5);
    var arrDirections = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arrDirections[(val % 16)];
}

function setErrorContent() {
    $('.weather-content').empty();
    $('.weather-content').html('<div class="error-content bg-white rounded mb-3 mt-4 mx-4 p-4"></div>');
    $('.error-content').html('<div class="error row "></div>');
    $('.error').append('<p class="text-info font-weight-bold text-center w-100 display-1 p-4">404</p>');
    $('.error').append('<h3 class="py-3 w-100 text-center font-weight-bold text-secondary">Querty could not be found. <br> Please enter different location.</h3>');
}
