<?php

ini_set('display_errors', 1);
$public_data = array('status'=>false, 'message'=>'Unknown Error');



if (isset($_POST['trip_id'])) {
    $trip_id = $_POST['trip_id'];
    $year = $_POST['trip_year'];
    $url = "localhost:8082";
    $results = check_trips($trip_id, $url, $year);
    $public_data['message'] = $results;
    $public_data['status'] = true;
}
else{
    $public_data['message'] = 'failed';
}


echo json_encode($public_data);





function check_trips($trip_id, $url, $year){



    $query = '/otp/routers/onlybus_'.$year.'/index/trips/' . $trip_id . '/stops';
    $query2 = '/otp/routers/onlybus_'.$year.'/index/trips/' . $trip_id;
    //Set the result to query response.
    $combine = $url . $query;
    //echo $combine . '<br>';
    //echo $combine2;
    $result = run_query_otp($url, $query);
    $result2 = run_query_otp($url, $query2);
    $response = new stdClass();
    /* $trip_id  . "\n";*/
    $trip_line = [];
    $stop_locations = [];
    $stop_info = [];
    $times = [];
    $coordinates = [];
    //Only works because $stops and $results_times JSON is in the same order.
    foreach($result as $key=>$stops){
        $times = [];
        $lat_long = [];
        $stop = new stdClass();
        $stop->stopName = $stops['name'];
        $stop->stop_id = $stops['id'];
        $stop->lat = $stops['lat'];
        $stop->lon = $stops['lon'];
        array_push($stop_locations, $stop);
        array_push($lat_long, '[' . $stops['lat']);
        array_push($lat_long, $stops['lon'] . ']');

        $coord_pair = [];
        if($stops['lat'] != 0.0 && $stops['lon'] != 0.0){
            array_push($coord_pair, $stops['lat']);
            array_push($coord_pair, $stops['lon']);
            array_push($coordinates, $coord_pair);
        }

        $lat_lon = implode(",", $lat_long);
        array_push($trip_line, $lat_lon );
    }
    //var_dump($coordinates);
    $coords =  implode(",", $trip_line);
    $response->trip_id = $trip_id;
    //$response->Geoline = '['. $coords . ']';
    $response->Geoline = $coordinates;
    $response->stops = $stop_locations;
    $response->route_id = $result2['route']['id'];
    $response->long_name = $result2['route']['longName'];
    $response->short_name = $result2['route']['shortName'];
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