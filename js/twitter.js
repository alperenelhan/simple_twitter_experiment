$(document).ready(function() {
    $("#instant-search").focus();
    $("#instant-search").val("");
    $("html").click(function(e) {
        if (e.which == 1) {
            $("#instant-search").focus();
        }
    });
    var timer;
    var interval = 10;
    var intervalId;
    var count = 5;
    var query = location.search.replace('?', '').split('&').map(function(val) {
        return val.split('=');
    });
    if (query instanceof Array && query.length > 0 && query[0][0] === "q") {
        $("#instant-search").val(query[0][1]);
        getTweets();
    }

    function refreshTweets (interval) {
    	clearInterval(intervalId);
    	intervalId = setInterval(function() {
	        getTweets();
	    }, interval * 1000);
    }
    

    $('#instant-search').keyup(function() {
    	clearTimeout(timer);
        timer = setTimeout(function () {
        	getTweets();
        }, 200);
    });
    $('.options').on('mouseover mouseout', function() {
       if (! $('#popover').hasClass("active")) {
        	$(".hover-text").toggle();    
        }
  	});

  	$('#interval-slider').slider({
  		range: "min",
  		max: 60,
  		min: 1,
  		value: interval,
  		slide: function (event, ui) {
  			$("#interval").html(ui.value);
  			interval = ui.value;
  		},
  		stop: function (event, ui) {
			refreshTweets(ui.value);
  		}
  	});
  	$('#count-slider').slider({
  		range: "min",
  		max: 50,
  		min: 1,
  		value: count,
  		slide: function (event, ui) {
  			$("#count").html(ui.value);
  			count = ui.value;
  		},
  		stop: getTweets
  	});

  	$('.options').click(function () {
  		$('#popover').toggle().toggleClass("active");
  	});

    function getTweets() {
        var value = $('#instant-search').val().trim();
        if (value === "") {
            $("#tweets").empty();
            return true;
        }
        $.ajax({
            dataType: "jsonp",
            url: "http://search.twitter.com/search.json",
            data: {
            	"q": value,
            	"rpp": count,
            	"results_type": "recent"
            },
            success: function(data) {
                $("#tweets").empty();
                $.each(data.results, function(i, item) {
                    $("#tweets").append(tweetBoxElement(item));
                });
            }
        });
    }

    function tweetBoxElement (item) {
	    return "<div class='tweet'>" + "<div class='user'>" + 
	    	"<a href='https://twitter.com/" + item.from_user + "' target='_blank'>" + 
	    	"<img class='profile-pic' src='" + item.profile_image_url_https + "' ></a>" + 
	    	"</div>" + "<div class='tweet-text' ><strong>" + item.from_user_name + "</strong> @" + 
	    	item.from_user + " (" + item.created_at + ") <br>" + item.text + "</div></div>";
    }
});