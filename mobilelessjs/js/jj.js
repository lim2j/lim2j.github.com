(function($){
    /* SLIDE NAV
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
            }

            e.preventDefault();
        });

        $('body').on('click', '.'+options.screenBg, function(e){
            self.close();
            e.preventDefault();
        });

        self.close = function(){
            if($el.hasClass(options.LeftOpenClass)){
                $el.addClass(options.LeftCloseClass);
            } else {
                $el.addClass(options.RightCloseClass);
            }
            $('.'+options.screenBg).hide();
            $el.removeClass(options.LeftOpenClass);
            $el.removeClass(options.RightOpenClass);

            console.log('close');
        };

        self.openLeft = function(){
            $el.removeClass(options.LeftCloseClass);
            $el.removeClass(options.RightCloseClass);

            $el.addClass(options.LeftOpenClass);
            $('.'+options.screenBg).show();

            console.log('openLeft');
        };

        self.openRight = function(){
            $el.removeClass(options.LeftCloseClass);
            $el.removeClass(options.RightCloseClass);

            $el.addClass(options.RightOpenClass);
            $('.'+options.screenBg).show();

            console.log('openRight');
        };

        function init(){
            $el.css('height', bodyH);
            $el.after($('<div/>',{
                    'class':options.screenBg,
                })
            );
            $('.'+options.screenBg).css('height', bodyH);
        };

    };

    /* defaults optipon */
    $.jjSlideNav.defaults = {
        LeftOpenClass: 'left-open',
        RightOpenClass: 'right-open',
        LeftCloseClass: 'left-close',
        RightCloseClass: 'right-close',
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



$(function(){
    // 플러그인의 defaults 값을 외부에서 변경할 수 있다.
    //$.fn.jjSlideNav.defaults. = '';

    // 사용자 정의의 옵션값을 정의하여 플러그인 메소드를 호출한다.
    // slide nav
    var slidenav = new $('#menu').jjSlideNav({});

    // slider
    $(".slider ol").bxSlider({
        auto: true,
        pause: $('.slider').attr('data-delay'),
        controls: false,
        onSliderLoad : function(){
            var pagingPosition = $(".slider").attr("data-paging-position");

            if(pagingPosition != undefined){
                $('.slider').find('.bx-pager').css('bottom', pagingPosition+'px');
            }
        }
    });

});
