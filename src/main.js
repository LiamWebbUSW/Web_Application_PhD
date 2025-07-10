
//map controls
var map = L.map('map').setView([51.5343, -3.2773], 11.3);
var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
window.onload =  genotp_agency(), genotp_routes(), gensupermarket_geom(), gencarehome_geom(), gendentist_geom(), grabpostcode(), bank(), gp_surgeries(), genschool_geom();
map.doubleClickZoom.disable();
map.on('dblclick', grabcords)
let supermarket_icon = L.icon ({iconUrl: 'img/store.png', iconSize: [25, 25], popupAnchor: [0, 0]});
let pharmacy_icon = L.icon ({iconUrl: 'img/pharmacy.png', iconSize:[25,25], popupAnchor: [0,0]});
let bank_icon = L.icon ({iconUrl: 'img/bank.png', iconSize: [25,25], popupAnchor: [0,0]});
let gp_surg_icon = L.icon({iconUrl: 'img/doctor.png', iconSize: [25,25], popupAnchor: [0,0]})
let carehome_icon2 = L.icon({iconUrl: 'img/nursing-home.png', iconSize:[25,25, ], popupAnchor: [0,0]})
let school_icon = L.icon({iconUrl:'img/education.png', iconSize:[25,25], popupAnchor: [0,0]})
$(document).ready(function() {
    $('.select2').select2();
    $("#input-panel-icons").draggable();
    $("#input-panel-dropdown").draggable();
    $("output-panel-chart").draggable();
    $("Temporal-chart").draggable();
});

$(".select2").select2({
    tags: true,
    tokenSeparators: [',', ' ']
})
var slider_value = document.getElementById("slider_value")
var output = document.getElementById("catchmenttime");
output.innerHTML = slider_value.value;
slider_value.oninput = function() {
    output.innerHTML = this.value + 'mins';
}

var maxwalk_slider_value = document.getElementById("maxwalk_value");
var maxwalk_output = document.getElementById("max_walk");
maxwalk_output.innerHTML = maxwalk_slider_value.value;
maxwalk_slider_value.oninput = function (){
    maxwalk_output.innerHTML = this.value + 'M';

}



//adding geolocator to map
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    autoClose: true,
    showPopup: true,
});
map.addControl(search);
var banned_routes = '';
var banned_agency = '';
var banned_trips = '';

//end map controls
//----------------------------------------------------------------------ROUTE SELECT STARTS
//otp routes callback
document.getElementById("year-select").oninput = function() {
    genotp_routes() 
    genotp_agency()
    console.log('changed')

}

//var year_selector = document.getElementById("year-select")

//year_selector.on = function(){
   // genotp_agency()

//}


var route_php;
var agency_php;
var routeselect = document.getElementById("vrs-select");

// if (year == "2023")
// {
//     route_php = "otp_routes_2023.php"
//     agency_php = "otp_agency_2023.php"
// }else if (year == "2022"){
//     route_php = "otp_routes_2022.php"
//     agency_php = "otp_agency_2022.php"
// }else if (year == "2021"){
// route_php = "otp_routes_2021.php"
// agency_php = "otp_agency_2021.php"
// }else if (year == "2019"){
//     route_php = "otp_routes_2019.php"
//     agency_php = "otp_agency_2019.php"
// }

function genotp_routes() {
    var otp_routes2021 = null;
   
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        'url': "otp_routes_2021.php",
        'data': '',
        'success': function (data) {
            otp_routes2021 = data.message;
        }
    });
    let routes_2021 = JSON.parse(otp_routes2021)
    console.log(routes_2021)

    var otp_routes_2019
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        'url': "otp_routes_2019.php",
        'data': '',
        'success': function (data) {
            otp_routes2019 = data.message;
        }
    });
    let routes_2019 = JSON.parse(otp_routes2019)
    console.log(routes_2019)

    var otp_routes_2022
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        'url': "otp_routes_2022.php",
        'data': '',
        'success': function (data) {
            otp_routes2022 = data.message;
        }
    });
    let routes_2022 = JSON.parse(otp_routes2022)
    console.log(routes_2022)

    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        'url': "otp_routes_2023.php",
        'data': '',
        'success': function (data) {
            otp_routes2023 = data.message;
        }
    });
    let routes_2023 = JSON.parse(otp_routes2023)

    var routes = routes_2022
    var years =  document.getElementById("year-select")
    var year = years.value

    years.onchange = function(){
        routes = ''
        console.log('routes')
        if (year ==2022){
            routes = routes_2022
        }else if (year == 2021){
            routes = routes_2021
        }else if (year == 2019){
            routes = routes_2019
        }else if (year ==2023){
            routes = routes_2023
        }
        
    }



    $(document).ready(function(event) {
        console.log(routes)
        //loops through array that gets sent back from otp and creates a list
        for (var i = 0; i < routes.length; i++) {
            var opt = routes[i];
            //name of agency
            var name = opt['longName'];
            //id of agency
            var id = opt['id'];
            // shortname of route
            var shortname = opt['shortName']
            var el = document.createElement('option'); // creates a new option
            //applies name to newly created option
            el.textContent = name + '-' + id + '-' + shortname;
            //shortname
            el.shortname = shortname
            //appleis value to option
            el.value = id;
            //applies id to option (id and value are the same)
            el.id = id;
            //adds the new option to select1 (the list for agencies)
            routeselect.appendChild(el);
        }
        // console logs the id and name of selected agency on change (onlick replicated result every change so no point)
                         routeselect.onchange = function (selectroute){
                             banned_routes = $('#vrs-select').select2('data')
                            //console.log(banned_routes);


        }
//yay me
    });





}



//-------------------------------------------------------ROUTE SELECTION ENDS
//------------------------------------------------------------AGENCY SELECTION BEGINS
//the id of the select list
var select1 = document.getElementById("eptc-select");
function genotp_agency() {
    var otp_agency_2022 = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        //php file that grabs agencies from otp
        'url': "otp_agency_2022.php",
        'data': '',
        'success': function (data) {
            //what otp sends back for agencies
            otp_agency2022 = data.message;
        }
    });
    

    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        //php file that grabs agencies from otp
        'url': "otp_agency_2023.php",
        'data': '',
        'success': function (data) {
            //what otp sends back for agencies
            otp_agency2023 = data.message;
        }
    });
    let agency_2023 = JSON.parse(otp_agency2023)




    let agency_2022 = JSON.parse(otp_agency2022);
    var otp_agency_2021 = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        //php file that grabs agencies from otp
        'url': "otp_agency_2021.php",
        'data': '',
        'success': function (data) {
            //what otp sends back for agencies
            otp_agency2021 = data.message;
        }
    });
//converts what otp sends back to a JSON array
let agency_2021 = JSON.parse(otp_agency2021);
var otp_agency_2019 = null;
$.ajax({
    'async': false,
    'type': "GET",
    'global': false,
    'datatype': 'html',
    //php file that grabs agencies from otp
    'url': "otp_agency_2019.php",
    'data': '',
    'success': function (data) {
        //what otp sends back for agencies
        otp_agency2019 = data.message;
    }
});
let agency_2019 = JSON.parse(otp_agency2019);

  var years =  document.getElementById("year-select")
    var year = years.value
