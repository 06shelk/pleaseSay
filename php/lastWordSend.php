<?php

// 데이터베이스 연결
include_once("./db_conn.php");

// 연결 확인
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// 클라이언트에서 전송된 JSON 데이터 읽기
$data = json_decode(file_get_contents("php://input"), true);

// 변수에 데이터 할당
$userName = $data['username'];
$point = $data['score'];

// 데이터베이스에 데이터 삽입
$sql = "INSERT INTO WordGame (username, Score) VALUES ('$userName', $point)";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "New record created successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

// 연결 종료
$conn->close();
?>
