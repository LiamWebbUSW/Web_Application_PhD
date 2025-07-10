<?php
$arr = $_POST['arr'];
$calender = $_POST['calender'];
$route = $_POST['route'];
$trip = $_POST['trip'];
$stop = $_POST['stop'];
$agency = $_POST['agency'];

foreach ($arr as $value){
    $output = "";
    $arrvalues = array_values($value);
    $lastElement = array_key_last($arrvalues);
   // var_dump($arrvalues);
    foreach ($arrvalues as $key =>  $results){
       //important adog
        if($key == $lastElement){
                $string = $results;
            }
            else{
                $string = $results.',';
            }
        $output = $output . $string;
}
echo $output;
//use src/app_files for empty gtfs calender 
//use src/test for filled out gtfs
//use src/test_2022 for 2022 gtfs
$myFile = "C:/xampp/htdocs/dashboard/src/app_files/stop_times.txt";
$fh = fopen($myFile, 'a') or die("can't open file");
fwrite($fh, $output."\n");
fclose($fh);
}

foreach ($route as $routevalue){
    $routeoutput = "";
$routearrvalues = array_values($routevalue);
$lastElementroute = array_key_last($routearrvalues);
foreach ($routearrvalues as $key => $routeresults){
if($key ==$lastElementroute){
    $routestring = $routeresults;
}else {
    $routestring = $routeresults.',';
}
$routeoutput = $routeoutput . $routestring;
}
echo $routeoutput;
$routefile = "C:/xampp/htdocs/dashboard/src/app_files/routes.txt";
$fh = fopen($routefile, 'a') or die("can't open file");
fwrite($fh, $routeoutput."\n");
fclose($fh);
}

foreach ($agency as $agencyvalue){
    $agencyoutput = "";
$agencyarrvalues = array_values($agencyvalue);
$lastElementagency = array_key_last($agencyarrvalues);
foreach ($agencyarrvalues as $key => $agencyresults){
if($key ==$lastElementagency){
    $agencystring = $agencyresults;
}else {
    $agencystring = $agencyresults.',';
}
$agencyoutput = $agencyoutput . $agencystring;
}
echo $agencyoutput;
$agencyfile = "C:/xampp/htdocs/dashboard/src/app_files/agency.txt";
$fh = fopen($agencyfile, 'a') or die("can't open file");
fwrite($fh, $agencyoutput."\n");
fclose($fh);
}

foreach ($stop as $stopvalue){
    $stopoutput = "";
$stoparrvalues = array_values($stopvalue);
$lastElementstop = array_key_last($stoparrvalues);
foreach ($stoparrvalues as $key => $stopresults){
if($key ==$lastElementstop){
    $stopstring = $stopresults;
}else {
    $stopstring = $stopresults.',';
}
$stopoutput = $stopoutput . $stopstring;
}
echo $stopoutput;
$stopfile = "C:/xampp/htdocs/dashboard/src/app_files/stops.txt";
$fh = fopen($stopfile, 'a') or die("can't open file");
fwrite($fh, $stopoutput."\n");
fclose($fh);
}

foreach ($trip as $tripvalue){
    $tripoutput = "";
$triparrvalues = array_values($tripvalue);
$lastElementtrip = array_key_last($triparrvalues);
foreach ($triparrvalues as $key => $tripresults){
if($key ==$lastElementtrip){
    $tripstring = $tripresults;
}else {
    $tripstring = $tripresults.',';
}
$tripoutput = $tripoutput . $tripstring;
}
echo $tripoutput;
$tripfile = "C:/xampp/htdocs/dashboard/src/app_files/trips.txt";
$fh = fopen($tripfile, 'a') or die("can't open file");
fwrite($fh, $tripoutput."\n");
fclose($fh);
}

foreach ($calender as $calvalue){
    $caloutput = "";
$calarrvalues = array_values($calvalue);
$lastElementcal = array_key_last($calarrvalues);
foreach ($calarrvalues as $key => $calresults){
if($key ==$lastElementcal){
    $calstring = $calresults;
}else {
    $calstring = $calresults.',';
}
$caloutput = $caloutput . $calstring;
}
echo $caloutput;
$calfile = "C:/xampp/htdocs/dashboard/src/app_files/calendar.txt";
$fh = fopen($calfile, 'a') or die("can't open file");
fwrite($fh, $caloutput."\n");
fclose($fh);
}

 ?>