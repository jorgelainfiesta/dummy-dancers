define(['jquery', './data'], function($, data){
 $('.overlay').on('click', function(){
    $(this).fadeOut();
    $('nav').slideUp();
 });
  $('#result').on('click', function(){
    $('.overlay').fadeIn(function(){
      $('nav').slideDown();
    });
  });
  
  //Change dance buttons
  $('.dances button').on('click', function(){
    $('.dances .active').removeClass('active');
    $(this).addClass('active');
    data.set('changeDanceTo', parseInt($(this).data('dance')));
    
  });
});