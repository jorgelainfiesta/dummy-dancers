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

  //Set up fog
  var fog =  new THREE.Fog(0x2d3e4b, 1, 100);
  
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
  
  
  var geometry = new THREE.CircleGeometry(9, 64);
  var basePlane = new THREE.Mesh( geometry, floorMaterial );
  
  basePlane.rotation.x = Math.Pi * 0.5;
  basePlane.matrixAutoUpdate = false;
  
//  var circleGeom = new THREE.CircleGeometry(5, 64);
//  var colorMat = new THREE.MeshBasicMaterial( {color: 0xffff00,  side: THREE.DoubleSide} );
//  var planeNew = new THREE.Mesh( circleGeom, colorMat );
//  planeNew.position.z = -1;
//  basePlane.add(planeNew);
//  
  
  //Level planes
  
   var levels = []
  for(var i = 0; i < 7; i++){
    
    //Make contrast plane
    var geometry = new THREE.CircleGeometry(9 - i, 64);
    var contrastPlane = new THREE.Mesh( geometry, floorMaterial);
    contrastPlane.position.z = -0.1 * i;
    basePlane.add(contrastPlane);
    
    //Make color plane
    var geometry = new THREE.CircleGeometry(9 - i - 0.5, 64);
    var material = new THREE.MeshPhongMaterial( {color: 0x23eeff,
                                                 side: THREE.DoubleSide, specular: 0xff4523,
                                                 transparent: true, opacity: 0.5} );
    var levelPlane = new THREE.Mesh(geometry, material);
    levelPlane.position.z = -0.1 * i  - 0.05;
    basePlane.add(levelPlane);
    levels.push(levelPlane);
    
  }
  
  //Set up scene
  var overlayScene = new THREE.Scene();
  overlayScene.add(ambientLight);
  overlayScene.add(basePlane);
  overlayScene.add(cameras.overlayCamera);
  overlayScene.fog = fog;
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
  var input;
  navigator.getUserMedia({ 'video': true }, function (stream) {
      input = $('#inputStream')
      input.attr('src', window.URL.createObjectURL(stream));
      input = input[0];
      data.increment('loaded');
  }, function () {
//      alert("Couldn't access webcam. Fallback to static image");
      input = $('#inputImage')[0];
      data.increment('loaded');
  });
  
  //Load scene objects for decoration
  var loader = new THREE.JSONLoader;
  //Load speaker
  var speaker1;
  var speaker2;
  loader.load(data.get('models.speaker'), function (geometry, materials) {
    data.increment('loaded');
    speaker1 = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    speaker1.rotation.x = -Math.PI * 0.5;
    speaker1.rotation.y = Math.PI * 0.5;
    speaker1.scale.set(3, 3, 3);
    speaker1.position.set(-5, -5, 0);
    basePlane.add(speaker1);
    //Second speaker
    speaker2 = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    speaker2.rotation.x = -Math.PI * 0.5;
    speaker2.rotation.y = Math.PI * 0.5;
    speaker2.scale.set(3, 3, 3);
    speaker2.position.set(-5, 5, 0);
    basePlane.add(speaker2);
  });
  
  //Load DJ bottom
  loader.load(data.get('models.djbottom'), function (geometry, materials) {
    data.increment('loaded');
    var bottom = new THREE.Mesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    bottom.rotation.set(-Math.PI * 0.5, -Math.PI * 0.5, 0);
    bottom.scale.set(2, 2, 2);
    bottom.position.set(-3, -5, 0);
    basePlane.add(bottom);
    
    //Load DJ top
    loader.load(data.get('models.djtop'), function (geometry, materials) {
      var mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshFaceMaterial(materials)
      );
      
      var material = new THREE.MeshBasicMaterial({
          color: 0x0000ff
      });
      var circleGeometry = new THREE.CircleGeometry(5, 32 );				
      var circle = new THREE.Mesh( circleGeometry, material );
      circle.rotation.x = -Math.PI * 0.5;
      bottom.add(circle);
      bottom.add(mesh);
    });

  });
  
  var lamp;
  //Load lamp
  loader.load(data.get('models.lamp'), function (geometry, materials) {
    data.increment('loaded');
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
  
  var floorColors = [
    0x55d42d,
    0x3cfbcf,
    0x2a95ff,
    0x89ecfd,
    0x31f0b5
  ];
  //Function to update scene elements
  var updateScene = function(){
    
    if(data.get('loaded') == data.get('totalLoads')){
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
      //Scene animations
      lamp.rotation.y += (Math.exp(data.get('danceRate')) - 1) * 0.4;
      speaker1.position.z = -Math.exp(data.get('danceRate'));
      speaker2.position.z = -Math.exp(data.get('danceRate'));
      
      
      var audioLevels = data.get('audioLevels');
      for(var l = 0; l < levels.length; l++){
        if(data.get('changeColor')){
          var ncolor = floorColors[parseInt(Math.random() * floorColors.length)];
          levels[l].material.color.setHex(ncolor);
        }
        
        levels[l].material.opacity = audioLevels[levels.length - l - 1];
        
      }
      data.set('changeColor', false);
    }
    
  };
  
  return {overlayScene : overlayScene, inputScene: inputScene, update : updateScene, basePlane: basePlane};
});