<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>발음 테스트 순위</title>
    
    <link rel=stylesheet href="../css/style.css">
    <link rel="stylesheet" href="../css/ranking.css">
</head>
<body>

    <div class="table-container">
        
        <div class="title_container"> 
            <h1>발음 테스트 랭킹</h1>
        </div>

    <table class="table">

        <?php
        // 디비접속
        include_once("./db_conn.php");
        $sql = "SELECT * FROM login_form ORDER BY game2 DESC";

        $result = mysqli_query($conn, $sql);
        $num = mysqli_num_rows($result);

        // echo "<thead><tr><th>ID</th><th>게임1</th></thead>";
        echo "<tbody>";

        // 결과를 반복하여 테이블 행에 표시
        $rank = 1;
        for ($i = 0; $i < $num; $i = $i + 1) {
            $re = mysqli_fetch_row($result);
            if ($re[2] !== null) { // $re[2] 값이 null이 아닌 경우에만 출력
                echo "<tr><td class='rank'>".$rank."</td><td class='name'>".$re[0]."</td><td>".$re[2]."</td></tr>";
                $rank++;
            }
        }

        echo "</tbody></table>";
        mysqli_close($conn);

        ?>

    </table>

    <div class="img xx">
        <img src="../img/firstX.png" alt="" >
    </div>
    <div class="img oo">
        <img src="../img/firstO.png" alt="">
    </div>
</div>


<div class="button-container" onClick="location.href='../index.html'">
    <img src="../img/GoBackIcon.svg" alt="">
    돌아가기
</div>

<div id="questionExp" class="questionExp">
    <p>게임 설명</p>
    <p id="gameDescription"> 이전 화면으로 가고 싶다면 
        <br>“이전”을 말하고
        <br>다음 화면으로 가고 싶다면
        <br>“다음”을 말하며
        <br>게임을 진행하세요</p>
</div>
<div class="questionIcon">
    <img src="../img/mic_none.png" class="icon" id="questionIcon">
</div>
    
<script src="../js/updateMicIcon.js"></script>
<script src="../js/levenshteinDistance.js"></script>
<script src="../js/voiceApi.js"></script>
</body>
</html>