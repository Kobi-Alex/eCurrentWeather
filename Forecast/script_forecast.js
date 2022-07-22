
$(function () {
    $('#forecast-tab').click();

    $('#forecast-tab').click(function () {
        selectTab = false;
        $('.weather-content').load("http://localhost/weather/Forecast/forecast.html",
            function () {
                var data = getCoordinats();
                getForecastWeather(data.lat, data.lon);
            });
    });

    $('#city').change(function () {
        if (selectTab == false) $('#forecast-tab').click();
    });
});

function getForecastWeather(lat, lon) {
    $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=f4be7ab06d3fa3bc50d6779421c37954`,
        function (data, status) {
            // console.log(status);
            // console.log(data);
            forecastWeatherInformation(data);
            hourlyWeatherInformation(data, 0);

            $('.weekDay_0').css('color', '#0467d8');
            $('.weekDay_0').css('border', '1px solid #740aff');
            $('.weekDay_0').css('box-shadow', '3px 3px 7px rgba(154, 147, 140, 0.5), 3px 3px 7px rgb(128, 126, 126)');

            $("#forecastWeather").on("click", ".day", function () {
                $('.hourly-content').empty();

                hourlyWeatherInformation(data, $(this).val());
                $('.day').removeAttr('style');
                $(this).css('color', '#0467d8');
                $(this).css('border', '1px solid #740aff');
                $(this).css('box-shadow', '3px 3px 7px rgba(154, 147, 140, 0.5), 3px 3px 7px rgb(128, 126, 126)');
                getDayStyle(data);
            });
        }).fail(function () { setErrorContent(); });
}

function forecastWeatherInformation(data) {
    
    var previewDay;
    for (let i = 0; i < data.list.length; i++) {
        var currentDay = getCurrentDate(data.list[i].dt, 0).toString();

        if (currentDay !== previewDay) {
            let icon = data.list[i].weather[0].icon;
            var icon_url = "http://openweathermap.org/img/w/" + icon + ".png";

            $("#forecastWeather ol").append(`<li class="weekDay_${i} day styleColor rounded p-4 mx-2 d-flex flex-column flex-fill text-center" value = ${i}></li>`);
            $(`.weekDay_${i}`).append(`<div id="name" class="py-1 font-weight-bold text-info">${getCurrentWeekDay(data.list[i].dt, 1)}</div>`);
            $(`.weekDay_${i}`).append(`<div id="date">${getCurrentDate(data.list[i].dt, 1)}</div>`);
            $(`.weekDay_${i}`).append(`<div id="icon" class="py-2 w-75 m-auto"><img class="w-100" src="${icon_url}"></img></div>`);
            $(`.weekDay_${i}`).append(`<div id="temp" class="py-2 font-weight-bold">${convertKelvinToCelsius(data.list[i].main.temp)} &deg;C</div>`);
            $(`.weekDay_${i}`).append(`<div id="weathertype" class="py-2 text-secondary">${data.list[i].weather[0].main}</div>`);
            previewDay = getCurrentDate(data.list[i].dt, 0).toString();
        }
    }
}

function getCurrentWeekDay(unix, type) {
    var date = new Date(unix * 1000);
    switch (type) {
        case 1: { optionsWeek = { weekday: 'short' }; break; }
        case 2: { optionsWeek = { weekday: 'long' }; break; }
    }
    return date.toLocaleString('en-US', optionsWeek).toUpperCase();
}