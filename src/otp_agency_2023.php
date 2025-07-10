<?php

ini_set('display_errors', 1);
$public_data = array('status' => false, 'message' => 'Unknown Error');
$result = run_query_otp_agency();
$public_data['message'] = $result;
$public_data['status'] = true;

header('Content-Type: application/json');
echo json_encode($public_data);


            



function run_query_otp_agency()
{
    $url = "localhost:8082";
    $query = '/otp/routers/onlybus_2023/index/agencies/1'.'';
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

return$contents;

    /*while ($row = pg_fetch_row($contents)) {
        foreach ($row as $i => $attr) {
            echo $attr;
        }
    }*/

}
