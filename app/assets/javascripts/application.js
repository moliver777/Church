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
    var offset = $("div.inner-header").height()+$("div#menu").height()+$("div.home.top.left").height()+5;
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
			$(this).css("width", $(this).parent().width());
			height = Math.max(height, $(this).height());
			$(this).parents("div.panel").css("height", height+"px");
			formatPage();
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