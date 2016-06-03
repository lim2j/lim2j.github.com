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



    /* IMAGE SLIDER
    PAGEING
    */
    $.jjImagesSlider = function(element, options){

        var options = $.extend({}, $.jjImagesSlider.defaults, options);
        // 첫번째 인자값이 {} 빈 객체이므로 defaults 객체의 멤버와 opts(사용자정의 옵션값)이 merge되어 options에 담겨진다.

        var self = this;
        var $el = $(element);
        var sliderWrap = $(element).children('ol')
        var sliderH = $el.find('img').height();
        var sliderW = $el.width();
        var sliderL = $el.find('img').length;
        var sliderWrapW = sliderL * sliderW;
        var sliderInterval;

        // event
        $('body').on('click', options.prevBtn, function(e){
            self.moveLeft();
            e.preventDefault();
        });

        $('body').on('click', options.nextBtn, function(e){
            self.moveRight();
            e.preventDefault();
        });

        self.slideAuto = function(){
            var delay = $el.attr("data-delay") || options.delay;

            sliderInterval = setInterval(function(){
                self.moveRight();
            }, delay);
            console.log('auto');
        };

        self.slideStop = function(){
            clearInterval(sliderInterval);
            console.log('stop');
        };

        self.moveLeft = function(){
            sliderWrap.animate({
               left: +sliderW
            }, 300, function(){
                sliderWrap.find('li:last-child').appendTo(sliderWrap);
                sliderWrap.css('left', '');
            });

            console.log('moveLeft');
        };

        self.moveRight = function(){
            sliderWrap.animate({
               left: -sliderW
            }, 300, function(){
                sliderWrap.find('li:first-child').appendTo(sliderWrap);
                sliderWrap.css('left', '')
            });
            console.log('moveRight');
        };

        self.pagingActive = function(){

        };

        self.sliderSetting = function(){

        };

        self.init = function(){

            $el.css({
                'height': sliderH,
                'width': sliderW
            });
            sliderWrap.css({
                'width': sliderWrapW,
                'marginLeft': -sliderW
            });
            sliderWrap.find('li').css({
                'height': sliderH,
                'width': sliderW,
            });
            sliderWrap.find('li:last-child').prependTo(sliderWrap);

            //pagination
            if(options.pagination){
                var a = '<a href="#"></a>';
                var pagingP = $el.attr('data-paging-positon') || option.pagingPositon;
                $el.append($('<div/>',{
                        'class':options.pagingClass,
                        'style':'bottom:'+pagingP+'px'
                    })
                );
                for(var i = 0; i < sliderL; i++){
                    $el.find('.'+options.pagingClass).append(a);
                }

            }

            //auto
            if(options.auto){
                self.slideAuto();
            }
        };

        self.init();

        // resize
        $(window).resize(function(){

        });
    };

    /* defaults optipon */
    $.jjImagesSlider.defaults = {
        prevBtn:'slider-prevbtn',
        nextBtn:'slider-nextbtn',
        auto: true,
        delay: '5000',
        pagination: true,
        pagingClass: 'slider-pagination',
        pagingPositon: '50'
    };

    /* plugin */
    $.fn.jjImagesSlider = function(options){
        return this.each(function(){
            var element = $(this);
            var jjImagesSlider = new $.jjImagesSlider(this, options);
            element.data('jjImagesSlider', jjImagesSlider);
        });
    };

})(jQuery);

$(function(){
    // 플러그인의 defaults 값을 외부에서 변경할 수 있다.
    //$.fn.jjSlideNav.defaults. = '';

    // 사용자 정의의 옵션값을 정의하여 플러그인 메소드를 호출한다.
    // slide nav
    var slidenav = new $("#menu").jjSlideNav({});

    // slider
    var imageslider = new $('.slider').jjImagesSlider({});
});
