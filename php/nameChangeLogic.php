<?php

$uid = $_POST['user_id'];

// 데이터베이스 연결
// 디비접속
include_once("./db_conn.php");

// 중복 체크를 위한 쿼리
$check_query = "SELECT * FROM login_form WHERE id = '$uid'";
$result = mysqli_query($conn, $check_query);

// 중복된 아이디가 있는지 확인
if (mysqli_num_rows($result) > 0) {
    // 중복된 경우, 사용자를 로그인 페이지로 돌려보냄
    // echo "<script>alert('중복되는 아이디 입니다.');</script>";
    // header("Location: login.html");
    echo "<script>alert('중복되는 아이디 입니다.'); window.location='../html/nameChange.html';</script>";
    exit(); // 코드 실행 중지
} else {
    // 중복되는 값이 없는 경우, 데이터베이스에 uid 값을 삽입
    $sql = "INSERT INTO login_form (id) VALUES ('$uid')";
    if (mysqli_query($conn, $sql)) {
        echo "성공";
        // header("Location: show.php");
        
        exit();
    } else {
        echo "실패: " . mysqli_error($conn);
    }
}

// 데이터베이스 연결 해제
mysqli_close($conn);

?>
