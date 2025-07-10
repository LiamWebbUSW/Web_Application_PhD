//map
//custom vars
var clickedcoords = [];

//sql feature calls and variables 
var fTable = 'geoupload.userfeatures';
var fColumn = ["name","address", "descritpion"];
var fGeom = 'geom';

//selectorLayers
var displayClusterDataLayer,displayHeatDataLayer,displayAttributeDataLayer


//map and map view
var threeMap,mapView,CWales;

//geojson object builder 
var geojsonobject = {};

//Custom View
CWales = [-3.4, 52.5]

mapView = new ol.View({
center: ol.proj.transform(CWales, 'EPSG:4326','EPSG:3857'),
zoom: 7
})
//Map Layers

//Map Instantiations and Layer Calls
threeMap = new ol.Map({
	layers:[ 
	//adding the tile layers
		new ol.layer.Group({
			title:'Basemaps',
			layers: [
				new ol.layer.Tile({
				title: 'OSM',
				type:'base',
				visible:true,
				source:new ol.source.OSM()
			}),
		//Water Colour Layer
		new ol.layer.Tile({
				title: 'Water color',
                type: 'base',
                visible: false,
                source: new ol.source.Stamen({
                layer: 'watercolor'
			})
		}),
		new ol.layer.Tile({
			title: 'OSM Humanitarian',
            type: 'base',
            source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
			}),
            visible: false
			})
		]
	})
],
	target:'mapspce',
	view: mapView,
	attributions:'Â© Tom Slater 18018815 USW'
})

//adding the layer switcher listener
var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'LÃ©gende', 
        groupSelectStyle: 'group' 
    });
    threeMap.addControl(layerSwitcher);
	
//marker style
var featureMarker = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1.0],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'marker.png'
        })
    })

//define source
var drawSource = new ol.source.Vector()
//Define Style if want using default atm
//define drawlayer
var drawLayer = new ol.layer.Vector({
	source:drawSource
})

threeMap.addLayer(drawLayer)

//initiate draw interaction
var draw = new ol.interaction.Draw({
	type:'Point',
	source:drawSource
})
draw.on('drawstart',function(evt) {
	drawSource.clear()
})
draw.on('drawend', function(evt){
	//alert('Point added'),
	//Get added marker coords
	clickedcoords = evt.feature.getGeometry().getFlatCoordinates()
	// When the user clicks the button, open the modal 
	modal.style.display = "block";
	console.log('Clicked at ', evt.feature.getGeometry().getFlatCoordinates())
	threeMap.removeInteraction(draw)
	
})

//function that enables draw interaction
function startDraw(){
	//adds ability to draw to map
	threeMap.addInteraction(draw)
}

