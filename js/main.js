jQuery.fn.updateWithText = function(text, speed)
{
	var dummy = $('<div/>').html(text);

	if ($(this).html() != dummy.html())
	{
		$(this).fadeOut(speed/2, function() {
			$(this).html(text);
			$(this).fadeIn(speed/2, function() {
				//done
			});
		});
	}
}

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function roundVal(temp)
{
	return Math.round(temp * 10) / 10;
}

function mph(kmh)
{
	var speed = kmh/1000*0.62137*3600;
	//var speed = kmh/1000/0.621371*3600;
	return roundVal(speed);

}

jQuery(document).ready(function($) {

	var news = [];
	var newsIndex = 0;

	var eventList = [];

	var lastCompliment;
	var compliment;

	var quote = [];
	var author = [];
	var format = [];
    moment.lang(lang);


	(function checkVersion()
	{
		$.getJSON('githash.php', {}, function(json, textStatus) {
			if (json) {
				if (json.gitHash != gitHash) {
					window.location.reload();
					window.location.href=window.location.href;
				}
			}
		});
		setTimeout(function() {
			checkVersion();
		}, 3000);
	})();

	(function updateTime()
	{
        var now = moment();
        var date = now.format('LLLL').split(' ',4);
        date = date[0] + ' ' + date[1] + ' ' + date[2] + ' ' + date[3];

		$('.date').html(date);
		$('.time').html(now.format('h') + ':' + now.format('mm') + '<span class="sec">'+now.format('ss')+'</span>' + '<span class="medium">'+now.format('A')+'</span>');

		setTimeout(function() {
			updateTime();
		}, 1000);
	})();

	(function updateCalendarData()
	{
		new ical_parser("calendar.php", function(cal){
        	events = cal.getEvents();
        	eventList = [];

        	for (var i in events) {
        		var e = events[i];
        		for (var key in e) {
        			var value = e[key];
					var seperator = key.search(';');
					if (seperator >= 0) {
						var mainKey = key.substring(0,seperator);
						var subKey = key.substring(seperator+1);

						var dt;
						if (subKey == 'VALUE=DATE') {
							//date
							dt = new Date(value.substring(0,4), value.substring(4,6) - 1, value.substring(6,8));
						} else {
							//time
							dt = new Date(value.substring(0,4), value.substring(4,6) - 1, value.substring(6,8), value.substring(9,11), value.substring(11,13), value.substring(13,15));
						}

						if (mainKey == 'DTSTART') e.startDate = dt;
						if (mainKey == 'DTEND') e.endDate = dt;
					}
        		}

                if (e.startDate == undefined){
                    //some old events in Gmail Calendar is "start_date"
                    //FIXME: problems with Gmail's TimeZone
            		var days = moment(e.DTSTART).diff(moment(), 'days');
            		var seconds = moment(e.DTSTART).diff(moment(), 'seconds');
                    var startDate = moment(e.DTSTART);
                } else {
            		var days = moment(e.startDate).diff(moment(), 'days');
            		var seconds = moment(e.startDate).diff(moment(), 'seconds');
                    var startDate = moment(e.startDate);
                }
                // console.log(startDate);
        		//only add fututre events, days doesn't work, we need to check seconds
        		if (seconds >= 0) {
                    if (seconds <= 60*60*5 || seconds >= 60*60*24*14) {
                        var time_string = moment(startDate).fromNow();
                    }else {
                        var time_string = moment(startDate).calendar()
                    }
                    if (!e.RRULE) {
    	        		eventList.push({'description':e.SUMMARY,'seconds':seconds,'days':time_string});
                    }
                    e.seconds = seconds;
        		}
                
                // Special handling for rrule events
                if (e.RRULE) {
                    var options = new RRule.parseString(e.RRULE);
                    options.dtstart = e.startDate;
                    var rule = new RRule(options);
                    
                    // TODO: don't use fixed end date here, use something like now() + 1 year
                    var dates = rule.between(new Date(), new Date(2016,11,31), true, function (date, i){return i < 10});
                    for (date in dates) {
                        var dt = new Date(dates[date]);
                        var days = moment(dt).diff(moment(), 'days');
                        var seconds = moment(dt).diff(moment(), 'seconds');
                        var startDate = moment(dt);
                        
                     	if (seconds >= 0) {
                            if (seconds <= 60*60*5 || seconds >= 60*60*24*2) {
                                var time_string = moment(dt).fromNow();
                            } else {
                                var time_string = moment(dt).calendar()
                            }
                            eventList.push({'description':e.SUMMARY,'seconds':seconds,'days':time_string});
                        }           
                    }
                }
            };
        	eventList.sort(function(a,b){return a.seconds-b.seconds});

        	setTimeout(function() {
        		updateCalendarData();
        	}, 60000);
    	});
	})();

	(function updateCalendar()
	{
		table = $('<table/>').addClass('xsmall').addClass('calendar-table');
		opacity = 1;


		for (var i in eventList) {
			var e = eventList[i];

			var row = $('<tr/>').css('opacity',opacity);
			row.append($('<td/>').html(e.description).addClass('description'));
			row.append($('<td/>').html(e.days).addClass('days dimmed'));
			table.append(row);

			opacity -= 1 / eventList.length;
		}

		$('.calendar').updateWithText(table,1000);

		setTimeout(function() {
        	updateCalendar();
        }, 1000);
	})();

	(function updateCompliment()
	{
        //see compliments.js
		while (compliment == lastCompliment) {
     
      //Check for current time  
      var compliments;
      var date = new Date();
      var hour = date.getHours();
      //set compliments to use
      if (hour >= 3 && hour < 12) compliments = morning;
      if (hour >= 12 && hour < 17) compliments = afternoon;
      if (hour >= 17 || hour < 3) compliments = evening;

		compliment = Math.floor(Math.random()*compliments.length);
		}

		$('.compliment').updateWithText(compliments[compliment], 4000);

		lastCompliment = compliment;

		setTimeout(function() {
			updateCompliment(true);
		}, 30000);

	})();

	

(function updateWeatherForecastio()
	{
		var iconTable = {
			'clear-day-day':'wi-day-sunny',
			'partly-cloudy-day-day':'wi-day-cloudy',
			'cloudy-day':'wi-cloudy',
			'sleet-day':'wi-day-sleet',
			'hail-day':'wi-day-hail',
			'wind-day':'wi-day-cloudy-gusts',
			'rain-day':'wi-rain',
			'thunderstorm-day':'wi-thunderstorm',
			'snow-day':'wi-snow',
			'fog-day':'wi-fog',
			'clear-night':'wi-night-clear',
			'partly-cloudy-night':'wi-night-alt-cloudy',
			'cloudy':'wi-night-alt-cloudy',
			'sleet':'wi-night-alt-sleet',
			'hail':'wi-night-alt-hail',
			'wind':'wi-night-alt-cloudy-gusts',
			'rain':'wi-night-alt-rain',
			'thunderstorm':'wi-night-alt-thunderstorm',
			'snow':'wi-night-alt-snow',
			'fog':'wi-night-fog'
		}
		var moonTable = {
			'0':'wi-moon-new',
			'0.03':'wi-moon-waxing-cresent-1','0.07':'wi-moon-waxing-cresent-2','0.1':'wi-moon-waxing-cresent-3','0.14':'wi-moon-waxing-cresent-4','0.18':'wi-moon-waxing-cresent-5','0.21':'wi-moon-waxing-cresent-6',
			'0.25':'wi-moon-first-quarter',
			'0.28':'wi-moon-waxing-gibbous-1','0.32':'wi-moon-waxing-gibbous-2','0.35':'wi-moon-waxing-gibbous-3','0.39':'wi-moon-waxing-gibbous-4','0.43':'wi-moon-waxing-gibbous-5','0.46':'wi-moon-waxing-gibbous-6',
			'0.5':'wi-moon-full',
			'0.53':'wi-moon-waning-gibbous-1','0.57':'wi-moon-waning-gibbous-2','0.6':'wi-moon-waning-gibbous-3','0.64':'wi-moon-waning-gibbous-4','0.68':'wi-moon-waning-gibbous-5','0.71':'wi-moon-waning-gibbous-6',
			'0.75':'wi-moon-3rd-quarter',
			'0.78':'wi-moon-waning-cresent-1','0.82':'wi-moon-waning-cresent-2','0.85':'wi-moon-waning-cresent-3','0.89':'wi-moon-waning-cresent-4','0.93':'wi-moon-waning-cresent-5','0.96':'wi-moon-waning-cresent-6',
		}
			$.getJSON('https://api.forecast.io/forecast/3a76c960cde37437e83b53f81bf859c9/37.3544,-121.9692?callback=?', function(json, textStatus) {
				console.log(json);
			
			var temp = roundVal(json.currently.temperature);
			// console.log(json.weather[0].icon);
			var wind = roundVal(json.currently.windSpeed);
			console.log(wind);
			var sunriseTime = json.daily.data[0].sunriseTime;
			var sunsetTime = json.daily.data[0].sunsetTime;
			var now = new Date();
			if (sunriseTime*1000 < now.getTime()){
				if ((sunsetTime*1000) > now.getTime()) {
						if (json.currently.icon.includes('night'));
						else {
							var str = '-day';
							json.currently.icon = json.currently.icon.concat(str);
						}
						//console.log(json.weather[0].icon);
				}
			}
			var last = 0;
			for (var k in moonTable){
				if (k > json.daily.data[0].moonPhase){
					var x = last;
					break;
				}
				last = k;
			}
			var moon = moonTable[x];
			var moonPhase = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(moon);
			$('.io_moon').updateWithText(moonPhase, 1000);
			//console.log(json.weather[0].icon);
			var iconClass = iconTable[json.currently.icon];
			if(json.currently.temperature > 95)
				iconClass = 'wi-hot';
			if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-day-showers';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.07)
				iconClass = 'wi-day-rain';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon=='rain' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-night-alt-showers';
			else if (json.currently.icon=='rain' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon == 'tornado')
			 	iconClass = 'wi-tornado';


			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.io_temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);


			var now = new Date();

			var sunrise = new Date(sunriseTime*1000).toTimeString().substring(0,5);
			var sunset = new Date(sunsetTime*1000).toTimeString().substring(0,5);

			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + '<span class="light small"> mph </span>' ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			var sunrise_date = new Date(sunriseTime*1000);
			if (sunriseTime*1000 < now.getTime()){
				if ((sunsetTime*1000) > now.getTime()) {
					sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
				}
			}
			alerts = [];
			if (json.alerts){
				for (var j in json.alerts){
					var alert = json.alerts[j].title;
					console.log(alert);
					var br = '<br />';
					alerts = alerts.concat(br);
					alerts = alerts.concat(alert);
					
				}
				$('.io_alerts').updateWithText(alerts, 1000);
			}

			$('.io_windsun').updateWithText(windString+' '+sunString, 1000);


			var forecastDataio = {};
			for (var i in json.daily.data) {
				var forecast2 = json.daily.data[i];
				forecastDataio[i] = {
					'timestamp':forecast2.time * 1000,
					'icon':forecast2.icon,
					'min':forecast2.temperatureMin,
					'max':forecast2.temperatureMax,
					'precipIntensityMax':forecast2.precipIntensityMax
				};

			}
			var forecastTableio = $('<table/>').addClass('forecast-table2');
			var opacity = 1;
			for (var i in forecastDataio) {
				var io_forecast = forecastDataio[i];
				io_forecast.icon = io_forecast.icon.replace(/night/g,"day");
				var str = '-day';
				io_forecast.icon = io_forecast.icon.concat(str);
				
				var iconClass = iconTable[io_forecast.icon];
				if(io_forecast.max > 95)
					iconClass = 'wi-hot';
				if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.03){
					iconClass = 'wi-day-showers';
				}
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.07)
					iconClass = 'wi-day-rain';
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax > 0.3)
					iconClass = 'wi-umbrella';

				var dt = new Date(io_forecast.timestamp);
				var row = $('<tr/>').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass('wi').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(io_forecast.max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(io_forecast.min)));

				forecastTableio.append(row);
				opacity -= 0.155;
			}


			$('.io_forecast').updateWithText(forecastTableio, 1000);
		});

		setTimeout(function() {
			updateWeatherForecastio();
		}, 300000);
	})();



