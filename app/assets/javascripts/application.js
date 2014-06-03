// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.

// ----- CSRF TOKENS ----- \\
$(document).ready(function() {
	$.ajaxSetup({headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')}});
});

// ----- SETUP ----- \\

function formatPage() {
	// Force panel to fill panel_wrapper
	$.each($("div.panel"), function() {
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
		} else if (horz == "left" && $(this).offset().top > $("div.corner."+vert+"."+horz).offset().top) {
			$("div.corner."+vert+"."+horz).css("margin-top", ($(this).offset().top-$("div.corner."+vert+"."+horz).offset().top)+"px");
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

$(document).ready(function() {
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
	}, 3000);

	// Resize panels to images
	$.each($("div.image_container"), function() {
		var height = $(this).parents("div.panel").height();
		$.each($(this).find("img"), function() {
			$(this).on("load", function() {
				// TODO: half width when combo
				$(this).css("width", $(this).parent().width());
				height = Math.max(height, $(this).height());
				$(this).parents("div.panel").css("height", height+"px");
				formatPage();
			});
		});
	});

	// Resize panels to iframes
	$.each($("div.panel iframe"), function() {
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
	$(el).val($(el).val().toLowerCase().replace(/[^a-z0-9\s]/g,"").replace(/\s+/g,"_"));
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
