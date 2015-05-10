define(['./opts'], function (opts) {
  var data = {
    dancer1: {
      url: 'models/dancer1.json'
    },
    models: {
      speaker: 'models/speaker.json',
      djtop: 'models/dj_top.json',
      djbottom: 'models/dj_bottom.json',
      test: 'models/lighthouse.json',
      lamp: 'models/lamp.json'
    },
    textures: {
      floor: 'images/floor.jpg'
    },
    opts: opts
  };
  
  
  //Use a resolver to have a better control of the data we send
  function get(param) {
    var s = param,
      o = data;
    
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }
  //Use a resolver to have a better control of the data we send
  function set(param, val) {
    var s = param,
      o = data;
    
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            //If we're on the last parent, assign the value
            if(i == n - 1){
              o[k] = val;
            } else {
              //Otherwise, keep looing for o
              o = o[k];
            }
            
        } else {
            return;
        }
    }
  }
  
  function increment(param, diff) {
    this.set(param, this.get(param) + diff);
  }
  //We only expose the get setting
  return {'get' : get, 'set' : set, 'increment' : increment};
});