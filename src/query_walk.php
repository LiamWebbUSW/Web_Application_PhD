<?php
ini_set('display_errors', 1);
$public_data = array('status'=>false, 'message'=>'Unknown Error');



if (isset($_POST['transport'], $_POST['coords'], $_POST['distance'],  $_POST['graph'],  $_POST['date'])) {

    $transport_type = $_POST['transport'];
    $coords = $_POST['coords'];
    $distance = $_POST['distance'];
    $graph = $_POST['graph'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $maxwalk = $_POST['maxwalk'];
    //echo($transport_type);
    
    //echo($coords);

    $url = "localhost:8082";

    $results = build_iso($transport_type, $coords, $distance, $maxwalk, $graph, $date, $time, $url);

    $public_data['message'] = $results;
   // echo $public_data['message'];
    $public_data['status'] = true;

}
else{
    $public_data['message'] = 'failed';
}

header('Content-Type: application/json');
echo json_encode($public_data);

function build_iso($transport_type, $coords, $distance, $maxwalk, $graph, $date, $time, $url){
    
    //sample = http://ces-gis.usw.southwales.ac.uk:8082/otp/routers/default/isochrone?fromPlace=51.6,-3.19273&mode=WALK&date=08-30-2021&time=11:00am&maxWalkDistance=400&cutoffSec=900
    $query = '/otp/routers/' .  $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time. '&cutoffSec=' . 360 .'&maxWalkDistance='. $maxwalk ;
    //$query20 = '/otp/routers/' . $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time.'&maxWalkDistance='. $maxwalk. '&cutoffSec=' . 1200 . $banned_agencies . $banned_routes ;
    //$query30 = '/otp/routers/' . $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time.'&maxWalkDistance='. $maxwalk. '&cutoffSec=' . 1800 . $banned_agencies . $banned_routes ;
    //$query40 = '/otp/routers/' . $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time.'&maxWalkDistance='. $maxwalk. '&cutoffSec=' . 2400 . $banned_agencies . $banned_routes ;
    //$query50 = '/otp/routers/' . $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time.'&maxWalkDistance='. $maxwalk. '&cutoffSec=' . 3000 . $banned_agencies . $banned_routes ;
    //$query60 = '/otp/routers/' . $graph . '/isochrone?fromPlace=' . $coords .  '&mode=' . $transport_type . '&date=' . $date . '&time='. $time.'&maxWalkDistance='. $maxwalk. '&cutoffSec=' . 3600 . $banned_agencies . $banned_routes ;
    
    //Set the result to query response.
    $combine = $url . $query;
    //echo($combine);
    $result = run_query_otp($url, $query);
   // $result20 = run_query_otp($url, $query20 );
   // $result30 = run_query_otp($url, $query30);
   // $result40 = run_query_otp($url, $query40 );
   // $result50 = run_query_otp($url, $query50 );
    //$result60 = run_query_otp($url, $query60 );
    //var_dump($result);
    $result_string = json_encode($result);
    //var_dump($result_string);
    return $result_string;
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
    $return_check = $return['features'][0];
    
    //var_dump($return_check);
    //Return the journey info.
    return $return_check;
}

