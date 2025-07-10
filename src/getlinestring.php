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


echo json_encode($public_data);


function build_iso($stop_id, $url){
    //sample = http://ces-gis.usw.southwales.ac.uk:8082/otp/routers/default/isochrone?fromPlace=51.6,-3.19273&mode=WALK&date=08-30-2021&time=11:00am&maxWalkDistance=400&cutoffSec=900
    $query = '/otp/routers/onlybus_2021/index/stops/' . $stop_id . '/routes';
    //Set the result to query response.
    $combine = $url . $query;
 /*   echo $combine . "\n";*/
    $result = run_query_otp($url, $query);
    $routes =[];
    $response = new stdClass();
    foreach($result as $key=>$route){
        $route = check_route($route['id'] ,$route['longName'],$route['shortName'], $url);
        array_push($routes, $route);

    }
    $response->stop_id = $stop_id;
    $response->routes = $routes ;
    $response_json = json_encode($response);
    $return = json_decode($response_json, true);
    return $return;
   return $routes;// $result_string = json_encode($result);
    //var_dump($result_string);
    //return $result_string;
}
function check_route($route_id, $routename,$shortname, $url){
    $query = '/otp/routers/onlybus_2021/index/routes/' . $route_id . '/trips';
    //Set the result to query response.
    $route_id;
    $routename;
    $shortname;

    $combine = $url . $query;
    $result = run_query_otp($url, $query);
/*    echo $combine . "\n";
    echo $route_id . "\n";*/
    $trips=[];
    $trip_stop = [];
    $response = new stdClass();
   /* foreach ($result as $key=>$trip_stop){
        $trip_stop = check_trips_stoptimes($trip_stop['id'], $url);
    }*/
    foreach($result as $key=>$trip){

        $trip = check_trips($trip['id'],$trip['serviceId'],$url);
        array_push($trips, $trip);
    }
    $response->route_id = $route_id;
    $response->route_name = $routename;
    $response->route_shortName = $shortname;
    $response->trips = $trips;
    $response_json = json_encode($response);
    return $response;

}

function check_trips($trip_id,$service_id, $url){
    $query = '/otp/routers/onlybus_2021/index/trips/' . $trip_id . '/stops';
    $query2 = '/otp/routers/onlybus_2021/index/trips/' . $trip_id . '/stoptimes';
    //Set the result to query response.
    $combine = $url . $query;
    $service_id;
    $combine2 = $url . $query2;
    /*echo $combine;
    echo $combine2;*/
    $result = run_query_otp($url, $query);
    $result_times = run_query_otp($url, $query2);
    $response = new stdClass();
    /* $trip_id  . "\n";*/
    $trip_line = [];
    $stop_locations = [];
    $stop_info = [];
    $times = [];

    //Only works because $stops and $results_times JSON is in the same order.
    foreach($result as $key=>$stops){
        $times = [];
        $lat_long = [];
        $stop = new stdClass();
        $stop->stopName = $stops['name'];
        $stop->stop_id = $stops['id'];
        $stop->lat = $stops['lat'];
        $stop->lon = $stops['lon'];
        $stop_id = $result_times[$key]['scheduledArrival'];
        $stop->time = $stop_id;
        array_push($stop_locations, $stop);
        array_push($lat_long, '[' . $stops['lat']);
        array_push($lat_long, $stops['lon'] . ']');
        $lat_lon = implode(",", $lat_long);
        array_push($trip_line, $lat_lon );
    }

    $coords =  implode(",", $trip_line);
    $response->trip_id = $trip_id;
    $response->service_id = $service_id;
    $response->Geoline = '['. $coords . ']';
    $response->stops = $stop_locations;
   // $response->stops = $merge;
    //$response->stopOrder = $stop_index;
    $response_json = json_encode($response);
   return $response;

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





