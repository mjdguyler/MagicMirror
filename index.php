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
<body>

	<div class="top left"><div class="date small dimmed"></div><div class="time"></div><div class="calendar xxsmall"></div></div>
	<!-- <div class="top right"><p class ="small dimmed">Santa Clara</p><div class="windsun small dimmed"></div><div class="temp"></div><div class="forecast small dimmed"></div>
	<p class ="small dimmed">San Diego</p><div class="windsun2 small dimmed"></div><div class="temp2"></div><div class="forecast2 small dimmed"></div></div>-->
	<div class="center-ver center-hor"><!-- <div class="dishwasher light">Vaatwasser is klaar!</div> --></div>
	<div class="top right"><p class="small dimmed"><span class="io_moon"></span>Santa Clara</p><div class = "io_windsun small dimmed"></div><div class="xxsmall dimmed io_alerts"></div><div class = "io_temp"></div><div class= "io_forecast small dimmed"></div>
	<p class="small dimmed"><span class="io2_moon"></span>Del Mar</p><div class = "io2_windsun small dimmed"></div><div class="xxsmall dimmed io2_alerts"></div><div class = "io2_temp"></div><div class= "io2_forecast small dimmed"></div>
	<p class="small dimmed"><span class="io3_moon"></span>London</p><div class = "io3_windsun small dimmed"></div><div class="xxsmall dimmed io3_alerts"></div><div class = "io3_temp"></div><div class= "io3_forecast small dimmed"></div></div>
	<div class="lower-third center-hor"><div class="compliment light"></div></div>
	<!-- <div class="bottom center-hor"><div class="news medium"></div></div> -->
	<div class = "bottom center-hor"><p><q class="quote qod1"></q><br /><span class="dimmed author qod2">— </span></p></div>
	<div id="container" class="center-ver left" style="height: 500px; width: 700px"></div>
	<div id="container2" class="map bottom" style="height: 750px; width:1500"></div>


<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="js/jquery.js"></script>
<script src="js/jquery.feedToJSON.js"></script>
<script src="js/ical_parser.js"></script>
<script src="js/moment-with-langs.min.js"></script>
<script src="js/config.js"></script>
<script src="js/rrule.js"></script>
<!-- <script src="/Highstock-2.1.5/js/highstock.js"></script> -->
<!-- <script src="/Highmaps-1.1.5/js/highmaps.js"></script> -->
<script src="//code.highcharts.com/maps/highmaps.js"></script>
<script src="/Highstock-2.1.5/js/themes/dark-mark.js"></script>
<script src="//code.highcharts.com/mapdata/custom/world.js"></script>
<!--<script src="//code.highcharts.com/stock/highstock.js"></script>-->
<!--<script src="//code.highcharts.com/stock/modules/exporting.js"></script>-->
<script src="js/MarkitTimeseries.js"></script>
<script src="js/main.js?nocache=<?php echo md5(microtime()) ?>"></script>

<!-- <script src="js/socket.io.min.js"></script> -->

</body>
</html>
