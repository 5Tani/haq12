<!DOCTYPE html>
<html>
    
<head>
        <title>SmartHCM App</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link type="text/css" rel="stylesheet" href="assets/css/style.css" />

        <link rel="shortcut icon" href="" />

        <script type="text/javascript" src="templates/js/jquery-1.9.js"></script>
        <script src="assets/js/jquery.cookie.js"></script>

        <script>

            function initTheme() {
                var link = $('.iphone-content').contents().find('#theme-style'),
                        list = $('.change-bg ul li'),
                        theme = $.cookie('malpha-theme');

                list.find('a').removeClass('active');

                if(theme != '') {
                    link.attr({ 'href' : 'assets/themes/'+ theme +'/style.css' });
                    list.find('[data-theme="'+ theme +'"]').addClass('active');
                } else {
                    link.attr({ 'href' : '' });
                    list.eq(0).find('a').addClass('active');
                }
            }

            $(document).ready(function() {

                $('.iphone-content').load(function () {
                    initTheme();
                });

                $('.change-bg a').on('click', function() {
                    $.cookie('malpha-theme', $(this).data('theme'));
                    initTheme();
                });
            });

        </script>

        <!--[if lt IE 9]>
            <script src="js/html5.js"></script>
        <![endif]-->

    </head>
    <!--[if IE 7]><body class="ie7"><![endif]-->
    <!--[if IE 8]><body class="ie8"><![endif]-->
    <!--[if IE 9]><body class="ie9"><![endif]-->
    <!--[if gt IE 9]><!--><body><!--<![endif]-->
        <div class="box">
            <div id="iphone">
               
                <div class="change-bg">
                </div>

               

                <iframe class="iphone-content" src="templates/index.html" frameborder="0"></iframe>
            </div>
        </div>

        <div class="overlay"></div>

        
    </body>

</html>