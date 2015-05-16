define(['jquery', './animation', './renderer', 'tour', './audioHandler', './gui'], function ($, animation, renderer, tour, AudioHandler) {

  var tour = new Tour({
    backdrop : false,
    steps: [
      {
        orphan: true,
        title: "Welcome",
        content: "This is a simple port view in 3D.",
        backdrop : true,
        next: 1,
      },
      {
        element: ".main",
        title: "Choose mode",
        content: "Select which mode you want to use. You can use a global view, the crane view or move the boat.",
        placement: "right",
        prev: 0,
        next : 2
      },
      {
        element: ".contextual",
        title: "Contextual Menu",
        content: "If you're using the global or crane mode you can manipulate its parts here. In ship mode you can move the ship.",
        placement: "left",
        prev : 1
      }
    ]
  });
  // Initialize the tour
//  tour.init();

  // Start the tour
//  tour.start();

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