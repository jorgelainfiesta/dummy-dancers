define(['jquery', './animation', './renderer', 'tour', './audioHandler', './gui'], function ($, animation, renderer, tour, AudioHandler) {

  var tour = new Tour({
    backdrop : false,
    steps: [
      {
        orphan: true,
        title: "Welcome",
        content: "This is demo in which models dance to the rythm of the music.",
        backdrop : true,
        next: 1,
      },
      {
        element: ".player",
        title: "Select Song",
        content: "Choose which song you want to play. The models will dance to that song.",
        placement: "right",
        prev: 0,
        next : 2
      },
      {
        element: ".songs li:last-child",
        title: "Drop any song",
        content: "You can also drag and drop any song to the browser and it will start playing it.",
        placement: "left",
        prev : 1,
        next: 3
      },
      {
        element: ".dances",
        title: "Select dance",
        content: "Choose which set of movements the models will play.",
        placement: "right",
        prev : 2,
        next: 4
      },
      {
        element: "nav",
        title: "Tap to toggle menu",
        content: "Tap anywhere to show or hide this menu. Have fun!",
        placement: "inside",
        prev : 3,
      }
    ]
  });
  // Initialize the tour
  tour.init();

  // Start the tour
  tour.start();

  document.onselectstart = function() {
    return false;
  };
  document.addEventListener('drop', onDocumentDrop, false);
  document.addEventListener('dragover', onDocumentDragOver, false);

  function onDocumentDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return false;
  }
  //load dropped MP3
  function onDocumentDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    AudioHandler.onMP3Drop(evt);
  }
  
  AudioHandler.init();
  AudioHandler.onUseSample();
  
  //Run animate
  animation.animate();
  
  
  
  //Insert into body
  $("#result").append(renderer.domElement);
});