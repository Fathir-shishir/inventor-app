<?php
session_start();
require_once("../functions.php");
$allowed_origin = 'http://localhost:3500';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Rest of your PHP script...

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request with necessary headers
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
    exit(0);
}




try {

    $conn = createConnection();


    $data = array();


    // Get the name of the user
    $stmt = checkStmt(
        $conn,
        "SELECT IIF(firstname = lastname, firstname, CONCAT(firstname,' ',lastname)) AS [name] FROM common.dbo.users WHERE id = ?",
        array($_SESSION["user_id"])
    );


    // Fetch the data
    foreach (sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC) as $key => $val) {
        $data[$key] = $val;
    }


    // Free up the statement
    sqlsrv_free_stmt($stmt);


    // Get the role of the user
    $stmt = checkStmt($conn, "SELECT [description] AS [role] FROM common.dbo.roles WHERE id = ?", array($_SESSION["role_id"]));


    // Fetch the data
    foreach (sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC) as $key => $val) {
        $data[$key] = $val;
    }


    sqlsrv_free_stmt($stmt);


    // Get the APU name
    $stmt = checkStmt($conn, "SELECT [description] FROM common.dbo.locations WHERE id = ?", array($_SESSION["apu_id"]));

    $data["apu"] = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)["description"];

    sqlsrv_free_stmt($stmt);


    // Get lines
    $location_ids = array($_SESSION["apu_id"]);

    $counter = 0;

    while (count($location_ids) > 0) {
        $sql = "SELECT l.id, l.[description], lt.[description] AS [type] FROM common.dbo.locations l
                INNER JOIN common.dbo.location_types lt ON l.type_id = lt.id
                WHERE l.parent_id IN (" . implode(",", $location_ids) . ")
                AND l.is_active = 1";

        $stmt = checkStmt($conn, $sql);

        $location_ids = array();

        while ($r = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            if ($r["type"] == "line") {
                $stmtIsItac = checkStmt(
                    $conn,
                    "SELECT TOP 1 IIF(ISNULL(itac_station_number, 'false') = 'false', 'false', 'true') AS is_itac FROM common.dbo.machines_bridge mb
                    INNER JOIN common.dbo.locations l ON mb.machine_id = l.id
                    WHERE l.parent_id = ?
                    ORDER BY [order]",
                    array($r["id"])
                );

                $isItac = false;

                if (sqlsrv_has_rows($stmtIsItac)) {
                    $isItac = sqlsrv_fetch_array($stmtIsItac, SQLSRV_FETCH_ASSOC)["is_itac"];
                }

                $data["lines"][] = array("id" => $r["id"], "description" => $r["description"], "is_itac" => $isItac);

                sqlsrv_free_stmt($stmtIsItac);
            } else {
                $location_ids[] = $r["id"];
            }
        }

        if ($counter == 50) break;
        $counter++;
    }


    // Response
    echo json_encode(array("errors" => 0, "session_data" => $data));
} catch (Exception $e) {

    logError($e);

    echo getErrorResponse($e);
} finally {
    sqlsrv_close($conn);
}
