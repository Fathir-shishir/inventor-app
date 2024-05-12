<?php

require_once("../functions.php");
header('Access-Control-Allow-Origin: http://localhost:3500'); // Your frontend URL
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

try{
    // Create the database connection
    $conn = createConnection();


    // Get lines
    $location_ids = array(1);

    $counter = 0;

    $apus = array();

    while (count($location_ids) > 0) {
        $sql = "SELECT l.id, l.[description], lt.[description] AS [type] FROM common.dbo.locations l
                INNER JOIN common.dbo.location_types lt ON l.type_id = lt.id
                WHERE l.parent_id IN (" . implode(",", $location_ids) . ")
                AND l.is_active = 1";

        $stmt = checkStmt($conn, $sql);

        $location_ids = array();

        while ($r = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            if ($r["type"] == "apu") {
                $apus[] = array("id" => $r["id"], "description" => $r["description"]);
            } else {
                $location_ids[] = $r["id"];
            }
        }

        if ($counter == 50) break;
        $counter++;
    }

    
    // Response
    echo json_encode(array("errors"=>0, "apus"=>$apus));
} catch(Exception $e){

    // Log the error
    logError($e);

    // Response
    echo getErrorResponse($e);

} finally {
    sqlsrv_close($conn);
}