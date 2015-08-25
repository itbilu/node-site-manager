var ItbiluAdmin = new
function ($) {
    "use strict";
    function updateContentHeight() {
        var windowHeight = $(window).height(),
        navHeight = $(".navbar-main").height();
        $(".content").css("min-height", windowHeight - navHeight - 1 + "px")
    }
    function initMenus() {
        function toggleMenu($menu) {
            $menu.toggleClass("open")
        }
        $(document).on("click", ".menu .menu-toggle",
        function (event) {
            event.preventDefault(),
            toggleMenu($(this).parents(".menu").first())
        })
    }
    function initDatepicker() {
        $('.datepicker').datepicker({
            format: 'yyyy/mm/dd',
            weekStart: 1,
            autoclose: true,
            todayBtn: 'linked',
            language: 'cn'
         })
    }
    function initControls() {
        $("textarea").autosize(),
        $('[data-toggle="tooltip"]').tooltip(),
        $("input:checkbox, input:radio").uniform()
    }
    this.init = function (charts) {
        initControls(),
        initMenus(),
        initDatepicker(),
        updateContentHeight(),
        $("body").resize(function () {
            updateContentHeight()
        })
    }
}(jQuery);

jQuery(function () {
    ItbiluAdmin.init();
})
$(function(){
    $('form :input').click(function(){
        $(this).parents('div').removeClass('has-error');
        $(this).parents('div').next('span.help-block').text('');
    });
});
function createAlert(type,info,strong,strongInfo)
{
    var alertHtml='<div class="alert alert-dismissable alert-';
    if(type=='success')
        alertHtml+='success';
    else if(type=='info')
        alertHtml+='info';
    else if(type=='warning')
        alertHtml+= 'warning';
    else if(type=='danger')
        alertHtml+='danger';
    else
        alertHtml+='info';
    alertHtml+='">';
    alertHtml+= '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
    if(strong)
        alertHtml+= '<strong>'+strongInfo+'</strong>';

    alertHtml+=info+'</div>';

    return alertHtml;
}