agency = agency_2022
years.onchange = function(){
    agency = ''
    console.log('agency')
    if(year == 2022){
        agency = agency_2022
    }else if ( year == 2021){
        agency = agency_2021
    }else if (year == 2019){
        agency = agency_2019
    }else if (year ==2023){
        agency = agency_2023
    }
}
// need this so that it gives tiem for the list to load otherwise script will run before page load
    $(document).ready(function(event) {
        //loops through array that gets sent back from otp and creates a list
        for (var i = 0; i < agency.length; i++) {
            var opt = agency[i];
            //console.log(opt);
            //name of agency
            var name = opt['name'];
            //id of agency
            var id = opt['id'];
            var el = document.createElement('option'); // creates a new option
            //applies name to newly created option
            el.textContent = name;
            //appleis value to option
            el.value = id;
            //applies id to option (id and value are the same)
            el.id = id;
            //adds the new option to select1 (the list for agencies)
            select1.appendChild(el);
        }
        // console logs the id and name of selected agency on change (onlick replicated result every change so no point)
        select1.onchange = function (selectagency){
            banned_agency = $('#eptc-select').select2('data')
            //console.log(banned_agency)
        }
//yay me
    });

}
    function gen_R() {
        var otp_stops = null;
        $.ajax({
            'async': false,
            'type': "GET",
            'global': false,
            'datatype': 'html',
            'url': "testing.php",
            'data': '',
            'success': function (data) {
                otp_stops = data.message;
            }
        });
        var stops = JSON.parse(otp_stops);
        //console.log(stops);
    }
    


function genotp_stops() {
    var otp_stops = null;
    $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'datatype': 'html',
        'url': "otp_stops.php",
        'data': '',
        'success': function (data) {
            otp_stops = data.message;
        }
    });
    var stops = JSON.parse(otp_stops);
    //console.log(stops);
}


let walk_style = {color: 'white', weight: 1, fillOpacity: 0.8, pane: "pane302", fillColor: '#e31a1c',};




//----------------------------------------------------------------------AGENCY SELECTIONS ENDS

//geosearch (grabcords) start
//taking coords from geolocator and sending them to functions
map.on('geosearch/showlocation', function (result) {
    var xcord = result.location.x;
    var ycord = result.location.y;
    var latlngpost = [];
    latlngpost.push('lat:' + ' ' + xcord + ',' + 'lng:' + ' ' + ycord)
    coordinates = ycord + ',' + xcord;
    console.log(coordinates)
    var isochrone_list = get_iso(this, coordinates);
    var theTable = load_supply(isochrone_list);
    load_points_within(isochrone_list, theTable, coordinates);
});

var poi_selected
var arrtable
let pharm = document.getElementById("pharmacy")
console.log(pharm)
pharm.addEventListener("click", function(){
supplylayer = pharmacies_geom; 
supplylayer_icon = pharmacy_icon;
poi_selected = 'pharm'
arrtable = 'supply.pharmacies'
})

let school_element = document.getElementById("schools")
school_element.addEventListener("click", function(){
    supplylayer = school_geom;
    supplylayer_icon = school_icon
    poi_selected = 'school'
    arrtable = 'supply.secondary_schools_2023'
    
})

let supermarket_element = document.getElementById("super_markets")
supermarket_element.addEventListener("click", function(){
supplylayer = supermarketgeom;
supplylayer_icon = supermarket_icon
poi_selected = 'supermarket'
    arrtable = 'supply.super_markets'

})


let carehome_element = document.getElementById("carehome_button")
carehome_element.addEventListener("click", function(){
    supplylayer = carehome_geom;
    supermarket_icon = carehome_icon2
    poi_selected = 'carehome'
arrtable = 'supply.carehomes_2022_redone'
})
let gp_surg = document.getElementById("gp_surgeries")
gp_surg.addEventListener("click" , function(){
    supplylayer = gp_surg_geom;
    supplylayer_icon = gp_surg_icon;
    poi_selected = 'gpsurg'
    arrtable = 'supply.gp_test_2022'
})

let bank_poi = document.getElementById("banks")
bank_poi.addEventListener("click", function(){
    supplylayer = bank_geom;
    supplylayer_icon = bank_icon;
    poi_selected = 'bank'
    arrtable = 'supply.banks_openinghours'
})

var supplylayer
var supplylayer_icon
var poilayer 
//geosearch ends --sends coordiantes to get_iso from the geosearch
var coordinates;
var supply_coordinates; 

var exclude_route_php

var form_string

var currentMarker;
var fourm 
map.on("click", function (event) {
currentMarker = L.marker(event.latlng,  {
    icon: supplylayer_icon
 })
var coords = event.latlng.lat + ',' + event.latlng.lng

//limits decimal places (rounds it)
var lat_dec = event.latlng.lat
var lon_dec = event.latlng.lng


var lat = lat_dec
var lon = lon_dec 
 currentMarker.addTo(map)
 
 //make this universal popupcontentbank = popupcontent 
 var popupcontent = '<H2>Point of interest info</H2><form role="form" id="form" <br>' +
      '<div class="form-group2">'+
          '<label class="control-label col-10"><strong>Give a name </strong></label>'+ "<br>" +
          '<input type="text" placeholder="Extra Information" id="name" name="Name" class="form-control"/>'+ 
      '</div>'+

  '<div class="form-group2">'+
          '<label class="control-label col-sm-10"><strong>Add a Postcode </strong></label>'+ "<br>" +
          '<input type="text" placeholder="Extra Information" id="Postcode" name="Postcode" class="form-control"/>'+ 
      '</div>'+
      

      '<div class="form-group2">'+
          '<label class="control-label col-sm-10"><strong>Latitude</strong></label>'+ "<br>" +
          '<input type="text" id="lat" name="Lat" class="form-control"/>'+ 
      '</div>'+

      '<div class="form-group2">'+
          '<label class="control-label col-sm-10"><strong>Longitude</strong></label>'+ "<br>" +
          '<input type="text" id="lon" name="Lon" class="form-control"/>'+ 
      '</div>'+

      '<div class="form-group2">'+
      '<label class="control-label col-sm-10"><strong>Capacity information</strong></label>'+ "<br>" +
      '<input type="text" placeholder= "Extra Information" id="capacity" name="Capacity" class="form-control"/>'+ 
  '</div>'+

        '<div class="form-group3">'+
            '<div style="text-align:center;" class="col-xs-11"><button style="text-align:center;" id="submit" value="submit" >Submit</button></div>'+
      '</div>'+ "<br>" +

             '</form>' ;
                // make this change based on what poi is selctecect so popupcontent_bank = popupcontent 
             currentMarker.bindPopup(popupcontent, {
                keepInView: true, 
                closeButton: true
             }).openPopup();
             
             const formEL = document.querySelector('form');
             document.getElementById('lat').value = lat;
             document.getElementById('lon').value = lon;
             console.log(poi_selected)
             $("#form").submit(function(e){
                e.preventDefault();
                console.log("didnt submit");
                const formData = new FormData(formEL);
                const data = Object.fromEntries(formData);
                console.log(data)
                form_string = data
                posttodb()
                regentable()

            


             

            

});

function posttodb(){
    var dbtable = arrtable
    var arrname = form_string['Name']
    var arrpostcode = form_string['Postcode']
    var arrlat = form_string['Lat']
    var arrlon = form_string['Lon']
    var arrcapacity = form_string['Capacity']
    console.log(arrlat)
    console.log(arrpostcode)
    var post_data = {Name: arrname, Postcode: arrpostcode, Lat: arrlat, Lon: arrlon, Capacity: arrcapacity, Table: dbtable}  
    console.log(post_data);
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "test.php",
        'data': post_data,
        'success': function (data) {
            console.log('posted to php')
        }
    });
    console.log(form_string)
}
function regentable(){
    theTable = arrtable
    var theColumns = ["id_1", "name", "postcode"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi.php",
        'data': post_data,
        'success': function (data) {
            console.log(supplylayer)
            if (supplylayer == supermarketgeom){
                supermarketgeom = data
                console.log("shop")
            }else if (supplylayer == carehome_geom){
                carehome_geom == data
                console.log("carehome")
            }else if (supplylayer == school_geom){
                school_geom = data
                console.log("school")
            }else if (supplylayer == gp_surg_geom){
                gp_surg_geom = data
                console.log("gp")
            }else if (supplylayer == pharmacies_geom){
                pharmacies_geom = data
                console.log("pharm")
            }else if (supplylayer == bank_geom){
                bank_geom = data
                console.log("bank")
            }
        }
    });
}})



