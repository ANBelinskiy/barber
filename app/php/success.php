<?php
header("Content-Type: text/html; charset=utf-8");
$name = htmlspecialchars($_POST["name"]);
$tel = htmlspecialchars($_POST["tel"]);
$subject = htmlspecialchars($_POST["subject"]);

$refferer = getenv('HTTP_REFERER');
$date=date("d.m.y"); // число.месяц.год  
$time=date("H:i"); // часы:минуты:секунды 
$myemail = "room15belinskiy@gmail.com"; // e-mail администратора

// Отправка письма администратору сайта
$tema = "Заявка на обратную связь";
$message_to_myemail = "Текст письма:
<br><br>
$subject<br>
Имя: $name<br>
Телефон: $tel<br>
Источник (ссылка): $refferer
";

mail($myemail, $tema, $message_to_myemail, "From: Самая клевая компания <room15belinskiy@gmail.com> \r\n Reply-To: Самая клевая компания \r\n"."MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf-8\r\n" );


// Сохранение инфо о лидах в файл leads.xls
$f = fopen("leads.xls", "a+");
fwrite($f," <tr>");    
fwrite($f," <td>$name</td> <td>$tel</td> <td>$date / $time</td>");   
fwrite($f," <td>$refferer</td>");    
fwrite($f," </tr>");  
fwrite($f,"\n ");    
fclose($f);

?>