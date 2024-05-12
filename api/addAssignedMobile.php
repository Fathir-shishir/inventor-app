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
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // Start transaction
        sqlsrv_begin_transaction($conn);

        $postData = json_decode(file_get_contents('php://input'), true);
        $model = $postData['model'] ?? '';
        $imei = $postData['imei'] ?? '';
        $serialNumber = $postData['serial_number'] ?? '';
        $comment = $postData['comment'] ?? '';
        $assignedTo = $postData['assignedTo'] ?? '';
        $condition = $postData['condition'] ?? '';
        $signatureData = $postData['signature'] ?? '';

        error_log('Signature Data: ' . $signatureData);
        error_log('Signature Data: ' . $condition);
      


        // First, check and update the dbo.mobileQuantities table
        $checkSql = "SELECT totalQuantities FROM dbo.mobileQuantities WHERE model = ? AND condition = ?";
        $checkParams = array(&$model,&$condition );
        $checkStmt = sqlsrv_query($conn, $checkSql, $checkParams);

        if ($checkStmt === false) {
            echo json_encode(["error" => "Error checking model quantities.", "details" => sqlsrv_errors()]);
            sqlsrv_rollback($conn); // Rollback transaction
            exit;
        }

        $row = sqlsrv_fetch_array($checkStmt, SQLSRV_FETCH_ASSOC);
        if ($row && $row['totalQuantities'] > 0) {
            $updateSql = "UPDATE dbo.mobileQuantities SET totalQuantities = totalQuantities - 1 WHERE model = ? AND condition = ?";
            if (!sqlsrv_query($conn, $updateSql, $checkParams)) {
                echo json_encode(["error" => "Error updating model quantities.", "details" => sqlsrv_errors()]);
                sqlsrv_rollback($conn); // Rollback transaction
                exit;
            }

            // Then, insert into dbo.assignedMobile
            $createdAt = date('Y-m-d H:i:s'); // SQL Server datetime2(7) format
            $insertSql = "INSERT INTO dbo.assignedMobile (model, imei, serial_number, comment, created_at, assignedTo, condition, signature_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $insertParams = array(&$model, &$imei, &$serialNumber, &$comment, &$createdAt, &$assignedTo, &$condition, &$signatureData);

            $insertStmt = sqlsrv_prepare($conn, $insertSql, $insertParams);
            if (!sqlsrv_execute($insertStmt)) {
                echo json_encode(["error" => "Error inserting into assignedMobile.", "details" => sqlsrv_errors()]);
                sqlsrv_rollback($conn); // Rollback transaction
                exit;
            }

            // Commit transaction
            sqlsrv_commit($conn);
            echo json_encode(["success" => "Mobile data successfully assigned and quantities updated."]);

        } else {
            echo json_encode(["error" => "Model does not exist or no quantities available."]);
            sqlsrv_rollback($conn); // Rollback transaction
            exit;
        }

    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    sqlsrv_rollback($conn); // Ensure rollback on exception
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
