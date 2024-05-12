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
            // Get assignment ID from request payload
            $postData = json_decode(file_get_contents('php://input'), true);
            $assignmentId = $postData['assignmentId'] ?? '';

            // Perform delete operation on dbo.assignedMobile table
            $deleteSql = "DELETE FROM dbo.assignedMobile WHERE id = ?";
            $deleteParams = array(&$assignmentId);
            $deleteStmt = sqlsrv_prepare($conn, $deleteSql, $deleteParams);

            if (!sqlsrv_execute($deleteStmt)) {
                echo json_encode(["error" => "Error deleting assignment data from dbo.assignedMobile table.", "details" => sqlsrv_errors()]);
                exit;
            }

            // Check model from assignment and update dbo.mobileQuantities table
            $model = $postData['model'] ?? '';
            $checkModelSql = "SELECT * FROM dbo.mobileQuantities WHERE model = ?";
            $checkModelParams = array(&$model);
            $checkModelStmt = sqlsrv_prepare($conn, $checkModelSql, $checkModelParams);
            $checkModelResult = sqlsrv_execute($checkModelStmt);

            if ($checkModelResult) {
                if (sqlsrv_has_rows($checkModelStmt)) {
                    // Model exists, update totalQuantities column
                    $updateSql = "UPDATE dbo.mobileQuantities SET totalQuantities = totalQuantities + 1 WHERE model = ?";
                    $updateParams = array(&$model);
                    $updateStmt = sqlsrv_prepare($conn, $updateSql, $updateParams);
                    if (!sqlsrv_execute($updateStmt)) {
                        echo json_encode(["error" => "Error updating totalQuantities in dbo.mobileQuantities table.", "details" => sqlsrv_errors()]);
                        exit;
                    }
                } else {
                    // Model does not exist, insert new row
                    $insertSql = "INSERT INTO dbo.mobileQuantities (model, totalQuantities) VALUES (?, 1)";
                    $insertParams = array(&$model);
                    $insertStmt = sqlsrv_prepare($conn, $insertSql, $insertParams);
                    if (!sqlsrv_execute($insertStmt)) {
                        echo json_encode(["error" => "Error inserting new row into dbo.mobileQuantities table.", "details" => sqlsrv_errors()]);
                        exit;
                    }
                }
            } else {
                echo json_encode(["error" => "Error checking model in dbo.mobileQuantities table.", "details" => sqlsrv_errors()]);
                exit;
            }

            echo json_encode(["success" => "Assignment deleted from dbo.assignedMobile table and mobile quantities updated successfully."]);
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