//sends coordiantes to get_iso from user dblclick
let poiclick = document.getElementById("poicheck")
console.log(poiclick);
var poicoord;
poiclick.addEventListener("change", function(){
    console.log(supplylayer)
    if (poiclick.checked == false){
        console.log("false")
        map.removeLayer(poilayer);
    }
    poilayer = L.geoJSON(JSON.parse(supplylayer), {
        pointToLayer: function(feature, latlng) {
            //carehome icon style 
            return L.marker(latlng, {icon: supplylayer_icon})
        }
    })
   


  







    if (poiclick.checked == true){
        poilayer.addTo(map);
        console.log("true")
        poilayer.addEventListener("click", function(event){
            var clicklocation = new L.marker(event.latlng ).addTo(map)
            coordinates = event.latlng.lat + ',' + event.latlng.lng
            console.log(coordinates)
        var isochrone_list = get_iso(this, coordinates);
        var theTable = load_supply(isochrone_list);
        load_points_within(isochrone_list, theTable, coordinates);
        })
    } 
    
   
})


function grabcords(ords) {

        route_removed_banks = 0
        route_removed_care = 0
        route_removed_cumscore = 0
        route_removed_dentist = 0
        route_removed_postcode = 0 
        route_removed_school = 0
        route_removed_superm = 0



         care_2019 = 0
         school_2019 = 0 
         gp_2019 = 0 
         banks_2019 = 0 
         dentist_2019 = 0 
         postcode_2019 = 0 
         superm_2019 = 0 
         care_2021 = 0 
         school_2021 = 0 
         gp_2021 = 0 
         banks_2021 = 0 
         dentist_2021 = 0 
         postcode_2021 = 0 
         superm_2021 = 0 
         care_2022 = 0 
         school_2022 = 0 
         gp_2022 = 0 
         banks_2022 = 0 
         dentist_2022 = 0 
         postcode_2022 = 0 
         superm_2022 = 0 
         care_2023 = 0 
         school_2023 = 0 
         gp_2023 = 0 
         banks_2023 = 0 
         dentist_2023 = 0 
         postcode_2023 = 0 
         superm_2023 = 0 

         bus.eachLayer(function (layer){
            if (layer.id === 'public_layer' || layer.id ==='pub_layer' || 'walking_layer'){
                map.removeLayer(layer);
                bus.removeLayer(layer);
                console.log('removed bus stops ')
            }
        })

    var clicklocation = new L.marker(ords.latlng).addTo(map)
     coordinates = ords.latlng.lat + ',' + ords.latlng.lng;
    //console.log(coordinates)
    var isochrone_list = get_iso(this);
    console.log(this);
    var theTable = load_supply(isochrone_list);
    load_points_within(isochrone_list, theTable);
};



function supplypointclick(clicked_mark){
console.log(clicked_mark);
supply_coordinates = clicked_mark; 
};


function regentables (){
gencarehome_geom();
gendentist_geom();
genschool_geom();
gensupermarket_geom();
bank();
gp_surgeries();
}

document.getElementById("recalculate").onclick = function (){
//console.log("recalc")
    regentables()
    carehomegroup.eachLayer(function(layer) {
    if (layer.id === 'carehome_layer'){
        map.removeLayer(layer);
        carehomegroup.removeLayer(layer);
        console.log('removed carehomes')
    }})


    bus.eachLayer(function (layer){
        if (layer.id === 'public_layer' || layer.id ==='pub_layer' || layer.id==='walking_layer' || layer.id==='walk_bus_layer'){
            map.removeLayer(layer);
            bus.removeLayer(layer);
            console.log('removed bus stops ')
        }
    })


    var isochrone_list = get_iso(this);
    var theTable = load_supply(isochrone_list);
    load_points_within(isochrone_list, theTable);


}

document.getElementById("clear-layers").onclick = function (){

    bus.eachLayer(function (layer){
        if (layer.id === 'public_layer' || layer.id ==='pub_layer' || layer.id ==='walking_layer' || layer.id==='busstop'){
            map.removeLayer(layer);
            bus.removeLayer(layer);
            console.log('removed bus stops ')
        }
    })

    clusterpub.clearLayers();

}


var otp_date_2023;
var otp_date_2021;
var otp_date_2019;
var otp_date_2022;
var otp_date;

