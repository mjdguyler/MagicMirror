// for navigator language
var lang = window.navigator.language;
// you can change the language
var lang = 'en';

//change weather params here:
//units: metric or imperial
var weatherParams = {
    'q':'Santa Clara, US',
    'units':'imperial',
    'cnt':'10',
    'mode':'JSON'
};

var weatherParams2 = {
    'q':'San Diego, US',
    'units':'imperial',
    'cnt':'10',
    'mode':'JSON'
};

//var feed = 'http://feeds.nos.nl/nosjournaal?format=rss';
var feed = 'http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/technology/rss.xml';
//var feed = 'http://www.nu.nl/feeds/rss/achterklap.rss';
//var feed = 'http://www.nu.nl/feeds/rss/opmerkelijk.rss';
//var feed = 'http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml';

// compliments:
var morning = [
            'Good morning, handsome!',
            'Enjoy your day!',
            'How was your sleep?'
        ];
        
var afternoon = [
            'Hello, beauty!',
            'Looking good today!'
        ];

//var evening = new FileReader();
//evening.onload = function(e){
//    var text = evening.result;
//}       
//evening.readAsText("evening.txt");
var evening=[
            'Wow, you look beautiful!',
            'You look nice!',
            'Have a nice night!'
        ];