
var selectTab = true;

$(function () {

    var tag = '';
    
    for (let i = 0; i < regions.regions.region.length; i++) {
        tag += `
        <option value=${i}>${regions.regions.region[i]._name}</option> 
        `;
    }
    $('#region').html(tag);

    if (navigator.geolocation) {
        geolocation();
    }
    else {
        $('#region').change();
    }
});

$('#region').change(function () {
    var tag = '';
    var region_id = $('#region').val();

    var region = regions.regions.region[region_id];
    for (let i = 0; i < region.city.length; i++) {
        tag += `
        <option value=${i}>${region.city[i]._name}</option>
        `
    }
    $('#city').html(tag);

    if(selectTab == true) $('#today-tab').click();
    else $('#forecast-tab').click();

});

function getCoordinats() {
    var region_id = $('#region').val();
    var city_id = $('#city').val();

    alert(region_id);
    alert(city_id);

    var lat = regions.regions.region[region_id].city[city_id]._lat;
    var lon = regions.regions.region[region_id].city[city_id]._lon;

    return { lat: lat, lon: lon };
}

function geolocation() {

    navigator.geolocation.getCurrentPosition(function (position) {

        var lat = position.coords.latitude.toString();
        var lon = position.coords.longitude.toString();
        let region = regions.regions.region;

        for (let i = 0; i < region.length; i++) {
            let city = region[i].city;
            for (let j = 0; j < city.length; j++) {
                if (Math.trunc(city[j]._lat * 10) / 10 == Math.trunc(lat * 10) / 10 &&
                    Math.trunc(city[j]._lon * 10) / 10 == Math.trunc(lon * 10) / 10) {

                    $(`#region [value=${i}]`).attr('selected', 'selected');
                    $('#region').change();
                    $(`#city [value=${j}]`).attr('selected', 'selected');
                }
            }
        }
    });
};