function get_iso(){
            bus_icons.clearLayers();
            bus.clearLayers();
            polygroup.clearLayers();
            clusterpub.clearLayers();
            console.log("cleared ")

    Transportbus.checked = true;

    // if (toggle_map_point == checked){


    // }

  let coords = coordinates;

//   if (toggle_supply_point == checked){
//         coords = supply_coordinates; 
//   }


  let range_meters = document.getElementById("maxwalk_value").value
  let range_mins = document.getElementById("slider_value").value * 60
  let routearr = banned_routes;
  //console.log(routearr);
  let agencyarr = banned_agency;
  //console.log(banned_trips);
  let triparr = banned_trips;
  var exclude_trips = [];
    var exclude_agency = [];
    var exclude_routes = [];

    for (var i = 0; i < routearr.length; i++) {
        var opt = routearr[i];
        //console.log(opt);
        var id = opt['id'];
        var stringroutes = id.replace(":","__" )
        //console.log(stringroutes)
        exclude_routes_alert.push(id);
        exclude_routes.push(stringroutes);
        //applies name to newly created option
        //console.log(id);

    }

    if (agencyarr != '' ) {
        for (var i = 0; i < agencyarr.length; i++) {
            var opt = agencyarr[i];
            //console.log(opt);
            var id = opt['id'];
            var stringagency = id.replace(":", "__")
            //console.log(stringagency)
            exclude_agency_alert.push(id);
            exclude_agency.push(stringagency);
            //applies name to newly created option
            //console.log(id);

        }
    }

    if (triparr != '' ) {
        for (var i = 0; i < triparr.length; i++) {
            var opt = triparr[i];
            console.log(opt);

            var id = opt.element.id;
            var stringroutes = id.replace(":","__" )
            console.log(id);
            //console.log(stringid)
            exclude_routes_alert.push(id);
            exclude_routes.push(stringroutes);
            //applies name to newly created option
            //console.log(id);
        }
    }








   


    //if statement to find the day and time for all 3 years based on user input 
    var dayofweek =  document.getElementById('vns-select').value
    if ( dayofweek == 'monday'){
        otp_date_2021 = '08-23-2021'
        otp_date_2019 = '08-19-2019'
        otp_date_2022 = '08-22-2022'
        otp_date_2023 = '08-21-2023'
    }else if (dayofweek == 'tuesday'){
        otp_date_2021 = '08-24-2021'
        otp_date_2019 = '08-20-2019'
        otp_date_2022 = '08-23-2022'
        otp_date_2023 = '08-22-2023'
    }else if (dayofweek == 'wednesday'){
        otp_date_2021 = '08-25-2021'
        otp_date_2019 = '08-21-2019'
        otp_date_2022 = '08-24-2022'
        otp_date_2023 = '08-23-2023'
    }else if (dayofweek == 'thursday'){
        otp_date_2021 = '08-26-2021'
        otp_date_2019 = '08-22-2019'
        otp_date_2022 = '08-25-2022'
        otp_date_2023 = '08-24-2023'
    }else if (dayofweek == 'friday'){
        otp_date_2021 = '08-27-2021'
        otp_date_2019 = '08-23-2019'
        otp_date_2022 = '08-26-2022'
        otp_date_2023 = '08-25-2023'
    }else if (dayofweek == 'saturday'){
        otp_date_2021 = '08-28-2021'
        otp_date_2019 = '08-24-2019'
        otp_date_2022 = '08-27-2022'
        otp_date_2023 = '08-26-2023'
    }else if (dayofweek == 'sunday'){
        otp_date_2021 = '08-29-2021'
        otp_date_2019 = '08-25-2019'
        otp_date_2022 = '08-28-2022'
        otp_date_2023 = '08-27-2023'
    }
    var year = document.getElementById('year-select').value
    console.log(year)
   if(year == 2022){
    console.log('2022')
    otp_graph = 'onlybus_2022'
    otp_date = otp_date_2022
   }else if (year == 2021){
    otp_graph = 'onlybus_2021'
    console.log('2021')
    otp_date = otp_date_2021
   }else if (year == 2019){
    console.log('2019')
    otp_graph = 'onlybus_2019'
    otp_date = otp_date_2019
   }else if (year == 2023){
    console.log("2023")
    otp_graph ='onlybus_2023'
    otp_date = otp_date_2023
   }
    var otptime = document.getElementById('vss-select').value
    //console.log(otptime);
//console.log(exclude_routes);
   var otp_graph; 
   max_walk = '9999'
   max_public_walk = range_meters.toString();
   catchment = range_mins.toString();
   //to exlcude route 1__route id
    //to exclude agency id
    exclude_route_php = exclude_routes.toString();
    exclude_agency_php = exclude_agency.toString();
    exclude_trips_php = exclude_trips.toString();
//console.log(exclude_agency_php);
  //walking Isochrone
    let post_walk = {
        coords: coords,
        transport: 'WALK',
        distance: catchment,
        maxwalk: max_public_walk,
        graph: otp_graph,
        date: otp_date,
        time: otptime,
    };
    //public transit Isochrone
    console.log(otp_date)
    let post_public_data = {
        coords: coords,
        transport: 'TRANSIT,WALK',
        distance: catchment,
        maxwalk: max_public_walk,
        graph: otp_graph,
        date: otp_date,
        time: otptime,
        route: exclude_route_php ,
        agency: exclude_agency_php,
    };


    //cycling Isochrone
   /* let post_cycling_data = {
        coords: coords,
        transport: 'BICYCLE',
        distance: catchment,
        maxwalk: max_walk,
        graph: otp_graph,
        date: otp_date
    };*/
    //driving Isochrone
/*    let post_private_data = {
        coords: coords,
        transport: 'CAR',
        distance: catchment,
        maxwalk: max_walk,
        graph: otp_graph,
        date: otp_date
    };*/
    console.log(post_walk)
    //fetching isochrones from OTP
    let public_iso = generate_iso(post_public_data);
    let walk_iso = gen_walk_iso(post_walk);
    console.log(post_public_data)
    

    var iso = public_iso
    var isochrone60 = iso[0]
    var isochrone55 = iso['1']
    var isochrone50 = iso['2']
    var isochrone45 = iso['3']
    var isochrone40 = iso['4']
    var isochrone35 = iso['5']
    var isochrone30 = iso['6']
    var isochrone25 = iso['7']
    var isochrone20 = iso['8']
    var isochrone15 = iso['9']
    var isochrone10 = iso['10']
    var isochrone5 = iso['11']
    
    console.log(isochrone30);




   /* let walk_iso = generate_iso(post_walk_data);
    let cycling_iso = generate_iso(post_cycling_data);*/
   /* let car_iso = generate_iso(post_private_data);*/

    //Set styles for each mode of transport isochrones.
    let walk_style2 = {color: 'white', weight: 1, fillOpacity: 0.8, pane: "pane302", fillColor: '#e31a1c',};
    // let cycle_style = {color: 'white', weight: 1, fillOpacity: 0.8, pane: "pane301", fillColor: '#fecc5c'};
    let public_style = {color: 'darkgreen', weight: 3, fillOpacity: 0.35, pane: "pane303", fillColor: '#04AA6D'};
  /*  let car_style = {color: 'white', weight: 1, fillOpacity: 0.8, pane: "pane300", fillColor: '#ffffb2'};*/

    //create layers from return data.
  /*  let car_layer = L.geoJSON((JSON.parse(car_iso)), {style: car_style});
    let cycling_layer = L.geoJSON((JSON.parse(cycling_iso)), {style: cycle_style});*/
    console.log(public_iso)
    console.log(walk_iso);
    let walking_layer = L.geoJSON((walk_iso), {style: walk_style2});
   walking_layer.id = 'walking_layer';
   bus.addLayer(walking_layer);
   console.log(walking_layer)
    /*cycling_layer.id = 'cycling_layer';*/
 /*   car_layer.id = 'car_layer';*/
    //adding layers to layergroups
/*    walking_layer.addTo(walk);*/
   

 /*   cycling_layer.addTo(bike);
    car_layer.addTo(carr);*/

   /* //console.log(walking_layer);*/

//creations of panes (map panes help to Zindex layers )
    var pane300 = map.createPane("pane300")
    pane300.style.zIndex = 300;


    var pane301 = map.createPane("pane301")
    pane301.style.zIndex = 301;

    var pane302 = map.createPane("pane302")
    pane302.style.zIndex = 302;

catch_size();
function catch_size(){
    
    var catch_slider = document.getElementById('slider_value')
    console.log(catch_slider)
    if (catch_slider.value == 5)
    {
        catchment_size = isochrone5
    }else if (catch_slider.value == 10){
        catchment_size = isochrone10
    }else if (catch_slider.value == 15 ){
        catchment_size = isochrone15
    }else if (catch_slider.value == 20){
        catchment_size = isochrone20
    }else if (catch_slider.value == 25){
        catchment_size = isochrone25
    }else if (catch_slider.value == 30){
        catchment_size = isochrone30
    }else if (catch_slider.value == 35){
        catchment_size = isochrone35
    }else if (catch_slider.value == 40 ){
        catchment_size = isochrone40
    }else if (catch_slider.value == 45){
        catchment_size = isochrone45
    }else if (catch_slider.value == 50){
        catchment_size = isochrone50
    }else if (catch_slider.value == 55){
        catchment_size = isochrone55
    }else if (catch_slider.value == 60){
        catchment_size = isochrone60
    }

console.log(catchment_size)
console.log(catch_slider.value)
bus.eachLayer(function (layer){
    if (layer.id === 'public_layer' || layer.id ==='pub_layer'){
        map.removeLayer(layer);
        bus.removeLayer(layer);
        console.log('removed bus stops ')
    }
})
}
    var pane303 = map.createPane("pane303")
    pane303.style.zIndex = 303;

    let public_layer_60 = L.geoJSON((isochrone60), {style: public_style});
   // public_layer_60.id = 'public_layer_60';
    let public_layer_55 = L.geoJSON((isochrone55), {style: public_style});
   // public_layer_55.id = 'public_layer_55';
    let public_layer_50 = L.geoJSON((isochrone50), {style: public_style});
    //public_layer_50.id = 'public_layer_50';
    let public_layer_45 = L.geoJSON((isochrone45), {style: public_style});
    //public_layer_45.id = 'public_layer_45';
    let public_layer_40 = L.geoJSON((isochrone40), {style: public_style});
    //public_layer_40.id = 'public_layer_40';
    let public_layer_35 = L.geoJSON((isochrone35), {style: public_style});
   // public_layer_35.id = 'public_layer_35';
    let public_layer_30 = L.geoJSON((isochrone30), {style: public_style});
   // public_layer_30.id = 'public_layer_30';
    let public_layer_25 = L.geoJSON((isochrone25), {style: public_style});
   // public_layer_25.id = 'public_layer_25';
    let public_layer_20 = L.geoJSON((isochrone20), {style: public_style});
    //public_layer_20.id = 'public_layer_20';
    let public_layer_15 = L.geoJSON((isochrone15), {style: public_style});
    //public_layer_15.id = 'public_layer_15';
    let public_layer_10 = L.geoJSON((isochrone10), {style: public_style});
    //public_layer_10.id = 'public_layer_10';
    let public_layer_5 = L.geoJSON((isochrone5), {style: public_style});
    //public_layer_5.id = 'public_layer_5';
    let public_layer = L.geoJSON((catchment_size), {style: public_style})
    public_layer.id = 'public_layer'
    public_layer_60.addTo(bus);
    public_layer_55.addTo(bus);
    public_layer_50.addTo(bus);
    public_layer_45.addTo(bus);
    public_layer_40.addTo(bus);
    public_layer_35.addTo(bus);
    public_layer_30.addTo(bus);
    public_layer_25.addTo(bus);
    public_layer_20.addTo(bus);
    public_layer_15.addTo(bus);
    public_layer_10.addTo(bus);
    public_layer_5.addTo(bus);

addtobus();
walking_layer.addTo(bus);
function removebus(){
    bus.eachLayer(function (layer){
        if (layer.id === 'public_layer' || layer.id ==='pub_layer'){
            map.removeLayer(layer);
            bus.removeLayer(layer);
            console.log('removed bus stops ')
        }
       
    })
}
function addtobus(){
    let public_layer = L.geoJSON((catchment_size), {style: public_style})
    public_layer.id = 'public_layer'
    public_layer.addTo(bus);
}
    let slider = document.getElementById("slider_value")
    slider.onchange = function(){
        removebus()
        catch_size();
        addtobus();
        load_points_within();
}
    let layer_list = {};
   /* layer_list['car_layer'] = car_iso;
    layer_list['cycling_layer'] = cycling_iso;*/
    layer_list['public_layer'] = catchment_size;
    layer_list['walking_layer'] = walk_iso;
    return layer_list;

};
var dayofweekalert = document.getElementById('vns-select').value
var timeofdayalert = document.getElementById('vss-select').value
//passes Isochrone information into the quesry2 php file and returns the isochrone data
function generate_iso(post_data) {
    var isochrone = null;
    var isochrone30 = null;
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "query2.php",
        'data': post_data,
        'success': function (data) {
            
            isochrone = data.message;
            isochrone30 = isochrone[0]
            console.log(isochrone)
            isochronestring = JSON.parse(isochrone)
            console.log(isochronestring[0])
            console.log(isochronestring['1'])
            console.log(isochronestring['2'])
        }
    });

        
         return isochronestring;
        //otp_date = []
}

