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
	// var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
	// for (var beaufort in speeds) {
	// 	var speed = speeds[beaufort];
	// 	if (speed > kmh) {
	// 		return beaufort;
	// 	}
	// }
	// return 12;
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

	//connect do Xbee monitor
	// var socket = io.connect('http://rpi-alarm.local:8082');
	// socket.on('dishwasher', function (dishwasherReady) {
	// 	if (dishwasherReady) {
	// 		$('.dishwasher').fadeIn(2000);
	// 		$('.lower-third').fadeOut(2000);
	// 	} else {
	// 		$('.dishwasher').fadeOut(2000);
	// 		$('.lower-third').fadeIn(2000);
	// 	}
	// });


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

        		//only add fututre events, days doesn't work, we need to check seconds
        		if (seconds >= 0) {
                    if (seconds <= 60*60*5 || seconds >= 60*60*24*2) {
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

	(function updateCurrentWeather()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-sunny-overcast',
			'03d':'wi-day-cloudy',
			'04d':'wi-day-cloudy-windy',
			'09d':'wi-day-showers',
			'10d':'wi-day-rain',
			'11d':'wi-day-thunderstorm',
			'13d':'wi-day-snow',
			'50d':'wi-day-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-alt-cloudy',
			'03n':'wi-night-alt-cloudy',
			'04n':'wi-night-alt-cloudy',
			'09n':'wi-night-alt-showers',
			'10n':'wi-night-alt-rain',
			'11n':'wi-night-alt-thunderstorm',
			'13n':'wi-night-alt-snow',
			'50n':'wi-night-fog'
		}


		$.getJSON('http://api.openweathermap.org/data/2.5/weather', weatherParams, function(json, textStatus) {
			//console.log(json);
			var temp = roundVal(json.main.temp);
			var temp_min = roundVal(json.main.temp_min);
			var temp_max = roundVal(json.main.temp_max);

			var wind = roundVal(json.wind.speed);

			var iconClass = iconTable[json.weather[0].icon];
			if (json.weather[0].id <505 && json.weather[0].id>501)
				iconClass = 'wi-umbrella';
			if (json.weather[0].id == 781 || json.weather[0].id == 900)
				iconClass = 'wi-tornado';
			if (json.weather[0].id == 902)
				iconClass = 'wi-hurricane';
			if (json.weather[0].id == 904)
				iconClass = 'wi-hot';
			if (json.weather[0].id == 903)
				iconClass = 'wi-snowflake-cold';
			if (json.weather[0].id == 905)
				iconClass = 'wi-strong-wind';


			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.temp').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

			// var forecast = 'Min: '+temp_min+'&deg;, Max: '+temp_max+'&deg;';
			// $('.forecast').updateWithText(forecast, 1000);

			var now = new Date();
			var sunrise = new Date(json.sys.sunrise*1000).toTimeString().substring(0,5);
			var sunset = new Date(json.sys.sunset*1000).toTimeString().substring(0,5);

			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + mph(wind) + '<span class="light small"> mph </span>' ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			if (json.sys.sunrise*1000 < (now) && json.sys.sunset*1000 > (now)) {
				sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
			}

			$('.windsun').updateWithText(windString+' '+sunString, 1000);
		});

		setTimeout(function() {
			updateCurrentWeather();
		}, 60000);
	})();

	(function updateWeatherForecast()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-cloudy',
			'03d':'wi-cloudy',
			'04d':'wi-cloudy-windy',
			'09d':'wi-showers',
			'10d':'wi-rain',
			'11d':'wi-thunderstorm',
			'13d':'wi-snow',
			'50d':'wi-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-cloudy',
			'03n':'wi-night-cloudy',
			'04n':'wi-night-cloudy',
			'09n':'wi-night-showers',
			'10n':'wi-night-rain',
			'11n':'wi-night-thunderstorm',
			'13n':'wi-night-snow',
			'50n':'wi-night-alt-cloudy-windy'
		}
			$.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily', weatherParams, function(json, textStatus) {

			var forecastData = {};
			for (var i in json.list) {
				var forecast = json.list[i];
				forecastData[i] = {
					'timestamp':forecast.dt * 1000,
					'icon':forecast.weather[0].icon,
					'min':forecast.temp.min,
					'max':forecast.temp.max
				};

			}
			var forecastTable = $('<table/>').addClass('forecast-table');
			var opacity = 1;
			for (var i in forecastData) {
				var forecast = forecastData[i];
				var iconClass = iconTable[forecast.icon];

				var dt = new Date(forecast.timestamp);
				var row = $('<tr/>').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass('wi').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(forecast.max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(forecast.min)));

				forecastTable.append(row);
				opacity -= 0.155;
			}


			$('.forecast').updateWithText(forecastTable, 1000);
		});


		setTimeout(function() {
			updateWeatherForecast();
		}, 60000);
	})();





