define(['jquery', './data', './audioHandler'], function($, data, AudioHandler){
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
  //Change song
  $('.songs a').on('click', function(e){
    e.preventDefault();
    data.set('audioParams.sampleURL', $(this).data('song'));
    AudioHandler.onUseSample();
  });
  
  $('#play').on('click', function(){
    AudioHandler.onTogglePlay();
  });
});