var walking_geom
function gen_walk_iso(post_walk){
var walk_isochrone;
$.ajax({
    'async': false,
    'type': "POST",
    'global': false,
    'datatype': 'html',
    'url': "query_walk.php",
    'data': post_walk,
    'success': function (data) {
        walk_isochrone = data.message;
        walking_iso = JSON.parse(walk_isochrone)
        walking_geom = JSON.parse(walk_isochrone)
    }
});
     return walking_iso;
    //otp_date = []
}



//defining each Isochrone set into its own feature group (makes it easier to seperate and anaylse)

var service_id
var school_group = new L.featureGroup();
var supermarket_group = new L.featureGroup();
var bankgroup = new L.featureGroup();
var gpgroup = new L.featureGroup();
var bus = new L.FeatureGroup();
var bus_icons = new L.featureGroup();
var polygroup = new L.featureGroup();
var clusterpub = L.markerClusterGroup({
    maxClusterRadius: 120,
});
        var route_removed_cumscore
        var route_removed_care
        var route_removed_school
        var route_removed_gp
        var route_removed_banks
        var route_removed_dentist
        var route_removed_postcode
        var route_removed_superm
        var care_2019
        var school_2019
        var gp_2019
        var banks_2019
        var dentist_2019
        var postcode_2019
        var superm_2019
        var care_2021
        var school_2021
        var gp_2021
        var banks_2021
        var dentist_2021
        var postcode_2021
        var superm_2021
        var care_2022
        var school_2022
        var gp_2022
        var banks_2022
        var dentist_2022
        var postcode_2022
        var superm_2022

function load_supply(isochrone_list) {
    var trip_year = document.getElementById("year-select").value
    //Set variables for supply tables.
    //var theTable = 'supply.carehomes';
    var theTable
    if(trip_year == 2021){
        theTable = 'gtfs_2021.stops';
    }else if (trip_year == 2022){
        theTable = 'gtfs_2022.stops'
    }else if (trip_year ==2019){
        theTable = 'gtfs_2019.stops'
    }else if (trip_year == 2023){
        theTable= 'gtfs_2023.stops'
    }
    //console.log(theTable)
    var theColumns = [ "stop_name", "stop_code", "stop_id"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}

    //fetch supply table.
    var theTable = get_supply(post_data);
    //console.log(theTable)

    return JSON.parse(theTable);


}
var maxwalkv = maxwalk_slider_value.value

var catchment_valuealert = document.getElementById("slider_value").value


var busstops 
function get_supply(post_data) {
    var theTable = null;
    $.ajax({
        'async': false,
        'method': "POST",
        'global': false,
        'datatype': 'html',
        'url': "connection.php",
        'data': post_data,
        'success': function (data) {
            theTable = data;
            // //console.log(theTable)
            busstops = data
        }
    });
    return theTable;
}




var school_geom;
var gp_surg_geom;
var carehome_geom;
var carehome_geom_supply_point
var supermarketgeom;



function genschool_geom(){
    theTable = 'supply.secondary_schools';
    var theColumns = ["id_1", "name", "postcode"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi_idnamepost.php",
        'data': post_data,
        'success': function (data) {
            school_geom = data;
           console.log(school_geom)
        }
    });
};



function gencarehome_geom(){
    theTable = 'supply.carehomes_2022_redone';
    var theColumns = ["id_1", "name", "postcode"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi_idnamepost.php",
        'data': post_data,
        'success': function (data) {
            carehome_geom = data;
            carehome_geom_supply_point = data;
           console.log(carehome_geom)
        }
    });
};

function gensupermarket_geom(){
    theTable = 'supply.super_markets';
    var theColumns = ["id_1", "name", "postcode"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi_idnamepost.php",
        'data': post_data,
        'success': function (data) {
            supermarketgeom = data;
            console.log(supermarketgeom)
        }
    });
}



var pharmacies_geom;
function gendentist_geom(){
    theTable = 'supply.pharmacies';
    var theColumns =["id_1", "name", "postcode"];
    var theGeom = "geom";
    var post_data ={theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi.php",
        'data': post_data,
        'success': function (data) {
            pharmacies_geom = data;
        }
    });
}


function gp_surgeries(){
    theTable = 'supply.gp_test_2022';
    var theColumns = ["id_1", "name" ];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi.php",
        'data': post_data,
        'success': function (data) {
            gp_surg_geom = data;
        }
    });
}

var bank_geom;
function bank(){

    theTable = 'supply.banks_openinghours';
    var theColumns = ["id_1", "times"];
    var theGeom = "geom";
    var post_data = {theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "poi.php",
        'data': post_data,
        'success': function (data) {
            bank_geom = data;
        }
    });

}

