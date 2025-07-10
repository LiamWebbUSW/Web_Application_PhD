var map = L.map('map').setView([51.5343, -3.2773], 11.3);
var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
window.onload = genotp_stops();
map.doubleClickZoom.disable();
$(document).ready(function() {
    $('.select2').select2();
    $("#input-panel-dropdown").draggable();
    $("output-panel-chart").draggable();
    $("Temporal-chart").draggable();
    $("#calender-form").draggable();
    $("#trip-form").draggable();
    $("#route-form").draggable();
    $("#agency-form").draggable();
    $("#stop-form").draggable();
});

$(".select2").select2({
    tags: true,
    tokenSeparators: [',', ' ']
})
var poi_selected
var arrtable
var points = ''
var obj = {}
var data_string = ''
var stop_seq = ''

//styles 

let iso_100 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#ffe0a5'};
let iso_90 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#ffcb69'};
let iso_80 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#ffa600'};
let iso_70 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#ff7c43'};
let iso_60 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#f95d6a'};
let iso_50 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#d45087'};
let iso_40 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#a05195'};
let iso_30 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#665191'};
let iso_20 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#2f4b7c'};
let iso_10 = {color: '#BDBDC3', weight: 3, fillOpacity: 0.35, fillColor: '#003f5c'};

//let r5calc = document.getElementById("r5calc")

//load in the POI for cumulative oppurtunity 
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

var polyline2 = new L.FeatureGroup();

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

//end of loading POI


//var supplylayer


var iso_set = new L.FeatureGroup();

//adding geolocator to map
const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
    autoClose: true,
    showPopup: true,
});
map.addControl(search);
var data_string = ''
var form_string
function gen_R() {
    console.log(coords)
    var datacord = {lat: coords.lat, lon: coords.lng}
    $.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': "testing.php",
        'data': datacord,
        'success': function (data) {
            var geojson_url = 'temp.geojson'
            $.getJSON("temp.geojson", function(data) {
                 data_string = data
                console.log(data_string)



                console.log(data_string)
                var features = data_string['features']
                console.log(data_string['features']['0'])
                var iso = features
                var isochrone100 = iso[0]
                var isochrone90 = iso['1']
                var isochrone80 = iso['2']
                var isochrone70 = iso['3']
                var isochrone60 = iso['4']
                var isochrone50 = iso['5']
                var isochrone40 = iso['6']
                var isochrone30 = iso['7']
                var isochrone20 = iso['8']
                var isochrone10 = iso['9']
                console.log(isochrone60);
                var geojson = L.geoJSON((isochrone60)).addTo(iso_set);
            
            
                let public_layer_100 = L.geoJSON((isochrone100), {style: iso_100});
                let public_layer_90 = L.geoJSON((isochrone90), {style: iso_90});
                let public_layer_80 = L.geoJSON((isochrone80), {style: iso_80});
                let public_layer_70 = L.geoJSON((isochrone70), {style: iso_70});
                let public_layer_60 = L.geoJSON((isochrone60), {style: iso_60});
                let public_layer_50 = L.geoJSON((isochrone50), {style: iso_50});
                let public_layer_40 = L.geoJSON((isochrone40), {style: iso_40});
                let public_layer_30 = L.geoJSON((isochrone30), {style: iso_30});
                let public_layer_20 = L.geoJSON((isochrone20), {style: iso_20});
                let public_layer_10 = L.geoJSON((isochrone10), {style: iso_10});
            
                //public_layer_100.addTo(iso_set);
                // public_layer_90.addTo(iso_set);
                // public_layer_80.addTo(iso_set);
                // public_layer_70.addTo(iso_set);
                 //public_layer_60.addTo(iso_set);
                // public_layer_50.addTo(iso_set);
                // public_layer_40.addTo(iso_set);
                // public_layer_30.addTo(iso_set);
                // public_layer_20.addTo(iso_set);
                // public_layer_10.addTo(iso_set);




            });
        



        }
    });
  


    iso_set.addTo(map)





}

// var stops = new L.FeatureGroup();
 var stops_style = {radius: 10, color: 'orange' , opacity: 0.6}
