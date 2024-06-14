<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>끝말잇기 순위</title>
    
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/ranking.css">
</head>
<body>

    <div class="table-container">
        
        <div class="title_container"> 
            <h1>끝말잇기 랭킹</h1>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>순위</th>
                    <th>사용자 이름</th>
                    <th>점수</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // 디비접속
                include_once("./db_conn.php");

                // WordGame 테이블에서 점수를 기준으로 내림차순 정렬하여 데이터를 가져오는 SQL 쿼리
                $sql = "SELECT username, Score FROM WordGame ORDER BY Score DESC";
                $result = mysqli_query($conn, $sql);

                // 순위 계산을 위한 변수
                $rank = 1;

                // 결과를 반복하여 테이블 행에 표시
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>";
                    echo "<td class='rank'>" . $rank . "</td>";
                    echo "<td class='name'>" . htmlspecialchars($row['username']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['Score']) . "</td>";
                    echo "</tr>";
                    $rank++;
                }

                // 데이터베이스 연결 종료
                mysqli_close($conn);
                ?>
            </tbody>
        </table>
    </div>

    <div class="img xx">
        <img src="../img/firstX.png" alt="">
    </div>
    <div class="img oo">
        <img src="../img/firstO.png" alt="">
    </div>

    <div class="button-container" onClick="location.href='login.html'">
        <img src="../img/GoBackIcon.svg" alt="">
        돌아가기
    </div>
    
    <script src="../js/voiceApi.js"></script>
</body>
</html>
