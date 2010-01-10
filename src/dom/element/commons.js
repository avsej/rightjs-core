/**
 * Common DOM Element unit methods
 *
 * Credits:
 *   Most of the naming system in the module inspired by
 *     - Prototype (http://prototypejs.org)   Copyright (C) Sam Stephenson
 *
 * Copyright (C) 2008-2010 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
Element.include({
  /**
   * sets the element attributes
   *
   * @param String attr name or Object attributes hash
   * @param mixed attribute value
   * @return Element self
   */
  set: function(hash, value) {
    if (typeof(hash) === 'string') { var val = {}; val[hash] = value; hash = val; }
    
    for (var key in hash) {
      // some attributes are not available as properties
      if (this[key] === undefined) {
        this.setAttribute(key, ''+hash[key]);
      }
      this[key] = hash[key];
    }
      
    return this;
  },
  
  /**
   * returns the attribute value for the name
   *
   * @param String attr name
   * @return mixed value
   */
  get: function(name) {
    var value = this[name] || this.getAttribute(name);
    return value === '' ? null : value;
  },
  
  /**
   * checks if the element has that attribute
   *
   * @param String attr name
   * @return Boolean check result
   */
  has: function(name) {
    return this.get(name) !== null;
  },
  
  /**
   * erases the given attribute of the element
   *
   * @param String attr name
   * @return Element self
   */
  erase: function(name) {
    this.removeAttribute(name);
    return this;
  },
  
  /**
   * checks if the elemnt is hidden
   *
   * NOTE: will check css level computed styles too
   *
   * @return boolean check result
   */
  hidden: function() {
    return this.getStyle('display') == 'none';
  },
  
  /**
   * checks if the element is visible
   *
   * @return boolean check result
   */
  visible: function() {
    return !this.hidden();
  },
  
  /**
   * hides the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  hide: function(effect, options) {
    this._$pd = this.getStyle('display');
    this.style.display = 'none';
    return this;
  },
  
  /**
   * shows the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  show: function(effect, options) {
    if (this.getStyle('display') == 'none') {
      // setting 'block' for the divs and 'inline' for the other elements hidden on the css-level
      var value = this.tagName == 'DIV' ? 'block' : 'inline';
      this.style.display = this._$pd == 'none' ? value : this._$pd || value;
    }
    return this;
  },
  
  /**
   * toggles the visibility state of the element
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  toggle: function(effect, options) {
    return this[this.hidden() ? 'show' : 'hide'](effect, options);
  },
  
  /**
   * shows the element and hides all the sibligns
   *
   * @param String optional effect name
   * @param Object the optional effect options
   * @return Element self
   */
  radio: function(effect, options) {
    this.siblings().each('hide', effect, options);
    return this.show();
  }
});