(function updateWeatherForecastio2()
	{
		var iconTable = {
			'clear-day-day':'wi-day-sunny',
			'partly-cloudy-day-day':'wi-day-cloudy',
			'cloudy-day':'wi-cloudy',
			'sleet-day':'wi-day-sleet',
			'hail-day':'wi-day-hail',
			'wind-day':'wi-day-cloudy-gusts',
			'rain-day':'wi-rain',
			'thunderstorm-day':'wi-thunderstorm',
			'snow-day':'wi-snow',
			'fog-day':'wi-fog',
			'clear-night':'wi-night-clear',
			'partly-cloudy-night':'wi-night-alt-cloudy',
			'cloudy':'wi-night-alt-cloudy',
			'sleet':'wi-night-alt-sleet',
			'hail':'wi-night-alt-hail',
			'wind':'wi-night-alt-cloudy-gusts',
			'rain':'wi-night-alt-rain',
			'thunderstorm':'wi-night-alt-thunderstorm',
			'snow':'wi-night-alt-snow',
			'fog':'wi-night-fog'
		}
		var moonTable = {
			'0':'wi-moon-new',
			'0.03':'wi-moon-waxing-cresent-1','0.07':'wi-moon-waxing-cresent-2','0.1':'wi-moon-waxing-cresent-3','0.14':'wi-moon-waxing-cresent-4','0.18':'wi-moon-waxing-cresent-5','0.21':'wi-moon-waxing-cresent-6',
			'0.25':'wi-moon-first-quarter',
			'0.28':'wi-moon-waxing-gibbous-1','0.32':'wi-moon-waxing-gibbous-2','0.35':'wi-moon-waxing-gibbous-3','0.39':'wi-moon-waxing-gibbous-4','0.43':'wi-moon-waxing-gibbous-5','0.46':'wi-moon-waxing-gibbous-6',
			'0.5':'wi-moon-full',
			'0.53':'wi-moon-waning-gibbous-1','0.57':'wi-moon-waning-gibbous-2','0.6':'wi-moon-waning-gibbous-3','0.64':'wi-moon-waning-gibbous-4','0.68':'wi-moon-waning-gibbous-5','0.71':'wi-moon-waning-gibbous-6',
			'0.75':'wi-moon-3rd-quarter',
			'0.78':'wi-moon-waning-cresent-1','0.82':'wi-moon-waning-cresent-2','0.85':'wi-moon-waning-cresent-3','0.89':'wi-moon-waning-cresent-4','0.93':'wi-moon-waning-cresent-5','0.96':'wi-moon-waning-cresent-6',
		}

			$.getJSON('https://api.forecast.io/forecast/3a76c960cde37437e83b53f81bf859c9/32.9550,-117.2639?callback=?', function(json, textStatus) {
				console.log(json);
			
			var temp = roundVal(json.currently.temperature);
			// console.log(json.weather[0].icon);
			var wind = roundVal(json.currently.windSpeed);
			console.log(wind);
			var sunriseTime = json.daily.data[0].sunriseTime;
			var sunsetTime = json.daily.data[0].sunsetTime;
			var now = new Date();
			if (sunriseTime*1000 < now.getTime()){
				if ((sunsetTime*1000) > now.getTime()) {
						if (json.currently.icon.includes('night'));
						else {
							var str = '-day';
							json.currently.icon = json.currently.icon.concat(str);
						}
						//console.log(json.weather[0].icon);
				}
			}
			var last = 0;
			for (var k in moonTable){
				if (k > json.daily.data[0].moonPhase){
					var x = last;
					break;
				}
				last = k;
			}
			var moon = moonTable[x];
			var moonPhase = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(moon);
			$('.io2_moon').updateWithText(moonPhase, 1000);
			//console.log(json.weather[0].icon);
			var iconClass = iconTable[json.currently.icon];
			if(json.currently.temperature > 95)
				iconClass = 'wi-hot';
			if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-day-showers';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.07)
				iconClass = 'wi-day-rain';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon=='rain' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-night-alt-showers';
			else if (json.currently.icon=='rain' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon == 'tornado')
			 	iconClass = 'wi-tornado';


			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.io2_temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);


			var now = new Date();
			var sunrise = new Date(sunriseTime*1000).toTimeString().substring(0,5);
			var sunset = new Date(sunsetTime*1000).toTimeString().substring(0,5);

			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + '<span class="light small"> mph </span>' ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			var sunrise_date = new Date(sunriseTime*1000);
			if (sunriseTime*1000 < now.getTime()){
				if ((sunsetTime*1000) > now.getTime()) {
					sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
				}
			}
			alerts = [];
			if (json.alerts){
				for (var j in json.alerts){
					var alert = json.alerts[j].title;
					console.log(alert);
					var br = '<br />';
					alerts = alerts.concat(br);
					alerts = alerts.concat(alert);
					
				}
				$('.io2_alerts').updateWithText(alerts, 1000);
			}
			$('.io2_windsun').updateWithText(windString+' '+sunString, 1000);


			var forecastDataio = {};
			for (var i in json.daily.data) {
				var forecast2 = json.daily.data[i];
				forecastDataio[i] = {
					'timestamp':forecast2.time * 1000,
					'icon':forecast2.icon,
					'min':forecast2.temperatureMin,
					'max':forecast2.temperatureMax,
					'precipIntensityMax':forecast2.precipIntensityMax
				};

			}
			var forecastTableio = $('<table/>').addClass('forecast-table2');
			var opacity = 1;
			for (var i in forecastDataio) {
				var io_forecast = forecastDataio[i];
				io_forecast.icon = io_forecast.icon.replace(/night/g,"day");
				var str = '-day';
				io_forecast.icon = io_forecast.icon.concat(str);
				
				var iconClass = iconTable[io_forecast.icon];
				if(io_forecast.max > 95)
					iconClass = 'wi-hot';
				if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.03){
					iconClass = 'wi-day-showers';
				}
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.07)
					iconClass = 'wi-day-rain';
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax > 0.3)
					iconClass = 'wi-umbrella';

				var dt = new Date(io_forecast.timestamp);
				var row = $('<tr/>').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass('wi').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(io_forecast.max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(io_forecast.min)));

				forecastTableio.append(row);
				opacity -= 0.155;
			}


			$('.io2_forecast').updateWithText(forecastTableio, 1000);
		});

		setTimeout(function() {
			updateWeatherForecastio2();
		}, 300000);
	})();

