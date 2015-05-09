define(["three", "./materials", "./data", "./cameras", "./renderer"], function (THREE, materials, data, cameras, renderer) {
  var scene, clock = new THREE.Clock();
  //Set up scene
  scene = new THREE.Scene();
  
  //Set up camera
  scene.add(cameras.topView);
  
  //Set up fog
  var fog =  new THREE.Fog(0xceeaff, 1, data.get('opts.far')*1.7);
  scene.fog = fog;

  //Set up lights
  
  //Add a light in sky
  var hemispherelight = new THREE.HemisphereLight(0xd6e7ff, 0x9ad7f7, 1);
  scene.add(hemispherelight);
  
  //Add point light closer to scene
  var light = new THREE.PointLight( 0xffffff, 1, 500);
  light.position.set(500, 500, 500);
  scene.add( light );
  
  //Set up skydom
  var geometry = new THREE.SphereGeometry (data.get('opts.far')*1.2);
//  var cloudTexture = THREE.ImageUtils.loadTexture(data.get('opts.skyURL'));
//  cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
//  cloudTexture.repeat.set(10, 10);
//  cloudTexture.anisotropy = 16;
  material = new THREE.MeshPhongMaterial({color: 0xB8EEFF, side: THREE.DoubleSide} );
  var sky = new THREE.Mesh( geometry, material );
  scene.add( sky );

  
  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = -Math.PI * 0.5;
  scene.add( plane );
  
  //Function to update scene elements
  var updateScene = function(){
    
  };

  
  cameras.topView.position.z = 800;
  
  return {scene : scene, update : updateScene};
});