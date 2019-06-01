;(function(){
  function gquery(s){
    var that = this;

    // this.length = 0;

    if (typeof s === 'string') {
        this.elements = document.querySelectorAll(s);
    }else if (Array.isArray(s)){ console.log('array', s);
        this.elements = s;
    }else if(NodeList.prototype.isPrototypeOf(s)){ console.log('nl', s);
        this.elements = s;
    } else { console.log(typeof s);
        this.elements = [s];
    }
  }

  gquery.prototype = {
    find: function(s){
      console.log('this',this.elements[0], s);
      console.log('qsa', this.elements[0].querySelectorAll(s));
      this.elements = this.elements[0].querySelectorAll(s);
      console.log('te', this.elements);
      console.log('new this', this);
      console.log('$$', $('a'));
      return this;
    },

    on: function(e, cb) {
      var events = e.split(' ');
      for (var i = 0; i < this.elements.length; i++) {
          for(var j = 0; j < events.length; j++){
            this.elements[i].addEventListener(events[j], cb);
          }
      }

      return this;
    },

    trigger: function(e){
      var event = new MouseEvent(e, {
        view: window,
        bubbles: true,
        cancelable: true
      });

      for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].dispatchEvent(event);
      }
    },

    html: function(v) {
      if (v == undefined || v == null) {
          return this.elements[0].innerHTML;
      } else {
          for (var i = 0; i < this.elements.length; i++) {
              this.elements[i].innerHTML = v;
          }

          return this;
      }
    },

    append: function(v){
      for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].innerHTML += v;
      }
    },

    width: function(){
      var el = this.elements[0];

      var width = el.offsetWidth;

      var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;

      var marginLeft = parseInt(style.marginLeft) || 0;
      var marginRight = parseInt(style.marginRight) || 0;
      var borderLeft = parseInt(style.borderLeftWidth) || 0;
      var borderRight = parseInt(style.borderRightWidth) || 0;

      return width + marginLeft + marginRight + borderLeft + borderRight;
    },

    height: function(){
      var el = this.elements[0];

      var height = el.offsetHeight;

      var style = window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle;

      var marginTop = parseInt(style.marginTop) || 0;
      var marginBottom = parseInt(style.marginBottom) || 0;
      var borderTop = parseInt(style.borderTopWidth) || 0;
      var borderBottom = parseInt(style.borderBottomWidth) || 0;

      return height + marginTop + marginBottom + borderTop + borderBottom;
    },

    css: function(a, v) {
      if((v == undefined || v == null) && typeof a === 'string' ){
        return window.getComputedStyle(this.elements[0]).getPropertyValue(a);
      }else{
        if(typeof a === 'string'){
          a = a.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
          for (var i = 0; i < this.elements.length; i++) {
              this.elements[i].style[a] = v;
          }
        }else{
          for(var i = 0; i < this.elements.length; i++){
            for(var k in a){
              var p = k.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
              this.elements[i].style[p] = a[k];
            }
          }
        }

        return this;      
      }
    },

    addClass: function(c) {
      for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].classList.add(c);
      }

      return this;
    },

    removeClass: function(c) {
      for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].classList.remove(c);
      }

      return this;
    },

    toggleClass: function(c) {
      for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].classList.toggle(c, true);
      }

      return this;
    },

    removeAllClassesExcept: function(c){
      if(typeof c === 'string'){
        c = [c];
      }

      for (var i = 0; i < this.elements.length; i++) {
        for(var j = 0; j < this.elements[i].classList.length; j++){
          if(c.indexOf(this.elements[i].classList[j]) === -1){
            this.elements[i].classList.remove(this.elements[i].classList[j]);
          }
        }
      }

      return this;
    },

    class: function(c){
      if(c == null || c == undefined){
        return this.elements[0].className;
      }

      for(var i = 0; i < this.elements.length; i++){
        this.elements[i].className = c;
      }

      return this;
    },

    hasClass: function(c){
      return this.elements[0] && this.elements[0].classList.contains(c);
    },

    show: function(v) {
      for (var i = 0; i < this.elements.length; i++) {
          var d = this.elements[i].style.display;
          if (d == 'none' || !d || d == null || d == undefined) {
              this.elements[i].style.display = v || 'block';
          }
      }

      return this;
    },

    hide: function() {
      for (var i = 0; i < this.elements.length; i++) {
          this.elements[i].style.display = 'none';
      }

      return this;
    },

    data: function(a, v) {
      if (v == null || v == undefined) {
          return this.elements[0].getAttribute('data-' + a);
      } else {
          for (var i = 0; i < this.elements.length; i++) {
              this.elements[i].setAttribute('data-' + a, v);
          }

          return this;
      }
    },

    attr: function(a, v) {
      if (v == null || v == undefined) {
          return this.elements[0].getAttribute(a);
      } else {
          for (var i = 0; i < this.elements.length; i++) {
              this.elements[i].setAttribute(a, v);
          }

          return this;
      }
    },

    position: function() {
        var el = this.elements[0];
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    },

    post: function(url, data){
      return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: 'follow',
        body: JSON.stringify(data)
      }).then(function(response){
        return response.json();
      })
    },

    patch: function(url, data){
      return fetch(url, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: 'follow',
        body: JSON.stringify(data)
      }).then(function(response){
        return response.json();
      })
    },

    get: function(url){
      return fetch(url).then(function(r){
        return r.json()
      });
    }
  }

  window.$ = function(s){
    return new gquery(s);
  }
})();