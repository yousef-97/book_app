$(document).ready(function(){
    $('.forupdate').hide();
    $('#showform').on('click',()=>{
        $('.forupdate').toggle();
        
    })
    $('#menu').on('click',()=>{
        $('.nav').toggle();
    })
})