var postcodes_geom;
function grabpostcode(){
    theTable = 'wales.household_postcode_count';
    var theColumns =["postcode" , "population", "house_count"];
    var theGeom = "geom";
    var post_data ={theTable: theTable, inclu: theColumns, geomy: theGeom}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "postcodes.php",
        'data': post_data,
        'success': function (data) {
            postcodes_geom = data;
        }
    });
}

console.log(postcodes_geom)









var exclude_agency_alert = [];
var exclude_routes_alert = [];

var pub;
var trip_select;
//for search within iso from coord 
var carehomegroup = new L.featureGroup;
var dentistgroup = new L.featureGroup; 
//second group is for the supply point search 
var carehome_supply = new L.featureGroup;
var lsoa = new L.FeatureGroup;







var catchment_size;
function load_points_within(isochrone_list,theTable){
    console.log(walking_geom);
    
    //console.log(JSON.parse(carehome_geom));
//let isochrone_parsee = JSON.parse(iso)

//sets the catchment size based on the selector value 
//here are current thoughts on how to implement this well, event listenr the slider and take the value of the slider and apply that ischrone catchment 
//to a global variable where this function can use it also make this function active everytime the slider is moved that way it will calculate the within statements for all pois again 



console.log(catchment_size)
console.log(pharmacies_geom)
console.log(gp_surg_geom)

    //alert("Isochrone complete" + "\nPararmaters selected:" + "\n" + document.getElementById('vns-select').value + "\n" + document.getElementById('vss-select').value + "\n" + document.getElementById("slider_value").value + "mins catchment" + "\n" + maxwalk_slider_value.value + "meters" + "\n" + "Routes excluded:" + exclude_routes_alert.toString() + "\n" + "Agencies excluded:" + exclude_agency_alert.toString() );


       // let public_check = JSON.parse(isochrone60.public_layer);
        //let all_check = $.extend(true, {},  public_check);
        //console.log(public_check);
console.log(busstops)
        var walk_within_catchment = turf.pointsWithinPolygon(JSON.parse(busstops),walking_geom);

        var public_within_catchment = turf.pointsWithinPolygon(JSON.parse(busstops),catchment_size);
        
        var carehome_within_catchment = turf.pointsWithinPolygon(JSON.parse(carehome_geom), catchment_size); 
        
        var supermarket_within_catchment = turf.pointsWithinPolygon(JSON.parse(supermarketgeom), catchment_size); 

        var dentist_within_catchement = turf.pointsWithinPolygon(JSON.parse(pharmacies_geom), catchment_size);
        
        var gp_within_catchment = turf.pointsWithinPolygon(JSON.parse(gp_surg_geom), catchment_size);
       
        var banks_within_catchment = turf.pointsWithinPolygon(JSON.parse(bank_geom), catchment_size);

        var schools_witihin_catchment = turf.pointsWithinPolygon(JSON.parse(school_geom), catchment_size);
       
        var postcode_within_catchment = turf.pointsWithinPolygon(JSON.parse(postcodes_geom), catchment_size);
       
       
       
        console.log(carehome_within_catchment); 
        console.log(supermarket_within_catchment);
        ////console.log(public_within_catchemnt);
        //var all_within_catchment = turf.pointsWithinPolygon(theTable, all_check);

        //saves the scores before, when the route is removed and comparing scores 
        

        if(exclude_route_php !== ''){
             
             school_before = school
             care_before = care/2
             superm_before = superm
             dentist_before = dentist
            postcode_before = postcode
             banks_before = banks
             gp_before = gp
             cumscore_before = ( school + care_before + superm + dentist + banks + gp)/7
        }else {
           
            school_before = 0
            care_before = 0
            superm_before = 0
            dentist_before = 0
           postcode_before = 0
            banks_before = 0
            gp_before =  0
            cumscore_before = 0
        }

        console.log(cumscore_before)

      
    school = 0
    pub = 0 ;
    care = 0;
    superm = 0;
    dentist = 0;
    postcode = 0;
    banks = 0;
    gp = 0;
    
    let supermarket_within = [];
    let school_within = [];
    let public_within = [];
    let carehome_within = [];
    let bank_within = [];
    let gp_within = [];
    let supermarket_within_sum = 0;
    let school_within_sum = 0
    let gp_within_sum = 0;
    let bank_within_sum = 0;
    let carehome_capacity_sum = 0;
    let pub_capacity_sum = 0;
    let dentist_within = []
    let dentist_capacity_sum = 0;
    let postcode_capacity_sum =0;
    let postcode_within =[];
   
    

    for (pub in public_within_catchment['features']) {
        public_within.push(public_within_catchment['features'][pub]['properties']['f1']);
        pub_capacity_sum = pub_capacity_sum + parseInt(public_within_catchment['features'][pub]['properties']['f4']);
        pub++;
    }

    console.log(carehome_within_catchment['features'])
    console.log(supermarket_within_catchment['features'])
    console.log(schools_witihin_catchment['features'])

    for (care in carehome_within_catchment['features']) {
        carehome_within.push(carehome_within_catchment['features'][care]['properties']['f2']);
        carehome_capacity_sum = carehome_capacity_sum + parseInt(carehome_within_catchment['features'][care]['properties']['f4']);
        care++;
    }
    console.log(care)
    for (superm in supermarket_within_catchment['features']) {
        supermarket_within.push(supermarket_within_catchment['features'][superm]['properties']['f2']);
        supermarket_within_sum = supermarket_within_sum + parseInt(supermarket_within_catchment['features'][superm]['properties']['f2'])
        superm++;
    }
    
    for (dentist in dentist_within_catchement['features']) {
        dentist_within.push(dentist_within_catchement['features'][dentist]['properties']['f2']);
        dentist_capacity_sum = dentist_capacity_sum + parseInt(dentist_within_catchement['features'][dentist]['properties']['f4']);
        dentist++;
    }

    for (postcode in postcode_within_catchment['features']) {
        postcode_within.push(postcode_within_catchment['features'][postcode]['properties']['f2']);
        postcode_capacity_sum = postcode_capacity_sum + parseInt(postcode_within_catchment['features'][postcode]['properties']['f4']);
        postcode++;
    }

    for (banks in banks_within_catchment['features']) {
         bank_within.push(banks_within_catchment['features'][banks]['properties']['f2']);
         bank_within_sum = bank_within_sum + parseInt(banks_within_catchment['features'][banks]['properties']['f4']);
         banks++;
     }
    
     for (gp in gp_within_catchment['features']) {
        gp_within.push(gp_within_catchment['features'][gp]['properties']['f2']);
         gp_within_sum = gp_within_sum + parseInt(gp_within_catchment['features'][gp]['properties']['f4']);
        gp++;
     }
 
     for (school in schools_witihin_catchment['features']){
        school_within.push(schools_witihin_catchment['features'][school]['properties']['f2']);
        school_within_sum = school_within_sum + parseInt(schools_witihin_catchment['features'][school]['properties']['f4']);
        school++;
     }


        chart1.destroy();
        console.log(gp)
        console.log(banks)
        var care3 = care/2
        var care2 = care/2



     if(exclude_route_php !== ''){
        console.log('removed route')
        route_removed_care = care2
        route_removed_school = school
        route_removed_gp = gp
        route_removed_banks = banks
        route_removed_postcode = postcode
        route_removed_dentist = dentist
        route_removed_superm = superm
        route_removed_cumscore = cumscore_before
     }else {

        route_removed_banks = 0
        route_removed_care = 0
        route_removed_cumscore = 0
        route_removed_dentist = 0
        route_removed_postcode = 0 
        route_removed_school = 0
        route_removed_superm = 0


     }
     var poiyear = document.getElementById('year-select').value
     

     if (poiyear == 2019){
        console.log(document.getElementById('year-select').value)
        console.log('2019')
        care_2019 = care2
        school_2019 = school
        gp_2019 = gp
        banks_2019 = banks
        postcode_2019 = postcode
        dentist_2019 = dentist
        superm_2019 = superm
     }else if (poiyear == 2021){
        console.log(document.getElementById('year-select').value)
        console.log('2021')
        care_2021 = care2
        school_2021 = school
        gp_2021 = gp
        banks_2021 = banks
        postcode_2021 = postcode
        dentist_2021 = dentist
        superm_2021 = superm
     }else if (poiyear == 2022){
        console.log(document.getElementById('year-select').value)
        console.log('2022')
        school_2022 = school 
        care_2022 = care2
        gp_2022 = gp
        banks_2022 = banks
        postcode_2022 = postcode
        dentist_2022 = dentist
        superm_2022 = superm 
     }else if (poiyear == 2023){
        console.log(document.getElementById('year-select').value)
        console.log('2023')
        school_2023 = school 
        care_2023 = care2
        gp_2023 = gp
        banks_2023 = banks
        postcode_2023 = postcode
        dentist_2023 = dentist
        superm_2023 = superm 

     }


     var cumscore = (superm + care2 + dentist + banks + gp + school)/7
     
     var cumscore_2019 = (superm_2019 + care_2019 + dentist_2019 + banks_2019 + gp_2019 + school_2019)/7
     var cumscore_2021 = (superm_2021 + care_2021 + dentist_2021 + banks_2021 + gp_2021 + school_2021)/7
     var cumscore_2022 = (superm_2022 + care_2022 + dentist_2022 + banks_2022 + gp_2022 + school_2022)/7
     var cumscore_2023 = (superm_2023 + care_2023 + dentist_2023 + banks_2023 + gp_2023 + school_2023)/7


     console.log(cumscore)

    const labels = ['supermarkets', 'Pharmacies', 'Banks', 'Doctors', 'Care Homes', 'Schools', 'Opp score'];
    const data = {
        labels: labels,
        datasets: [
            {
            label: '2019 POI access',
            data: [superm_2019, dentist_2019, banks_2019, gp_2019, care_2019, school_2019, cumscore_2019], 

            backgroundColor: [
                '#04AA6D'
                

            ],
            borderColor: [
                
                'white'
            ],
            borderWidth: 1
        }, 
        {



            label: '2021 POI access',
            data: [superm_2021, dentist_2021, banks_2021, gp_2021, care_2021, school_2021, cumscore_2021], 

            backgroundColor: [
                '#9B111E'
                

            ],
            borderColor: [
                
                'white'
            ],
            borderWidth: 1



        }, {
            label: '2022 POI access',
            data: [superm_2022, dentist_2022, banks_2022, gp_2022, care_2022, school_2022, cumscore_2022], 

            backgroundColor: [
                '#E1CC4F'
                

            ],
            borderColor: [
                
                'white'
            ],
            borderWidth: 1





        },{
            label: '2023 POI access',
            data: [superm_2023, dentist_2023, banks_2023, gp_2023, care_2023, school_2023, cumscore_2023], 

            backgroundColor: [
                '#48b0ea'
                

            ],
            borderColor: [
                
                'white'
            ],
            borderWidth: 1





        },
        {
            label: 'Score before removed',
            data: [superm_before, dentist_before, banks_before, gp_before, care_before, school_before, cumscore_before], 

            backgroundColor: [
                '#924E7D'
                

            ],
            borderColor: [
                
                'white'
            ],
            borderWidth: 1
        },
    ]
    };
        chart1 = new Chart('chartCanvas', {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        
                        
                    }
                }, 
    

            },
        });
    
    



