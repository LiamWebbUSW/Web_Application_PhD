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
    $year = $_POST['trip_year'];
	$stop_id = $_POST['stop_id'];
	$day = $_POST['day'];
    $time = $_POST['time'];
    $catchment = $_POST['catchment_value'];

    $time_converted = date("H:i:s", strtotime($time));

    $time_converted_catchment = date("H:i:s", strtotime( $time_converted. ' + ' . $catchment . ' minutes'));

    $table =    "(select routes.route_long_name, st.trip_id, st.arrival_time, trips.service_id, trips.route_id,".
                "cal.monday, cal.tuesday, cal.wednesday, cal.thursday, cal.friday, cal.saturday, cal.sunday " .
                "from gtfs_".$year.".stop_times as st " .
                "left join trips as  trips on st.trip_id = trips.trip_id " .
                "left join calendar as cal on trips.service_id = cal.service_id ".
                "left join routes as routes on routes.route_id = trips.route_id ".
                "where st.stop_id = '"  . $stop_id . "' and ".$day." = '1' " .
                "and arrival_time > '" . $time_converted . "' and arrival_time < '" . $time_converted_catchment . "')";
                

	//build query
	$sql1 = "SELECT jsonb_build_object(
            'stop_times', jsonb_agg(stop_time)) from
            (SELECT json_build_object(                                  
            'long_name', features.route_long_name,
            'trip_id', features.trip_id,
            'arrival_time', features.arrival_time,
            'service_id', features.service_id,
            'route_id', features.route_id,
			'monday', features.monday, 
            'tuesday', features.tuesday, 
            'wednsday', features.wednesday,
            'thursday', features.thursday, 
            'friday', features.friday, 
            'saturday', features.saturday, 
            'sunday', features.sunday) as stop_time
			FROM " . $table . " as features ) as stop_times;";
          


	//replace placeholders
	// $sql2 = str_replace("#table#", $table, $sql1);
	// $sql3 = str_replace("#table2#", $table2, $sql2);
	// $sql4 = str_replace("#table3#", $table3, $sql3);
	
	
	// $sql3 = str_replace("#fields#", $fields, $sql2);
	$sql5 = $sql1;
	//ChromePhp::log($sql5);

//exdecute query
if (!$response = pg_query($conn, $sql5)) {
	ChromePhp::error("*SQL failed*");
	exit;
}
	
//return data
while ($row = pg_fetch_row($response)) {
	foreach ($row as $i => $attr){
       echo utf8_decode($attr);

	}
}
?>