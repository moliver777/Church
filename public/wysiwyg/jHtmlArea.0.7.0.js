/*
* jHtmlArea 0.7.0 - WYSIWYG Html Editor jQuery Plugin
* Copyright (c) 2009 Chris Pietschmann
* http://jhtmlarea.codeplex.com
* Licensed under the Microsoft Reciprocal License (Ms-RL)
* http://jhtmlarea.codeplex.com/license
*/
(function($) {
    $.fn.htmlarea = function(opts) {
        if (opts && typeof (opts) === "string") {
            var args = [];
            for (var i = 1; i < arguments.length; i++) { args.push(arguments[i]); }
            var htmlarea = jHtmlArea(this[0]);
            var f = htmlarea[opts];
            if (f) { return f.apply(htmlarea, args); }
        }
        return this.each(function() { jHtmlArea(this, opts); });
    };
    var jHtmlArea = window.jHtmlArea = function(elem, options) {
        if (elem.jquery) {
            return jHtmlArea(elem[0]);
        }
        if (elem.jhtmlareaObject) {
            return elem.jhtmlareaObject;
        } else {
            return new jHtmlArea.fn.init(elem, options);
        }
    };
    jHtmlArea.fn = jHtmlArea.prototype = {

        // The current version of jHtmlArea being used
        jhtmlarea: "0.7.0",

        init: function(elem, options) {
            if (elem.nodeName.toLowerCase() === "textarea") {
                var opts = $.extend({}, jHtmlArea.defaultOptions, options);
                elem.jhtmlareaObject = this;

                var textarea = this.textarea = $(elem);
                var container = this.container = $("<div/>").addClass("jHtmlArea").width(textarea.width()).insertAfter(textarea);

                var toolbar = this.toolbar = $("<div/>").addClass("ToolBar").appendTo(container);							
								var image_select = $('<div class="image_select_container" style="display:none;"><select class="wysiwyg_image_select"></select><button class="image_select_insert">Insert</button><button class="image_select_cancel">Cancel</button></div>')
								$.each(options.images, function(i,image) {
									image_select.find(".image_select").append('<option value="'+image.id+'">'+image.name+'</option>');
								});
								image_select.appendTo(container);
                priv.initToolBar.call(this, opts);

                var iframe = this.iframe = $("<iframe/>").height(textarea.height());
                iframe.width(textarea.width() - ($.browser.msie ? 0 : 4));
                var htmlarea = this.htmlarea = $("<div/>").append(iframe);

                container.append(htmlarea).append(textarea.hide());

                priv.initEditor.call(this, opts);
                priv.attachEditorEvents.call(this);

                // Fix total height to match TextArea
                iframe.height(iframe.height() - toolbar.height());
                toolbar.width(textarea.width() - 2);

                if (opts.loaded) { opts.loaded.call(this); }
            }
        },
        dispose: function() {
            this.textarea.show().insertAfter(this.container);
            this.container.remove();
            this.textarea[0].jhtmlareaObject = null;
        },
        execCommand: function(a, b, c) {
            this.iframe[0].contentWindow.focus();
            this.editor.execCommand(a, b || false, c || null);
            this.updateTextArea();
        },
        ec: function(a, b, c) {
            this.execCommand(a, b, c);
        },
        queryCommandValue: function(a) {
            this.iframe[0].contentWindow.focus();
            return this.editor.queryCommandValue(a);
        },
        qc: function(a) {
            return this.queryCommandValue(a);
        },
        getSelectedHTML: function() {
            if ($.browser.msie) {
                return this.getRange().htmlText;
            } else {
                var elem = this.getRange().cloneContents();
                return $("<p/>").append($(elem)).html();
            }
        },
        getSelection: function() {
            if ($.browser.msie) {
                //return (this.editor.parentWindow.getSelection) ? this.editor.parentWindow.getSelection() : this.editor.selection;
                return this.editor.selection;
            } else {
                return this.iframe[0].contentDocument.defaultView.getSelection();
            }
        },
        getRange: function() {
            var s = this.getSelection();
            if (!s) { return null; }
            //return (s.rangeCount > 0) ? s.getRangeAt(0) : s.createRange();
            return (s.getRangeAt) ? s.getRangeAt(0) : s.createRange();
        },
        html: function(v) {
            if (v) {
                this.pastHTML(v);
            } else {
                return toHtmlString();
            }
        },
        pasteHTML: function(html) {
            this.iframe[0].contentWindow.focus();
            var r = this.getRange();
            if ($.browser.msie) {
                r.pasteHTML(html);
            } else if ($.browser.mozilla) {
                r.deleteContents();
                r.insertNode($((html.indexOf("<") != 0) ? $("<span/>").append(html) : html)[0]);
            } else { // Safari
                r.deleteContents();
                r.insertNode($(this.iframe[0].contentWindow.document.createElement("div")).append($((html.indexOf("<") != 0) ? html : html))[0]);
            }
            r.collapse(false);
			if (r.select) {
				r.select();
			}
            
        },
        cut: function() {
            this.ec("cut");
        },
        copy: function() {
            this.ec("copy");
        },
        paste: function() {
            this.ec("paste");
        },
        bold: function() { this.ec("bold"); },
        italic: function() { this.ec("italic"); },
        underline: function() { this.ec("underline"); },
        strikeThrough: function() { this.ec("strikethrough"); },
		table: function() {
			var self = this;
			if ($("#table_input").length == 0) {
				$(".ToolBar").after("<div id='table_input' class='popup_wrapper'><table><tbody><tr><td>Rows</td><td><input type='text' id='row_num' /></td></tr><tr><td>Columns</td><td><input type='text' id='col_num' /></td></tr><tr><td>&nbsp;</td><td><input id='create_tbl_btn' type='button' value='Create Table'/></td></tr></tbody></table></div>")	
				$("#create_tbl_btn").after("<button type='button' id='close_table' class='close_link'>Cancel</button>")
			}
			$("#close_table").click(function() { $("#table_input").remove() });
			$("#create_tbl_btn").click(function() {
				var rowCount = $("#row_num").val()
				var colCount = $("#col_num").val()
				
				if (isNaN(rowCount) || isNaN(colCount) || rowCount === null || colCount === null) {
					return;
				}

				var i, j, html = ['<table border="1"><tbody>'];

				colCount = parseInt(colCount, 10);
				rowCount = parseInt(rowCount, 10);
				
				filler = "&nbsp;";
				filler = "<td>" + filler + "</td>";

				for (i = rowCount; i > 0; i -= 1) {
					html.push("<tr>");
					for (j = colCount; j > 0; j -= 1) {
						html.push(filler);
					}
					html.push("</tr>");
				}
				html.push("</tbody></table>");
				self.textarea.htmlarea("pasteHTML",html.join("") );
				$("#table_input").remove();
			});
		},
    image: function(url) {
			var self = this;
			$(".image_select_container").toggle();
			$(".image_select_cancel").unbind("click").click(function(e) {
				e.preventDefault();
				$(".image_select_container").hide();
			});
			$(".image_select_insert").unbind("click").click(function(e) {
				e.preventDefault();
				var image_id = $(".wysiwyg_image_select").val();
				if (image_id.length > 0 && parseInt(image_id) > 0) {
					$("#"+self.textarea.attr("id")).htmlarea("pasteHTML", '<img style="width:100%;" src="/image/'+image_id+'" />');
				}
				$(".image_select_container").hide();
			});
    },
    removeFormat: function() {
        this.ec("removeFormat", false, []);
        this.unlink();
    },
    alink: function() {
        if ($.browser.msie) {
            this.ec("createLink", true);
        } else {
            this.ec("createLink", false, prompt("Link URL:", ""));
        }
    },
		youtube: function() { 
				var self = this;
				if ($("#youtube_link").length == 0) {
					$(".ToolBar").after("<div id='youtube_link' class='popup_wrapper'><table><tbody><tr><td width='80'>Video URL</td><td><input type='text' class='long' id='link' value='http://'/></td></tr><tr><td>Width</td><td><input type='text' id='width' /></td></tr><tr><td>Height</td><td><input type='text' id='height' /></td></tr><tr><td>&nbsp;</td><td><input id='embed_video' type='button' value='Embed Video'/></td></tr></tbody></table></div>")	
					$("#embed_video").after("<button type='button' id='close_video_link' class='close_link'>Cancel</button>")
				}
				$("#close_video_link").click(function() { $("#youtube_link").remove() });
				$("#embed_video").click(function() {
					var width = $("#width").val();
					var height = $("#height").val();
					var video_id = $("#link").val().split("=")[1];
					iframe = '<iframe width="'+ width +'" height="'+ height +'" src="http://www.youtube.com/embed/'+video_id+'?rel=0" frameborder="0" allowfullscreen=""></iframe>'
					self.textarea.htmlarea("pasteHTML",iframe);
					$("#youtube_link").remove()
				});
				

		},
		undo: function() { this.iframe[0].contentWindow.document.execCommand('undo', false, null); }, 
		redo: function() { this.iframe[0].contentWindow.document.execCommand('redo', false, null); },

        unlink: function() { this.ec("unlink", false, []); },
        orderedList: function() { this.ec("insertorderedlist"); },
        unorderedList: function() { this.ec("insertunorderedlist"); },
        superscript: function() { this.ec("superscript"); },
        subscript: function() { this.ec("subscript"); },

        p: function() {
            this.formatBlock("<p>");
        },
        h1: function() {
            this.heading(1);
        },
        h2: function() {
            this.heading(2);
        },
        h3: function() {
            this.heading(3);
        },
        h4: function() {
            this.heading(4);
        },
        h5: function() {
            this.heading(5);
        },
        h6: function() {
            this.heading(6);
        },
        heading: function(h) {
            this.formatBlock($.browser.msie ? "Heading " + h : "h" + h);
        },

        indent: function() {
            this.ec("indent");
        },
        outdent: function() {
            this.ec("outdent");
        },

        insertHorizontalRule: function() {
            this.ec("insertHorizontalRule", false, "ht");
        },

        justifyLeft: function() {
            this.ec("justifyLeft");
        },
        justifyCenter: function() {
            this.ec("justifyCenter");
        },
        justifyRight: function() {
            this.ec("justifyRight");
        },

        increaseFontSize: function() {
            if ($.browser.msie) {
                this.ec("fontSize", false, this.qc("fontSize") + 1);
            } else if ($.browser.safari) {
                this.getRange().surroundContents($(this.iframe[0].contentWindow.document.createElement("span")).css("font-size", "larger")[0]);
            } else {
                this.ec("increaseFontSize", false, "big");
            }
        },
        decreaseFontSize: function() {
            if ($.browser.msie) {
                this.ec("fontSize", false, this.qc("fontSize") - 1);
            } else if ($.browser.safari) {
                this.getRange().surroundContents($(this.iframe[0].contentWindow.document.createElement("span")).css("font-size", "smaller")[0]);
            } else {
                this.ec("decreaseFontSize", false, "small");
            }
        },

        forecolor: function(c) {
            this.ec("foreColor", false, c || prompt("Enter HTML Color:", "#"));
        },

        formatBlock: function(v) {
            this.ec("formatblock", false, v || null);
        },

        showHTMLView: function() {
            this.updateTextArea();
            this.textarea.show();
            this.htmlarea.hide();
            $("ul li:not(li:has(a.html))", this.toolbar).attr("disabled", "disabled");
            $("ul:not(:has(:visible))", this.toolbar).attr("disabled", "disabled");
            $("ul li a.html", this.toolbar).addClass("highlighted");
        },
        hideHTMLView: function() {
            this.updateHtmlArea();
            this.textarea.hide();
            this.htmlarea.show();
            $("ul", this.toolbar).show();
            $("ul li", this.toolbar).show().find("a.html").removeClass("highlighted");
        },
        toggleHTMLView: function() {
            (this.textarea.is(":hidden")) ? this.showHTMLView() : this.hideHTMLView();
        },

        toHtmlString: function() {
            return this.editor.body.innerHTML;
        },
        toString: function() {
            return this.editor.body.innerText;
        },

        updateTextArea: function() {
            this.textarea.val(this.toHtmlString());
        },
        updateHtmlArea: function() {
            this.editor.body.innerHTML = this.textarea.val();
        }

		
    };
    jHtmlArea.fn.init.prototype = jHtmlArea.fn;

    jHtmlArea.defaultOptions = {
        toolbar: [
        ["bold", "italic", "underline", "strikethrough", "|", "subscript", "superscript"],
        ["orderedlist", "unorderedlist"],
        ["indent", "outdent"],
        ["justifyleft", "justifycenter", "justifyright"],
        ["p", "h1", "h2", "h3", "h4", "h5", "h6"],
		["image", "table", "alink", "unlink", "youtube"],
		["forecolor", "increasefontsize", "decreasefontsize"],
		["html"],
		["undo", "redo"]  
    ],
        css: null,
        toolbarText: {
            bold: "Bold", italic: "Italic", underline: "Underline", strikethrough: "Strike-Through",
            cut: "Cut", copy: "Copy", paste: "Paste",
            h1: "Heading 1", h2: "Heading 2", h3: "Heading 3", h4: "Heading 4", h5: "Heading 5", h6: "Heading 6", p: "Paragraph",
            indent: "Indent", outdent: "Outdent", horizontalrule: "Insert Horizontal Rule",
            justifyleft: "Left Justify", justifycenter: "Center Justify", justifyright: "Right Justify",
            increasefontsize: "Increase Font Size", decreasefontsize: "Decrease Font Size", forecolor: "Text Color",
            alink: "Insert Link", unlink: "Remove Link", image: "Insert Image", table: "Insert Table", youtube: "Youtube",
            orderedlist: "Insert Ordered List", unorderedlist: "Insert Unordered List",
            subscript: "Subscript", superscript: "Superscript",
            html: "Show/Hide HTML Source View",
			undo: "Undo", redo: "Redo"
        }
    };
    var priv = {
        toolbarButtons: {
            strikethrough: "strikeThrough", orderedlist: "orderedList", unorderedlist: "unorderedList",
            horizontalrule: "insertHorizontalRule",
            justifyleft: "justifyLeft", justifycenter: "justifyCenter", justifyright: "justifyRight",
            increasefontsize: "increaseFontSize", decreasefontsize: "decreaseFontSize",
            html: function(btn) {
                this.toggleHTMLView();
            }
        },
        initEditor: function(options) {
            var edit = this.editor = this.iframe[0].contentWindow.document;
            edit.designMode = 'on';
            edit.open();
            edit.write(this.textarea.val());
            edit.close();
            if (options.css) {
                var e = edit.createElement('link'); e.rel = 'stylesheet'; e.type = 'text/css'; e.href = options.css; edit.getElementsByTagName('head')[0].appendChild(e);
            }
        },
        initToolBar: function(options) {
            var that = this;

            var menuItem = function(className, altText, action) {
                return $("<li/>").append($("<a href='javascript:void(0);'/>").addClass(className).attr("title", altText).click(function() { action.call(that, $(this)); }));
            };

            function addButtons(arr) {
                var ul = $("<ul/>").appendTo(that.toolbar);
                for (var i = 0; i < arr.length; i++) {
                    var e = arr[i];
                    if ((typeof (e)).toLowerCase() === "string") {
                        if (e === "|") {
                            ul.append($('<li class="separator"/>'));
                        } else {
                            var f = (function(e) {
                                // If button name exists in priv.toolbarButtons then call the "method" defined there, otherwise call the method with the same name
                                var m = priv.toolbarButtons[e] || e;
                                if ((typeof (m)).toLowerCase() === "function") {
                                    return function(btn) { m.call(this, btn); };
                                } else {
                                    return function() { this[m](); this.editor.body.focus(); };
                                }
                            })(e.toLowerCase());
                            var t = options.toolbarText[e.toLowerCase()];
                            ul.append(menuItem(e.toLowerCase(), t || e, f));
                        }
                    } else {
                        ul.append(menuItem(e.css, e.text, e.action));
                    }
                }
            };
            if (options.toolbar.length !== 0 && priv.isArray(options.toolbar[0])) {
                for (var i = 0; i < options.toolbar.length; i++) {
                    addButtons(options.toolbar[i]);
                }
            } else {
                addButtons(options.toolbar);
            }
        },
        attachEditorEvents: function() {
            var t = this;

            var fnHA = function() {
				if (!$(this).html().match("iframe")) {
						t.updateHtmlArea();
				}

            };

            this.textarea.click(fnHA).
                keyup(fnHA).
                keydown(fnHA).
                mousedown(fnHA).
                blur(fnHA);



            var fnTA = function() {
                t.updateTextArea();
				
            };

            $(this.editor.body).click(fnTA).
                keyup(fnTA).
                keydown(fnTA).
                mousedown(fnTA).
                blur(fnTA);

            $('form').submit(function() { t.toggleHTMLView(); t.toggleHTMLView(); });
            //$(this.textarea[0].form).submit(function() { //this.textarea.closest("form").submit(function() {


            // Fix for ASP.NET Postback Model
            if (window.__doPostBack) {
                var old__doPostBack = __doPostBack;
                window.__doPostBack = function() {
                    if (t) {
                        if (t.toggleHTMLView) {
                            t.toggleHTMLView();
                            t.toggleHTMLView();
                        }
                    }
                    return old__doPostBack.apply(window, arguments);
                };
            }
            
        },
        isArray: function(v) {
            return v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !(v.propertyIsEnumerable('length'));
        }
    };
})(jQuery);