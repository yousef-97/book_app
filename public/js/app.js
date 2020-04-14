$(document).ready(function(){
    $('.forupdate').hide();
    $('#showform').on('click',()=>{
        $('.forupdate').toggle();
        
    })
    $('#menu div').on('click',()=>{
        $('.nav').toggle();
    })
})
