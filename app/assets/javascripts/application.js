// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.

// ----- CSRF TOKENS ----- \\
$(document).ready(function() {
	$.ajaxSetup({headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')}});
});

// ----- LEGACY IE BROWSER DETECTION ----- \\
$.browser = {};
(function() {
	$.browser.msie = false;
	$.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
		$.browser.msie = true;
		$.browser.version = RegExp.$1;
	}
})();

// ----- SETUP ----- \\

function formatPage() {
	// Force panel to fill panel_wrapper
	$.each($("div.panel:not(.full)"), function() {
    if ($(this).height() < $(this).parent().height()) {
      $(this).css("height", $(this).parent().height()+"px");
    } else {
      $(this).parent().css("height", $(this).height()+"px");
    }
	});

	$.each($("div.corner"), function() {
    var horz = $(this).hasClass("left") ? "right" : "left";
    var vert = $(this).hasClass("top") ? "top" : ($(this).hasClass("middle") ? "middle" : "bottom");
    
    // Make opposite corner panels match heights
    if ($("div.corner."+vert+"."+horz).height() > $(this).height()) {
      $(this).css("height", $("div.corner."+vert+"."+horz).height()+"px");
      $(this).find("div.panel").css("height", $(this).height()+"px");
    } else if ($("div.corner."+vert+"."+horz).height() < $(this).height()) {
      $("div.corner."+vert+"."+horz).css("height", $(this).height()+"px");
      $("div.corner."+vert+"."+horz).find("div.panel").css("height", $(this).height()+"px");
    }
    
    // Realign top offsets
    if (horz == "right" && $(this).offset().top < $("div.corner."+vert+"."+horz).offset().top) {
      $("div.corner."+vert+"."+horz).css("margin-top", "-"+($("div.corner."+vert+"."+horz).offset().top-$(this).offset().top)+"px");
    }
	});

	// Dynamically position home page cross to calculated panel sizes
	if ($("div.home.left")[0]) {
    var offset = $("div.inner-header").height()+$("div#menu").height()+$("div.ticker-wrapper").height()+$("div.home.top.left").height()+20;
    $("div.cross-top").css("top", (offset-75)+"px");
    $("div.cross-left").css("top", offset+"px");
    $("div.cross-middle").css("top", offset+"px");
    $("div.cross-right").css("top", offset+"px");
    $("div.cross-bottom").css("top", (offset+40)+"px");
    $("div.cross").show();
	}
}

$(window).load(function() {
  $("div#loading").hide();
  $("div#content").show();
  setTimeout(function() {
    $.each($("iframe"), function() {
      $(this).attr("src", function(i,val) { return val });
    });
  }, 10);

  // Image slideshows
	var index = 1;
	window.slideshows = 0;
	$.each($("div.slideshow"), function() {
    $.each($(this).find("div.image_container"), function() {
    	$(this).attr("id", "image_container"+index);
      $("div#image_container"+index+" > img:gt(0)").hide();
      index++;
    });
	});

  window.slideshows = index;
	setInterval(function() {
		for (i=1;i<=window.slideshows;i++) {
			$("#image_container"+i+" > img:first")
				.fadeOut(1000)
				.next()
				.fadeIn(1000)
				.end()
				.appendTo("#image_container"+i);
		}
	}, 5000);

	// Resize panels to images
	$.each($("div.image_container"), function() {
		var height = $(this).parents("div.panel").height();
		$.each($(this).find("img"), function() {
			$(this).css("max-width", $(this).parent().width());
			height = Math.max(height, $(this).height());
			$(this).parents("div.panel").css("height", height+"px");
		});
		// Stretch images
		$.each($(this).find("img"), function() {
			$(this).css("height", height+"px");
		});
	});

	// Resize panels to iframes/embeds
	$.each($("div.panel iframe, div.panel embed"), function() {
		var height = $(this).parents("div.panel").height();
		height = Math.max(height, parseInt($(this).attr("height")));
		$(this).parents("div.panel").css("height", height+"px");
		formatPage();
	});

	// Resize splits
	$.each($("div.panel.split"), function() {
		var height = $(this).height();
		height = Math.max(height, $(this).find("div.split-left").height());
		height = Math.max(height, $(this).find("div.split-right").height());
		$(this).css("height", height+"px");
		formatPage();
	});

	// Accessibility options
	$("a.accessibility").click(function() {
		$.post("/accessibility/"+$(this).attr("id"), function() {
			window.location.reload();
		});
	});

  formatPage();
});

// ----- MAILING LIST ----- \\
function subscribe() {
  $("span#mailing_list_error").hide();
  $("span#mailing_list_success").hide();
  var email = $("input#mailing_list").val();
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    $.post("/subscribe", {email_address: email}, function() {
      $("span#mailing_list_success").show();
      setTimeout(function() {
        $("span#mailing_list_success").fadeOut("fast");
      }, 3000);
    });
  } else {
    $("span#mailing_list_error").show();
    setTimeout(function() {
      $("span#mailing_list_error").fadeOut("fast");
    }, 3000);
  }
}

function unsubscribe() {
  $("span#mailing_list_error").hide();
  $("span#mailing_list_success").hide();
  var email = $("input#mailing_list").val();
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    $.post("/unsubscribe", {email_address: email}, function() {
      $("span#mailing_list_success").show();
      setTimeout(function() {
        $("span#mailing_list_success").fadeOut("fast");
      }, 3000);
    });
  } else {
    $("span#mailing_list_error").show();
    setTimeout(function() {
      $("span#mailing_list_error").fadeOut("fast");
    }, 3000);
  }
}

// ----- CONTACT ----- \\
function submitContact() {
  var params = {};
  $.each($(".contact"), function(i,input) {
    params[$(input).attr("id")] = $(input).val();
  });
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (params["email_address"].length == 0 || re.test(params["email_address"])) {
    $.post("/contact", {note: params}, function(response) {
      if (response.success) {
        $(".contact").val("");
        $("span#contact_success").show();
        setTimeout(function() {
          $("span#contact_success").fadeOut("fast");
        }, 3000);
      } else {
        $("span#contact_error").html(response.error);
        $("span#contact_error").show();
        setTimeout(function() {
          $("span#contact_error").fadeOut("fast");
        }, 3000);
      }
    });
  } else {
    $("span#contact_error").html("The email address provided appears to be invalid.");
    $("span#contact_error").show();
    setTimeout(function() {
      $("span#contact_error").fadeOut("fast");
    }, 3000);
  }
}


// ----- CMS ----- \\

// Checks that the filename suffix in el is in allowed array
function checkFile(el,allowed) {
	var suffix = $(el).val().split(".")[$(el).val().split(".").length-1].toUpperCase();
	if (!(allowed.indexOf(suffix) !== -1)) {
		alert("File type not allowed,\nAllowed files: *."+allowed.join(",*."));
		$(el).val("");
	}
}

// Removes invalid characters and replaces whitespace with underscores
function checkFilename(el) {
	$(el).val($(el).val().toLowerCase().replace(/[^a-z0-9\s_-]/g,"").replace(/\s+/g,"_"));
}

// Fixes DELETE routes
$(document).ready(function() {
	$("a.rails-delete").unbind("click").click(function() {
		if (confirm("Are you sure?")) {
			$.post($(this).data("link"), function() {
				window.location.reload();
			});
		}
	});
});

// ----- PRAYER GENERATOR ----- \\

