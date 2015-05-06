<html>
<head>
	<title>Magic Mirror</title>
	<style type="text/css">
		<?php include('css/main.css') ?>
	</style>
	<link rel="stylesheet" type="text/css" href="css/weather-icons.css">
	<script type="text/javascript">
		var gitHash = '<?php echo trim(`git rev-parse HEAD`) ?>';
	</script>
	<meta name="google" value="notranslate" />
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
</head>
<script> src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javcascript">
var auto_refresh = setInterval(
	function(){
		$('#qod').load('category.php').fadeIn("slow");
	}, 15000);
</script>
<body>

	<div class="top left"><div class="date small dimmed"></div><div class="time"></div><div class="calendar xxsmall"></div></div>
	<div class="top right"><div class="windsun small dimmed"></div><div class="temp"></div><div class="forecast small dimmed"></div></div>
	<div class="center-ver center-hor"><!-- <div class="dishwasher light">Vaatwasser is klaar!</div> --></div>
	<div class="lower-third center-hor"><div class="compliment light"></div></div>
	<div class="bottom center-hor"><div class="news medium"></div></div>
	<script type="text/javascript" src="https://theysaidso.com/gadgets/v2/theysaidso.js"></script>
	<div id = "qod", class = "bottom center-hor medium light">
		<!-- <?php
		$min = date('i');
		if ($min%5==0)
			$category = "inspire";
		elseif ($min%2==0)
			$category = "love";
		else
			$category = "life";

		?> -->
		<script>TheySaidSo.render({ qod_category:"<?php print $category ?>"});</script>
	</div>

</div>

<script src="js/jquery.js"></script>
<script src="js/jquery.feedToJSON.js"></script>
<script src="js/ical_parser.js"></script>
<script src="js/moment-with-langs.min.js"></script>
<script src="js/config.js"></script>
<script src="js/rrule.js"></script>
<script src="js/main.js?nocache=<?php echo md5(microtime()) ?>"></script>
<!-- <script src="js/socket.io.min.js"></script> -->

</body>
</html>
