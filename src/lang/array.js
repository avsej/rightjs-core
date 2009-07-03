/**
 * The Array class extentions
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Array.prototype, {
  /**
   * IE fix
   * returns the index of the value in the array
   *
   * @param mixed value
   * @param Integer optional offset
   * @return Integer index or -1 if not found
   */
  indexOf: Array.prototype.indexOf || function(value, from) {
    for (var i=(from<0) ? Math.max(0, this.length+from) : from || 0; i < this.length; i++)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * IE fix
   * returns the last index of the value in the array
   *
   * @param mixed value
   * @return Integer index or -1 if not found
   */
  lastIndexOf: Array.prototype.lastIndexOf || function(value) {
    for (var i=this.length-1; i >=0; i--)
      if (this[i] === value)
        return i;
    return -1;
  },
  
  /**
   * returns the first element of the array
   *
   * @return mixed first element of the array
   */
  first: function() {
    return this[0];
  },
  
  /**
   * returns the last element of the array
   *
   * @return mixed last element of the array
   */
  last: function() {
    return this[this.length-1];
  },
  
  /**
   * returns a random item of the array
   *
   * @return mixed a random item
   */
  random: function() {
    return this.length ? this[Math.random(this.length-1)] : null;
  },
  
  /**
   * returns the array size
   *
   * @return Integer the array size
   */
  size: function() {
    return this.length;
  },
  
  /**
   * cleans the array
   * @return Array this
   */
  clean: function() {
    this.length = 0;
    return this;
  },
  
  /**
   * checks if the array has no elements in it
   *
   * @return boolean check result
   */
  empty: function() {
    return !this.length;
  },
  
  /**
   * creates a copy of the given array
   *
   * @return Array copy of the array
   */
  clone: function() {
    return this.slice(0);
  },
  
  /**
   * calls the given callback function in the given scope for each element of the array
   *
   * @param Function callback
   * @param Object scope
   * @return Array this
   */
  each: function() {
    this._call(arguments, 'forEach');
    return this;
  },
  
  /**
   * creates a list of the array items converted in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array collected
   */
  map: function() {
    return this._call(arguments, '_map');
  },
  
  /**
   * creates a list of the array items which are matched in the given callback function
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array filtered copy
   */
  filter: function() {
    return this._call(arguments, '_filter');
  },
  
  /**
   * applies the given lambda to each element in the array
   *
   * NOTE: changes the array by itself
   *
   * @param Function callback
   * @param Object optional scope
   * @return Array this
   */
  walk: function() {
    this.map.apply(this, arguments).forEach(function(value, i) { this[i] = value; }, this);
    return this;
  },
    
  /**
   * similar to the concat function but it adds only the values which are not on the list yet
   *
   * @param Array to merge
   * ....................
   * @return Array new merged
   */
  merge: function() {
    for (var copy = this.clone(), arg, i=0; i < arguments.length; i++) {
      arg = arguments[i];
      if (isArray(arg)) {
        for (var j=0; j < arg.length; j++) {
          if (copy.indexOf(arg[j]) == -1)
            copy.push(arg[j]);
        }  
      } else if (copy.indexOf(arg) == -1) {
        copy.push(arg);
      }
    }
    return copy;
  },
  
  /**
   * flats out complex array into a single dimension array
   *
   * @return Array flatten copy
   */
  flatten: function() {
    var copy = [];
    this.forEach(function(value) {
      if (isArray(value)) {
        copy = copy.concat(value.flatten());
      } else {
        copy.push(value);
      }
    });
    return copy;
  },
  
  /**
   * returns a copy of the array whithout any null or undefined values
   *
   * @return Array filtered version
   */
  compact: function() {
    return this.without(null, undefined);
  },
  
  /**
   * returns a copy of the array which contains only the unique values
   *
   * @return Array filtered copy
   */
  uniq: function() {
    return [].merge(this);
  },
  
  /**
   * checks if all of the given values
   * exists in the given array
   *
   * @param mixed value
   * ....
   * @return boolean check result
   */
  includes: function() {
    for (var i=0; i < arguments.length; i++)
      if (this.indexOf(arguments[i]) == -1)
        return false;
    return true;
  },
  
  /**
   * returns a copy of the array without the items passed as the arguments
   *
   * @param mixed value
   * ......
   * @return Array filtered copy
   */
  without: function() {
    var filter = $A(arguments);
    return this.filter(function(value) {
      return !filter.includes(value);
    });
  },
  
  /**
   * Shuffles the array items in a random order
   *
   * @return Array shuffled version
   */
  shuffle: function() {
    var shuff = this.clone();
    
    for (var j, x, i = shuff.length; i;
       j = Math.random(i-1), x = shuff[--i], shuff[i] = shuff[j], shuff[j] = x);
    
    return shuff;
  },
  
  /**
   * sorts the array by running its items though a lambda or calling their attributes
   *
   * @param Function callback or attribute name
   * @param Object scope or attribute argument
   * @return Array sorted copy
   */
  sortBy: function() {
    var pair = this._guessCallback(arguments);
    return this.map(function(item, i) {
      return {
        item: item,
        value: pair[0].call(pair[1], item, i, this)
      }
    }).sort(function(a, b) {
      return a.value > b.value ? 1 : a.value < b.value ? -1 : 0;
    }).map('item');
  },
  
  /**
   * checks if any of the array elements is logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return mixed the first non-false item or false if nothing found
   */
  any: function() {
    return this._all(arguments, 'any');
  },
  
  /**
   * checks if all the array elements are logically true
   *
   * @param Function optional callback for checks
   * @param Object optional scope for the callback
   * @return Boolean check result
   */
  all: function() {
    return this._all(arguments, 'all');
  },
  
// private
  
  // recatching the original JS 1.6 method 
  forEach: Array.prototype.forEach || function(callback, scope) {
    for (var i=0; i < this.length; i++)
      callback.call(scope, this[i], i, this);
  },
  
  _filter: Array.prototype.filter || function(callback, scope) {
    for (var result=[], i=0; i < this.length; i++) {
      if (callback.call(scope, this[i], i, this))
        result.push(this[i]);
    }
    return result;
  },
  
  _map: Array.prototype.map || function(callback, scope) {
    for (var result=[], i=0; i < this.length; i++) {
      result.push(callback.call(scope, this[i], i, this));
    }
    return result;
  },

  // handles the each/map/filter methods wrapups
  _call: function(args, name) {
    try {
      return this[name].apply(this, this._guessCallback(args));
    } catch(e) { if (!(e instanceof Break)) throw(e); }
  },
  
  // processes the all and any methods
  _all: function(args, name) {
    var pair = this._guessCallback(args), callback = pair[0], scope = pair[1], break_value = name != 'all', result = null;
    if (!callback) callback = function(value) { return value; };
    
    for (var i=0; i < this.length; i++) {
      if (!!(callback.call(scope, this[i], i, this)) == break_value) {
        result = name == 'all' ? false : this[i];
        break;
      }
    }
    
    return result === null ? !break_value : result;
  },
  
  // guesses the callback/scope pair out of the arguments list
  _guessCallback: function(args) {
    var args = $A(args), callback = args.shift(), scope = this;
    
    if (isString(callback)) {
      var attr = callback;
      if (this.length && isFunction(this[0][attr])) {
        callback = function(object) { return object[attr].apply(object, args); };
      } else {
        callback = function(object) { return object[attr]; };
      }
    } else {
      scope = args.shift();
    }
    
    return [callback, scope];
  }
});

$alias(Array.prototype, {includes: 'include'});