// function genotp_stops() {
//     var otp_stops = null;
//     $.ajax({
//         'async': false,
//         'type': "GET",
//         'global': false,
//         'datatype': 'html',
//         'url': "2021_stops.php",
//         'data': '',
//         'success': function (data) {
//             otp_stops = data
//             otp_stops_json = JSON.parse(otp_stops)
//             console.log(otp_stops_json)
//         }
//     });
//    // var stops1 = JSON.parse(otp_stops);

//     let stops_2021 = L.geoJSON((otp_stops_json), {style: stops_style})
    
//     stops_2021.addTo(map);
//     //console.log(stops);
// }
var geoline = []
var arr =[]
var stoparr =[]
var routearr = []
var triparr = []
var agencyarr = []
var stoparr = []
var calenderarr = []
var k;
var stop_time_string = []
var stop_seq = 1
var time_point = 1
var stops = new L.FeatureGroup(); 




function genotp_stops(){
// console.log('here')
// var wfs_root = 'http://192.168.0.40:8080/geoserver/ows';
// //wfs parameters
// var WFSparam = {
// 	service:'WFS',
// 	version:'1.0.0',
// 	request:'GetFeature',
// 	typeName:'Liam_work:2021_stops',
// 	outputFormat: 'text/javascript',
// 	format_options:'callback: getJson',
// 	srsName: 'EPSG:4326'
// };


// //complete URL to geoServer
// var GeoURL = wfs_root + L.Util.getParamString(WFSparam);
// console.log(GeoURL)

dbtable = '2021_stops.php'


// if (year.value == 2022){
//     dbtable = 'gtfs_2022.stops'
// }else if (year.value == 2021){
//     dbtable = 'gtfs_2021.stops'
// }else if (year.value == 2019){
// dbtable = 'gtfs_2019.stops'
// }else if (year.value == 2023){
// dbtable = 'gtfs_2023.stops'
// }
var post_data = { Table: dbtable}  
//Ajax script to get the WFS data
	$.ajax({
        'async': false,
        'type': "POST",
        'global': false,
        'datatype': 'html',
        'url': dbtable,
        'data': '',
        'success': ''
	}).done(function(data) {

      

		ire_pubs = L.geoJson(JSON.parse(data), {
			pointToLayer: function(feature, latlng) {
                
			return L.circleMarker(latlng, stops_style)
			},
			//ire_pubs popups
			onEachFeature: function(feature, layer) {
  
				popupOptions = {maxWidth: 300, closeOnEscapeKey: true, closeOnClick: true, autoClose:true};
				var pophtml='<H2>Bus entry info </H2><form role="form" id="form" <br>' +
                '<div class="form-group2">'+
                    '<label class="control-label col-10"><strong>Trip ID</strong></label>'+ "<br>" +
                    '<input type="text" placeholder="Insert a Trip ID" id="trip_id" name="trip_id" class="form-control"/>'+ 
                '</div>'+
          
            '<div class="form-group2">'+
                    '<label class="control-label col-sm-10"><strong>Arrival Time</strong></label>'+ "<br>" +
                    '<input type="text" placeholder="Input time that Bus will arrive at bus stop" id="arr_time" name="arr_time" class="form-control"/>'+ 
                '</div>'+
                
                '<div class="form-group2">'+
                '<label class="control-label col-sm-10"><strong>Departure Time</strong></label>'+ "<br>" +
                '<input type="text" placeholder= "Input Time that bus will leave the bus stop" id="dep_time" name="dep_time" class="form-control"/>'+ 
            '</div>'+
          
                '<div class="form-group2">'+
                    '<label class="control-label col-sm-10"><strong>Stop ID</strong></label>'+ "<br>" +
                    '<input type="text" id="stop_id" name="stop_id" class="form-control"/>'+ 
                '</div>'+
          
                '<div class="form-group2">'+
                    '<label class="control-label col-sm-10"><strong>Stop Sequence</strong></label>'+ "<br>" +
                    '<input type="text" id="stop_seq" name="stop_seq" class="form-control"/>'+ 
                '</div>'+
          
                '<div class="form-group2">'+
                    '<label class="control-label col-sm-10"><strong>Time Point</strong></label>'+ "<br>" +
                    '<input type="text" id="time_point" name="time_point" class="form-control"/>'+ 
                '</div>'+

                  '<div class="form-group3">'+
                      '<div style="text-align:center;" class="col-xs-11"><button style="text-align:center;" id="submit" value="submit" >Submit</button></div>'+
                '</div>'+ "<br>" +
          
                       '</form>' 
                       
				
			layer.bindPopup(pophtml, popupOptions);
			}
		});

        var stop_times_arr = []
        
        ire_pubs.on("click", function(event){

            var click_value = ''
            var stop_time_string = []

            clicked_marker = event.layer
            lat_click = event.latlng.lat
            lon_click = event.latlng.lng
          

            const formEL = document.querySelector('form');
            
            $("#form").submit(function(e){
                console.log(document.querySelector('form'));
                e.preventDefault();
                console.log("didnt submit");
                const formData = new FormData(formEL);
                const data = Object.fromEntries(formData);
                console.log(data)
                stop_seq++
                console.log(time_point)
                data_string = JSON.stringify(Object.fromEntries(formData));
                console.log(data_string);
            
                
                arr.push(data);
                var tablecontent = document.getElementById('tableData').innerHTML
                 k = '<tbody>'
                    k+= '<tr>';
                    k+= '<td>' + data.trip_id + '</td>';
                    k+= '<td>' + data.arr_time + '</td>';
                    k+= '<td>' + data.dep_time + '</td>';
                    k+= '<td>' + data.stop_id + '</td>';
                    k+= '<td>' + data.stop_seq + '</td>';
                    k+= '</tr>';
                
                k+='</tbody>';
                tablecontent +=k
                document.getElementById('tableData').innerHTML = tablecontent;


                
                //var coords = event.latlng.lat + ',' + event.latlng.lng
                busstopcord = [event.latlng.lat, event.latlng.lng]
                console.log(busstopcord);
                geoline.push(busstopcord);
                console.log(geoline);
              
               
                // points += '['+coords+']'
                // console.log(points)
                // var plz = '[' + points + ']'
                
                Object.assign(obj, geoline)
            
                console.log(obj);
                L.polyline(geoline, {color: 'red'}).addTo(map);
                var polyline = L.polyline(obj, {color: 'red'})
                polyline.addTo(polyline2)
                polyline.addTo(map)
                console.log(polyline)

            })
            
            
            console.log(clicked_marker)
            console.log("stop_id: " + clicked_marker.feature.properties["f1"])
            click_value = clicked_marker.feature.properties["f1"] 
            console.log(click_value)
            stop_time_string.push(click_value)
            console.log(stop_time_string)
            console.log(stop_seq)
            document.getElementById('stop_seq').value = stop_seq
            document.getElementById('time_point').value = time_point
            //document.getElementById('lat').value = lat_click;
            //document.getElementById('lon').value = lon_click;
            document.getElementById('stop_id').value = click_value
            console.log(arr)

        })

        var markers = new L.MarkerClusterGroup();
		ire_pubs.addTo(markers)
        markers.addTo(map)





        
	})
}