(function updateWeatherForecastio3()
	{
		var iconTable = {
			'clear-day-day':'wi-day-sunny',
			'partly-cloudy-day-day':'wi-day-cloudy',
			'cloudy-day':'wi-cloudy',
			'sleet-day':'wi-day-sleet',
			'hail-day':'wi-day-hail',
			'wind-day':'wi-day-cloudy-gusts',
			'rain-day':'wi-rain',
			'thunderstorm-day':'wi-thunderstorm',
			'snow-day':'wi-snow',
			'fog-day':'wi-fog',
			'clear-night':'wi-night-clear',
			'partly-cloudy-night':'wi-night-alt-cloudy',
			'cloudy':'wi-night-alt-cloudy',
			'sleet':'wi-night-alt-sleet',
			'hail':'wi-night-alt-hail',
			'wind':'wi-night-alt-cloudy-gusts',
			'rain':'wi-night-alt-rain',
			'thunderstorm':'wi-night-alt-thunderstorm',
			'snow':'wi-night-alt-snow',
			'fog':'wi-night-fog'
		}
		var moonTable = {
			'0':'wi-moon-new',
			'0.03':'wi-moon-waxing-cresent-1','0.07':'wi-moon-waxing-cresent-2','0.1':'wi-moon-waxing-cresent-3','0.14':'wi-moon-waxing-cresent-4','0.18':'wi-moon-waxing-cresent-5','0.21':'wi-moon-waxing-cresent-6',
			'0.25':'wi-moon-first-quarter',
			'0.28':'wi-moon-waxing-gibbous-1','0.32':'wi-moon-waxing-gibbous-2','0.35':'wi-moon-waxing-gibbous-3','0.39':'wi-moon-waxing-gibbous-4','0.43':'wi-moon-waxing-gibbous-5','0.46':'wi-moon-waxing-gibbous-6',
			'0.5':'wi-moon-full',
			'0.53':'wi-moon-waning-gibbous-1','0.57':'wi-moon-waning-gibbous-2','0.6':'wi-moon-waning-gibbous-3','0.64':'wi-moon-waning-gibbous-4','0.68':'wi-moon-waning-gibbous-5','0.71':'wi-moon-waning-gibbous-6',
			'0.75':'wi-moon-3rd-quarter',
			'0.78':'wi-moon-waning-cresent-1','0.82':'wi-moon-waning-cresent-2','0.85':'wi-moon-waning-cresent-3','0.89':'wi-moon-waning-cresent-4','0.93':'wi-moon-waning-cresent-5','0.96':'wi-moon-waning-cresent-6',
		}
			$.getJSON('https://api.forecast.io/forecast/3a76c960cde37437e83b53f81bf859c9/51.5072,-0.1275?callback=?', function(json, textStatus) {
				console.log(json);
			
			var temp = roundVal(json.currently.temperature);
			// console.log(json.weather[0].icon);
			var wind = roundVal(json.currently.windSpeed);
			console.log(wind);
			var sunriseTime = json.daily.data[0].sunriseTime;
			var sunsetTime = json.daily.data[0].sunsetTime;
			var now = new Date();
			if (sunriseTime*1000 < json.currently.time*1000){
				if ((sunsetTime*1000) > json.currently.time*1000) {
						if (json.currently.icon.includes('night'));
						else {
							var str = '-day';
							json.currently.icon = json.currently.icon.concat(str);
						}
						//console.log(json.weather[0].icon);
				}
			}
			var last =0;
			for (var k in moonTable){
				if (k > json.daily.data[0].moonPhase){
					var x = last;
					break;
				}
				last = k;
			}
			var moon = moonTable[x];
			var moonPhase = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(moon);
			$('.io3_moon').updateWithText(moonPhase, 1000);
			//console.log(json.weather[0].icon);
			var iconClass = iconTable[json.currently.icon];
			if(json.currently.temperature > 95)
				iconClass = 'wi-hot';
			if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-day-showers';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity < 0.07)
				iconClass = 'wi-day-rain';
			else if (json.currently.icon=='rain-day' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon=='rain' && json.currently.precipIntensity < 0.025)
				iconClass = 'wi-night-alt-showers';
			else if (json.currently.icon=='rain' && json.currently.precipIntensity > 0.3)
				iconClass = 'wi-umbrella';
			if (json.currently.icon == 'tornado')
			 	iconClass = 'wi-tornado';


			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.io3_temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);


			var now = new Date();
			var sunrise = new Date(sunriseTime*1000+28800000).toTimeString().substring(0,5);
			var sunset = new Date(sunsetTime*1000+28800000).toTimeString().substring(0,5);

			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + wind + '<span class="light small"> mph </span>' ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			var sunrise_date = new Date(sunriseTime*1000);
			if (sunriseTime*1000 < json.currently.time*1000){
				if ((sunsetTime*1000) > json.currently.time*1000) {
					sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
				}
			}
			alerts = [];
			if (json.alerts){
				for (var j in json.alerts){
					var alert = json.alerts[j].title;
					console.log(alert);
					var br = '<br />';
					alerts = alerts.concat(br);
					alerts = alerts.concat(alert);
					
				}
				$('.io3_alerts').updateWithText(alerts, 1000);
			}

			$('.io3_windsun').updateWithText(windString+' '+sunString, 1000);


			var forecastDataio = {};
			for (var i in json.daily.data) {
				var forecast2 = json.daily.data[i];
				forecastDataio[i] = {
					'timestamp':forecast2.time * 1000+28800000,
					'icon':forecast2.icon,
					'min':forecast2.temperatureMin,
					'max':forecast2.temperatureMax,
					'precipIntensityMax':forecast2.precipIntensityMax
				};

			}
			var forecastTableio = $('<table/>').addClass('forecast-table2');
			var opacity = 1;
			for (var i in forecastDataio) {
				var io_forecast = forecastDataio[i];
				io_forecast.icon = io_forecast.icon.replace(/night/g,"day");
				var str = '-day';
				io_forecast.icon = io_forecast.icon.concat(str);
				
				var iconClass = iconTable[io_forecast.icon];
				if(io_forecast.max > 95)
					iconClass = 'wi-hot';
				if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.03){
					iconClass = 'wi-day-showers';
				}
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax < 0.07)
					iconClass = 'wi-day-rain';
				else if (io_forecast.icon=='rain-day' && io_forecast.precipIntensityMax > 0.3)
					iconClass = 'wi-umbrella';


				var dt = new Date(io_forecast.timestamp);
				var row = $('<tr/>').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass('wi').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(io_forecast.max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(io_forecast.min)));

				forecastTableio.append(row);
				opacity -= 0.155;
			}


			$('.io3_forecast').updateWithText(forecastTableio, 1000);
		});

		setTimeout(function() {
			updateWeatherForecastio3();
		}, 300000);
	})();



	// (function stockChart(){
	// 	var sym = 'AAPL';
	// 	var dur = 32;
	// 	new Markit.InteractiveChartApi(sym, dur);

	// 	setTimeout(function() {
	// 		stockChart();
	// 	}, 300000);

	// })();

	// (function map() {
	//     // Instanciate the map
	//     $('#container2').highcharts('Map', {
	//         chart : {
	//             borderWidth : 1
	//         },

	//         title : {
	//             text : 'Countries Visited'
	//         },
	//         // subtitle : {
	//         //     text : ''
	//         // },

	//         legend: {
	//             enabled: false
	//         },

	//         series : [{
	//             name: 'Country',
	//             nullColor: "black",
	//             mapData: Highcharts.maps['custom/world'],
	//             data: [{
	//                 code: 'AU',
	//                 value: 1
	//             }, {
	//                 code: 'CA',
	//                 value: 1
	//             }, {
	//                 code: 'CN',
	//                 value: 1
	//             }, {
	//                 code: 'HR',
	//                 value: 1
	//             }, {
	//                 code: 'CZ',
	//                 value: 1
	//             }, {
	//                 code: 'FR',
	//                 value: 1
	//             }, {
	//                 code: 'DE',
	//                 value: 1
	//             }, {
	//                 code: 'GR',
	//                 value: 1
	//             }, {
	//                 code: 'IT',
	//                 value: 1
	//             }, {
	//                 code: 'MX',
	//                 value: 1
	//             }, {
	//                 code: 'NL',
	//                 value: 1
	//             }, {
	//                 code: 'ES',
	//                 value: 1
	//             }, {
	//                 code: 'CH',
	//                 value: 1
	//             }, {
	//                 code: 'TW',
	//                 value: 1
	//             }, {
	//                 code: 'TH',
	//                 value: 1
	//             }, {
	//                 code: 'GB',
	//                 value: 1
	//             }, {
	//                 code: 'US',
	//                 value: 1
	//             }],
	//             joinBy: ['iso-a2', 'code'],
	//             dataLabels: {
	//                 enabled: true,
	//                 //color: 'white',
	//                 color: '#2b908f', 
	//                 style: {
	//                 	fontSize: '20px',
	//                 	textWeight: 'Bold',
	//                 	textShadow: "0 0 0 white"
	//                 	//textShadow: "2px 2px blue"
	//                 },
	//                 formatter: function () {
	//                     if (this.point.value) {
	//                         return this.point.name;
	//                     }
	//                 }
	//             },
	//             tooltip: {
	//                 headerFormat: '',
	//                 pointFormat: '{point.name}'
	//             }
	//         }]
	//     });
	// })();

	(function updateQuote(){

		$.getJSON("http://api.theysaidso.com/qod.json?category=inspire", function(inspire){
		
			console.log(inspire);
		quote[0] = inspire.contents.quotes[0].quote;
		author[0] = "— " + inspire.contents.quotes[0].author;
		format[0] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/qod.json?category=love", function(love){
			console.log(love);
		quote[1] = love.contents.quotes[0].quote;
		author[1] = "— " + love.contents.quotes[0].author;
		format[1] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/qod.json?category=life", function(life){
			console.log(life);
		quote[2] = life.contents.quotes[0].quote;
		author[2] = "— " + life.contents.quotes[0].author;
		format[2] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/qod.json?category=funny", function(funny){
			console.log(funny);
		quote[3] = funny.contents.quotes[0].quote;
		author[3] = "— " + funny.contents.quotes[0].author;
		format[3] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/bible/vod.json", function(bible){
			console.log(bible);
		quote[4] = bible.contents.verse;
		author[4] = bible.contents.book + " " + bible.contents.chapter + ":" + bible.contents.number;
		format[4] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/bible/verse.json", function(bible_rand){
			console.log(bible_rand);
		quote[5] = bible_rand.contents.verse;
		author[5] = bible_rand.contents.book + " " + bible_rand.contents.chapter + ":" + bible_rand.contents.number;
		format[5] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
 	setTimeout(function(){
 		updateQuote();
 	}, 3600000);
	})();


	(function selectQuote(){
		var date = new Date();
	    var min = date.getMinutes();
	    //set compliments to use
	    if (min % 6 ==0) result = 2;
	    else if (min % 6 ==2) result = 0;
	    else if (min % 6 == 4) result = 1;
	    else if (min % 6 == 1) result = 5;
	    else if (min % 6 == 3) result = 3;
	    else result = 4; 


		$('.qod1').updateWithText(quote[result], 1000);
		$('.qod2').updateWithText(author[result], 1000);

	setTimeout(function(){
 		selectQuote();
 	}, 30000);
	})();

});
