<?php
$lat = $_POST['lat'];
$lon = $_POST['lon'];
 //$lat = '51.770370218435886';
 //$lon = '-3.6351307253178042';

 //system('C:\\"Program Files"\\R\\R-4.4.2\\bin\\Rscript.exe C:\Users\Liam\Documents\app\r5.R 2>&1' .$lon. ' ' .$lat);
 
 //var_dump($output);
 //echo($result_code);
 
 system('C:\\"Program Files"\\R\\R-4.4.1\\bin\\Rscript.exe C:\Users\Liam\Documents\app\r5.R 2>&1' .$lon. ' ' .$lat);
//$json = file_get_contents('temp.geojson');
//echo($json);
?>