//Function that closes modal
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
		featureInput_lon = clickedcoords[0];
		console.log(featureInput_lon);
		featureInput_lat = clickedcoords[1];
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
	
	//create this as a layer
	
	//create a new source to store the data
	var dataSource = new ol.source.Vector({
		features: (new ol.format.GeoJSON().readFeatures(geojsonobject)),
	})
	
	//Heatmap Layer 
	displayHeatDataLayer = new ol.layer.Heatmap({
		source: dataSource
	})
	//add this layer to the map and set visibility false
	threeMap.addLayer(displayHeatDataLayer)
	displayHeatDataLayer.setVisible(false)
	
	
	
	//attribute based styling
	displayAttributeDataLayer = new ol.layer.Vector({
		//use the stored json data as the source data
		source:dataSource,
		
		//assign style based on purpose Attribute
		style: function(feature){
			//style for residential features
			if (feature.values_.purpose == 'residential'){
				return new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1.0],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
						src: 'src/residential.png',
						scale: 0.05
					})
				})
			}
			//style for leisure features
			else if (feature.values_.purpose =='leisure'){
				return new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1.0],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
						src: 'src/leisure.png',
						scale: 0.02
					})
				})
			}
			//style for educational features
			else if (feature.values_.purpose =='education'){
				return new ol.style.Style({
					image: new ol.style.Icon({
						anchor: [0.5, 1.0],
						anchorXUnits: 'fraction',
						anchorYUnits: 'fraction',
						src: 'src/education.png',
						scale: 0.02
					})
				})
			}
			//Base Style
			else {
				 return new ol.style.Style({
					image: new ol.style.Circle({
						 fill: new ol.style.Fill({
							 color:'#00ffff'
						 }),
						 radius: 7
					 })
				})
			 }
		
		}
	})
	//add this new layer to the map
	threeMap.addLayer(displayAttributeDataLayer)
	
	//Cluster Layer
	var clusterSource = new ol.source.Cluster({
		distance: parseInt(40,10),
		source: dataSource
	});
	
	var styleCache = {};
	displayClusterDataLayer = new ol.layer.Vector({
		source: clusterSource,
		style: function (feature) {
			var size = feature.get('features').length;
			var style = styleCache[size];
			if (!style) {
				style = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 10,
						stroke: new ol.style.Stroke({
							color: '#fff',
						}),
						fill: new ol.style.Fill({
							color: '#3399CC',
						}),
					}),
					text: new ol.style.Text({
						text: size.toString(),
						fill: new ol.style.Fill({
							color: '#fff',
						}),
					}),
				});
				styleCache[size] = style;
			}
			return style;
		},
	});
	//add to map then hide
	threeMap.addLayer(displayClusterDataLayer)
	displayClusterDataLayer.setVisible(false)
	
}

//changing layer based on selector
function changeLayer(){
	var selectBox = document.getElementById('featureview');
	var selectedValue = selectBox.options[selectBox.selectedIndex].value;
	//heat poi clust
	if(selectedValue == 'poi'){
		//SWAP TO POI LAYER
		displayAttributeDataLayer.setVisible(true);
		//Hide others
		displayHeatDataLayer.setVisible(false);
		displayClusterDataLayer.setVisible(false);
	}
	else if(selectedValue == 'heat'){
		//swap to heat map layer
		displayHeatDataLayer.setVisible(true);
		//Hide others
		displayAttributeDataLayer.setVisible(false);
		displayClusterDataLayer.setVisible(false);
	}
	else if(selectedValue == 'clust'){
		//swap to clustered
		displayClusterDataLayer.setVisible(true);
		//Hide others
		displayAttributeDataLayer.setVisible(false);
		displayHeatDataLayer.setVisible(false);
	}	
	
}

//popup Overlay

var Box = document.querySelector(".ol-popup");
var content = document.querySelector(".popup-content");
var closer = document.querySelector(".ol-popup-closer");


var overlay = new ol.Overlay({
	element: Box,
	autoPan: true,
	offset:[0,-10]
});

//creating a function for closing the overlay
closer.onclick = function(){
	overlay.setPosition(undefined);
	closer.blur();
	return false;
};
threeMap.addOverlay(overlay);

//popup click displays feature
threeMap.on('click', function(e){
	threeMap.forEachFeatureAtPixel(e.pixel, function(feature,layer){
		let PopCoord = e.coordinate;
		let clickedFeatureName = (feature.get('name'));
		let clickedFeatureAddr = (feature.get('address'));
		let clickedFeatureDesc = (feature.get('description'));
		let clickedFeaturePurp = (feature.get('purpose'));
		overlay.setPosition(PopCoord);
		
		var popContent = '<h3>' +clickedFeatureName +'</h3>';
		popContent += '<p> Address: ' + clickedFeatureAddr + '<br>Description: ' + clickedFeatureDesc + '<br> Purpose: ' + clickedFeaturePurp;
		content.innerHTML = popContent;
		overlay.setPosition(PopCoord);
		
		console.log(clickedFeatureName, clickedFeatureAddr, clickedFeatureDesc, clickedFeaturePurp);
		
		//var popupOptions = {max_width: 300};
	})
});