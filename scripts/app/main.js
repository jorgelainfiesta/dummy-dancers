define(['jquery','./animation', './renderer', './gui', 'tour'], function ($, animation, renderer) {

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

  
  //Run animate
  animation.animate();
  
  //Insert into body
  $("#result").append(renderer.domElement);
});