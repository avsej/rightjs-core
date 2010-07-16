/**
 * The dom-wrapper main unit
 *
 * This unit is basically for the internal use
 * so that we could control the common functionality
 * among all the wrappers
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

var Wrapper = function(parent, klass) {
  if (!klass) {
    klass  = parent;
    parent = null;
  }
  
  // hooking up the class extension tools
  $ext(klass, Class_Methods).inherit(parent);
  
  // predefining the raw object reference
  klass[PROTO]._ = null;
  
  return klass;
},

// returns a cached or an initialized instance of an object wrapper
Wrapper_cached = function(object, instance) {
  var uid = object[UID_KEY] || (object[UID_KEY] = UID++);
  
  if (!(uid in Wrappers_Cache)) {
    instance._ = object;
    Wrappers_Cache[uid] = instance;
  }
  
  return Wrappers_Cache[uid];
};