var coords = ''
var currentMarker;
var fourm 


map.on("dblclick", function(event){
    console.log("dbcliked")
    var dblclicklat = event.latlng.lat
    var dblclicklon = event.latlng.lng
    
    dbclickmkr = L.circleMarker(event.latlng,  {
        radius: 10, color: 'orange' , opacity: 0.6
    })
    
    var popupOptions = {maxWidth: 300, closeOnEscapeKey: true, closeOnClick: true, autoClose:true};
    var pophtml='<H2>Create a new bus stop</H2><form role="form" id="form" <br>' +
    '<div class="form-group2">'+
        '<label class="control-label col-10"><strong>Trip ID</strong></label>'+ "<br>" +
        '<input type="text" placeholder="Insert a Trip ID" id="trip_id" name="trip_id" class="form-control"/>'+ 
    '</div>'+

'<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Arrival Time</strong></label>'+ "<br>" +
        '<input type="text" placeholder="Input time that Bus will arrive at bus stop" id="arr_time" name="arr_time" class="form-control"/>'+ 
    '</div>'+
    
    '<div class="form-group2">'+
    '<label class="control-label col-sm-10"><strong>Departure Time</strong></label>'+ "<br>" +
    '<input type="text" placeholder= "Input Time that bus will leave the bus stop" id="dep_time" name="dep_time" class="form-control"/>'+ 
'</div>'+

    '<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Stop ID</strong></label>'+ "<br>" +
        '<input type="text" id="stop_id" name="stop_id" class="form-control"/>'+ 
    '</div>'+

    '<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Stop Sequence</strong></label>'+ "<br>" +
        '<input type="text" id="stop_seq" name="stop_seq" class="form-control"/>'+ 
    '</div>'+

    '<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Time Point</strong></label>'+ "<br>" +
        '<input type="text" id="time_point" name="time_point" class="form-control"/>'+ 
    '</div>'+

    '<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Stop Code</strong></label>'+ "<br>" +
        '<input type="text" id="stop_code" name="stop_code" class="form-control"/>'+ 
    '</div>'+

    '<div class="form-group2">'+
        '<label class="control-label col-sm-10"><strong>Stop name</strong></label>'+ "<br>" +
        '<input type="text" id="stop_name" name="stop_name" class="form-control"/>'+ 
    '</div>'+

      '<div class="form-group3">'+
          '<div style="text-align:center;" class="col-xs-11"><button style="text-align:center;" id="submit" value="submit" >Submit</button></div>'+
    '</div>'+ "<br>" +

           '</form>' 


           dbclickmkr.bindPopup(pophtml, popupOptions).openPopup();
           dbclickmkr.on("click", function(event){

            var click_value = ''
            var stop_time_string = []
    //tomoz make the same thing as bus stop clicks however when dbclick you make new bus stops as well as the route 
        lat_click = event.latlng.lat
        lon_click = event.latlng.lng
      

        const formEL = document.querySelector('form');
        
        $("#form").submit(function(e){
            console.log(document.querySelector('form'));
            e.preventDefault();
            console.log("didnt submit");
            const formData = new FormData(formEL);
            console.log(formData)
            console.log(formEL)
            const data = Object.fromEntries(formData);
            const data2 = Object.fromEntries(formData);
            delete data2.arr_time 
            delete data2.dep_time
            delete data2.trip_id 
            delete data2.stop_seq
            delete data2.time_point
            Object.assign(data2, {stop_lon: dblclicklon})
            Object.assign(data2, {stop_lat: dblclicklat})
            console.log(data2)
            stop_seq++
            console.log(time_point)
            data_string = JSON.stringify(Object.fromEntries(formData));
            console.log(data_string);
        
            console.log(data.stop_id)
            stoparr.push(data2)
            arr.push(data);

           
            var tablecontent = document.getElementById('tableData').innerHTML
             k = '<tbody>'
                k+= '<tr>';
                k+= '<td>' + data.trip_id + '</td>';
                k+= '<td>' + data.arr_time + '</td>';
                k+= '<td>' + data.dep_time + '</td>';
                k+= '<td>' + data.stop_id + '</td>';
                k+= '<td>' + data.stop_seq + '</td>';
                k+= '</tr>';
            
            k+='</tbody>';
            tablecontent +=k
            document.getElementById('tableData').innerHTML = tablecontent;


            
            //var coords = event.latlng.lat + ',' + event.latlng.lng
            busstopcord = [event.latlng.lat, event.latlng.lng]
            console.log(busstopcord);
            geoline.push(busstopcord);
            console.log(geoline);
          
           
            // points += '['+coords+']'
            // console.log(points)
            // var plz = '[' + points + ']'
            
            Object.assign(obj, geoline)
        
            console.log(obj);
            L.polyline(geoline, {color: 'red'}).addTo(map);
            var polyline = L.polyline(obj, {color: 'red'})
            
            polyline.addTo(map)
            console.log(polyline)

        })
        
        
        
    })
  
    
    dbclickmkr.addTo(map)
    })

