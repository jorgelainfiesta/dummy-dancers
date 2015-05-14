define(["three", 'JSARToolKit', 'jquery', "./materials", "./data", "./cameras", "./renderer"], function (THREE, JSARToolKit, $, materials, data, cameras, renderer) {
  var scene, clock = new THREE.Clock();
  window.DEBUG = false;
  if (window.DEBUG) {
      $("#debugCanvas").show();
  }
  var width = data.get('opts.swidth');
  var height = data.get('opts.sheight');
  
  $('#inputCapture').attr('width', width);
  $('#inputCapture').attr('height', height);
  //Set up JSARToolKit
  var markerWidth = 10;
  var parameters = new JSARToolKit.FLARParam(width, height);
  var detector = new JSARToolKit.FLARMultiIdMarkerDetector(parameters, markerWidth);

  // The three.js camera for rendering the overlay on the input images
  // (We need to give it the same projection matrix as the detector
  // so the overlay will line up with what the detector is 'seeing')
  cameras.overlayCamera.setJsArMatrix(parameters);


  //Set up lights
  
  //Add a light in sky
  
  var ambientLight = new THREE.AmbientLight(0x555555);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0.3, 0.5, 2);
  cameras.overlayCamera.add(directionalLight);
  
  //Set up main plane
  var floorTexture	= THREE.ImageUtils.loadTexture(data.get('textures.floor'));
  var floorMaterial = new THREE.MeshLambertMaterial( {color: 0x3e3e3e, map: floorTexture} );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(2, 2);
  
  
  var geometry = new THREE.PlaneBufferGeometry(15, 15, 32 );
  var material = new THREE.MeshLambertMaterial( {color: 0x3e3e3e, side: THREE.DoubleSide} );
  var basePlane = new THREE.Mesh( geometry, floorMaterial );
  
  basePlane.rotation.x = Math.Pi * 0.5;
  basePlane.matrixAutoUpdate = false;
  
  //Set up scene
  var overlayScene = new THREE.Scene();
  overlayScene.add(ambientLight);
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
//      alert("Couldn't access webcam. Fallback to static image");
      input = $('#inputImage')[0];
//      jsFrames.start();
      ready = true;
  });
  
  //Load scene objects for decoration
  var loader = new THREE.JSONLoader;
  //Load speaker
  loader.load(data.get('models.speaker'), function (geometry, materials) {
    var mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.rotation.y = Math.PI * 0.5;
    mesh.scale.set(2, 2, 2);
    mesh.position.set(-5, -5, 0);
    basePlane.add(mesh);
    //Second speaker
    var mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.rotation.y = Math.PI * 0.5;
    mesh.scale.set(2, 2, 2);
    mesh.position.set(-5, 5, 0);
    basePlane.add(mesh);
  });
  
  //Load DJ bottom
  loader.load(data.get('models.djbottom'), function (geometry, materials) {
    var bottom = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    bottom.rotation.set(-Math.PI * 0.5, -Math.PI * 0.5, 0);
    bottom.scale.set(2, 2, 2);
    bottom.position.set(-5, -5, 0);
    basePlane.add(bottom);
    //Load DJ top
    loader.load(data.get('models.djtop'), function (geometry, materials) {
      var mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      bottom.add(mesh);
    });

  });
  
  var lamp;
  //Load lamp
  loader.load(data.get('models.lamp'), function (geometry, materials) {
    var mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.z = -10;
    basePlane.add(mesh);
    
    var light = new THREE.PointLight(0x001dff, 1, 100 );
    light.position.set(10, 0, 0);
    mesh.add(light);
    
    var light = new THREE.PointLight(0x00ffe2, 1, 100 );
    light.position.set(-10, 0, 0);
    mesh.add(light);
    
    var light = new THREE.PointLight(0xffba00, 1, 100 );
    light.position.set(0, 10, 0);
    mesh.add(light);
    
    var light = new THREE.PointLight(0x9d00ff, 1, 100 );
    light.position.set(0, -10, 0);
    mesh.add(light);
    
    lamp = mesh;
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
      
      lamp.rotation.y += 0.1;
    }
    
  };
  
  return {overlayScene : overlayScene, inputScene: inputScene, update : updateScene, basePlane: basePlane};
});