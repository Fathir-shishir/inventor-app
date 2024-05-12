<?php

// Database credentials
$dbHost = "FRI1-SV00134";
$dbUser = "fashishir";
$dbPwd = "YNb0Hn{O7]}}_m6X";
$dbName = "fri1_inventory";

// Function to create a database connection
function createConnection($dbHost, $dbUser, $dbPwd, $dbName) {
    $connectionInfo = array("UID" => $dbUser, "PWD" => $dbPwd, "Database" => $dbName, "CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect($dbHost, $connectionInfo);
    if ($conn === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    return $conn;
}

// Handling CORS
header("Access-Control-Allow-Origin: http://localhost:3500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // Get assignment ID from URL parameters
        $assignmentId = $_GET['assignmentId'] ?? '';

        // Get assignment data from request payload
        $putData = json_decode(file_get_contents('php://input'), true);
        $model = $putData['model'] ?? '';
        $imei = $putData['imei'] ?? '';
        $serialNumber = $putData['serial_number'] ?? '';
        $comment = $putData['comment'] ?? '';
        $assignedTo = $putData['assignedTo'] ?? '';
        $signatureData = $putData['signatureImage'] ?? ''; // New field for signature data

       

        // Update assignment data in the database using the assignment ID
        $sql = "UPDATE dbo.assignedMobile SET model = ?, imei = ?, serial_number = ?, comment = ?, assignedTo = ?, signature_data = ? WHERE id = ?";
        $params = array(&$model, &$imei, &$serialNumber, &$comment, &$assignedTo, &$signatureData, &$assignmentId);
        $stmt = sqlsrv_prepare($conn, $sql, $params);

        if (!sqlsrv_execute($stmt)) {
            echo json_encode(["error" => "Error updating assignment data.", "details" => sqlsrv_errors()]);
            exit;
        }

        echo json_encode(["success" => "Assignment data updated successfully."]);

    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
