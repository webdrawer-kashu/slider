/**
* sliders
* jQuery required.
*
* * Copyright 2014 (c) webdrawer-kashu
* * http://webdrawer.net/
* * Licensed Under the MIT.
*
*/

(function($) {

    $.fn.sliders = function(options){

        //fadeSlide フェードインアウト
        //leftSlide スライドでループは無し
        //leftSlideLoop スライドでループ
        //leftSlideAnimation 常にスライド・ループ
        //selectAnimation 次へ戻るボタンあり
        //moveOn 重なるスライド

        //デフォルト設定
        var defaults = {
            slideType : 'leftSlide',//上記スライドタイプ
            changeTime: 1500,//次のスライドまでの移動秒数
            showTime: 3000,//表示秒数
            allTime: 15000,//leftSlideAnimation用・全体にかける秒数
            animeType: 'swing'//leftSlide・leftSlideLoop・selectAnimation・moveOn用
        };

        var setting = $.extend(defaults,options);
        var slideChangeTime = setting.changeTime;
        var slideShowTime = setting.showTime;
        var slideAllTime = setting.allTime;
        var animationType = setting.animeType;

       	var slideWrap = this;
        var own = slideWrap.attr('id')
        var slideContent = slideWrap.find('ul');
        var slideList = slideContent.find('li');
        var slideWidth = slideList.find('img').width();
        var slideHeight = slideList.find('img').height();
        var slideNum  = slideList.length;

        //全体を囲む
        this.wrapInner('<div class="sliders"></div>');
        var slideWrapInner = slideWrap.children($('.sliders'));

        //ページャーの表示
        if(setting.slideType == 'leftSlideAnimation'){
        }else {
            slideWrapInner.after('<ul class="pager"></ul>');
            for (i = 1; i < slideNum + 1; i++) {
                var list = '<li><a href="#">' + i +'</a></li>';
                slideWrapInner.next('.pager').append(list);
            };
            $('.pager').each(function(index, el) {
                $(this).children('li:first').addClass('current');
            });
            var pager = slideWrapInner.next('.pager');
            var pagerList = slideWrapInner.next('.pager').find('li');
        }

        //それぞれ実行
        if (setting.slideType == 'fadeSlide'){
            fadeSlide();
        }
        if(setting.slideType == 'leftSlide'){
            leftSlide();
        }
        if (setting.slideType == 'leftSlideLoop'){
            leftSlideLoop();
        }
        if(setting.slideType == 'leftSlideAnimation'){
            leftSlideAnimation();
        }
        if(setting.slideType == 'selectAnimation'){
            selectAnimation();
        }
        if(setting.slideType == 'moveOn'){
            moveOn();
        }


        ////////////////////////////////////////////////////

        //  fadeSlide

        ////////////////////////////////////////////////////
        function fadeSlide(){
            slideContent.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'width': slideWidth,
                'height': slideHeight,
                'position': 'relative'
            });
            slideList.css({
               'position' : 'absolute',
               'top' : 0,
               'left' : 0
            }).hide();

            $(slideList).first().show().css('z-index','3');

            var currentIndex = 1;
            var index = 1;

            //スライド処理
            function goSlide(index){
                slideList.eq(index - 1).show().css('z-index','2');
                slideList.eq(currentIndex - 1).css('z-index','3').fadeOut();
                currentIndex = index;
                clickFlg = true;

                pagerList.removeClass('current');
                pagerList.eq(index - 1).addClass('current')
            };

            //クリック判定
            var clickFlg = true;
            pagerList.click(function() {
                if(clickFlg && currentIndex != $(this).index() + 1){
                    clickFlg = false;
                    index = $(this).index() + 1;
                    goSlide(index);
                    stop();
                    start();
                }
                return false;
            });

            function start(){
                own = setInterval(function() {
                        if(index >= slideNum){
                            index = 0;
                        }
                        index++;
                        goSlide(index);

                    }, slideShowTime);
            }

            function stop () {
               clearInterval(own);
            }

            start();
        }

        ////////////////////////////////////////////////////

        //  leftSlide

        ////////////////////////////////////////////////////
        function leftSlide(){
            slideWrapInner.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'overflow' : 'hidden',
                'width' : slideWidth,
                'height' : slideHeight
            });
            slideContent.css({
                'position' : 'relative',
                'left' : 0,
                'overflow' : 'hidden',
                'width' : (slideWidth * slideNum)
            });
            slideList.css({
                'float' : 'left'
            });

            var index = 1;

            //スライド処理
            function goSlide(index){
                slideContent.animate({
                    'left' : parseInt(slideWidth * (index - 1) * (-1))+ 'px'
                },slideChangeTime,animationType,function(){
                    clickFlg = true;
                });

                //ページャーの処理
                pagerList.removeClass('current');
                pagerList.eq(index - 1).addClass('current');
            };

            var clickFlg = true;
            //ページャー
            pagerList.click(function() {
                if(clickFlg){
                    clickFlg = false;
                    index = $(this).index() + 1;
                    goSlide(index);
                    stop();
                    start();
                }
                return false;
            });

            function start(){
                own = setInterval(function() {
                        clickFlg = false;
                        if(index >= slideNum){
                            index = 0;
                        }
                        index++;
                        goSlide(index);

                    }, slideShowTime);
            }

            function stop () {
               clearInterval(own);
            }

            start();
        }


        ////////////////////////////////////////////////////

        //  leftSlideLoop

        ////////////////////////////////////////////////////
        function leftSlideLoop(){
            slideContent.wrapAll('<div class="loop"></div>');

            slideWrapInner.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'overflow' : 'hidden',
                'width' : slideWidth,
                'height' : slideHeight
            });
            slideContent.css({
                'float' : 'left',
                'overflow' : 'hidden',
                'width' : (slideWidth * slideNum)
            });
            slideList.css({
                'float' : 'left'
            });

            slideWrapInner.children('.loop').css({
                'width' : (slideWidth * slideNum) * 2,
                'position' : 'relative',
                'left' : 0
            });
            slideContent.clone().appendTo(slideWrapInner.children('.loop'));

            var currentIndex = 1;
            var index = 1;

            function goSlide(index){

                //ループまで行かない場合
                if(index > currentIndex){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1) * (-1))+ 'px'
                    },slideChangeTime,animationType,function(){
                        clickFlg = true;
                    });
                    currentIndex = index;
                }
                //ループする場合
                if(index < currentIndex){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1 + slideNum) * (-1))+ 'px'
                    },slideChangeTime,animationType).animate({
                        'left' : parseInt(slideWidth * (index - 1) * (-1))+ 'px'
                    },0,function() {
                        clickFlg = true;
                    });
                    currentIndex = index;
                }

                //ページャーの処理
                pagerList.removeClass('current');
                pagerList.eq(index - 1).addClass('current')
            };

            var clickFlg = true;
            //ページャーをクリックした時
            pagerList.click(function() {
                if(clickFlg){
                    clickFlg = false;
                    index = $(this).index() + 1;
                    goSlide(index);
                    stop();
                    start();
                }
                return false;
            });

            function start(){
                own = setInterval(function() {
                        if(index >= slideNum){
                            index = 0;
                        }
                        index++;
                        goSlide(index);

                    }, slideShowTime);
            }

            function stop () {
               clearInterval(own);
            }

            start();
        }

        ////////////////////////////////////////////////////

        //  leftSlideAnimation

        ////////////////////////////////////////////////////
        function leftSlideAnimation(){
            slideContent.wrapAll('<div class="loop"></div>');
            slideContent.clone().appendTo(slideWrapInner.children('.loop'));

            slideWrapInner.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'overflow' : 'hidden',
                'width' : slideWidth,
                'height' : slideHeight
            });
            slideContent.css({
                'float' : 'left',
                'overflow' : 'hidden',
                'width' : (slideWidth * slideNum)
            });
            slideList.css({
                'float' : 'left'
            });

            slideWrapInner.children('.loop').css({
                'width' : (slideWidth * slideNum) * 2,
                'position' : 'relative',
                'left' : 0
            });

            var currentIndex = 1;
            var index = 1;

            function goSlide(index){
                slideWrapInner.children('.loop').stop().animate({
                    'left' : parseInt(slideContent.width() * -1 + 'px')
                },slideAllTime, 'linear').animate({
                    left : 0
                },0);
            };
            goSlide();

            function start(){
                own = setInterval(function() {
                        if(index >= slideNum){
                            index = 0;
                        }
                        index++;
                        goSlide(index);

                    }, slideAllTime);
            }

            start();
        }

        ////////////////////////////////////////////////////

        //  selectAnimation

        ////////////////////////////////////////////////////
        function selectAnimation(){
            slideContent.wrapAll('<div class="loop"></div>');
            slideWrapInner.before('<div class="prev">前へ</div>');
            slideWrapInner.after('<div class="next">次へ</div>');

            slideWrapInner.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'overflow' : 'hidden',
                'width' : slideWidth,
                'height' : slideHeight
            });
            slideContent.css({
                'float' : 'left',
                'overflow' : 'hidden',
                'width' : (slideWidth * slideNum)
            });
            slideList.css({
                'float' : 'left'
            });

            slideContent.clone().appendTo(slideWrapInner.children('.loop'));
            slideContent.clone().appendTo(slideWrapInner.children('.loop'));

            slideWrapInner.children('.loop').css({
                'width' : (slideList.width() * slideNum) * 3,
                'position' : 'relative',
                'left' : (slideList.width() * slideNum) * (-1)
            });

            var firstPos = (slideList.width() * slideNum) * (-1);//初期位置
            var currentIndex = 1;//現在表示枚数
            var index = slideNum + 1;//初期位置

            function leftGoSlide(index){
                //ループまで行かない場合
                if(slideNum < index){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1) * (- 1))+ 'px'
                    },slideChangeTime,animationType,function() {
                        clickFlg = true;
                    });

                    currentIndex = index % slideNum;
                }
                //ループする場合
                if(slideNum > index || slideNum == index){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1) * (- 1))+ 'px'
                    },slideChangeTime,animationType).animate({
                        'left' : parseInt(slideWidth * ((index - 1) % slideNum + slideNum) * (-1))+ 'px'
                    },0, function() {
                        clickFlg = true;
                    });

                    currentIndex = index % slideNum;
                    if(currentIndex == 0){
                        currentIndex = slideNum;
                    }
                }

                // //ページャーの処理
                pagerList.removeClass('current');
                pagerList.eq(index % slideNum - 1).addClass('current');
            };

            function rightGoSlide(index){
                //ループまで行かない場合
                if(slideNum * 2 > index - 1){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1) * (- 1))+ 'px'
                    },slideChangeTime,animationType,function() {
                        clickFlg = true;
                    });

                    currentIndex = index % slideNum;
                    if(currentIndex == 0){
                        currentIndex = slideNum;
                    }
                }
                //ループする場合
                if(slideNum * 2 < index){
                    slideWrapInner.children('.loop').stop().animate({
                        'left' : parseInt(slideWidth * (index - 1) * (- 1))+ 'px'
                    },slideChangeTime,animationType).animate({
                        'left' : parseInt(slideWidth * ((index - 1) % slideNum + slideNum) * (-1))+ 'px'
                    },0, function() {
                        clickFlg = true;
                    });

                    currentIndex = index % slideNum;
                }

                //ページャーの処理
                pagerList.removeClass('current');
                pagerList.eq(index % slideNum - 1).addClass('current');
            }

            var clickFlg = true;
            //ページャーをクリックした時
            pagerList.click(function() {
                if(clickFlg){
                    stop();
                    clickFlg = false;
                    pagerIndex = $(this).index() + 1 + slideNum;
                    index = pagerIndex;
                    rightGoSlide(index);
                    start();
                }
                return false;
            });

            //前へをクリックした時
            slideWrapInner.prev($('.prev')).click(function() {
                if(clickFlg) {
                    stop();
                    clickFlg = false;
                    index = index - 1;
                    leftGoSlide(index);
                    if(slideNum >= index){
                        index = index + slideNum;
                    }
                    start();
                }else {
                    return false;
                }
            });

            //次へをクリックした時
            slideWrapInner.next($('.next')).click(function() {
                if(clickFlg) {
                    stop();
                    clickFlg = false;
                    index = index + 1;
                    rightGoSlide(index);
                    if(slideNum * 2 < index){
                        index = (index % slideNum) + slideNum;
                    }
                    start();
                }else {
                    return false;
                }
            });


            function start(){
                 own = setInterval(function() {
                        clickFlg = false;
                        if(slideNum * 2 >= index){
                            index++;
                        }
                        rightGoSlide(index);
                        if(slideNum * 2 + 1 == index){
                            index = slideNum + 1;
                        }

                    }, slideShowTime);
            }

            function stop () {
                clearInterval(own);
            }

            start();
        }

        ////////////////////////////////////////////////////

        //  moveOn

        ////////////////////////////////////////////////////
        function moveOn() {
            slideWrapInner.before('<div class="prev">前へ</div>');
            slideWrapInner.after('<div class="next">次へ</div>');

            slideWrapInner.css({
                'margin-right': 'auto',
                'margin-left': 'auto',
                'position': 'relative',
                'overflow' : 'hidden',
                'width' : slideWidth,
                'height' : slideHeight
            });
            slideContent.css({
                'overflow' : 'hidden',
                'width' : (slideList.width() * slideNum)
            });

            slideList.css({
                'position' : 'absolute',
                'left': slideWidth,
                'z-index': 3
            });
            slideList.eq(0).css({
                'left': 0,
                'z-index': 1
            });

            var index = 1;//次表示
            var currentIndex = 0;//現在表示

            function goSlide(index){

                //現在表示中
                slideList.eq(currentIndex).css('z-index', 1);

                //真ん中に動く
                slideList.eq(index).stop().animate({
                    'left': 0
                },slideChangeTime,animationType,function(){
                    slideList.eq(currentIndex).stop().animate({
                        'left': slideWidth,
                        'z-index': 3
                    },0,function(){
                        clickFlg = true;
                        currentIndex　= index;
                    });
                });

                //ページャーの処理
                pagerList.removeClass('current');
                pagerList.eq(index).addClass('current');
            };

            var clickFlg = true;
            slideWrapInner.next($('.next')).click(function() {
                if(clickFlg){
                    stop ();
                    clickFlg = false;
                    index = currentIndex;
                    index++;
                    if(index == slideNum){
                        index = 0;
                    }
                    goSlide(index);
                    index++;
                    if(index == slideNum){
                        index = 0;
                    }
                    start();
                }else {
                    return false;
                }
            });

            slideWrapInner.prev($('.prev')).click(function() {
                if(clickFlg){
                    stop ();
                    clickFlg = false;
                    index = currentIndex;
                    index--;
                    if(index < 0){
                        index = slideNum - 1;
                    }
                    goSlide(index);
                    index++;
                    if(index == slideNum){
                        index = 0;
                    }
                    start();
                }else {
                    return false;
                }
            });

            //ページャーをクリックした時
            pagerList.click(function() {
                if(clickFlg){
                    clickFlg = false;
                    stop();
                    pagerIndex = $(this).index();
                    index = pagerIndex;
                    goSlide(index);
                    index++;
                    if(index == slideNum){
                        index = 0;
                    }
                    start();
                }else {
                    return false;
                }
                return false;
            });

            function start(){
                own = setInterval(function() {
                        clickFlg = false;
                        goSlide(index)
                        index++;
                        if(index == slideNum){
                            index = 0;
                        }
                    }, slideShowTime);
            }

            function stop () {
               clearInterval(own);
            }

            start();
        }

    }

})(jQuery);
