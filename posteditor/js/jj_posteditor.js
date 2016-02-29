/*! v1.0.0 - 2016-01-26 - 2j */
(function($ ){
    $.posteditor = function(el, options){        
        var root = this;
        root.$el = $(el);
        root.$el.data("posteditor", root);        
        var $post;
        
        /* init 
            * eiting mode
        */
        root.init = function(){
            root.options = $.extend({},$.posteditor.defaultOptions, options);
            root.createCanvas();
            root.createApiScript();
            //root.initSreen();
            root.initControls();
            root.initCanvas();            
            root.initModal();
            root.log("Finished");
        };
        
        root.initSreen = function(){
            root.createViewcontrols();
            
            var canvas = $post.find("#" + root.options.canvasId);
            var cnavasWidth = canvas.innerWidth();
            root.log($("."+root.options.viewGroupClass).length);
            if(cnavasWidth > 320){
                $("."+root.options.viewGroupClass).find(".post-view-pc").addClass(root.options.viewButtonsOnClass);                
            }else{
                $("."+root.options.viewGroupClass).find(".post-view-mobile").addClass(root.options.viewButtonsOnClass);
            }
            
            $(window).resize(function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var cnavasWidth = canvas.outerWidth();
                $("."+root.options.viewGroupClass).find("button").removeClass(root.options.viewButtonsOnClass);

                if(cnavasWidth > 320){
                    $("."+root.options.viewGroupClass).find(".post-view-pc").addClass(root.options.viewButtonsOnClass);                
                }else{
                    $("."+root.options.viewGroupClass).find(".post-view-mobile").addClass(root.options.viewButtonsOnClass);
                }
            });
        };
        
        /* create div textarea id appenTo */
        root.createCanvas = function(){            
            /* div
            var html = root.$el.html();
            root.$el.html("");
            $("<div/>", {
                'id': root.options.canvasId,
                'html': html
            }).appendTo(root.$el);
            */
            
            // textarea replaceWith div
            
            var contents = root.$el.val();            
            if(!$.trim(contents)){
                var addElement = "post-text";                
                contents = root.createRow(addElement).removeClass(root.options.rowAddClass).clone().wrap('<div>').parent().html(); 
            }
            
            var html = $("<div/>", {
                'id': root.options.canvasId,
                'html': contents
            });
            
            var elid = root.$el.attr("id");
            var elclass = root.$el.attr("class");            
            $post = $("<div/>",{
                'id':elid,
                'class':elclass,                
            });
            root.$el.replaceWith($post);            
            $post.append(html);
          
        };
        
        root.createApiScript = function(){
            /*
            var script = $("<script />", {
                'id':root.options.mapApiId,
                'type':"text/javascript",
                'src':"//apis.daum.net/maps/maps3.js?autoload=false&apikey="+root.options.mapApiKey
            });
            $("head").append(script);
            */
            var getScriptSrc = "//apis.daum.net/maps/maps3.js?autoload=false&apikey="+root.options.mapApiKey;
            $.getScript(getScriptSrc, function ( data, textStatus, jqxhr )
            {
                root.log(data); // 받은 data 
                root.log(textStatus); // success
                root.log(jqxhr.status); // 200
                root.log('자바스크립트 로드 완료');
            });
        };
        
        /* Control click fucntion */
        root.initControls = function () {
            var canvas = $post.find("#" + root.options.canvasId);
            
            //row click
            $post.on("click", ".post-moveRow", function(e){ 
                //if (e.target !== this) return;
                root.clearColControls();
                root.clearRowControls();
                
                var thisParent = $(this).parent();
                thisParent.find(".post-setRow").show();
                thisParent.find(".post-removeRow").show();                
                thisParent.find(".post-moveRow").addClass("post-select-show");
            
            //row AddControls show
            }).on("click", ".post-setRow", function(){                
                var addBtns = $(this).parent().next("." + root.options.addGroupClass)
                root.addGroupControls(addBtns);                
                
            //row remove
            }).on("click", ".post-removeRow", function(){                
                var rowLen = canvas.find("."+root.options.rowClass).length;
                var thisRow = $(this).closest("."+root.options.rowClass);
                var rowIndex = thisRow.index()+1;
                
                if(rowLen == "1"){
                    alert("컨텐츠가 혼자 있어 삭제 할수 없습니다.")
                }else{
                    if(rowLen == rowIndex){
                        thisRow.prev().find(".post-setRow").show();
                        thisRow.prev().find(".post-removeRow").show();
                    } else {
                        thisRow.next().find(".post-setRow").show();
                        thisRow.next().find(".post-removeRow").show();
                    } 
                    thisRow.remove();                                        
                }
                
            //add Text 
            }).on("click", ".post-addText", function(){     
                var selectThis = $(this);
                var addElement = "post-text";
                                
                root.postAddButtonAction(selectThis, addElement);
                
            //edit Text 
            }).on("click", ".post-text", function(){                 
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));                
                
                $(this).next().find(".post-moveRow").addClass("post-select-show");                
                $(this).addClass(root.options.postupdateClass);
                
                if($(this).hasClass(root.options.postEmptyClass)){
                    $(this).text("");
                }
                root.editorControl("enable", $(this));
                
            //add img
            }).on("click", ".post-addImage", function(){     
                var selectThis = $(this);
                var addElement = "post-image";
                
                root.postAddButtonAction(selectThis, addElement);
                
            //edit image 
            }).on("click", ".post-image", function(){                 
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));                
                
                $(this).next().find(".post-moveRow").addClass("post-select-show");                
                $(this).addClass(root.options.postupdateClass);                
                $(this).append(root.editToolFactory(root.options.ImgButtonsAppend));
                        
            }).on("click", ".post-editpicture", function(){                
                $("#modalImg").modal("show");
            
            //align Left
            }).on("click", "button.post-alignLeft", function(){ 
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);
                
                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });                    
                }
                thisCol.addClass("post-alignLeft");                
            
            //align Center
            }).on("click", "button.post-alignCenter", function(){ 
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);
                
                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });                    
                }
                thisCol.addClass("post-alignCenter");
                
            //align Right
            }).on("click", "button.post-alignRight", function(){ 
                var thisCol = $(this).closest("."+root.options.colClass);
                var alignClass = thisCol.attr("class").match(/(post-align)\w+/g);
                
                if(alignClass != "null"){
                    thisCol.removeClass (function (index, css) {
                        return (css.match (/\post-align\S+/g) || []).join(' ');
                    });                    
                }
                thisCol.addClass("post-alignRight");
            
            //img link
            }).on("click", "button.post-editlink", function(){ 
                $("#modalLink").modal("show");
                                
            //add Video
            }).on("click", "button.post-addVideo", function(){ 
                var selectThis = $(this);
                var addElement = "post-video";
                
                root.postAddButtonAction(selectThis, addElement);
                                
            //edit Video
            }).on("click", ".post-video", function(e){                 
                root.clearColControls();
                root.clearRowControls();
                root.showRowControls($(this));                
                
                $(this).next().find(".post-moveRow").addClass("post-select-show");                
                $(this).addClass(root.options.postupdateClass);                
                $(this).append(root.editToolFactory(root.options.VideoButtonsAppend));
                           
            //edit Video
            }).on("click", ".post-editvideo", function(){  
                $("#modalVideo").modal("show");
                var videoUrl = canvas.find("."+root.options.postupdateClass).find("iframe").attr("src");
                $("#modalVideo").find('.note-video-url').val("https:"+videoUrl);
                
            //add map
            }).on("click", ".post-addDmap", function(){                
                var selectThis = $(this);
                var addElement = "post-Dmap";
                
                root.postAddButtonAction(selectThis, addElement);                 
            
            //add Line
            }).on("click", ".post-addLine", function(){
                var selectThis = $(this);
                var addElement = "post-line";
                
                root.postAddButtonAction(selectThis, addElement);               
            
            
                
            //testLog root.log("rowLength: " + rowLen + "/" +"rowIndex: " + rowIndex);
            // prevent default.
            }).on("click", "a.post-moveRow, a.post-setRow, button.post-addText, div.post-text, button.post-addImage, div.post-image, button.post-image, button.post-addVideo, div.post-video, button.post-addDmap, button.post-addLine", function (e) {
                root.log("Clicked: " + $(this).attr("class"));
                e.preventDefault();
            
            });            
                      
        };
        
        //post Add Button click Action
        root.postAddButtonAction = function(selectThis, addElement){
            var canvas = $post.find("#" + root.options.canvasId);
            var thisRow = selectThis.closest("."+root.options.rowClass);
            root.clearColControls();
            root.clearRowControls();

            thisRow.after(root.createRow(addElement));                
            root.activateRows($("."+root.options.rowAddClass));                

            thisRow.find(".post-setRow").hide();
            thisRow.find(".post-removeRow").hide();  
            thisRow.find("." + root.options.addGroupClass).css("height","0");

            $("."+root.options.rowAddClass).find(".post-moveRow").addClass("post-select-show");
            var selectThisClass = selectThis.attr("class");
            
            switch (selectThisClass) {
                case 'post-addText':
                    $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                    break;
                case 'post-addImage':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                     $("#modalImg").modal("show");
                    break;
                case 'post-addVideo':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                    $("#modalVideo").modal("show");
                
                    break;
                case 'post-addDmap':
                    $("."+root.options.rowAddClass).find("."+addElement).addClass(root.options.postupdateClass);
                    $("#modalDmap").modal("show");
                    break;
                    
                case 'post-addLine':
                    $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                    break;
                default:
                    root.log("postAddButtonAction");
            }
            
            canvas.sortable('refresh');
        }; 
        
        /* createViewcontrols pc mobile */
        root.createViewcontrols = function(){            
            $("body").prepend(
                $("<div />", {
                    "class":root.options.viewGroupClass
                }).html(root.options.viewButtonsPrepand)
            );
        };
        
        /* clearRowControls */
        root.addGroupControls = function(addBtns){
            var timer;                
                
            if(addBtns.css("height").replace("px", "") == "0"){
                //show
                addBtns.css("height","48px");

                //hide time
                timer = setTimeout(function(){
                    addBtns.css("height","0");
                }, 5000);

                addBtns.mouseenter(function(){
                   timer = clearTimeout(timer);
                }).mouseleave(function(){
                    $(this).css("height","0");
                });
            }else{
                //hide
                addBtns.css("height","0");
            }
        };
        
        /* clearRowControls */
        root.clearRowControls = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);
            rows.find(".post-setRow").hide();
            rows.find(".post-removeRow").hide();   
            rows.find("." + root.options.addGroupClass).css("height","0"); 
            canvas.find(".post-moveRow").removeClass("post-select-show");
        };
        
        /* showRowControls */
        root.showRowControls = function(element){
            var thisParent = element.parent();
            thisParent.find(".post-setRow").show();
            thisParent.find(".post-removeRow").show();
        };
        
        /* clearColControls */
        root.clearColControls = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var updateClass = "update-post-cont";  
            //root.log("aaaa"+canvas.find("."+updateClass).attr("class"));
            if(canvas.find("."+updateClass).length > 0 && canvas.find("."+updateClass).hasClass("post-text")){               
                root.editorControl("disable", $("."+updateClass));  
                canvas.find("."+updateClass).removeClass(updateClass);
            }
            canvas.find("." + root.options.postEditToolClass).remove();
        };
        
        /* initCanvas */
        root.initCanvas = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);            
            var cols = canvas.find("."+root.options.colClass);            
            
            root.activateRows(rows);
            root.activateCols(cols);
            //Make Rows sortable
            canvas.sortable({                
                //items: rows,                
                axis: 'y',                
                handle: ".post-moveRow, .post-screen",                               
                placeholder: root.options.rowsortableClass,
                opacity: 0.7,
                tolerance: "pointer",
                cursor: "move",                
                helper: function (e, item) {                   
                    return item.clone();
                    root.clearColControls();
                },                
                start:function(e,ui){
                    $(ui.item).show().addClass("ui-sortable-this");
                    ui.placeholder.removeAttr("style");                      
                    clone = $(ui.item).clone();                    
                    //ui.helper.find("."+root.options.postToolClass).remove();
                },
                sort: function(e, ui) {                    
                    if(ui.item.next().hasClass(root.options.rowsortableClass)){
                        ui.item.next().hide();
                    }else{
                        ui.placeholder.show();
                    }
                },
                stop:function(e, ui){
                    $(ui.item).removeClass("ui-sortable-this");                
                }               
            });//.disableSelection();
            
            $.each(rows, function (i, val) {
                if(i == "0"){
                    $(val).find(".post-setRow").show();
                    $(val).find(".post-removeRow").show();                    
                }else{
                    $(val).find(".post-setRow").hide();
                    $(val).find(".post-removeRow").hide();
                }
            });
            
        };
        
        /*------------ rows ------------*/
        /* activateRows 
            * add buttons
        */
        root.createRow = function(addElement){
            var row = $("<div/>").addClass(root.options.rowClass)
                                .addClass(root.options.rowAddClass)
                                .prepend(root.createCol(addElement));
            return row;
        };
        
        root.activateRows = function(rows){            
            rows.append(root.toolFactory(root.options.rowButtonsAppend));
            rows.append(
                $("<div/>", {
                    'class': root.options.addGroupClass,
                    'html': root.buttonFactory(root.options.addButtonsAppend)
                })
            );
            root.log("activateRows"+rows.attr("class"));
        };
        
        root.deactivateRows = function(rows){
            rows.find("." + root.options.postToolClass).remove();
            rows.find("." + root.options.addGroupClass).remove();
            rows.find("." + root.options.rowAddClass).remove();
        };
        
        
        /*------------ cols ------------*/
        /* activateCows 
            * switch contents html
        */
        root.createCol = function(addElement){            
            var html = "";
            var addClass = "";
            var addScreen ="";
            switch (addElement) {
                case 'post-text':
                    html = root.options.postTextempty;            
                    addClass = root.options.postEmptyClass;
                    break;
                case 'post-image':
                    html = $("<img />",{
                        'src': '',
                        'alt': ''
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-video':
                    html = $("<iframe />",{
                        'frameborder': '0',
                        'src': ''
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-Dmap':
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                case 'post-line':
                    html = $("<div />",{
                        'class': 'post-horizontal-line1',
                    });
                    addScreen=$("<span/>", {'class': root.options.postScreenClass});
                    break;
                default:
                    root.log("add Col");
            }                  
            var col = $("<div/>").addClass(root.options.colClass)
                                .addClass(addElement)
                                .addClass(addClass)
                                .html(html)
                                .append(addScreen);
            return col;
        };
        
        root.activateCols = function(cols){     
            /*
            var len = cols.length;
            if(len == 1 && cols.hasClass("post-text")){
                cols.addClass(root.options.postEmptyClass)
            }
            */
            $.each(cols, function (i, col) {
                if($(col).hasClass("post-text")){
                    if($(col).hasClass("."+root.options.postEmptyClass)){
                        $(col).append(root.options.postTextempty)    
                    }
                }else{
                    $(col).append(
                        $("<span/>", {'class': root.options.postScreenClass})
                    );    
                }
                
            });
            root.log("activateCols"+cols.attr("class"));
        };        
        
        root.deactivateCols = function(cols){
            cols.find("." + root.options.postScreenClass).remove();
            cols.find("." + root.options.postEditToolClass).remove();
        };
                
        /*------------ wysiwyg editor ------------*/
        /*
            * summernote
            * http://summernote.org/
        */
        root.editorControl = function(action, element){
            var canvas = $post.find("#" + root.options.canvasId);
            switch(action){
                case 'enable':                    
                    element.summernote(root.options.summernote.config);
                break;
                case 'disable':                     
                    var markupStr = element.summernote('code');
                    var markupStrText = $("<div/>",{
                       html:markupStr
                    }).text();
                    
                    element.summernote('destroy');                    
                    
                    if(markupStrText == ""){                        
                        element.html("").append(root.options.postTextempty);
                        element.addClass(root.options.postEmptyClass);
                    }else{              
                        //element.html("", markupStr);
                        element.removeClass(root.options.postEmptyClass);
                    }
                break;                    
                                
                default:
                    root.log('editorControl default');
                    
            }
        };        
        
        /* toolFactory */
        root.toolFactory = function(btns){
            var tools = $("<div/>").addClass(root.options.postToolClass).html(root.buttonFactory(btns));
            return tools[0].outerHTML;
        };        
        
        /* editToolFactory */
        root.editToolFactory = function(btns){
            var tools = $("<div/>").addClass(root.options.postEditToolClass).html(root.buttonFactory(btns));
            return tools[0].outerHTML;
        };
        
        /* buttonFactory */
        root.buttonFactory = function(btns){
            var buttons = [];
            $.each(btns, function(i, val){
                val.btnLabel = (typeof val.btnLabel === 'undefined') ? '' : val.btnLabel;
                val.title = (typeof val.title == 'undefined') ? '' : val.title;
                val.btntype = (typeof val.type == 'undefined') ? '' : " type='" + val.btntype + "'";
                buttons.push("<" + val.element + " title='" + val.title + "' class='" + val.btnClass + "'" + val.btntype + ">" + val.btnLabel  + "</"+ val.element + ">")
            });
            return buttons.join("")
        };
        
         root.modalFactory = function(modalContents){
            var tools = $("<div/>").html(root.modalsFactory(modalContents));
            return tools[0].innerHTML;
        };
        
        /* modalFactory */
        root.modalsFactory = function(modalContents){     
            var modals = [];
            $.each(modalContents, function(i, val){
                val.id = (typeof val.id === 'undefined') ? '' : val.id;
                val.html = (typeof val.html === 'undefined') ? '' : val.html;
                
                modals.push('<div class="modal fade" id='+ val.id +' aria-hidden="false" tabindex="-1" style="display: none;"><div class="modal-dialog"><div class="modal-content">'+ val.html +'</div></div></div>')
            });
            return modals.join("")            
        };
        
        root.modalsRemove = function(modalContents){
            $.each(modalContents, function(i, val){
                val.id = (typeof val.id === 'undefined') ? '' : val.id;
                $("#"+val.id).remove();
            });
        };
                
        /* initModal */
        root.initModal = function(){
            $("body").append(root.modalFactory(root.options.modaldefault));
        
            $("#modalImg").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var imageInput = $(this).find(".note-image-input"),
                    imageAlt = $(this).find(".note-image-alt-input"),
                    imageBtn = $(this).find(".note-image-btn"),                    
                    imgSrc;

                imageInput.on("change", function () {
                    var val = $(this).val();
                    var thisDom = $(this)[0];

                    if (thisDom.files && thisDom.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            imgSrc = e.target.result;
                        } 
                        reader.readAsDataURL(thisDom.files[0]);

                        imageBtn.removeClass("disabled").prop("disabled", false);
                    } else {
                        imageBtn.addClass("disabled").prop("disabled", true);
                    };
                });

                imageBtn.click(function(e){
                    e.preventDefault();
                    if(imageInput.val() != ""){         
                        canvas.find("."+root.options.postupdateClass).find("img").attr("src", imgSrc);                        canvas.find("."+root.options.postupdateClass).find("img").attr("alt", imageAlt.val());
                        imageBtn.addClass("uploadImg");

                        $("#modalImg").modal("hide");
                    }
                });
            });

            $("#modalImg").on("hidden.bs.modal", function () {
                var imageInput = $(this).find(".note-image-input"),
                    imageAlt = $(this).find(".note-image-alt-input"),
                    imageBtn = $(this).find(".note-image-btn");

                if(imageBtn.hasClass("uploadImg")){
                     $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                }else{
                    $("."+root.options.rowAddClass).remove();
                } 
                imageInput.val("");
                imageAlt.val("");
                imageBtn.addClass("disabled").prop("disabled", true);
            });
            
            $("#modalLink").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var thisLink = canvas.find("."+root.options.postupdateClass).find("a");
                var thisLinkUrl, thisLinkTarget, newLink = false;
                var linkText = $(this).find(".note-link-text"),
                    linkUrl = $(this).find(".note-link-url"),
                    linkBtn = $(this).find(".note-link-btn"),
                    openInNewWindow = $(this).find("input[type=checkbox]");
                                
                if(thisLink.length > 0){
                    $(this).find(".modal-title").text("링크 수정")
                    thisLinkUrl = thisLink.attr("href");
                    linkBtn.removeClass("disabled").prop("disabled", false);
                    if(thisLink.attr("target") == "_self"){
                        openInNewWindow.prop("checked", false);
                    }else{
                        openInNewWindow.prop("checked", true)
                    }
                    newLink = true;
                } else {
                    thisLinkUrl = "http://";
                }                 

                linkUrl.on('input', function () {                    
                    if (linkUrl.val() == "http://" || linkUrl.val() == "") {                 
                        linkBtn.addClass("disabled").prop("disabled", true);
                    } else {
                        linkBtn.removeClass("disabled").prop("disabled", false);
                    };
                }).val(thisLinkUrl).trigger('focus');            

                linkBtn.click(function(e){
                    e.preventDefault();
                    if(openInNewWindow[0].checked){
                        thisLinkTarget = "_blank";
                    } else {
                        thisLinkTarget = "_self";
                    }                    
                    
                    if(newLink){
                        thisLink.attr("href", linkUrl.val());
                        thisLink.attr("title", linkText.val());                        
                        thisLink.attr("target", thisLinkTarget);                        
                    } else {
                        canvas.find("."+root.options.postupdateClass).find("img").wrap("<a href='"+ linkUrl.val() +"' title='"+linkText.val()+"' target='"+thisLinkTarget+"'></a>");                        
                    }
                    $("#modalLink").modal("hide");
                });
            });

            $("#modalLink").on("hidden.bs.modal", function () {
                var linkText = $(this).find(".note-link-text"),
                    linkUrl = $(this).find(".note-link-url"),
                    linkBtn = $(this).find(".note-link-btn"),
                    openInNewWindow = $(this).find("input[type=checkbox]");

                linkUrl.val("");
                openInNewWindow.prop('checked', true);;
                linkBtn.addClass("disabled").prop("disabled", true);
            });
            
            $("#modalVideo").on("shown.bs.modal", function () {
                var canvas = $post.find("#" + root.options.canvasId);
                var videoUrl = $(this).find('.note-video-url'),
                    videoBtn = $(this).find('.note-video-btn');
                var youtubeId;

                videoUrl.on('input', function () {  
                    var ytRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                    var ytMatch = videoUrl.val().match(ytRegExp);
                                        
                    if (ytMatch && ytMatch[1].length === 11) {               
                        videoBtn.removeClass("disabled").prop("disabled", false);
                        youtubeId = ytMatch[1];
                    } else {
                        //$(this).find("small.text-muted").text("youtube 공유 url을 입력해주세요.")
                        videoBtn.addClass("disabled").prop("disabled", true);
                    };
                }).trigger('focus'); 

                videoBtn.click(function(e){
                    e.preventDefault();                    canvas.find("."+root.options.postupdateClass).find("iframe").attr('src', '//www.youtube.com/embed/' + youtubeId);
                    videoBtn.addClass("uploadVideo");
                    $("#modalVideo").modal("hide");
                    
                });
            });

            $("#modalVideo").on("hidden.bs.modal", function () {
                var videoUrl = $(this).find('.note-video-url'),
                    videoBtn = $(this).find('.note-video-btn');

                if(videoBtn.hasClass("uploadVideo")){
                     $("."+root.options.rowAddClass).removeClass(root.options.rowAddClass);
                }else{
                    $("."+root.options.rowAddClass).remove();
                } 
                videoUrl.val("");
                videoBtn.addClass("disabled").prop("disabled", true);
            });
        };
        
        /* deinitCanvas 
            * remove canvas eiting mode
        */
        root.deinitCanvas = function(){
            var canvas = $post.find("#" + root.options.canvasId);
            var rows = canvas.find("."+root.options.rowClass);            
            var cols = canvas.find("."+root.options.colClass);            
            root.deactivateRows(rows);
            root.deactivateCols(cols);
            root.clearRowControls();
            root.clearColControls();
            $("body").find("."+root.optionsviewGroupClass).remove();
            root.modalsRemove(root.options.modaldefault);
            canvas.find("."+root.options.postEmptyClass).text("");
        };
        
        /* clean
            * remove
        */
        root.cleanup = function () {
            root.deinitCanvas();            
        };
        
        /* log */
        root.log = function(logvar){
            if(root.options.debug){
                if((window['console'] !== undefined)){
                    window.console.log(logvar);
                }
            }
        };
        
        // run
        root.init();

    };
    
    /* options */
    $.posteditor.defaultOptions = {
        debug: true, //console : true/fals        
        canvasId: "post-canvas", // Canvas ID
        rowClass :"postrow",        
        rowAddClass: "post-add-row",
        rowsortableClass : "ui-sortable-placeholder",        
        colClass: "postcol",
        postToolClass: "post-tool",
        postEditToolClass: "post-edit-tool",
        postupdateClass: "update-post-cont",
        postScreenClass: "post-screen",
        postEmptyClass: "post-empty",
        postTextempty: "내용을 입력하세요.",
        rowButtonsAppend:[
            {
                btnLabel: "",
                title: "move",
                element: "a",
                btnClass: "post-moveRow"
            },
            {
                btnLabel: "+",
                title: "row seting",
                element: "a",
                btnClass: "post-setRow"
            },
            {
                btnLabel: "-",
                title: "row remove",
                element: "a",
                btnClass: "post-removeRow"
            }
        ],
        addGroupClass: "post-add",
        addButtonsAppend:[
            {
                btnLabel: "텍스트",
                title: "add text",
                element: "button",
                btntype: "button",
                btnClass: "post-addText"
            },
            {
                btnLabel: "이미지",
                title: "add image",
                element: "button",
                btntype: "button",
                btnClass: "post-addImage"
            },
            {
                btnLabel: "동영상",
                title: "add youtube",
                element: "button",
                btntype: "button",
                btnClass: "post-addVideo"
            },            
            {
                btnLabel: "지도",
                title: "add daum map",
                element: "button",
                btntype: "button",
                btnClass: "post-addDmap"
            },
            {
                btnLabel: "선",
                title: "add line",
                element: "button",
                btntype: "button",
                btnClass: "post-addLine"
            },
        ],
        ImgButtonsAppend:[
            {
                btnLabel: "L",
                title: "alignLeft",
                element: "button",
                btntype: "button",
                btnClass: "post-alignLeft"
            },
            {
                btnLabel: "C",
                title: "alignCenter",
                element: "button",
                btntype: "button",
                btnClass: "post-alignCenter"
            },
            {
                btnLabel: "R",
                title: "alignRight",
                element: "button",
                btntype: "button",
                btnClass: "post-alignRight"
            },
            {
                btnLabel: "Link",
                title: "edit Link",
                element: "button",
                btntype: "button",
                btnClass: "post-editlink"
            },
            {
                btnLabel: "사진",
                title: "edit picture",
                element: "button",
                btntype: "button",
                btnClass: "post-editpicture"
            }
        ],
        VideoButtonsAppend:[
            {
                btnLabel: "L",
                title: "alignLeft",
                element: "button",
                btntype: "button",
                btnClass: "post-alignLeft"
            },
            {
                btnLabel: "C",
                title: "alignCenter",
                element: "button",
                btntype: "button",
                btnClass: "post-alignCenter"
            },
            {
                btnLabel: "R",
                title: "alignRight",
                element: "button",
                btntype: "button",
                btnClass: "post-alignRight"
            },            
            {
                btnLabel: "동영상",
                title: "edit video",
                element: "button",
                btntype: "button",
                btnClass: "post-editvideo"
            }
        ],
        
        summernote: {
            config: {
                focus: true,
                airMode: true,
                lang: 'ko-KR',
                dialogsInBody: true,
                dialogsFade: true,
                disableDragAndDrop: true,
                //toolbarContainer: '.post-addText'                
                fontNames: ['굴림', '돋움','Arial', 'Arial Black', 'Comic Sans MS', 'Courier New'],                
                popover: {                  
                  link: [
                    ['link', ['linkDialogShow', 'unlink']]
                  ],
                  air: [
                    ['fontname', ['fontname']],
                    ['fontsize', ['fontsize']],
                    ['font', ['bold', 'italic', 'underline']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['link']]
                    //['insert', ['link', 'picture']]
                  ]
                },
                callbacks: {
                    onInit: function() {                        
                        console.log('Summernote is launched');
                    }
                }
                
            }
        },       
        /*        
        hallo:{
            config: {
                plugins: {
                    //'hallosize': {},
                    'halloblock': {},
                    'hallocolor':{},                    
                    'hallobackcolor':{},                    
                    //'hallocolorpicker': {},
                    'hallofontfamily': {},                    
                    'halloformat': {},
                    //'halloheadings': {},
                    'hallojustify': {},
                    'hallolists': {},
                    'hallolink': {},
                    'halloreundo': {}
                },
                toolbar: 'halloToolbarFixed',
                editable: true,
                showAlways: true
            }
        }
        */
        viewGroupClass: "post-view-controls",
        viewButtonsPrepand:            
            '   <button type="button" class="post-view-pc">pc</button>'+
            '   <button type="button" class="post-view-mobile">mobile</button>',
        viewButtonsOnClass: "post-view-on",
        modaldefault:[
            {
                id:"modalImg",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">사진 추가</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div class="form-group note-group-select-from-files">'+
                '                    <label>파일 선택</label><input class="note-image-input form-control" type="file" name="files" accept="image/*" multiple="multiple">'+
                '                </div>'+
                '                <div class="form-group note-group-select-from-files">'+
                '                    <label>대체텍스트</label><input class="note-image-alt-input form-control" type="text" name="alt" multiple="multiple">'+
                '                </div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '                <button href="#" class="btn btn-primary note-image-btn disabled" disabled="">사진 추가</button>'+
                '            </div>'            
            },
            {
                id:"modalLink",
                html:
                '        <div class="modal-header">'+
                '            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button><h4 class="modal-title">링크 추가</h4>'+
                '        </div>'+
                '        <div class="modal-body">'+
                '            <div class="form-group">'+
                '                <label>링크에 표시할 내용</label><input class="note-link-text form-control" type="text">'+
                '            </div>'+
                '            <div class="form-group">'+
                '                <label>이동할 URL</label><input class="note-link-url form-control" type="text" value="http://">'+
                '            </div>'+
                '            <div class="checkbox">'+
                '                <label><input type="checkbox" checked=""> 새창으로 열기</label>'+
                '            </div>'+
                '        </div>'+
                '        <div class="modal-footer">'+
                '            <button href="#" class="btn btn-primary note-link-btn disabled" disabled="">링크 추가</button>'+
                '        </div>'
            },
            {
                id:"modalVideo",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">동영상 추가</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div class="form-group row-fluid">'+
                '                    <label>YouTube Video URL?<small class="text-muted"></small></label><input class="note-video-url form-control span12" type="text">'+
                '                </div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '            <button href="#" class="btn btn-primary note-video-btn disabled" disabled="">동영상 추가</button>'+
                '            </div>'
            },
            {
                id:"modalDmap",
                html:
                '            <div class="modal-header">'+
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                '                <h4 class="modal-title">지도 위치 설정</h4>'+
                '            </div>'+
                '            <div class="modal-body">'+
                '                <div id="modalDaumMap"></div>'+
                '                <div id="modalDaumMapInfo"></div>'+
                '            </div>'+
                '            <div class="modal-footer">'+
                '                <button href="#" class="btn btn-primary note-image-btn">지도 추가</button>'+
                '            </div>'+
                '<script>'+
                'daum.maps.load(function() {'+
                'var mapContainer = document.getElementById("modalDaumMap"),'+
                '    mapOption = { '+
                '        center: new daum.maps.LatLng(33.450701, 126.570667),'+
                '        level: 3'+
                '    };'+
                'var map = new daum.maps.Map(mapContainer, mapOption);'+
                'var mapTypeControl = new daum.maps.MapTypeControl();'+
                'map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);'+
                'function getInfo() {'+
                '    var center = map.getCenter(); '+                
                '    var message = "지도 중심좌표는 위도 " + center.getLat() + ",<br>";'+
                '    message += "경도 " + center.getLng() + " 이고 <br>";'+
                '    var infoDiv = document.getElementById("modalDaumMapInfo");'+
                '    infoDiv.innerHTML = message;'+
                '}'+
                '});'+
                '</script>'
            }
            
        ],
        mapApiId:"daumMap",
        mapApiKey:"a7b3e5375021061876b437aaaf84ef18",       
       
    };
    
    $.fn.posteditor = function(options){
        return this.each(function(){
            var element = $(this);            
            var posteditor = new $.posteditor(this, options);
            element.data('posteditor', posteditor);
                      
        });
    };
    
})(jQuery );






    
