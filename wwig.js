



(function() {

  jQuery(document).ready(function($) {
 
    var $card = $(".profile-card-inner"),
        sname = $card.attr("data-screen-name"),
        uid = $card.attr("data-user-id"),
        $stream = $("#stream-items-id"),
        last_height = $stream.outerHeight();
    
    
    $('body').append("<style>#wwig { position:absolute; top: -13px; left: -2px; width: 154px; z-index: 5;} .profile_card .profile_picture { position relative; top:0; left:0; } .stats li.new_stats{ border-top: 1px solid #E8E8E8; display: block; padding: 6px 12px 6px 0; color: #999; font-size: 10px; line-height: 16px; text-transform: uppercase; } .new_stats strong { color: #333; font-size: 14px; } #wwig-wwig-per-day strong{ padding: 2px 4px; border-radius: 3px; background: #856C48; color: #FDE8C4; text-shadow: 0 1px#725B3B; }</style>");
    
    function differentiate_replies(){
      $stream.find(".stream-item").each( function( idx, el ){
        var $t = $(this),
            $cont = $t.find('.js-tweet-text'),
            cont = $cont.html(),
            $first_link = $cont.find('a').eq(0).clone().wrap('<span />'),
            first_link = $first_link.parent().html();
        if ( cont.indexOf( first_link, 0)==0 ){
          $t.css('overflow','hidden')
            .animate( { //position: 'relative',
                        //marginLeft: '-10px',
                        opacity: .3,
                        //height: 10,
                        //borderRadius: 10,
                         });
        }      
      });
    }
    
    differentiate_replies();
    
    setInterval( function(){
        var new_height = $stream.outerHeight();
        if ( new_height > last_height ){
          differentiate_replies();
          last_height = new_height;
        }
      }, 2000);
    
    
    
    
    $.getJSON( "//api.twitter.com/1/statuses/user_timeline.json?callback=?",
		        { include_entities: "false",
              include_rts: "true",
              exclude_replies: "false",
              screen_name: sname,
              count: 200 },
		  function(data) {
		    
		    var num_tweets = data.length,
		        num_days = (new Date() - new Date(data[data.length-1].created_at))/86400000,
		        tweets_per_day = Math.round( (num_tweets/num_days)*100 )/100,
		        wwig_tweets = data.length,
		        wwig_per_day = 0;
		        
		    for (var i=0; i<data.length; i++ ){
		      if ( data[i].text.indexOf("@",0)==0 ) --wwig_tweets;
		    }
		    wwig_per_day = Math.round( (wwig_tweets/num_days)*100 )/100
		    		    
		    var $tpd = $('#wwig-tweets-per-day'),
		        $wpd = $('#wwig-wwig-per-day');
		    if ( $tpd.length==0 ){
          $tpd = $('<li id="wwig-tweets-per-day" class="new_stats" data-msg="An estimated number of tweets per day"><strong>'+tweets_per_day+'</strong> Tweets / Day</li>')
                  .appendTo(('.js-mini-profile-stats')).hide().slideDown();
          $wpd = $('<li id="wwig-wwig-per-day" class="new_stats" data-msg="What you would get per day (not including @ tweets to other folks)"><strong>'+wwig_per_day+'</strong> WWIG / Day</li>')
                  .appendTo(('.js-mini-profile-stats')).hide().slideDown();
          
		    }
		    $tpd.find('strong').html(tweets_per_day);
		    $wpd.find('strong').html(wwig_per_day);
		    
		    $("li.new_stats").click(function(){
		      var msg = $(this).attr('data-msg');
		      if ( msg ) alert( msg );
		    });
		    
		    var $wwig = $('#wwig'),
		        img = "//github.com/jonahgoldstein/WWIG/raw/master/wwig.png";
		        console.log( img );
		    if ($wwig.length==0){
          $wwig = $('<img src="'+img+'" id="wwig">')
                  .prependTo('.profile-card .profile-picture')
                  .hide()
                  .fadeIn();
		    }		    
		  }
		);
    
      
    
  });
  
})();