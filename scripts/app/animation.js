define(['three', './scene', './renderer', './cameras', './data', './audioHandler'], function (THREE, scene, renderer, cameras, data, AudioHandler) {
  //Animate
  
  var loader = new THREE.JSONLoader;
  var animations = [];
  
  //Load alien
  loader.load(data.get('models.alien'), function (geometry, materials) {
    var mesh, material, animation;
    data.increment('loaded');
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
    
    mesh.rotation.y = -Math.PI * 0.5;
    mesh.scale.set(2, 2, 2);
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.set(-1, 1, 0);
    scene.basePlane.add(mesh);
    
    // create animation
    animation = new THREE.Animation(
      mesh,
      geometry.animations[0]
    );
    animation.loop = false;
    animation.play();
    
    //Add to animation queue
    animations.push(animation);
  });
  
  //Load robot
  loader.load(data.get('models.robot'), function (geometry, materials) {
    var mesh, material, animation;
    data.increment('loaded');
    // create a mesh
    mesh = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh.position.set(3, -2, 0);
    // define materials collection
    material = mesh.material.materials;
//    enable skinning
    for (var i = 0; i < materials.length; i++) {
      var mat = materials[i];
      mat.skinning = true;
    }
    console.log(geometry.animations);
    
    mesh.rotation.y = -Math.PI * 0.5;
    mesh.rotation.x = -Math.PI * 0.5;
    scene.basePlane.add(mesh);
    
    // create animation
    animation = new THREE.Animation(
      mesh,
      geometry.animations[0]
    );
    animation.loop = false;
    animation.play();
    
    //Add to animation queue
    animations.push(animation);
  });
  
  //Load penguin
  loader.load(data.get('models.penguin'), function (geometry, materials) {
    var mesh, material, animation;
    data.increment('loaded');
    // create a mesh
    mesh = new THREE.SkinnedMesh(
      geometry,
      new THREE.MeshFaceMaterial(materials)
    );
    mesh.position.set(1, -1, 0);
    // define materials collection
    material = mesh.material.materials;
//    enable skinning
    for (var i = 0; i < materials.length; i++) {
      var mat = materials[i];
      mat.skinning = true;
    }
    console.log(geometry.animations);
    
    mesh.rotation.y = Math.PI * 0.5;
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.position.set(-5, 0, 0);
    scene.basePlane.add(mesh);
    
    // create animation
    animation = new THREE.Animation(
      mesh,
      geometry.animations[0]
    );
    animation.loop = false;
    animation.play();
    
    //Add to animation queue
    animations.push(animation);
  });
  
  var clock = new THREE.Clock();
  var pastHalf = false;

  var animRate = Math.exp(data.get('danceRate') * 6);
  function animate() {
    requestAnimationFrame(animate);
    
    if(data.get('loaded') == data.get('totalLoads')) {
      AudioHandler.update();
      for(var i in animations){
        var animation = animations[i];
        animation.update(animRate);
      
        if(animation.currentTime >= data.get('currentDance') + 50 && !pastHalf) {
          animation.reset();
          animation.resetBlendWeights();
          animation.currentTime = data.get('currentDance') + 50;
          console.info("half reached");
          pastHalf = true;
        }
        if(animation.currentTime >= data.get('currentDance') + 100){
          animation.reset();
          animation.resetBlendWeights();
          animation.play();
          if(data.get('changeDanceTo') >= 0){
            data.set('currentDance', data.get('changeDanceTo'));
            data.set('changeDanceTo', -1);
          }
          animation.currentTime = data.get('currentDance');
          animRate = Math.exp(data.get('danceRate') * 6);
          pastHalf = false;
        }
      }
     
    }
 
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene.inputScene, cameras.inputCamera);
    renderer.render(scene.overlayScene, cameras.overlayCamera);

    scene.update();
  }
  return {"animate" : animate};
});