map.on("click", function (event) {
currentMarker = L.marker(event.latlng,  {


    

 })

coords = event.latlng
console.log(coords);
//limits decimal places (rounds it)
    lat_dec = event.latlng.lat
    lon_dec = event.latlng.lng



var lat = lat_dec
var lon = lon_dec 
 //currentMarker.addTo(map)
 
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
            //  currentMarker.bindPopup(popupcontent, {
            //     keepInView: true, 
            //     closeButton: false
            //  }).openPopup();
             
            //  const formEL = document.querySelector('form');
            //  document.getElementById('lat').value = lat;
            //  document.getElementById('lon').value = lon;
            //  console.log(poi_selected)
            //  $("#form").submit(function(e){
            //     e.preventDefault();
            //     console.log("didnt submit");
            //     const formData = new FormData(formEL);
            //     const data = Object.fromEntries(formData);
            //     console.log(data)
            //     form_string = data
            //     posttodb()
            //  })

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


// map.addEventListener("click", function () {
//   currentMarker = null;

// }); 
// var marker = document.getElementById("input-panel-icons")

// var newmarkerl
// var markers = new L.layerGroup
// map.on('click', function(ev){
//     console.log(marker)
//      newmarkerl = L.marker(ev.latlng);
//     newmarkerl.feature = { 
//       type: 'Point', 
//       properties: { infoText: '', imageURL: '' }, 
//       geometry: undefined 
//     };
//     newmarkerl.addTo(markers);
//     newmarkerl.addTo(map);
//     markersjson = markers.toGeoJSON();
//     console.log(markersjson)
//   });
  
  
 
  // ...later
  
  //r5calc.addEventListener("click", function(){
  //  gen_R();
  //  })

    function post_txt_data(){
        console.log(arr)
        console.log(data_string)
        var post_data = {arr: arr, route: routearr, trip: triparr, calender: calenderarr, agency: agencyarr, stop: stoparr}
        console.log(post_data)
        $.ajax({
            'async': false,
            'type': "POST",
            'global': false,
            'datatype': 'html',
            'url': "test_stops.php",
            'data': post_data,
            'success': function (data) {
                console.log('posted to php')
            }
        });
    
    
    }

    
    
    console.log(document.getElementById('click'))
    
    document.getElementById('click').addEventListener("click", function(){
    console.log("click")
        post_txt_data();
    })

    document.getElementById('genr5').addEventListener("click", function(){

        gen_R();

    })

    
document.getElementById('trip').addEventListener("click", function(){
    document.getElementById("trip-form").style.display = "block";
})

document.getElementById('route').addEventListener("click", function(){
    document.getElementById("route-form").style.display = "block";
    document.getElementById('route_type').value = 3
})

document.getElementById('stop').addEventListener("click", function(){
    document.getElementById("stop-form").style.display = "inline";
    document.getElementById('stop_lat').value = coords.lat
    document.getElementById('stop_lon').value = coords.lng
})

document.getElementById('agency').addEventListener("click", function(){
    document.getElementById("agency-form").style.display = "inline";
    
})

document.getElementById('calender').addEventListener("click", function(){
    document.getElementById("calender-form").style.display = "inline";
    
})




function closeForm() {
    document.getElementById("trip-form").style.display = "none";
    document.getElementById("route-form").style.display = "none";
    document.getElementById("calender-form").style.display = "none";
    document.getElementById("agency-form").style.display = "none";
    document.getElementById("stop-form").style.display = "none";
  }


  

  $("#agency-form").submit(function(e){
    e.preventDefault();
    //useful code quick easy soultion to retrive form entries 
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(data)
    agencyarr.push(data)
  })

  $("#stop-form").submit(function(e){
    e.preventDefault();
    //useful code quick easy soultion to retrive form entries 
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(data)
    stoparr.push(data)
  })


  $("#trip-form").submit(function(e){
    e.preventDefault();
    //useful code quick easy soultion to retrive form entries 
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(data)
    triparr.push(data)
    document.getElementById('calender').disabled = false;
  
  })

  $("#route-form").submit(function(e){
    e.preventDefault();
    //useful code quick easy soultion to retrive form entries 
    const data = Object.fromEntries(new FormData(e.target).entries());
    console.log(data)
    routearr.push(data);
    document.getElementById('trip').disabled = false;
  
  })

  $("#calender-form").submit(function(e){
    e.preventDefault();
    //useful code quick easy soultion to retrive form entries 
    const data = Object.fromEntries(new FormData(e.target).entries());
    calenderarr.push(data)
    console.log(data)
  
  })

document.getElementById('Save').addEventListener("click", function(){
    console.log(iso_set)
    console.log(polyline2)
    var filename = 'polygon'
    var geoJSON = iso_set.toGeoJSON();
    var geoJSON2 = polyline2.toGeoJSON();
    console.log(geoJSON2)
    var file = filename + '.geojson';
    saveAs(new File([JSON.stringify(geoJSON2)], file, {
      type: "text/plain;charset=utf-8"
    }), file);


})



  function load_points_within(isochrone_list,theTable){
    console.log(walking_geom);
    console.log(catchment_size)
    console.log(pharmacies_geom)
    console.log(gp_surg_geom)
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
  }