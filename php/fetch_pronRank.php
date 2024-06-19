<!DOCTYPE html>
<?php
    // POST로 전송된 데이터 가져오기
    $data = json_decode(file_get_contents('php://input'), true);

// Check if data exists and extract variables
    if (isset($data['userName']) && isset($data['score'])) {
        $userName = $data['userName'];
        $score = $data['score'];

        // echo $userName;
        // echo $score;
        // MySQL 연결
        include_once("./db_conn.php");
    
        // 연결 확인
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
    
        // 쿼리 작성하여 데이터베이스에 INSERT
        $sql = "INSERT INTO prongame (username, score, createdAt) VALUES ('$userName', '$score', CURRENT_TIMESTAMP)";
    
        if ($conn->query($sql) === TRUE) {
            // 데이터가 성공적으로 삽입되면 lastWordRank.php로 리디렉션
            header("Location: lastWordRank.php");
            exit();
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    
        // 연결 종료
        $conn->close();
        
    } else {
        // 데이터가 올바르게 전송되지 않은 경우
        $response = array('status' => 'error', 'message' => 'Invalid data received');
        echo json_encode($response);
    }
    // echo `<script>console.log($userName)</script>`

?>
</html>