<?php
ini_set('display_errors', 1);
$public_data = array('status'=>false, 'message'=>'Unknown Error');



if (isset($_POST['stop_id'])) {
    $stop_id = $_POST['stop_id'];
    //echo($transport_type);
    //echo($distance);
    //echo($coords);
    $url = "localhost:8082";
    $results = build_iso($stop_id, $url);
    $public_data['message'] = $results;
    // echo $public_data['message'];
    $public_data['status'] = true;
}
else{
    $public_data['message'] = 'failed';
}

header('Content-Type: application/json');
echo json_encode($public_data);

function build_iso($stop_id, $url){
    //sample = http://ces-gis.usw.southwales.ac.uk:8082/otp/routers/default/isochrone?fromPlace=51.6,-3.19273&mode=WALK&date=08-30-2021&time=11:00am&maxWalkDistance=400&cutoffSec=900
    $query = '/otp/routers/onlybus_2021/index/stops/' . $stop_id . '/routes';
    //Set the result to query response.
    $combine = $url . $query;
 /*   echo $combine . "\n";*/
    $result = run_query_otp($url, $query);
    foreach($result as $key=>$route){
        check_route($route['id'],$url);
    }
   // $result_string = json_encode($result);
    //var_dump($result_string);
    //return $result_string;
}

function check_route($route_id, $url){
    $query = '/otp/routers/onlybus_2021/index/routes/' . $route_id . '/trips';
    //Set the result to query response.
    $combine = $url . $query;
    $result = run_query_otp($url, $query);
/*    echo $combine . "\n";
    echo $route_id . "\n";*/
    foreach($result as $key=>$trip){
        check_trips($trip['id'],$url);
    }
}

function check_trips($trip_id, $url){
    $query = '/otp/routers/onlybus_2021/index/trips/' . $trip_id . '/stops';
    //Set the result to query response.
    $combine = $url . $query;
    $result = run_query_otp($url, $query);
    /* $trip_id  . "\n";*/
    $trip_line = [];
    foreach($result as $key=>$stops){
        $lat_long = [];
        array_push($lat_long, $stops['lat']);
        array_push($lat_long, $stops['lon']);
        $lat_lon = implode(",", $lat_long);
        array_push($trip_line, $lat_lon);
    }
    $coords =  implode(",", $trip_line);
   return $coords;
}
function run_query_otp($url, $query)
{
    //Initialise cURL session.
    $ch = curl_init();
    //Set options.
    curl_setopt($ch, CURLOPT_URL, $url . $query);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_TIMEOUT, -1);

    //Execute session and set variable to content of query.
    $contents = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error_code = curl_errno($ch);
    $error_message = curl_error($ch);

    //Close cURL session.
    curl_close($ch);

    //var_dump($contents);
    //Set variable to response, decoding cURL response from JSON format to variable.
    $return = json_decode($contents, true);

    //var_dump($return_check);
    //Return the journey info.
    return $return;
}





