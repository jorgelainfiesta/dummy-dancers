define(['three', './scene', './renderer', './cameras', './data', './audioHandler'], function (THREE, scene, renderer, cameras, data, AudioHandler) {
  //Animate
  
  var loader = new THREE.JSONLoader;
  var animation;
  var curAnim;
  var done = false;
  loader.load(data.get('models.alien'), function (geometry, materials) {
    var mesh, material;
    
    // create a mesh
    mesh = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    // define materials collection
    material = mesh.material.materials;
//    enable skinning
    for (var i = 0; i < materials.length; i++) {
      var mat = materials[i];
      mat.skinning = true;
    }
    console.log(geometry.animations);
    // create animation
    animation = new THREE.Animation(
      mesh,
      geometry.animations[0]
    );
    mesh.rotation.y = -Math.PI * 0.5;
    animation.loop = false;

    // play the anim
    animation.play();
    mesh.scale.set(2, 2, 2);
    mesh.rotation.x = -Math.PI * 0.5;
    scene.basePlane.add(mesh);

    done  = true;
  });
  
  
  var clock = new THREE.Clock();

  AudioHandler.init();
  AudioHandler.onUseSample();
  var animRate = Math.exp(data.get('danceRate') * 6);
  function animate() {
    requestAnimationFrame(animate);
    AudioHandler.update();
    if(done) {
      
      animation.update(animRate);
      
      if(animation.currentTime == data.get('currentDance') + 50) {
        animation.reset();
        animation.resetBlendWeights();
        animation.currentTime = data.get('currentDance') + 50 + data.get('danceRate');
      }
      if(animation.currentTime >= data.get('currentDance') + 100){
        animation.reset();
        animation.resetBlendWeights();
        animation.play();
        animation.currentTime = data.get('currentDance');
        animRate = Math.exp(data.get('danceRate') * 6);
      }
//      if(!animation.isPlaying){
//        animation.reset();
//        animation.resetBlendWeights();
//        animation.currentTime = data.get('currentDance') * 100;
//        animation.play();
//      }
    }
//    
    
//    controls.update();
//    renderer.render(scene.scene, cameras.topView);
//    
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene.inputScene, cameras.inputCamera);
    renderer.render(scene.overlayScene, cameras.overlayCamera);

    scene.update();
  }
  return {"animate" : animate};
});