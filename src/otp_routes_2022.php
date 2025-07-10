<?php

ini_set('display_errors', 1);
$public_data = array('status' => false, 'message' => 'Unknown Error');

//echo($transport_type);
//echo($distance);
//echo($coords);

$result = run_query_otp_routes();
$public_data['message'] = $result;
$public_data['status'] = true;
header('Content-Type: application/json');
echo json_encode($public_data);

function run_query_otp_routes()
{
    $url = "localhost:8082";
    $query = '/otp/routers/onlybus_2022/index/routes'.'';
    //Initialise cURL session.
    $ch = curl_init();
    //Set options.
    curl_setopt($ch, CURLOPT_URL, $url . $query);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_TIMEOUT, -1);
    //Execute session and set variable to content of query.
    $contents = curl_exec($ch);
    //Close cURL session.
    curl_close($ch);

    //Return the journey info.

    return $contents;

    /*while ($row = pg_fetch_row($contents)) {
        foreach ($row as $i => $attr) {
            echo $attr;
        }
    }*/

}



