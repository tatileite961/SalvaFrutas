//Script
$(document).ready(function(){

    $('.back-on').hide();
    
    $(window).scroll(function(){
        if($(this).scrollTop()>0){
            $('.back-on').fadeIn();
               
        }
        if($(this).scrollTop()<600){
            $('.back-on').css("color","white");
        }
        else {
            $('.back-on').css("color","#39b300e1");
        }
        
        });

        $('.back-on').click(function(){
            $('html, body').animate({
                scrollTop : 0
                
            },2000);
         });

    });
   