function randomPrayer() {
  var truth=new Array()
  truth[0]='Dear Lord, help me to recognize the things that keep me from You and discard them. Slow me down and help me find the path to You. Amen'
  truth[1]='Dear Father, help me to always be aware of the marvels of my life now and not when I am in the depths of despair. AMEN'
  truth[2]='Walk beside me today, Lord, and show me the way to contentment and serenity. Amen'
  truth[3]= 'I thank You, Lord, for giving me so many people and so many opportunities to love. Grant that I do not fail them. AMEN';
  truth[4]= 'Father, help me to bury all bitter and unkind thoughts. Guide me all this day and keep me free from self-pity. Amen';
  truth[5]= 'When I am afraid, Lord, it means I have strayed away from You. Please help me to stay near You and grant me the faith that You will protect me. Amen';
  truth[6]= 'Dear Lord, You are here , ever near, close to my heart. I cherish You and need You. Thank You for Your Care. Amen';
  truth[7]= 'Gracious Lord, You have given me hope and Your love for me has made me whole. Thank You for holding me up. Amen ';
  truth[8]= 'Lord, I know that ultimately time is all we have ~  help me to savour it not save it. Amen';
  truth[9]= 'Dear Father, when I centre my life on You, my days are flooded with vitality. Thank You for Your tender mercies. Amen';
  truth[10]= 'Precious Lord, do not let me take this wonderful life for granted. I pause now to say a truth of thanks. Amen ';
  truth[11]= 'Father, I know I am too quick to see the faults in others. Help me to see my own faults just as clearly and instil in me the desire to shed my faults. Amen ';
  truth[12]= 'Lord, make me eager to hear Your voice and follow Your holy words in my daily life. Amen ';
  truth[13]= 'Lord, one distraction after another fills my thoughts, grant me grace to hear Your loving voice within my soul. Amen ';
  truth[14]= 'I need to remember, Dear Lord, that You are always within calling distance and ready to listen whenever I ask. Amen ';
  truth[15]= 'I joyfully put my complete trust in You. You have a purpose for me ~ open my heart and my eyes to that purpose. Amen';
  truth[16]= 'Father, I need to remember that You replenish love in me as I give love to others. Teach me to serve You joyfully. Amen ';
  truth[17]= 'Lord, when my dreams are shattered, walk beside me, comfort me and show me the way to other dreams and fulfilment. Amen ';
  truth[18]= 'Dear Lord, I feel burdened by my sins and pray for Your merciful forgiveness. Help me to forgive myself and walk with You. Amen ';
  truth[19]= 'Heavenly Father, help me to remember to set aside time for You today. Silence my busy mind, calm me and let me feel Your loving presence. Amen';
  truth[20]= 'Dear Lord, are my troubles really opportunities in disguise Help me to see beyond these painful times and to trust in Your guidance. Amen ';
  truth[21]= 'Dear Lord, help me to trust You so that I may feel You are with me always and therefore I need not fear. Amen ';
  truth[22]= 'Heavenly Father, there are times when I want to share experiences and thoughts with other people, But often I do not feel they will understand. I am thankful I can talk with You and feel Your understanding. Amen ';
  truth[23]= 'O Lord, mould me, while I am silent, listening and calm, to be the person You planned for me to be. Amen';
  truth[24]= 'Precious Lord, today I will commend more and condemn less. Help me to refrain from judging others and keep me ever mindful of this promise all through this day. Amen ';
  truth[25]='God is always with me. God bestows blessings of life, light and love on me and all His children. We have a special place in God\'s world. Amen';
  truth[26]='O Father, You enter my heart even when I am unaware of Your presence. Unbend me so that I will do Your will with joy. Amen';
  truth[27]='Dear Lord, I know that pity will not feed the hungry, Prod me to help the hungry today with food, both spiritual and physical. Amen';
  truth[28]='Father, You have given me a sense of right and wrong. If I make choices that I know will not please You, give me courage to admit I am wrong. Amen';
  truth[29]='Dear Lord, I know You are greater than my problems. When I am troubled let me not forget that I will find the strength I need from You. Amen';
  truth[30]=' Father in heaven, Your love for me is greater than I deserve. Help me to be worthy of Your love and to be the person You want me to be. Amen';
  truth[31]='O Father, direct me to find the way to reach those that seek peace and relief from fear and anxiety. Show me how to be Your servant. Amen ';
  truth[32]='Abba Father, thank you for Your grace and forgiveness, Amen';
  truth[33]='Holy Lord, often I do not hear the silent cries for help from those around me. Quiet me and make me more aware of those who are hurting. Amen ';
  truth[34]='Dear Father, when I am wrong make me willing to admit it. When I am right, make me easy to live with. Amen  ';
  truth[35]='O GOD, I pray for the courage to embrace dreams, the strength to sacrifice for them, and the determination to fulfil them. Amen';
  truth[36]='Father in heaven, thank You for lightening my burdens. Thank You for hearing me when I cry out to You in pain. Thank You for loving me. Amen ';
  truth[37]='Dear Lord, I ask forgiveness for not doing many things that I should have done, and for doing many things I should not have done. I\'m truly thankful that You are so forgiving. Amen ';
  truth[38]='Dear Lord, help me to see the good in those whose lives touch mine. Banish criticism from my heart and mind. Amen';
  truth[39]='Lord, wherever I travel in life, whenever I feel lonely or distressed, help me to remember that You are always with me. Amen';
  truth[40]='Oh God, sometimes doubt seems to consume me. Help me not to make faith dependent upon the things I pray for and don\'t get. Amen';
  truth[41]='Lord, I often recall old hurts. Help me to remember that nothing is gained by living in the past. Teach me how to truly forgive and forget. Amen';
  truth[42]='You have opened my heart, Dear Lord, now enter there and grant me peace. Amen'
  truth[43]='Father, I am often envious of those who seem to have more than I. Teach me to count my blessings and share with those who have so much less than I. Amen'; 
  truth[44]='Father, help me to stop worrying about money. Instil in me the faith and confidence that You always provide. Amen';
  truth[45]='Dear Lord, those of Your children who are hungry ~ let me feed them. Those who are hurt ~ let me comfort them. Amen';
  truth[46]='Dear Lord, help me in my distress, open my heart so I may feel Your caring, loving Spirit. Amen';
  truth[47]='Father, I need to be reminded that You are not my servant, but rather I am Your servant, and to serve Your children is to please You. Amen';
  truth[48]='Holy Father, I ask for courage to let You control my life. If I have lost faith in You even for a moment, restore it. Amen';
  truth[49]='Dear Father, help me to remember that You are at work within me and around me each day, even when I am blind to Your good. Amen';
  truth[50]='Remind me, Lord, to take time to reach out to someone who is ill, who is frightened, and who is lonely. Amen';
  truth[51]='Heavenly Father, thank You for being near me when I reach out to You for comfort. When I fall apart You miraculously put me back together again. Amen';
  truth[52]='O Lord, help me to find You when I search for You. I come to You searching for courage and comfort to carry me through this day. Amen';
  truth[53]='Dear Father, help me to be receptive to Your Word ~ write it on my heart so that I may live my life to please You. Amen';
  truth[54]='Thank You, Lord, for Your gentle guidance. With Your help I will accept worthy Challenges. Amen';
  truth[55]='Lord, I need to remember that I am far from perfect, that I hurt and offend. Help me to be a better person. Amen';
  truth[56]='O Father, help me to be sensitive to the needs and pain of those around me. Guide me as I try to help them. Amen';
  truth[57]='Father in heaven, I am a link in a chain that connects all Your children. Lead me on the path to strengthen that connection. Amen';
  truth[58]='Lord, help me to understand that it is only by serving others in Your name that we find love, peace, and joy in our faith, and in our lives. Amen';
  truth[59]='When I have hurt someone, Lord help me to sincerely say "I\'m sorry," and not sit in judgement and say the hurt was deserved. Amen';
  truth[60]='Father in heaven, do You want me to feed the hungry, find the lost, make music in the heart\? Reveal Your wishes in my heart so that I may do Your good works. Amen';
  truth[61]='I rely on You, Dear Lord, and my work becomes pleasant. I rely on You and my burdens fall away. Amen';
  truth[62]='Dear Lord, teach me to trust You wherever I go, and wherever I go I shall do Your work. Amen';
  truth[63]='Lord, should I feel sorry for myself today, help me to remember that no one lives in perfection and that tomorrow is a new untarnished day. Amen ';
  truth[64]='Heavenly Lord, I know I have a mission that You have bestowed upon just me. I pray that mission will be revealed to me so that I may do Your good works. Amen';
  truth[65]='Dear Lord, sometimes I compare my life with that of another. Help me to appreciate my many blessings, and remind me that I would not trade my life with anyone else if I could see behind their closed doors. Amen ';
  truth[66]='Father, release me from wanting to straighten out everybody\'s affairs. I need to remember I am not a judge. Amen';
  truth[67]='Father, I pray that my words and actions will not hurt anyone today. If I cannot speak and act kindly, let me be silent. Amen';
  truth[68]='Father, I have an undesirable habit of thinking I must say something on every occasion. Help me to remember there is much to learn by listening. Amen';
  truth[69]='Loving Father, Your wisdom is mine to use if only I would take time to read and listen to Your Word. Help me to live as the scriptures teach. Amen';
  truth[70]='Dear Lord, Thank You for healing my hurt heart, for soothing my sorrow and for loving me. Amen';
  truth[71]='If I get discouraged today, Lord, let me feel Your presence and guidance. As I extend my hand, let me feel Your reassuring touch and abundant love. Amen';
  truth[72]='Father, give the ability to see good in unexpected places and talents in unexpected people. I ask for the grace to tell them so. Amen';
  truth[73]='Dear Lord, there are times when I hunger for faith, feel lost and lonely with doubt. Guide me through this darkness. Amen';
  truth[74]='Keep me reasonably sweet, Dear Lord. I do not want to be a saint~ Some of them are so hard to live with ~ But a sour old person is very unappealing. Amen';
  truth[75]='Thank You, Dear Lord, for listening to me with love and patience. I pray for a thankful and grateful heart for Your blessings. Amen';
  truth[76]='Dear Lord, teach me that marvellous lesson that it is possible I may be mistaken occasionally. Amen';
  truth[77]='Father, don\'t let me be too busy to love. Show me how to encourage those who are discouraged and at the end of their rope. Amen ';
  truth[78]='Thank You, Lord, because of You, I live in Your light. It guides me and shines through me. My mind and my heart are open to love and forgiveness. Amen';
  truth[79]='Dear Lord, You are my hope, my trust, my strength, my comfort, and my faithful helper in every need. Amen';
  truth[80]='Merciful Lord, cleanse me from all the prejudices I harbour within me. Forgive me for all the injustices of my pride. Amen ';
  truth[81]='Let the laughter fill my home, Dear Lord, for laughter is the heartbeat of a home and the fuel for the warmth there. Amen';
  truth[82]='Father in heaven, help me to remember that the more faith I have in You, the more strength You give me. Amen';
  truth[83]='Dear Lord, help me not to put too much importance in possessions. Possessions are meant to enhance life, not to be a focal part of living. Amen';
  truth[84]='O Lord, when I am angry and upset, please calm me down. help me to remember when I put my trust in You, You will see me through the day. Amen';
  truth[85]='Father, stay close to those who are grieving and release them from their sorrow. Heartache is draining and makes life lonelier. I pray You will help them. Amen';
  truth[86]='When my burden seems too heavy to carry, You give me stamina to go on. You do not desert me when I call out to You. Amen';
  truth[87]='Dear Father, keeping  the promises I have made to You is my responsibility not Yours. Put me to work fulfilling those promises. Amen ';
  truth[88]='Dear Lord, help me to see past the surface and into the beauty of human hearts as You do. Amen';
  truth[89]='Dear Lord, help me make a difference in someone\'s life so that they will be glad I am their friend. Amen';
  truth[90]='Dear Lord, I am often blind to Your presence in my life and to the daily joys with which You bless me. Amen ';
  truth[91]='Lord, I know that You are everywhere and if I cry out and I cannot find You it is because I have not completely opened my heart to You. Amen ';
  truth[92]='Father, I pray that You will help me not to be so self-centred. Fill me with the desire to think of others and to help them how ever I am able. Amen ';
  truth[93]='Dear Lord, You have shown me that there is no greater deed than the one done for others. With Your help, may I always be willing to give of myself as You give to me. Amen';
  truth[94]='Dear Lord. my heart clings to You. I know You are with me always and when You touch my soul, I am strengthened. Amen ';
  truth[95]='Dear Lord, help me to build bridges, not walls and guide me across those bridges to help someone in need. Amen';
  truth[96]='O Lord, may loving be my reason for living. I ask that You warm my heart, soften my rigid walls and bend my pride. Amen';
  truth[97]='Father in heaven, let me set aside my wants for just this one day. With genuine effort and caring, make it a better day for someone else. Amen ';
  truth[98]='Dear Lord, I will try to look forward to the changes in my life without fear...I know You will lead me safely up every path. Amen ';
  truth[99]='Father, You know what I say, what I do and what I think and feel. I pray that the way I live pleases You. Amen';
  return truth[Math.floor(Math.random()*(truth.length))];
}

