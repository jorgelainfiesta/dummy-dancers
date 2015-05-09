define(['three', './data'], function (THREE, data) {
  //Set up renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(data.get('opts.swidth'), data.get('opts.sheight'));
  
  return renderer;
});