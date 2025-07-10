<?php
//console error reporting:  0=off  1=on
ini_set('display_errors', 1); 
//to use Chrome Logger
include 'ChromePhp.php';
	
//** database login details **
$host = '';
$port = '';
$dbname = '';
$user = '';
$password = '';

//attempt connection
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
	ChromePhp::error("...database connection FAILED" );
	exit;
}

	
	$table = $_POST['theTable']; // carehomes
	$inclu = $_POST['inclu'];
	$geomy = $_POST['geomy'];



	//build query
	$sql1 = "SELECT jsonb_build_object(
			'type',     'FeatureCollection',
			'features', jsonb_agg(feature)) from 
			(SELECT json_build_object(
				'type',       'Feature',   
				'geometry',   ST_AsGeoJSON(st_transform(geom,4326),4)::jsonb,
				'properties', (features.postcode, features.population, features.house_count)
			)  as feature
			FROM " . $table . " as features where geom is not null) as features;";

	//replace placeholders
	// $sql2 = str_replace("#table#", $table, $sql1);
	// $sql3 = str_replace("#table2#", $table2, $sql2);
	// $sql4 = str_replace("#table3#", $table3, $sql3);
	
	
	// $sql3 = str_replace("#fields#", $fields, $sql2);
	$sql5 = str_replace("#omits#", $geomy, $sql1);
	ChromePhp::log($sql5);

//exdecute query
if (!$response = pg_query($conn, $sql5)) {
	ChromePhp::error("*SQL failed*");
	exit;
}
	
//return data
while ($row = pg_fetch_row($response)) {
	foreach ($row as $i => $attr){
		echo $attr;
	}
}
?>