//San Diego Weather
	(function updateCurrentWeather2()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-sunny-overcast',
			'03d':'wi-day-cloudy',
			'04d':'wi-day-cloudy-windy',
			'09d':'wi-day-showers',
			'10d':'wi-day-rain',
			'11d':'wi-day-thunderstorm',
			'13d':'wi-day-snow',
			'50d':'wi-day-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-alt-cloudy',
			'03n':'wi-night-alt-cloudy',
			'04n':'wi-night-alt-cloudy',
			'09n':'wi-night-alt-showers',
			'10n':'wi-night-alt-rain',
			'11n':'wi-night-alt-thunderstorm',
			'13n':'wi-night-alt-snow',
			'50n':'wi-night-fog'
		}


		$.getJSON('http://api.openweathermap.org/data/2.5/weather', weatherParams2, function(json, textStatus) {
			//console.log(json);
			var temp = roundVal(json.main.temp);
			var temp_min = roundVal(json.main.temp_min);
			var temp_max = roundVal(json.main.temp_max);

			var wind = roundVal(json.wind.speed);

			var iconClass = iconTable[json.weather[0].icon];
			if (json.weather[0].id <505 && json.weather[0].id>501)
				iconClass = 'wi-umbrella';
			if (json.weather[0].id == 781 || json.weather[0].id == 900)
				iconClass = 'wi-tornado';
			if (json.weather[0].id == 902)
				iconClass = 'wi-hurricane';
			if (json.weather[0].id == 904)
				iconClass = 'wi-hot';
			if (json.weather[0].id == 903)
				iconClass = 'wi-snowflake-cold';
			if (json.weather[0].id == 905)
				iconClass = 'wi-strong-wind';


			var icon = $('<span/>').addClass('icon').addClass('dimmed').addClass('wi').addClass(iconClass);
			$('.temp2').updateWithText(icon.outerHTML()+temp+'&deg;', 1000);

			// var forecast = 'Min: '+temp_min+'&deg;, Max: '+temp_max+'&deg;';
			// $('.forecast').updateWithText(forecast, 1000);

			var now = new Date();
			var sunrise = new Date(json.sys.sunrise*1000).toTimeString().substring(0,5);
			var sunset = new Date(json.sys.sunset*1000).toTimeString().substring(0,5);

			var windString = '<span class="wi wi-strong-wind xdimmed"></span> ' + mph(wind) + '<span class="light small"> mph </span>' ;
			var sunString = '<span class="wi wi-sunrise xdimmed"></span> ' + sunrise;
			if (json.sys.sunrise*1000 < (now) && json.sys.sunset*1000 > (now)) {
				sunString = '<span class="wi wi-sunset xdimmed"></span> ' + sunset;
			}

			$('.windsun2').updateWithText(windString+' '+sunString, 1000);
		});

		setTimeout(function() {
			updateCurrentWeather2();
		}, 60000);
	})();

	(function updateWeatherForecast2()
	{
		var iconTable = {
			'01d':'wi-day-sunny',
			'02d':'wi-day-cloudy',
			'03d':'wi-cloudy',
			'04d':'wi-cloudy-windy',
			'09d':'wi-showers',
			'10d':'wi-rain',
			'11d':'wi-thunderstorm',
			'13d':'wi-snow',
			'50d':'wi-fog',
			'01n':'wi-night-clear',
			'02n':'wi-night-cloudy',
			'03n':'wi-night-cloudy',
			'04n':'wi-night-cloudy',
			'09n':'wi-night-showers',
			'10n':'wi-night-rain',
			'11n':'wi-night-thunderstorm',
			'13n':'wi-night-snow',
			'50n':'wi-night-alt-cloudy-windy'
		}
			$.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily', weatherParams2, function(json, textStatus) {

			var forecastData2 = {};
			for (var i in json.list) {
				var forecast2 = json.list[i];
				forecastData2[i] = {
					'timestamp':forecast2.dt * 1000,
					'icon':forecast2.weather[0].icon,
					'min':forecast2.temp.min,
					'max':forecast2.temp.max
				};

			}
			var forecastTable2 = $('<table/>').addClass('forecast-table2');
			var opacity = 1;
			for (var i in forecastData2) {
				var forecast2 = forecastData2[i];
				var iconClass = iconTable[forecast2.icon];

				var dt = new Date(forecast2.timestamp);
				var row = $('<tr/>').css('opacity', opacity);

				row.append($('<td/>').addClass('day').html(moment.weekdaysShort(dt.getDay())));
				row.append($('<td/>').addClass('icon-small').addClass('wi').addClass(iconClass));
				row.append($('<td/>').addClass('temp-max').html(roundVal(forecast2.max)));
				row.append($('<td/>').addClass('temp-min').html(roundVal(forecast2.min)));

				forecastTable2.append(row);
				opacity -= 0.155;
			}


			$('.forecast2').updateWithText(forecastTable2, 1000);
		});


		setTimeout(function() {
			updateWeatherForecast2();
		}, 60000);
	})();


	(function updateQuote(){

		$.getJSON("http://api.theysaidso.com/qod.json?category=inspire", function(inspire){
		

		quote[0] = inspire.contents.quote;
		author[0] = inspire.contents.author;
		format[0] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/qod.json?category=love", function(love){

		quote[1] = love.contents.quote;
		author[1] = love.contents.author;
		format[1] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/qod.json?category=life", function(life){

		quote[2] = life.contents.quote;
		author[2] = life.contents.author;
		format[2] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/quote.json", function(random){
			console.log(random);
		quote[3] = random.contents.quote;
		author[3] = random.contents.author;
		format[3] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/bible/vod.json", function(bible){
			console.log(bible);
		quote[4] = bible.contents.quote;
		author[4] = bible.contents.author;
		format[4] = '<q class = "quote">' + quote + '</q>' + ' <span class = "author">' + author + '</span>';
		});
		$.getJSON("http://api.theysaidso.com/bible/verse.json", function(bible_rand){
			console.log(bible_rand);
		quote[5] = bible_rand.contents.quote;
		author[5] = bible_rand.contents.author;
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
	    else if (min % 6 == 3) result = 1;
	    else if (min % 6 == 1) result = 5;
	    else if (min % 6 == 4) result = 4;
	    else result = 3; 


		$('.qod1').updateWithText(quote[result], 1000);
		$('.qod2').updateWithText(author[result], 1000);

	setTimeout(function(){
 		selectQuote();
 	}, 30000);
	})();

	// (function fetchNews() {
	// 	$.feedToJson({
	// 		feed: feed,
	// 		success: function(data){
	// 			news = [];
	// 			for (var i in data.item) {
	// 				var item = data.item[i];
	// 				news.push(item.title);
	// 			}
	// 		}
	// 	});
	// 	setTimeout(function() {
	// 		fetchNews();
	// 	}, 60000);
	// })();

	// (function showNews() {
	// 	var newsItem = news[newsIndex];
	// 	$('.news').updateWithText(newsItem,2000);

	// 	newsIndex--;
	// 	if (newsIndex < 0) newsIndex = news.length - 1;
	// 	setTimeout(function() {
	// 		showNews();
	// 	}, 5500);
	// })();

});
