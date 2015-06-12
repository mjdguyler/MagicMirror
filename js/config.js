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
            'If you look up \"beautiful\" in the dictionary, there would be an accurate description of you.',
            'On a scale of 1 to 10, you\'re an 11.',
            'It\'s nice to have someone in your life who can make you smile even if they\'re not around.',
            'Life is like a book and there are a thousand pages yet to be read.',
            'Some people do more than light up a room... they light up the hearts of all who are in it.',
            'Good morning, Beautiful!',
            'Enjoy your day!',
            'You\'re a hot mess. Emphasis on the hot part. And the mess. Not gonna lie, you\'re kinda crazy sometimes.',
            'Your smile is contageous.',
            'Everyone is so proud of you.',
            'You\'re capable of moving the world. Follow your dreams.',
            'Hey you. You are beautiful and don\'t let anyone tell you otherwise!.',
            'Best friends are those in life that make you laugh a little louder, smile a little brighter, and live a little better.',
            'How was your sleep?',
            'If I could give you one thing, it would be the ability to see yourself as other see you. Then you would realize what a truly special person you are.',
            'I love how you dress. Even when it\'s sweatpants.',
            'You\'re weird: (w)onderful, (e)xciting, (i)nteresting, (r)eal, and (d)ifferent.',
            'If you think missing me is too hard, you should try missing you',
            'You are somebody\'s reason to smile.',
            'The minute you think of giving up, think of the reason why you held on for so long.',
            'If you were a triangle, you\'d be acute one.',
            'Today you are you that is truer than true. There is no one alive that is youer than you. - Dr. Seuss',
            'Every morning starts a new page in your story. Make is a great one today.',
            'Somebunny loves you.',
            'Don\'t let a bad day make you feel like you have a bad life.',
            'To me you are perfect.',
            'I am very indecisive, but I know without a doubt that you are my favorite.',
            'Whenever I look into those eyes, the world melts away leaving just me and you.',
            'You don\'t need makeup, you\'re already perfect.',
            'Friends are God\'s way of taking care of us.',
            'You\'re the Rachel to my Ross.',
            'Today\'s outfit = thumbs up',
            'You are crafted with beauty and purpose.',



        ];
        
var afternoon = [
            'Somebunny loves you.',
            'Don\'t let a bad day make you feel like you have a bad life.',
            'To me you are perfect.',
            'I am very indecisive, but I know without a doubt that you are my favorite.',
            'You\'re a hot mess. Emphasis on the hot part. And the mess. Not gonna lie, you\'re kinda crazy sometimes.',
            'Today you are you that is truer than true. There is no one alive that is youer than you. - Dr. Seuss',
            'Your smile is contageous.',
            'Whenever I look into those eyes, the world melts away leaving just you and me.',
            'You don\'t need makeup, you\'re already perfect.',
            'Friends are God\'s way of taking care of us.',
            'You are crafted with beauty and purpose.',
            'Hey you. You are beautiful and don\'t let anyone tell you otherwise!.',
            'If I could give you one thing, it would be the ability to see yourself as other see you. Then you would realize what a truly special person you are.',
            'Best friends are those in life that make you laugh a little louder, smile a little brighter, and live a little better.',
            'Hello, beauty!',
            'On a scale of 1 to 10, you\'re an 11.',
            'You\'re like sunshine on a rainy day.',
            'My life would be so different without you.',
            'There\'s so much warmth in your eyes.',
            'You\'re so good at what you do!',
            'You are the beautiful cupcake in a world full of muffins.',
            'You are more important than you realize.',
            'Thank you for touching my life in ways you never know. Friends like you don\'t come every lifetime.',
            'Life is like a book, everything before you was just the Introduction.',
            'Life is like a book and there are a thousand pages yet to be read.', //re word
            'Sometimes all you need is to walk on the beach with a friend.',
            'It\'s nice to have someone in your life who can make you smile even if they\'re not around.',
            'Our time together is like a nap; it just doesn\'t last long enough.',
            'Sitting next to you doing absolutely nothing means absolutely everything to me.',
            'You make me smile, even when I\'m trying not to.',
            'You\'re my cup of tea.',
            'Some people do more than light up a room... they light up the hearts of all who are in it.',
    
            'We may not have it all together, but together we have it all.',
            'There\'s rarely a dull moment when I\'m with you.',
            'Looking good today!',
            'If you look up \"beautiful\" in the dictionary, there would be an accurate description of you.',

        ];
//var evening = new FileReader();
//evening.onload = function(e){
//    var text = evening.result;
//}       
//evening.readAsText("evening.txt");
var evening=[
            'You\'re a hot mess. Emphasis on the hot part. And the mess. Not gonna lie, you\'re kinda crazy sometimes.',
            'Today you are you that is truer than true. There is no one alive that is youer than you. - Dr. Seuss',
            'Your smile is contageous.',
            'Whenever I look into those eyes, the world melts away leaving just me and you.',
            'You don\'t need makeup, you\'re already perfect.',
            'Friends are God\'s way of taking care of us.',
            'You are crafted with beauty and purpose.',
            'Hey you. You are beautiful and don\'t let anyone tell you otherwise!.',
            'If I could give you one thing, it would be the ability to see yourself as other see you. Then you would realize what a truly special person you are.',
            'Best friends are those in life that make you laugh a little louder, smile a little brighter, and live a little better.',
            'You\'re like sunshine on a rainy day.',
            'The minute you think of giving up, think of the reason why you held on for so long.',
            'I love how you dress. Even when it\'s sweatpants.',
            'If you look up \"beautiful\" in the dictionary, there would be an accurate description of you.',
            'On a scale of 1 to 10, you\'re an 11.',
            'It\'s nice to have someone in your life who can make you smile even if they\'re not around.',
            'Life is like a book and there are a thousand pages yet to be read.',
            'Some people do more than light up a room... they light up the hearts of all who are in it.',
            'Wow, you look gorgeous!',
            'This Evening\'s outfit = A+.',
            'You look lovely today.',
            'Any day spent with you is my favorite day.',
            'Relax. You are enough. You have enough. You do enough.',
            'Shhh, I think you\'re gorgeous.',
            'Somebunny loves you.',
            'Follow your own star.',
            'Just look up. We are both under the same starry sky.',
            'Don\'t let a bad day make you feel like you have a bad life.',
            'A true friend laughs at your stories even though they\'re not funny, and sympathizes with your troubles even though they\'re not so bad.',
            'To me you are perfect.',
            'I am very indecisive, but I know without a doubt that you are my favorite.',
            'Who is the most wonderful and pretty girl today? You are, of course!',
            'Netflix, Pizza, and Pajamas? Sounds like a perfect night to me.',
            'You look nice!',
            'Have a nice night!'
        ];