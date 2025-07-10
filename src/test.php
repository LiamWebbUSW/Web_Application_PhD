<?php
//console error reporting:  0=off  1=on
ini_set('display_errors', 1); 
//to use Chrome Logger
include 'ChromePhp.php';


$host = '';
$port = '';
$dbname = '';
$user = '';
$password = '';



$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
if (!$conn) {
	ChromePhp::error("...database connection FAILED" );
	exit;
}




$name = $_POST['Name'];
$postcode = $_POST['Postcode'];
$lat = $_POST['Lat'];
$lon = $_POST['Lon'];
$capacity = $_POST['Capacity'];
$table = $_POST['Table'];

var_dump($lat);
var_dump($lon);

$sql1 = "INSERT INTO ".$table."(name, postcode, geom) VALUES ('$name' , '$postcode', st_transform(ST_POINT(".$lon."::float, ".$lat."::float, 4326), 27700));";



  if (!$response = pg_query($conn, $sql1)) {
	ChromePhp::error("*SQL failed*");
	exit;
}