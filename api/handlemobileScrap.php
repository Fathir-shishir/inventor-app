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
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // Check if request method is POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Get assignment ID and model from request payload
            $postData = json_decode(file_get_contents('php://input'), true);
            $assignmentId = $postData['assignmentId'] ?? '';
            $model = $postData['model'] ?? '';

            // Get assignment details from dbo.assignedMobile table
            $getAssignmentSql = "SELECT * FROM dbo.assignedMobile WHERE id = ?";
            $getAssignmentParams = array(&$assignmentId);
            $getAssignmentStmt = sqlsrv_prepare($conn, $getAssignmentSql, $getAssignmentParams);
            $getAssignmentResult = sqlsrv_execute($getAssignmentStmt);

            if ($getAssignmentResult && sqlsrv_has_rows($getAssignmentStmt)) {
                // Fetch assignment details
                $assignmentData = sqlsrv_fetch_array($getAssignmentStmt, SQLSRV_FETCH_ASSOC);

                // Move assignment data to dbo.scrapedMobile table
                $scrapedDate = date('Y-m-d');
                $insertScrapedSql = "INSERT INTO dbo.scrapedMobile (model, imei, serial_number, comment, created_at, assignedTo, scrapedDate) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $insertScrapedParams = array(&$assignmentData['model'], &$assignmentData['imei'], &$assignmentData['serial_number'], &$assignmentData['comment'], &$assignmentData['created_at'], &$assignmentData['assignedTo'], &$scrapedDate);
                $insertScrapedStmt = sqlsrv_prepare($conn, $insertScrapedSql, $insertScrapedParams);
                if (!sqlsrv_execute($insertScrapedStmt)) {
                    echo json_encode(["error" => "Error moving data to dbo.scrapedMobile table.", "details" => sqlsrv_errors()]);
                    exit;
                }

                // Delete assignment data from dbo.assignedMobile table
                $deleteSql = "DELETE FROM dbo.assignedMobile WHERE id = ?";
                $deleteParams = array(&$assignmentId);
                $deleteStmt = sqlsrv_prepare($conn, $deleteSql, $deleteParams);
                if (!sqlsrv_execute($deleteStmt)) {
                    echo json_encode(["error" => "Error deleting assignment data from dbo.assignedMobile table.", "details" => sqlsrv_errors()]);
                    exit;
                }

                echo json_encode(["success" => "Assignment data moved to dbo.scrapedMobile table and deleted from dbo.assignedMobile table successfully."]);
            } else {
                echo json_encode(["error" => "No assignment data found for the given ID.", "details" => sqlsrv_errors()]);
                exit;
            }
        } else {
            echo json_encode(["error" => "Unsupported request method. Only POST requests are allowed."]);
            exit;
        }
    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