$(document).ready(function() {
/*
    jQuery News Ticker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 2 of the License.
 
    jQuery News Ticker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with jQuery News Ticker.  If not, see <http://www.gnu.org/licenses/>.
*/
(function($){  
	$.fn.ticker = function(options) { 
		// Extend our default options with those provided.
		// Note that the first arg to extend is an empty object -
		// this is to keep from overriding our "defaults" object.
		var opts = $.extend({}, $.fn.ticker.defaults, options); 

		// check that the passed element is actually in the DOM
		if ($(this).length == 0) {
			if (window.console && window.console.log) {
				window.console.log('Element does not exist in DOM!');
			}
			else {
				alert('Element does not exist in DOM!');		
			}
			return false;
		}
		
		/* Get the id of the UL to get our news content from */
		var newsID = '#' + $(this).attr('id');

		/* Get the tag type - we will check this later to makde sure it is a UL tag */
		var tagType = $(this).get(0).tagName; 	

		return this.each(function() { 
			// get a unique id for this ticker
			var uniqID = getUniqID();
			
			/* Internal vars */
			var settings = {				
				position: 0,
				time: 0,
				distance: 0,
				newsArr: {},
				play: true,
				paused: false,
				contentLoaded: false,
				dom: {
					contentID: '#ticker-content-' + uniqID,
					titleID: '#ticker-title-' + uniqID,
					titleElem: '#ticker-title-' + uniqID + ' SPAN',
					tickerID : '#ticker-' + uniqID,
					wrapperID: '#ticker-wrapper-' + uniqID,
					revealID: '#ticker-swipe-' + uniqID,
					revealElem: '#ticker-swipe-' + uniqID + ' SPAN',
					controlsID: '#ticker-controls-' + uniqID,
					prevID: '#prev-' + uniqID,
					nextID: '#next-' + uniqID,
					playPauseID: '#play-pause-' + uniqID
				}
			};

			// if we are not using a UL, display an error message and stop any further execution
			if (tagType != 'UL' && tagType != 'OL' && opts.htmlFeed === true) {
				debugError('Cannot use <' + tagType.toLowerCase() + '> type of element for this plugin - must of type <ul> or <ol>');
				return false;
			}

			// set the ticker direction
			opts.direction == 'rtl' ? opts.direction = 'right' : opts.direction = 'left';
			
			// lets go...
			initialisePage();
			/* Function to get the size of an Object*/
			function countSize(obj) {
			    var size = 0, key;
			    for (key in obj) {
			        if (obj.hasOwnProperty(key)) size++;
			    }
			    return size;
			};

			function getUniqID() {
				var newDate = new Date;
				return newDate.getTime();			
			}
			
			/* Function for handling debug and error messages */ 
			function debugError(obj) {
				if (opts.debugMode) {
					if (window.console && window.console.log) {
						window.console.log(obj);
					}
					else {
						alert(obj);			
					}
				}
			}

			/* Function to setup the page */
			function initialisePage() {
				// process the content for this ticker
				processContent();
				
				// add our HTML structure for the ticker to the DOM
				$(newsID).wrap('<div id="' + settings.dom.wrapperID.replace('#', '') + '"></div>');
				
				// remove any current content inside this ticker
				$(settings.dom.wrapperID).children().remove();
				
				$(settings.dom.wrapperID).append('<div id="' + settings.dom.tickerID.replace('#', '') + '" class="ticker"><div id="' + settings.dom.titleID.replace('#', '') + '" class="ticker-title"><span><!-- --></span></div><p id="' + settings.dom.contentID.replace('#', '') + '" class="ticker-content"></p><div id="' + settings.dom.revealID.replace('#', '') + '" class="ticker-swipe"><span><!-- --></span></div></div>');
				$(settings.dom.wrapperID).removeClass('no-js').addClass('ticker-wrapper has-js ' + opts.direction);
				// hide the ticker
				$(settings.dom.tickerElem + ',' + settings.dom.contentID).hide();
				// add the controls to the DOM if required
				if (opts.controls) {
					// add related events - set functions to run on given event
					$(settings.dom.controlsID).live('click mouseover mousedown mouseout mouseup', function (e) {
						var button = e.target.id;
						if (e.type == 'click') {	
							switch (button) {
								case settings.dom.prevID.replace('#', ''):
									// show previous item
									settings.paused = true;
									$(settings.dom.playPauseID).addClass('paused');
									manualChangeContent('prev');
									break;
								case settings.dom.nextID.replace('#', ''):
									// show next item
									settings.paused = true;
									$(settings.dom.playPauseID).addClass('paused');
									manualChangeContent('next');
									break;
								case settings.dom.playPauseID.replace('#', ''):
									// play or pause the ticker
									if (settings.play == true) {
										settings.paused = true;
										$(settings.dom.playPauseID).addClass('paused');
										pauseTicker();
									}
									else {
										settings.paused = false;
										$(settings.dom.playPauseID).removeClass('paused');
										restartTicker();
									}
									break;
							}	
						}
						else if (e.type == 'mouseover' && $('#' + button).hasClass('controls')) {
							$('#' + button).addClass('over');
						}
						else if (e.type == 'mousedown' && $('#' + button).hasClass('controls')) {
							$('#' + button).addClass('down');
						}
						else if (e.type == 'mouseup' && $('#' + button).hasClass('controls')) {
							$('#' + button).removeClass('down');
						}
						else if (e.type == 'mouseout' && $('#' + button).hasClass('controls')) {
							$('#' + button).removeClass('over');
						}
					});
					// add controls HTML to DOM
					$(settings.dom.wrapperID).append('<ul id="' + settings.dom.controlsID.replace('#', '') + '" class="ticker-controls"><li id="' + settings.dom.playPauseID.replace('#', '') + '" class="jnt-play-pause controls"><a href=""><!-- --></a></li><li id="' + settings.dom.prevID.replace('#', '') + '" class="jnt-prev controls"><a href=""><!-- --></a></li><li id="' + settings.dom.nextID.replace('#', '') + '" class="jnt-next controls"><a href=""><!-- --></a></li></ul>');
				}
				if (opts.displayType != 'fade') {
                	// add mouse over on the content
               		$(settings.dom.contentID).mouseover(function () {
               			if (settings.paused == false) {
               				pauseTicker();
               			}
               		}).mouseout(function () {
               			if (settings.paused == false) {
               				restartTicker();
               			}
               		});
				}
				// we may have to wait for the ajax call to finish here
				if (!opts.ajaxFeed) {
					setupContentAndTriggerDisplay();
				}
			}

			/* Start to process the content for this ticker */
			function processContent() {
				// check to see if we need to load content
				if (settings.contentLoaded == false) {
					// construct content
					if (opts.ajaxFeed) {
						if (opts.feedType == 'xml') {							
							$.ajax({
								url: opts.feedUrl,
								cache: false,
								dataType: opts.feedType,
								async: true,
								success: function(data){
									count = 0;	
									// get the 'root' node
									for (var a = 0; a < data.childNodes.length; a++) {
										if (data.childNodes[a].nodeName == 'rss') {
											xmlContent = data.childNodes[a];
										}
									}
									// find the channel node
									for (var i = 0; i < xmlContent.childNodes.length; i++) {
										if (xmlContent.childNodes[i].nodeName == 'channel') {
											xmlChannel = xmlContent.childNodes[i];
										}		
									}
									// for each item create a link and add the article title as the link text
									for (var x = 0; x < xmlChannel.childNodes.length; x++) {
										if (xmlChannel.childNodes[x].nodeName == 'item') {
											xmlItems = xmlChannel.childNodes[x];
											var title, link = false;
											for (var y = 0; y < xmlItems.childNodes.length; y++) {
												if (xmlItems.childNodes[y].nodeName == 'title') {      												    
													title = xmlItems.childNodes[y].lastChild.nodeValue;
												}
												else if (xmlItems.childNodes[y].nodeName == 'link') {												    
													link = xmlItems.childNodes[y].lastChild.nodeValue; 
												}
												if ((title !== false && title != '') && link !== false) {
												    settings.newsArr['item-' + count] = { type: opts.titleText, content: '<a href="' + link + '">' + title + '</a>' };												    count++;												    title = false;												    link = false;
												}
											}	
										}		
									}			
									// quick check here to see if we actually have any content - log error if not
									if (countSize(settings.newsArr < 1)) {
										debugError('Couldn\'t find any content from the XML feed for the ticker to use!');
										return false;
									}
									settings.contentLoaded = true;
									setupContentAndTriggerDisplay();
								}
							});							
						}
						else {
							debugError('Code Me!');	
						}						
					}
					else if (opts.htmlFeed) { 
						if($(newsID + ' LI').length > 0) {
							$(newsID + ' LI').each(function (i) {
								// maybe this could be one whole object and not an array of objects?
								settings.newsArr['item-' + i] = { type: opts.titleText, content: $(this).html()};
							});		
						}	
						else {
							debugError('Couldn\'t find HTML any content for the ticker to use!');
							return false;
						}
					}
					else {
						debugError('The ticker is set to not use any types of content! Check the settings for the ticker.');
						return false;
					}					
				}			
			}

			function setupContentAndTriggerDisplay() {

				settings.contentLoaded = true;

				// update the ticker content with the correct item
				// insert news content into DOM
				$(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
				$(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);

				// set the next content item to be used - loop round if we are at the end of the content
				if (settings.position == (countSize(settings.newsArr) -1)) {
					settings.position = 0;
				}
				else {		
					settings.position++;
				}			

				// get the values of content and set the time of the reveal (so all reveals have the same speed regardless of content size)
				distance = $(settings.dom.contentID).width();
				time = distance / opts.speed;

				// start the ticker animation						
				revealContent();		
			}

			// slide back cover or fade in content
			function revealContent() {
				$(settings.dom.contentID).css({'opacity' : '1', 'margin' : '0px', 'padding' : '0px'});
				if(settings.play) {	
					// get the width of the title element to offset the content and reveal	
          offset = 0;
	
					$(settings.dom.revealID).css(opts.direction, offset + 'px');
					// show the reveal element and start the animation
					if (opts.displayType == 'fade') {
						// fade in effect ticker
						$(settings.dom.revealID).hide(0, function () {
							$(settings.dom.contentID).css(opts.direction, offset + 'px').fadeIn(opts.fadeInSpeed, postReveal);
						});						
					}
					else if (opts.displayType == 'scroll') {
						// to code
					}
					else {
						// default bbc scroll effect
						$(settings.dom.revealElem).show(0, function () {
							$(settings.dom.contentID).css(opts.direction, offset + 'px').show();
							// set our animation direction
							animationAction = opts.direction == 'right' ? { marginRight: distance + 'px'} : { marginLeft: distance + 'px' };
							$(settings.dom.revealID).css('margin-' + opts.direction, '0px').delay(20).animate(animationAction, time, 'linear', postReveal);
						});		
					}
				}
				else {
					return false;					
				}
			};

			// here we hide the current content and reset the ticker elements to a default state ready for the next ticker item
			function postReveal() {				
				if(settings.play) {		
					// we have to separately fade the content out here to get around an IE bug - needs further investigation
					$(settings.dom.contentID).delay(opts.pauseOnItems).fadeOut(opts.fadeOutSpeed);
					// deal with the rest of the content, prepare the DOM and trigger the next ticker
					if (opts.displayType == 'fade') {
						$(settings.dom.contentID).fadeOut(opts.fadeOutSpeed, function () {
							$(settings.dom.wrapperID)
								.find(settings.dom.revealElem + ',' + settings.dom.contentID)
									.hide()
								.end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
									.show()
								.end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
									.removeAttr('style');								
							setupContentAndTriggerDisplay();						
						});
					}
					else {
						$(settings.dom.revealID).hide(0, function () {
							$(settings.dom.contentID).fadeOut(opts.fadeOutSpeed, function () {
								$(settings.dom.wrapperID)
									.find(settings.dom.revealElem + ',' + settings.dom.contentID)
										.hide()
									.end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
										.show()
									.end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
										.removeAttr('style');								
								setupContentAndTriggerDisplay();						
							});
						});	
					}
				}
				else {
					$(settings.dom.revealElem).hide();
				}
			}

			// pause ticker
			function pauseTicker() {				
				settings.play = false;
				// stop animation and show content - must pass "true, true" to the stop function, or we can get some funky behaviour
				$(settings.dom.tickerID + ',' + settings.dom.revealID + ',' + settings.dom.titleID + ',' + settings.dom.titleElem + ',' + settings.dom.revealElem + ',' + settings.dom.contentID).stop(true, true);
				$(settings.dom.revealID + ',' + settings.dom.revealElem).hide();
				$(settings.dom.wrapperID)
					.find(settings.dom.titleID + ',' + settings.dom.titleElem).show()
						.end().find(settings.dom.contentID).show();
			}

			// play ticker
			function restartTicker() {				
				settings.play = true;
				settings.paused = false;
				// start the ticker again
				postReveal();	
			}

			// change the content on user input
			function manualChangeContent(direction) {
				pauseTicker();
				switch (direction) {
					case 'prev':
						if (settings.position == 0) {
							settings.position = countSize(settings.newsArr) -2;
						}
						else if (settings.position == 1) {
							settings.position = countSize(settings.newsArr) -1;
						}
						else {
							settings.position = settings.position - 2;
						}
						$(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
						$(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);						
						break;
					case 'next':
						$(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
						$(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);
						break;
				}
				// set the next content item to be used - loop round if we are at the end of the content
				if (settings.position == (countSize(settings.newsArr) -1)) {
					settings.position = 0;
				}
				else {		
					settings.position++;
				}	
			}
		});  
	};  

	// plugin defaults - added as a property on our plugin function
	$.fn.ticker.defaults = {
		speed: 0.10,			
		ajaxFeed: false,
		feedUrl: '',
		feedType: 'xml',
		displayType: 'reveal',
		htmlFeed: true,
		debugMode: true,
		controls: false,
		titleText: '',	
		direction: 'ltr',	
		pauseOnItems: 3000,
		fadeInSpeed: 600,
		fadeOutSpeed: 300
	};	
})(jQuery);
});


// LIGHTGALLERY
/** ==========================================================

* jquery lightGallery.js v1.1.5 // 3/29/2015
* http://sachinchoolur.github.io/lightGallery/
* Released under the MIT License - http://opensource.org/licenses/mit-license.html  ---- FREE ----

=========================================================/**/
;
(function ($) {
    "use strict";
    $.fn.lightGallery = function (options) {
        var defaults = {
                mode: 'slide',
                useCSS: true,
                cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
                easing: 'linear', //'for jquery animation',//
                speed: 600,
                addClass: '',

                closable: true,
                loop: false,
                auto: false,
                pause: 4000,
                escKey: true,
                controls: true,
                hideControlOnEnd: false,

                preload: 1, //number of preload slides. will exicute only after the current slide is fully loaded. ex:// you clicked on 4th image and if preload = 1 then 3rd slide and 5th slide will be loaded in the background after the 4th slide is fully loaded.. if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
                showAfterLoad: true,
                selector: null,
                index: false,

                lang: {
                    allPhotos: 'All photos'
                },
                counter: false,

                exThumbImage: false,
                thumbnail: true,
                showThumbByDefault: false,
                animateThumb: true,
                currentPagerPosition: 'middle',
                thumbWidth: 100,
                thumbMargin: 5,


                mobileSrc: false,
                mobileSrcMaxWidth: 640,
                swipeThreshold: 50,
                enableTouch: true,
                enableDrag: true,

                vimeoColor: 'CCCCCC',
                youtubePlayerParams: false, // See: https://developers.google.com/youtube/player_parameters
                videoAutoplay: true,
                videoMaxWidth: '855px',

                dynamic: false,
                dynamicEl: [],
                //callbacks

                onOpen: function (plugin) {},
                onSlideBefore: function (plugin) {},
                onSlideAfter: function (plugin) {},
                onSlideNext: function (plugin) {},
                onSlidePrev: function (plugin) {},
                onBeforeClose: function (plugin) {},
                onCloseAfter: function (plugin) {}
            },
            el = $(this),
            plugin = this,
            $children = null,
            index = 0,
            isActive = false,
            lightGalleryOn = false,
            isTouch = document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints,
            $gallery, $galleryCont, $slider, $slide, $prev, $next, prevIndex, $thumb_cont, $thumb, windowWidth, interval, usingThumb = false,
            aTiming = false,
            aSpeed = false;
        var settings = $.extend(true, {}, defaults, options);
        var lightGallery = {
            init: function () {
                el.each(function () {
                    var $this = $(this);
                    if (settings.dynamic) {
                        $children = settings.dynamicEl;
                        index = 0;
                        prevIndex = index;
                        setUp.init(index);
                    } else {
                        if (settings.selector !== null) {
                            $children = $(settings.selector);
                        } else {
                            $children = $this.children();
                        }
                        $children.on('click', function (e) {
                            if (settings.selector !== null) {
                                $children = $(settings.selector);
                            } else {
                                $children = $this.children();
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            index = $children.index(this);
                            prevIndex = index;
                            setUp.init(index);
                        });
                    }
                });
            }
        };
        var setUp = {
            init: function () {
                isActive = true;
                this.structure();
                this.getWidth();
                this.closeSlide();
                this.autoStart();
                this.counter();
                this.slideTo();
                this.buildThumbnail();
                this.keyPress();
                if (settings.index) {
                    this.slide(settings.index);
                    this.animateThumb(settings.index);
                } else {
                    this.slide(index);
                    this.animateThumb(index);
                }
                if (settings.enableDrag) {
                    this.touch();
                }
                if (settings.enableTouch) {
                    this.enableTouch();
                }

                setTimeout(function () {
                    $gallery.addClass('opacity');
                }, 50);
            },
            structure: function () {
                $('body').append('<div id="lg-outer" class="' + settings.addClass + '"><div id="lg-gallery"><div id="lg-slider"></div><a id="lg-close" class="close"></a></div></div>').addClass('light-gallery');
                $galleryCont = $('#lg-outer');
                $gallery = $('#lg-gallery');
                if (settings.showAfterLoad === true) {
                    $gallery.addClass('show-after-load');
                }
                $slider = $gallery.find('#lg-slider');
                var slideList = '';
                if (settings.dynamic) {
                    for (var i = 0; i < settings.dynamicEl.length; i++) {
                        slideList += '<div class="lg-slide"></div>';
                    }
                } else {
                    $children.each(function () {
                        slideList += '<div class="lg-slide"></div>';
                    });
                }
                $slider.append(slideList);
                $slide = $gallery.find('.lg-slide');
            },
            closeSlide: function () {
                var $this = this;
                if (settings.closable) {
                    $('#lg-outer')
                        .on('click', function (event) {
                            if ($(event.target).is('.lg-slide')) {
                                plugin.destroy(false);
                            }
                        });
                }
                $('#lg-close').bind('click touchend', function () {
                    plugin.destroy(false);
                });
            },
            getWidth: function () {
                var resizeWindow = function () {
                    windowWidth = $(window).width();
                };
                $(window).bind('resize.lightGallery', resizeWindow());
            },
            doCss: function () {
                var support = function () {
                    var transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
                    var root = document.documentElement;
                    for (var i = 0; i < transition.length; i++) {
                        if (transition[i] in root.style) {
                            return true;
                        }
                    }
                };
                if (settings.useCSS && support()) {
                    return true;
                }
                return false;
            },
            enableTouch: function () {
                var $this = this;
                if (isTouch) {
                    var startCoords = {},
                        endCoords = {};
                    $('body').on('touchstart.lightGallery', function (e) {
                        endCoords = e.originalEvent.targetTouches[0];
                        startCoords.pageX = e.originalEvent.targetTouches[0].pageX;
                        startCoords.pageY = e.originalEvent.targetTouches[0].pageY;
                    });
                    $('body').on('touchmove.lightGallery', function (e) {
                        var orig = e.originalEvent;
                        endCoords = orig.targetTouches[0];
                        e.preventDefault();
                    });
                    $('body').on('touchend.lightGallery', function (e) {
                        var distance = endCoords.pageX - startCoords.pageX,
                            swipeThreshold = settings.swipeThreshold;
                        if (distance >= swipeThreshold) {
                            $this.prevSlide();
                            clearInterval(interval);
                        } else if (distance <= -swipeThreshold) {
                            $this.nextSlide();
                            clearInterval(interval);
                        }
                    });
                }
            },
            touch: function () {
                var xStart, xEnd;
                var $this = this;
                $('.light-gallery').bind('mousedown', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    xStart = e.pageX;
                });
                $('.light-gallery').bind('mouseup', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    xEnd = e.pageX;
                    if (xEnd - xStart > 20) {
                        $this.prevSlide();
                    } else if (xStart - xEnd > 20) {
                        $this.nextSlide();
                    }
                });
            },
            isVideo: function (src, index) {
                var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i);
                var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
                var iframe = false;
                if (settings.dynamic) {
                    if (settings.dynamicEl[index].iframe == 'true') {
                        iframe = true;
                    }
                } else {
                    if ($children.eq(index).attr('data-iframe') == 'true') {
                        iframe = true;
                    }
                }
                if (youtube || vimeo || iframe) {
                    return true;
                }
            },
            loadVideo: function (src, _id) {
                var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i);
                var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
                var video = '';
                var a = '';
                if (youtube) {
                    if (settings.videoAutoplay === true && lightGalleryOn === false) {
                        a = '?autoplay=1&rel=0&wmode=opaque';
                    } else {
                        a = '?wmode=opaque';
                    }

                    if (settings.youtubePlayerParams) {
                        var youtubeParams = $.param(settings.youtubePlayerParams);
                        a = a + '&' + youtubeParams;
                    }

                    video = '<iframe class="object" width="560" height="315" src="//www.youtube.com/embed/' + youtube[1] + a + '" frameborder="0" allowfullscreen></iframe>';
                } else if (vimeo) {
                    if (settings.videoAutoplay === true && lightGalleryOn === false) {
                        a = 'autoplay=1&amp;';
                    } else {
                        a = '';
                    }
                    video = '<iframe class="object" id="video' + _id + '" width="560" height="315"  src="http://player.vimeo.com/video/' + vimeo[1] + '?' + a + 'byline=0&amp;portrait=0&amp;color=' + settings.vimeoColor + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                } else {
                    video = '<iframe class="object" frameborder="0" src="' + src + '"  allowfullscreen="true"></iframe>';
                }
                return '<div class="video-cont" style="max-width:' + settings.videoMaxWidth + ' !important;"><div class="video">' + video + '</div></div>';
            },
            addHtml: function (index) {
                var dataSubHtml = null;
                if (settings.dynamic) {
                    dataSubHtml = settings.dynamicEl[index]['sub-html'];
                } else {
                    dataSubHtml = $children.eq(index).attr('data-sub-html');
                }
                if (typeof dataSubHtml !== 'undefined' && dataSubHtml !== null) {
                    var fL = dataSubHtml.substring(0, 1);
                    if (fL == '.' || fL == '#') {
                        dataSubHtml = $(dataSubHtml).html();
                    } else {
                        dataSubHtml = dataSubHtml;
                    }
                    $slide.eq(index).append(dataSubHtml);
                }
            },
            preload: function (index) {
                var newIndex = index;
                for (var k = 0; k <= settings.preload; k++) {
                    if (k >= $children.length - index) {
                        break;
                    }
                    this.loadContent(newIndex + k, true);
                }
                for (var h = 0; h <= settings.preload; h++) {
                    if (newIndex - h < 0) {
                        break;
                    }
                    this.loadContent(newIndex - h, true);
                }
            },
            loadObj: function (r, index) {
                var $this = this;
                $slide.eq(index).find('.object').on('load error', function () {
                    $slide.eq(index).addClass('complete');
                });
                if (r === false) {
                    if (!$slide.eq(index).hasClass('complete')) {
                        $slide.eq(index).find('.object').on('load error', function () {
                            $this.preload(index);
                        });
                    } else {
                        $this.preload(index);
                    }
                }
            },
            loadContent: function (index, rec) {
                var $this = this;
                var i, j, l = $children.length - index;
                var src;

                if (settings.preload > $children.length) {
                    settings.preload = $children.length;
                }
                if (settings.mobileSrc === true && windowWidth <= settings.mobileSrcMaxWidth) {
                    if (settings.dynamic) {
                        src = settings.dynamicEl[index].mobileSrc;
                    } else {
                        src = $children.eq(index).attr('data-responsive-src');
                    }
                }

                // Fall back to use non-responsive source if no responsive source was found
                if (!src) {
                    if (settings.dynamic) {
                        src = settings.dynamicEl[index].src;
                    } else {
                        src = $children.eq(index).attr('data-src');
                    }
                }
                var time = 0;
                if (rec === true) {
                    time = settings.speed + 400;
                }

                if (typeof src !== 'undefined' && src !== '') {
                    if (!$this.isVideo(src, index)) {
                        setTimeout(function () {
                            if (!$slide.eq(index).hasClass('loaded')) {
                                $slide.eq(index).prepend('<img class="object" src="' + src + '" />');
                                $this.addHtml(index);
                                $slide.eq(index).addClass('loaded');
                            }
                            $this.loadObj(rec, index);
                        }, time);
                    } else {
                        setTimeout(function () {
                            if (!$slide.eq(index).hasClass('loaded')) {
                                $slide.eq(index).prepend($this.loadVideo(src, index));
                                $this.addHtml(index);
                                $slide.eq(index).addClass('loaded');

                                if (settings.auto && settings.videoAutoplay === true) {
                                    clearInterval(interval);
                                }
                            }
                            $this.loadObj(rec, index);
                        }, time);

                    }
                } else {
                    setTimeout(function () {
                        if (!$slide.eq(index).hasClass('loaded')) {
                            var dataHtml = null;
                            if (settings.dynamic) {
                                dataHtml = settings.dynamicEl[index].html;
                            } else {
                                dataHtml = $children.eq(index).attr('data-html');
                            }
                            if (typeof dataHtml !== 'undefined' && dataHtml !== null) {
                                var fL = dataHtml.substring(0, 1);
                                if (fL == '.' || fL == '#') {
                                    dataHtml = $(dataHtml).html();
                                } else {
                                    dataHtml = dataHtml;
                                }
                            }
                            if (typeof dataHtml !== 'undefined' && dataHtml !== null) {
                                $slide.eq(index).append('<div class="video-cont" style="max-width:' + settings.videoMaxWidth + ' !important;"><div class="video">' + dataHtml + '</div></div>');
                            }
                            $this.addHtml(index);
                            $slide.eq(index).addClass('loaded complete');

                            if (settings.auto && settings.videoAutoplay === true) {
                                clearInterval(interval);
                            }
                        }
                        $this.loadObj(rec, index);
                    }, time);
                }

            },
            counter: function () {
                if (settings.counter === true) {
                    var slideCount = $("#lg-slider > div").length;
                    $gallery.append("<div id='lg-counter'><span id='lg-counter-current'></span> / <span id='lg-counter-all'>" + slideCount + "</span></div>");
                }
            },
            buildThumbnail: function () {
                if (settings.thumbnail === true && $children.length > 1) {
                    var $this = this,
                        $close = '';
                    if (!settings.showThumbByDefault) {
                        $close = '<span class="close ib"><i class="bUi-iCn-rMv-16" aria-hidden="true"></i></span>';
                    }
                    $gallery.append('<div class="thumb-cont"><div class="thumb-info">' + $close + '</div><div class="thumb-inner"></div></div>');
                    $thumb_cont = $gallery.find('.thumb-cont');
                    $prev.after('<a class="cl-thumb"></a>');
                    $prev.parent().addClass('has-thumb');
                    $gallery.find('.cl-thumb').bind('click touchend', function () {
                        $gallery.addClass('open');
                        if ($this.doCss() && settings.mode === 'slide') {
                            $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                            $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                        }
                    });
                    $gallery.find('.thumb-cont .close').bind('click touchend', function () {
                        $gallery.removeClass('open');
                    });
                    var thumbInfo = $gallery.find('.thumb-info');
                    var $thumb_inner = $gallery.find('.thumb-inner');
                    var thumbList = '';
                    var thumbImg;
                    if (settings.dynamic) {
                        for (var i = 0; i < settings.dynamicEl.length; i++) {
                            thumbImg = settings.dynamicEl[i].thumb;
                            thumbList += '<div class="thumb"><img src="' + thumbImg + '" /></div>';
                        }
                    } else {
                        $children.each(function () {
                            if (settings.exThumbImage === false || typeof $(this).attr(settings.exThumbImage) == 'undefined' || $(this).attr(settings.exThumbImage) === null) {
                                thumbImg = $(this).find('img').attr('src');
                            } else {
                                thumbImg = $(this).attr(settings.exThumbImage);
                            }
                            thumbList += '<div class="thumb"><img src="' + thumbImg + '" /></div>';
                        });
                    }
                    $thumb_inner.append(thumbList);
                    $thumb = $thumb_inner.find('.thumb');
                    $thumb.css({
                        'margin-right': settings.thumbMargin + 'px',
                        'width': settings.thumbWidth + 'px'
                    });
                    if (settings.animateThumb === true) {
                        var width = ($children.length * (settings.thumbWidth + settings.thumbMargin));
                        $gallery.find('.thumb-inner').css({
                            'width': width + 'px',
                            'position': 'relative',
                            'transition-duration': settings.speed + 'ms'
                        });
                    }
                    $thumb.bind('click touchend', function () {
                        usingThumb = true;
                        var index = $(this).index();
                        $thumb.removeClass('active');
                        $(this).addClass('active');
                        $this.slide(index);
                        $this.animateThumb(index);
                        clearInterval(interval);
                    });
                    thumbInfo.prepend('<span class="ib count">' + settings.lang.allPhotos + ' (' + $thumb.length + ')</span>');
                    if (settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    }
                }
            },
            animateThumb: function (index) {
                if (settings.animateThumb === true) {
                    var thumb_contW = $gallery.find('.thumb-cont').width();
                    var position;
                    switch (settings.currentPagerPosition) {
                    case 'left':
                        position = 0;
                        break;
                    case 'middle':
                        position = (thumb_contW / 2) - (settings.thumbWidth / 2);
                        break;
                    case 'right':
                        position = thumb_contW - settings.thumbWidth;
                    }
                    var left = ((settings.thumbWidth + settings.thumbMargin) * index - 1) - position;
                    var width = ($children.length * (settings.thumbWidth + settings.thumbMargin));
                    if (left > (width - thumb_contW)) {
                        left = width - thumb_contW;
                    }
                    if (left < 0) {
                        left = 0;
                    }
                    if (this.doCss()) {
                        $gallery.find('.thumb-inner').css('transform', 'translate3d(-' + left + 'px, 0px, 0px)');
                    } else {
                        $gallery.find('.thumb-inner').animate({
                            left: -left + "px"
                        }, settings.speed);
                    }
                }
            },
            slideTo: function () {
                var $this = this;
                if (settings.controls === true && $children.length > 1) {
                    $gallery.append('<div id="lg-action"><a id="lg-prev"></a><a id="lg-next"></a></div>');
                    $prev = $gallery.find('#lg-prev');
                    $next = $gallery.find('#lg-next');
                    $prev.bind('click', function () {
                        $this.prevSlide();
                        clearInterval(interval);
                    });
                    $next.bind('click', function () {
                        $this.nextSlide();
                        clearInterval(interval);
                    });
                }
            },
            autoStart: function () {
                var $this = this;
                if (settings.auto === true) {
                    interval = setInterval(function () {
                        if (index + 1 < $children.length) {
                            index = index;
                        } else {
                            index = -1;
                        }
                        index++;
                        $this.slide(index);
                    }, settings.pause);
                }
            },
            keyPress: function () {
                var $this = this;
                $(window).bind('keyup.lightGallery', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.keyCode === 37) {
                        $this.prevSlide();
                        clearInterval(interval);
                    }
                    if (e.keyCode === 38 && settings.thumbnail === true && $children.length > 1) {
                        if (!$gallery.hasClass('open')) {
                            if ($this.doCss() && settings.mode === 'slide') {
                                $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                                $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                            }
                            $gallery.addClass('open');
                        }
                    } else if (e.keyCode === 39) {
                        $this.nextSlide();
                        clearInterval(interval);
                    }
                    if (e.keyCode === 40 && settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        if ($gallery.hasClass('open')) {
                            $gallery.removeClass('open');
                        }
                    } else if (settings.escKey === true && e.keyCode === 27) {
                        if (!settings.showThumbByDefault && $gallery.hasClass('open')) {
                            $gallery.removeClass('open');
                        } else {
                            plugin.destroy(false);
                        }
                    }
                });
            },
            nextSlide: function () {
                var $this = this;
                index = $slide.index($slide.eq(prevIndex));
                if (index + 1 < $children.length) {
                    index++;
                    $this.slide(index);
                } else {
                    if (settings.loop) {
                        index = 0;
                        $this.slide(index);
                    } else if (settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    } else {
                        $slide.eq(index).find('.object').addClass('right-end');
                        setTimeout(function () {
                            $slide.find('.object').removeClass('right-end');
                        }, 400);
                    }
                }
                $this.animateThumb(index);
                settings.onSlideNext.call(this, plugin);
            },
            prevSlide: function () {
                var $this = this;
                index = $slide.index($slide.eq(prevIndex));
                if (index > 0) {
                    index--;
                    $this.slide(index);
                } else {
                    if (settings.loop) {
                        index = $children.length - 1;
                        $this.slide(index);
                    } else if (settings.thumbnail === true && $children.length > 1 && !settings.showThumbByDefault) {
                        $gallery.addClass('open');
                    } else {
                        $slide.eq(index).find('.object').addClass('left-end');
                        setTimeout(function () {
                            $slide.find('.object').removeClass('left-end');
                        }, 400);
                    }
                }
                $this.animateThumb(index);
                settings.onSlidePrev.call(this, plugin);
            },
            slide: function (index) {
                var $this = this;
                if (lightGalleryOn) {
                    setTimeout(function () {
                        $this.loadContent(index, false);
                    }, settings.speed + 400);
                    if (!$slider.hasClass('on')) {
                        $slider.addClass('on');
                    }
                    if (this.doCss() && settings.speed !== '') {
                        if (!$slider.hasClass('speed')) {
                            $slider.addClass('speed');
                        }
                        if (aSpeed === false) {
                            $slider.css('transition-duration', settings.speed + 'ms');
                            aSpeed = true;
                        }
                    }
                    if (this.doCss() && settings.cssEasing !== '') {
                        if (!$slider.hasClass('timing')) {
                            $slider.addClass('timing');
                        }
                        if (aTiming === false) {
                            $slider.css('transition-timing-function', settings.cssEasing);
                            aTiming = true;
                        }
                    }
                    settings.onSlideBefore.call(this, plugin);
                } else {
                    $this.loadContent(index, false);
                }
                if (settings.mode === 'slide') {
                    var isiPad = navigator.userAgent.match(/iPad/i) !== null;
                    if (this.doCss() && !$slider.hasClass('slide') && !isiPad) {
                        $slider.addClass('slide');
                    } else if (this.doCss() && !$slider.hasClass('use-left') && isiPad) {
                        $slider.addClass('use-left');
                    }
                    /*                  if(this.doCss()){
                        $slider.css({ 'transform' : 'translate3d('+(-index*100)+'%, 0px, 0px)' });
                    }*/
                    if (!this.doCss() && !lightGalleryOn) {
                        $slider.css({
                            left: (-index * 100) + '%'
                        });
                        //$slide.eq(index).css('transition','none');
                    } else if (!this.doCss() && lightGalleryOn) {
                        $slider.animate({
                            left: (-index * 100) + '%'
                        }, settings.speed, settings.easing);
                    }
                } else if (settings.mode === 'fade') {
                    if (this.doCss() && !$slider.hasClass('fade-m')) {
                        $slider.addClass('fade-m');
                    } else if (!this.doCss() && !$slider.hasClass('animate')) {
                        $slider.addClass('animate');
                    }
                    if (!this.doCss() && !lightGalleryOn) {
                        $slide.fadeOut(100);
                        $slide.eq(index).fadeIn(100);
                    } else if (!this.doCss() && lightGalleryOn) {
                        $slide.eq(prevIndex).fadeOut(settings.speed, settings.easing);
                        $slide.eq(index).fadeIn(settings.speed, settings.easing);
                    }
                }
                if (index + 1 >= $children.length && settings.auto && settings.loop === false) {
                    clearInterval(interval);
                }
                $slide.eq(prevIndex).removeClass('current');
                $slide.eq(index).addClass('current');
                if (this.doCss() && settings.mode === 'slide') {
                    if (usingThumb === false) {
                        $('.prev-slide').removeClass('prev-slide');
                        $('.next-slide').removeClass('next-slide');
                        $slide.eq(index - 1).addClass('prev-slide');
                        $slide.eq(index + 1).addClass('next-slide');
                    } else {
                        $slide.eq(index).prevAll().removeClass('next-slide').addClass('prev-slide');
                        $slide.eq(index).nextAll().removeClass('prev-slide').addClass('next-slide');
                    }
                }
                if (settings.thumbnail === true && $children.length > 1) {
                    $thumb.removeClass('active');
                    $thumb.eq(index).addClass('active');
                }
                if (settings.controls && settings.hideControlOnEnd && settings.loop === false && $children.length > 1) {
                    var l = $children.length;
                    l = parseInt(l) - 1;
                    if (index === 0) {
                        $prev.addClass('disabled');
                        $next.removeClass('disabled');
                    } else if (index === l) {
                        $prev.removeClass('disabled');
                        $next.addClass('disabled');
                    } else {
                        $prev.add($next).removeClass('disabled');
                    }
                }
                prevIndex = index;
                lightGalleryOn === false ? settings.onOpen.call(this, plugin) : settings.onSlideAfter.call(this, plugin);
                setTimeout(function () {
                    lightGalleryOn = true;
                });
                usingThumb = false;
                if (settings.counter) {
                    $("#lg-counter-current").text(index + 1);
                }
                $(window).bind('resize.lightGallery', function () {
                    setTimeout(function () {
                        $this.animateThumb(index);
                    }, 200);
                });
            }
        };
        plugin.isActive = function () {
            if (isActive === true) {
                return true;
            } else {
                return false;
            }

        };
        plugin.destroy = function (d) {
            isActive = false;
            d = typeof d !== 'undefined' ? false : true;
            settings.onBeforeClose.call(this, plugin);
            var lightGalleryOnT = lightGalleryOn;
            lightGalleryOn = false;
            aTiming = false;
            aSpeed = false;
            usingThumb = false;
            clearInterval(interval);
            if (d === true) {
                $children.off('click touch touchstart');
            }
            $('.light-gallery').off('mousedown mouseup');
            $('body').off('touchstart.lightGallery touchmove.lightGallery touchend.lightGallery');
            $(window).off('resize.lightGallery keyup.lightGallery');
            if (lightGalleryOnT === true) {
                $gallery.addClass('fade-m');
                setTimeout(function () {
                    $galleryCont.remove();
                    $('body').removeClass('light-gallery');
                }, 500);
            }
            settings.onCloseAfter.call(this, plugin);
        };
        lightGallery.init();
        return this;
    };
}(jQuery));