//console.log(pub);
    let all_within = carehome_within 
    //console.log(carehome_within);
    console.log(postcode_within)
    let occurrences = all_within.reduce(function (acc, curr) {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    console.log(occurrences);
    var stop_routes_json_routes = null;
    var stop_routes_json_names = null;
    


    function markerClick(marker) {
        $('#trip-select').empty();

        var dayofweek = document.getElementById('vns-select').value
        var timeofday = document.getElementById('vss-select').value
        var catchment_value = document.getElementById("slider_value").value

        var trip_year = document.getElementById("year-select").value
        //console.log(marker);
        let post_stop_data = {
            stop_id: "1:" + marker.feature.properties.f3
        };

        let post_stop_data_info = {
            stop_id: marker.feature.properties.f3,
            day: dayofweek,
            time: timeofday,
            catchment_value: catchment_value,
            trip_year: trip_year

        }




        $.ajax({
            'async': false,
            'type': "POST",
            'global': false,
            'datatype': 'html',
            'url': "get_serviceId.php",
            'data': post_stop_data_info,
            'success': function (data) {
                theTable = data;
                console.log(theTable)
            }

        });


        var trips_list = []
var trip_year = document.getElementById("year-select").value
console.log(trip_year)
        var stop_info = JSON.parse(theTable);
        console.log(stop_info);
        //console.log(stop_info);
        for (var i = 0; i < stop_info.stop_times.length; i++) {
                var trip_information = [];
                var trip = stop_info.stop_times[i];
                var trip_id = trip.trip_id;
                trip_information.push(trip_id);
                var post_trip_id = '1:' + trip_id;

                let trip_info = {
                    trip_id: post_trip_id,
                    trip_year: trip_year
                };


            $.ajax({
                'async': false,
                'type': "POST",
                'global': false,
                'datatype': 'html',
                'url': "geoline.php",
                'data': trip_info,
                'success': function (data) {
                        trip_stops = JSON.parse(data);
                        console.log(trip_stops);
                        var trip_geoline = trip_stops.message.Geoline;
                        console.log(trip_geoline);
                        var trip_route_id = trip_stops.message.route_id;
                        var trip_short_name = trip_stops.message.short_name;
                        var trip_long_name = trip_stops.message.long_name;
                        console.log(trip_geoline, trip_route_id, trip_short_name, trip_long_name);
                        trip_information.push(trip_geoline);
                        //console.log(trip_geoline)

                        var el = document.createElement('option'); // creates a new option
                        //applies name to newly created option
                        el.textContent = trip_long_name;

                        //applies id to option (id and value are the same)
                        el.id = trip_route_id;
                        //console.log(el.id, el.value, el.textContent);
                        //adds the new option to select1 (the list for agencies)
                        trip_select = document.getElementById('trip-select')
                        trip_select.appendChild(el);

                        console.log(typeof trip_geoline);


                    // var trip_linestring = [{
                    //         "type": "lineString",
                    //         "coordinates": [trip_coordinates]
                    //     }]


                    var polyline = L.polyline(trip_geoline, {color: 'red'})
                    polyline.addTo(polygroup);
                    polygroup.addTo(map)


                }
            });


            trips_list.push(trip_information);
        }

        console.log(trips_list);
//
// //todo work on creating a for each loop to isolate the routes then all trips within
//         //todo apply a time frame first time instance and last
//         var arr = [];
//         //apply a loop that searches for the service id from postgres
//         for (var i = 0; i < trips_list.length; i++) {
//             var routes = trips_list[i];
//             //console.log(routes);
//             var long_name = routes.long_name;
//             var geoline = routes.trip_id;
//             arr.push(routes.arrival_time)
//             //name of agency
//             //id of agency
//             var el = document.createElement('option'); // creates a new option
//             //applies name to newly created option
//             el.textContent = long_name;
//             //appleis value to option
//             el.value = geoline;
//             //applies id to option (id and value are the same)
//             el.id = trip_id;
//             //console.log(el.id, el.value, el.textContent);
//             //adds the new option to select1 (the list for agencies)
//             trip_select = document.getElementById('trip-select')
//             trip_select.appendChild(el);
//         }
}












    var walkingl_layer = L.geoJSON(walking_geom, {style: walk_style})
    walkingl_layer.id = 'walkingl'

    var walk_bus_layer = L.geoJSON(walk_within_catchment, {
        pointToLayer: function (feature, latlng) {
            //Icon styles
            return L.circleMarker(latlng, {radius: 10, color: 'white' , opacity: 1})
        }
    } )

    var pub_layer = L.geoJSON(public_within_catchment, {
            pointToLayer: function (feature, latlng) {
                //Icon styles
                return L.circleMarker(latlng, {radius: 10, color: 'red' , opacity: 1})
            }
        }
    );

    var school_layer = L.geoJSON(schools_witihin_catchment, {
        pointToLayer: function(feature, latlng){
            return L.marker(latlng, {icon: school_icon})
        }
    })
    //creates pharmacies icon dentist = pharmacie idk why ask me when im awake 
    var pharmacy_layer = L.geoJSON(dentist_within_catchement, {
pointToLayer: function(feature, latlng){
return L.marker(latlng, {icon: pharmacy_icon})
}
    })

    console.log(banks_within_catchment);
     var banklayer = L.geoJSON(banks_within_catchment, {
         pointToLayer: function(feature, latlng){
             return L.marker(latlng, {icon: bank_icon})
         }
     });
        console.log(gp_surg_icon)
        console.log(gp_within_catchment)
        var doctor_layer = L.geoJSON(gp_within_catchment, {
        pointToLayer:function(feature, latlng){
        return L.marker(latlng, {icon: gp_surg_icon})
}

     });

        var supermarket_layer = L.geoJSON(supermarket_within_catchment, {
            pointToLayer: function(feature, latlng){
                return L.marker(latlng, {icon: supermarket_icon})
            }
        })

    // creates carehome icon 
    //creates carehome geojson as a marker and applies icon 
    var carehome_layer = L.geoJSON(carehome_within_catchment, {
            pointToLayer: function(feature, latlng) {
                //carehome icon style 
                return L.marker(latlng, {icon: carehome_icon2})
            }
    })

    carehome_layer.on("click", function (event) {
        var clicked_mark = event.latlng;
        supplypointclick(clicked_mark); 

    })


    carehome_layer.id = 'carehome_layer';
    carehomegroup.addLayer(carehome_layer);
    //section for adding carehome icons to the map if the button is checked 
    if (carehome_element.checked == true){
        carehomegroup.eachLayer(function(layer){
            if(layer.id === 'carehome_layer'){
                var carehome = layer 
                if(map.hasLayer(layer) == false){
                    map.addLayer(carehome_layer);
                }
            }
        })
    }

    school_layer.id = 'school_layer';
    school_group.addLayer(school_layer);
    if(school_element.checked == true){
        school_group.eachLayer(function(layer){
            if(layer.id ==='school_layer'){
                var school = layer
                if(map.hasLayer(layer)==false){
                    map.addLayer(school_layer);
                }
            }
        })
    }






    supermarket_layer.id = 'supermarket_layer';
    supermarket_group.addLayer(supermarket_layer);
    if (supermarket_element.checked == true){
        supermarket_group.eachLayer(function(layer){
            if (layer.id === 'supermarket_layer'){
                var supermarketadd = layer
                if (map.hasLayer(layer)== false){
                    map.addLayer(supermarket_layer)
                }
            }
        })
    }

    //dentist if 
    pharmacy_layer.id = 'pharmacy_layer'
    dentistgroup.addLayer(pharmacy_layer);
    if (pharmacy.checked ==true){
        dentistgroup.eachLayer(function(layer){
            if(layer.id ==='pharmacy_layer'){
                var pharmacy = layer 
                if (map.hasLayer(layer) == false){
                    map.addLayer(pharmacy_layer)
                }
            }
        })
    }

    banklayer.id = 'bank_layer'
    bankgroup.addLayer(banklayer);
    if (bank_poi.checked == true){
        bankgroup.eachLayer(function(layer){
            if (layer.id === 'bank_layer'){
                var banks_layer = layer
                if (map.hasLayer(layer) == false){
                    map.addLayer(banklayer)
                }
            }
        })
    }
  

    
    



    doctor_layer.id = 'gpsurgery'
    gpgroup.addLayer(doctor_layer);
    if (gp_surg.checked == true){
        console.log("checked")
        gpgroup.eachLayer(function(layer){
            if (layer.id == ' gpsurgery'){
                var gps = layer
                console.log(supplylayer_icon)
                if (map.hasLayer(layer) == false){
                    console.log("added to map")
                    map.addLayer(doctor_layer)
                }
            }
        })
    }


    pub_layer.on("click", function (event){
        var clicked_marker = event.layer;
        markerClick(clicked_marker);
        trip_select.onchange = function (){
            banned_trips = $('#trip-select').select2('data')
            console.log( banned_trips)
        }
    });

    pub_layer.id = 'pub_layer';
    //console.log(pub_layer);
    bus_icons.addLayer(pub_layer)
    //Transportbus.addEventListener('change', function busclick(a) {
        if (Transportbus.checked == true) {
            //draws isochrone for walking 2019 (map1)
            bus_icons.eachLayer(function (layer) {
                if (layer.id === 'pub_layer') {
                    var pub = layer

                    if (map.hasLayer(layer) == false) {
                        //console.log(true)

                        clusterpub.addLayer(pub);
                       // map.addLayer(clusterpub);
                    }
                }
            })
        }

        bus.addLayer(walkingl_layer)
        walk_bus_layer.id ='busstop'
        bus.addLayer(walk_bus_layer);
        walk_bus_layer.on("click", function (event){
            var clicked_marker = event.layer;
            markerClick(clicked_marker);
            trip_select.onchange = function (){
                banned_trips = $('#trip-select').select2('data')
                console.log( banned_trips)
            }
        });

       
        walk_bus_layer.id = 'walk_pub_layer';
        bus_icons.addLayer(walk_bus_layer)
        if (Transportbus.checked ==true) {
            bus_icons.eachLayer(function (layer) {
                if (layer.id == 'walk_pub_layer') {
                    var walk_public = layer
                    console.log(layer)
                    if (map.hasLayer(layer) == false) {
                        //console.log(true)
                        map.addLayer(walk_public);
                    }
                }  })
        }

        if (Transportbus.checked == true){
            bus.eachLayer(function (layer){
                if (layer.id =='walking_layer'){
                    var walking = layer
                    console.log(layer)
                    if (map.hasLayer(layer)==false){
                        map.addLayer(walking);
                    }
                }
            })
        }






        //adds markers from turf calculation for 2019 (map1)
        if (Transportbus.checked ==true) {
            bus.eachLayer(function (layer) {
                if (layer.id == 'public_layer') {
                    var public = layer
                    console.log(layer)
                    if (map.hasLayer(layer) == false) {
                        //console.log(true)
                        map.addLayer(public);
                    }
                }
            })
        }
        bus.eachLayer(function (layer) {
            if (Transportbus.checked == false) {
                if (layer.id == 'public_layer') {
                    var public = layer
                    map.removeLayer(public);
                    clusterpub.clearLayers();
                }
            }
        })

    //});



}

document.getElementById('Save').addEventListener("click", function(){
    var filename = 'polygon'
    var filename2 = 'polyline'
    var geoJSON = bus.toGeoJSON();
    var geoJSON2 = polygroup.toGeoJSON();
    var file = filename + '.geojson';
    var file2 = filename2 + '.geojson'
    saveAs(new File([JSON.stringify(geoJSON)], file, {
      type: "text/plain;charset=utf-8"
    }), file);

    saveAs(new File([JSON.stringify(geoJSON2)], file2, {
        type: "text/plain;charset=utf-8"
      }), file);
})


