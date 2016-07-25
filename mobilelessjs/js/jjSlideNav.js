(function($){
    /* jj SLIDE NAV
    LEFT, RIGHT
    2DETH
    CSS keyframe
    */
    $.jjSlideNav = function(element, options){

        var options = $.extend({}, $.jjSlideNav.defaults, options);
        // 첫번째 인자값이 {} 빈 객체이므로 defaults 객체의 멤버와 opts(사용자정의 옵션값)이 merge되어 options에 담겨진다.

        var self = this;
        var $el = $(element);
        var elementId = '#'+$el.attr('id');
        var bodyH = $(document).height();

        init();

        // event
        $('body').on('click', 'a[href="'+ elementId +'"]', function(e){

            var direction = $el.attr('data-slide-positon') || 'left';
            switch(direction){
                case 'left' :
                    if($el.hasClass(options.LeftOpenClass)){
                        self.close();
                    } else {
                        self.openLeft();
                    }
                    break;
                case 'right' :
                    if($el.hasClass(options.RightOpenClass)){
                        self.close();
                    } else {
                        self.openRight();
                    }
                    break;
                case 'top' :
                    if($el.hasClass(options.ToptOpenClass)){
                        self.close();
                    } else {
                        self.openTop();
                    }
                    break;
            }

            e.preventDefault();
        });

        $('body').on('click', '.'+options.screenBg, function(e){
            self.close();
            e.preventDefault();
        });

        $('body').on('click', '.'+options.navCloseClass, function(e){
            self.close();
            e.preventDefault();
        });

        $('.item-depthOne').on('click', function(e){
            var activeMenu = $('.'+options.oneDepthOpenClass);
            
            if($(this).hasClass(options.oneDepthOpenClass)){
                $(this).next('ol').stop().slideUp(function(){
                    $(this).removeClass(options.towDepthOpenClass);
                });
                $(this).removeClass(options.oneDepthOpenClass);
                $(this).find('i').removeClass(options.navMinusicon);
                $(this).find('i').addClass(options.navPlusicon);
            } else {

                if(activeMenu.length>0){
                    activeMenu.next('ol').stop().slideUp(function(){
                        $(this).removeClass(options.towDepthOpenClass);
                    });
                    activeMenu.removeClass(options.oneDepthOpenClass);
                    activeMenu.find('i').removeClass(options.navMinusicon);
                    activeMenu.find('i').addClass(options.navPlusicon);
                }

                $(this).next('ol').stop().slideDown();
                $(this).addClass(options.oneDepthOpenClass);
                $(this).find('i').removeClass(options.navPlusicon);
                $(this).find('i').addClass(options.navMinusicon);
            }

            e.preventDefault();
        });

        self.close = function(){
            if($el.hasClass(options.LeftOpenClass)){
                $el.addClass(options.LeftCloseClass);
            } else if($el.hasClass(options.RightOpenClass)) {
                $el.addClass(options.RightCloseClass);
            } else {
                $el.addClass(options.TopCloseClass);
            }
            $('.'+options.screenBg).hide();
            $el.removeClass(options.LeftOpenClass);
            $el.removeClass(options.RightOpenClass);
            $el.removeClass(options.TopOpenClass);

            console.log('close');
        };

        self.openLeft = function(){
            $el.removeClass(options.LeftCloseClass);
            $el.addClass(options.LeftOpenClass);
            $('.'+options.screenBg).show();

            console.log('openLeft');
        };

        self.openRight = function(){
            $el.removeClass(options.RightCloseClass);
            $el.addClass(options.RightOpenClass);
            $('.'+options.screenBg).show();

            console.log('openRight');
        };

        self.openTop = function(){
            $el.removeClass(options.TopCloseClass);
            $el.addClass(options.TopOpenClass);
            $('.'+options.screenBg).show();

            console.log('openRight');
        };

        self.openEventDepth = function(link){
            var elA = $el.find('.'+options.navClass).find('a');

            elA.each(function(){
                var href = $(this).attr('href');
                if(href == link){
                    if($(this).hasClass('item-depthOne') || $(this).closest('ol').hasClass(options.navClass)){
                        $(this).addClass(options.oneDepthOpenClass);
                    }else{
                        $(this).parent().parent().addClass(options.towDepthOpenClass);
                        $(this).parent().parent().parent().children('a').addClass(options.oneDepthOpenClass);
                        $(this).parent().parent().parent().children('a').children('i').removeClass(options.navPlusicon).addClass(options.navMinusicon);
                    }
                }
            });
            /*
            // eq number
            var openEl = $el.find('.'+options.navClass).children('li').eq(oneDepth);
            var childEl = openEl.find('ol');
            openEl.children('a').addClass(options.oneDepthOpenClass);

            if(childEl.length>0){
                childEl.addClass(options.towDepthOpenClass);
            }
            */
        };

        function init(){
            var elHeight = $el.attr('data-slide-positon') == 'top' ? 'auto' : bodyH;

            $el.css('height', elHeight);
            $el.after($('<div/>',{
                    'class':options.screenBg
                })
            );

            var depthMenu = $el.find('.'+options.navClass).find('ol');
            if(depthMenu.length>0){
                //depthMenu.addClass('item-depthTwo').hide();
                depthMenu.each(function(){
                    $(this).prev('a').addClass('item-depthOne');
                    $(this).prev('a').append($('<i class="'+ options.navPlusicon +'"/>'));
                });
            }

            $('.'+options.screenBg).css('height', bodyH);
        }


        $( window ).resize(function() {
            $el.css('height', $(window).height());
        });

    };

    /* defaults optipon */
    $.jjSlideNav.defaults = {
        navClass: 'item',
        navCloseClass: 'icon-comm_exit',
        navPlusicon: 'icon-comm_add',
        navMinusicon: 'icon-comm_min',
        oneDepthOpenClass: 'item-ative',
        towDepthOpenClass: 'item-open',
        LeftOpenClass: 'left-open',
        RightOpenClass: 'right-open',
        TopOpenClass: 'top-open',
        LeftCloseClass: 'left-close',
        RightCloseClass: 'right-close',
        TopCloseClass: 'top-close',
        screenBg: 'back-screen'
    };

    /* plugin */
    $.fn.jjSlideNav = function(options){
        return this.each(function(){
            var element = $(this);
            var jjSlideNav = new $.jjSlideNav(this, options);
            element.data('jjSlideNav', jjSlideNav);
        });
    };

})(jQuery);


/*
$(function(){
    // 플러그인의 defaults 값을 외부에서 변경할 수 있다.
    //$.fn.jjSlideNav.defaults. = '';

    // 사용자 정의의 옵션값을 정의하여 플러그인 메소드를 호출한다.
    var slidenav = new $('#menu').jjSlideNav({}).data('jjSlideNav');
    slidenav.openEventDepth(link);     //메뉴 활성화
});
*/
