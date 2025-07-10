
var map = L.map('map').setView([51.5343, -3.2773], 11.3);
var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
map.doubleClickZoom.disable();
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
var poi_selected
let pharm = document.getElementById("pharmacy")
console.log(pharm)
pharm.addEventListener("click", function(){
//supplylayer = pharmacies_geom; 
supplylayer_icon = pharmacy_icon;
poi_selected = 'pharm'
})

let school_element = document.getElementById("schools")
school_element.addEventListener("click", function(){
    //supplylayer = school_geom;
    supplylayer_icon = school_icon
    poi_selected = 'school'
})

let supermarket_element = document.getElementById("super_markets")
supermarket_element.addEventListener("click", function(){
//supplylayer = supermarketgeom;
supplylayer_icon = supermarket_icon
poi_selected = 'supermarket'
})


let carehome_element = document.getElementById("carehome_button")
carehome_element.addEventListener("click", function(){
    //supplylayer = carehome_geom;
    supermarket_icon = carehome_icon2
    poi_selected = 'carehome'
})
let gp_surg = document.getElementById("gp_surgeries")
gp_surg.addEventListener("click" , function(){
    //supplylayer = gp_surg_geom;
    supplylayer_icon = gp_surg_icon;
    poi_selected = 'gpsurg'
})

let bank_poi = document.getElementById("banks")
bank_poi.addEventListener("click", function(){
    //supplylayer = bank_geom;
    supplylayer_icon = bank_icon;
    poi_selected = 'bank'
})

//var supplylayer
var supplylayer_icon
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
var select1 = document.getElementById("eptc-select");
var routeselect = document.getElementById("vrs-select");

//adding geolocator to map
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    autoClose: true,
    showPopup: true,
});
map.addControl(search);
var addedmarkers = new L.featureGroup;
var form_string

var currentMarker;
var fourm 
//custom vars
var clickedcoords = [];
//sql feature calls and variables 
var fTable = 'geoupload.userfeatures';
var fColumn = ["name","address", "descritpion"];
var fGeom = 'geom';
//geojson object builder 
var geojsonobject = {};
//Function that closes modal


var drawcontrol = new L.Control.Draw({
    draw: {
        postion: 'topleft',
        polygon: false,
        polyline:false,
        circle: false,
        rectangle: false,
        
    }
})

map.addControl(drawcontrol);



map.on('draw:drawstop', function (event){
    layer = event.layer 

    console.log(layer)

    console.log(event)
    modal.style.display = "block";
	console.log('Clicked at ')
});
var coords
map.on(L.Draw.Event.CREATED, function (e) {
    var layer = e.layer;
     coords = layer['_latlng']
    console.log(layer['_latlng'])
});
function closeModal () {
	modal.style.display = "none";
}
//save data to database
function passData() {
	var featureInput_name, featureInput_desc, featureInput_addr, featureInput_lat, featureInput_lon, featureInput_purp
	if(document.input_new_feature.F_Name.value == "" || document.input_new_feature.F_Address.value == "" || document.input_new_feature.F_Desc.value == "") {
        alert("please enter Fields");
        return false;
    } 
	else {
		featureInput_name = document.getElementById('F_Name');//passes name  to a useable variable
		featureInput_name = featureInput_name.value;
		featureInput_name = featureInput_name.replaceAll("'","");
		console.log(featureInput_name);
		featureInput_addr = document.getElementById('F_Address');//passes address  to a useable variable
		featureInput_addr = featureInput_addr.value;
		featureInput_addr = featureInput_addr.replaceAll("'","");
		console.log(featureInput_addr);
		featureInput_desc = document.getElementById('F_Desc');//passes description  to a useable variable
		featureInput_desc = featureInput_desc.value;
		featureInput_desc = featureInput_desc.replaceAll("'","");
		console.log(featureInput_desc);
		featureInput_lon = coords['lng'];
		console.log(featureInput_lon);
		featureInput_lat = coords['lat'];
		console.log(featureInput_lat);
		featureInput_purp = document.getElementById('F_Purpose').value; //Gets feature purpose
		console.log(featureInput_purp);
		$.ajax({
			url: 'addfeature.php',
			type: 'POST',
			data:{
				UserName: featureInput_name,
				UserAddress: featureInput_addr,
				UserDescription: featureInput_desc,
				UserPurpose: featureInput_purp,
				UserLong: featureInput_lon,
				UserLat: featureInput_lat
			},
			success: function(dataResult){
				var dataResult = JSON.parse(dataResult)
				if(dataResult.statusCode == 200) {
					alert('Feature Added Successfully')
					//close after data passed
					closeModal();
				}
				else {
					alert('Something Bronk')
				}
			}
		})
	}
	
	
}

var popContent

//Create GeoJSON from data response
function createGeojson(arrayofdata) {
	geojsonobject['type'] = "FeatureCollection"
	var geojsonFeatures = []
	//loop for each item in the array
	for(i=0;i<arrayofdata.length;i++) {
		var featureObj = {}
		//set object type as feature
		featureObj['type'] = 'Feature'
		//assign properties of the geoJson
		featureObj['properties'] = {
			'address':arrayofdata[i].address,
			'description':arrayofdata[i].description,
			'name':arrayofdata[i].name,
			'purpose':arrayofdata[i].purpose
		}
		//parse geometry so it appears as json format not a string
		featureObj['geometry'] = JSON.parse(arrayofdata[i].st_asgeojson)
		//add feature to geojsonFeatures
		geojsonFeatures.push(featureObj)
	}
	//create an object with the returned features
	geojsonobject['features'] = geojsonFeatures
}
//creating a function for closing the overlay
var currentMarker;
//popup click displays feature
map.on('click', function(event){
    
    currentMarker = L.marker(event.latlng, {
        onEachFeature: function (feature,layer){

            let PopCoord = coords;
            let clickedFeatureName = (feature.get('name'));
            let clickedFeatureAddr = (feature.get('address'));
            let clickedFeatureDesc = (feature.get('description'));
            let clickedFeaturePurp = (feature.get('purpose'));
            
            popContent = '<h3>' + clickedFeatureName +'</h3>';
            popContent += '<p> Address: ' + clickedFeatureAddr + '<br>Description: ' + clickedFeatureDesc + '<br> Purpose: ' + clickedFeaturePurp;
            content.innerHTML = popContent;
            console.log(clickedFeatureName, clickedFeatureAddr, clickedFeatureDesc, clickedFeaturePurp);
           
        }
    })

     
     console.log(popContent)
     currentMarker.bindPopup(popContent, {
        keepInView: true, 
        closeButton: false
     }).openPopup();
	
});