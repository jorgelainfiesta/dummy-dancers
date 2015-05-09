define(["three", 'JSARToolKit', 'jquery', "./materials", "./data", "./cameras", "./renderer"], function (THREE, JSARToolKit, $, materials, data, cameras, renderer) {
  var scene, clock = new THREE.Clock();
  window.DEBUG = true;
  if (window.DEBUG) {
      $("#debugCanvas").show();
  }
  var width = 320;
  var height = 240;
  //Set up JSARToolKit
  var markerWidth = 10;
  var parameters = new JSARToolKit.FLARParam(width, height);
  var detector = new JSARToolKit.FLARMultiIdMarkerDetector(parameters, markerWidth);

  // The three.js camera for rendering the overlay on the input images
  // (We need to give it the same projection matrix as the detector
  // so the overlay will line up with what the detector is 'seeing')
  cameras.overlayCamera.setJsArMatrix(parameters);

  
  //Set up fog
//  var fog =  new THREE.Fog(0xceeaff, 1, data.get('opts.far')*1.7);
//  scene.fog = fog;

  //Set up lights
  
  //Add a light in sky
  var hemispherelight = new THREE.HemisphereLight(0xd6e7ff, 0x9ad7f7, 1);
  
  //Add point light closer to scene
  var light = new THREE.PointLight( 0xffffff, 1, 500);
  light.position.set(500, 500, 500);
  
  //Set up main plane
  var geometry = new THREE.PlaneBufferGeometry(10, 10, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var basePlane = new THREE.Mesh( geometry, material );
  basePlane.rotation.x = Math.Pi * 0.5;
  basePlane.matrixAutoUpdate = false;
  
  //Set up scene
  var overlayScene = new THREE.Scene();
  overlayScene.add(hemispherelight);
  overlayScene.add(basePlane);
  overlayScene.add(cameras.overlayCamera);
//  overlayScene.add(fog);
  
  // This is the canvas that we draw our input image on & pass
  // to the detector to analyse for markers...
  var inputCapture = $('#inputCapture')[0];
  
  // Set up another three.js scene that just draws the inputCapture...
  var inputCamera = cameras.inputCamera;
  var inputScene = new THREE.Scene();
  var inputTexture = new THREE.Texture(inputCapture);
  var inputPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2, 0), new THREE.MeshBasicMaterial({ map: inputTexture }));
  inputPlane.material.depthTest = false;
  inputPlane.material.depthWrite = false;
  inputScene.add(inputPlane);
  inputScene.add(inputCamera);
  
  // This JSARToolkit object reads image data from the input canvas...
  var imageReader = new NyARRgbRaster_Canvas2D(inputCapture);

  // ...and we'll store matrix information about the detected markers here.
  var resultMatrix = new NyARTransMatResult();

  //For cross-browser
  window.URL = window.URL || window.webkitURL;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || function (type, success, error) { error(); };

  // Get permission to use the webcam video stream as input to the detector
  // (Otherwise we can fallback to a static image for the input)
  var ready = false;
  var input;
  navigator.getUserMedia({ 'video': true }, function (stream) {
      input = $('#inputStream')
      input.attr('src', window.URL.createObjectURL(stream));
      input = input[0];
      ready = true;
    console.log(input);
      // Start the animation loop (see below)
//      jsFrames.start();
  }, function () {
      alert("Couldn't access webcam. Fallback to static image");
      input = $('#inputImage')[0];
//      jsFrames.start();
      ready = true;
  });
  
  
  //Function to update scene elements
  var updateScene = function(){
    
    if(ready){
      // Capture the current frame from the inputStream
      inputCapture.getContext('2d').drawImage(input, 0, 0, width, height);

      // then we need to tell the image reader and the input scene that the input has changed
      inputCapture.changed = true;
      inputTexture.needsUpdate = true;

      // Use the imageReader to detect the markers
      // (The 2nd parameter is a threshold)
      if (detector.detectMarkerLite(imageReader, 128) > 0) {
          // If any markers were detected, get the transform matrix of the first one
          detector.getTransformMatrix(0, resultMatrix);

          // and use it to transform our three.js object
          basePlane.setJsArMatrix(resultMatrix);
          basePlane.matrixWorldNeedsUpdate = true;
      }
    }
    
  };
  
  return {overlayScene : overlayScene, inputScene: inputScene, update : updateScene};
});