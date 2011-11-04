/*!
 * routing.js
 * Copyright (c) 2011
 * Original author: Julien Muetton <julien_muetton@carpe-hora.com>
 * Modified by: William DURAND <william.durand1@gmail.com>
 * Adjusted to ExtJS by zbigniew.labacz@hatimeria.pl
 * MIT Licensed
 */

/**
 * define Routing class
 */

var Routing = Routing || {};

(function(Routing, undefined) {

  // now register our routing methods
  Ext.apply(Routing, (function() {

    var _routes = {},
        _defaults = {},
        rquery = /\?/,
        rabsurl = /^\//,
        rescregexp = /[-[\]{}()*+?.,\\^$|#\s]/g,
        rdblslash = /\/\/$/g,
        rbracket = /\[\]$/,
        r20 = /%20/g;
        

    /**
     * @api private
     * prepare a regexp part with several caracters/parts
     * having to be escaped.
     *
     *    regexify('a'); // returns 'a'
     *    regexify(['a', '.']); // returns 'a|\.'
     *    regexify(['a', '.'], '$'); // returns 'a|\.|$'
     *
     * @param {Array|string}  separators  a list of separators.
     * @param {String}        unescaped   a meta character to use in regexp.
     * @return {String}      the regexp part, ready to use.
     */
    function regexify(separators, unescaped) {
      var _i, _separators = [];
      // make sure separator is an array
      if (!Ext.isArray(separators)) {
        separators = [separators];
      }
      // escape every separator
      for (_i in separators) {
        _separators[_i] = separators[_i].replace(rescregexp, '\\$&');
      }
      // add unescaped caracters
      if (unescaped) { _separators.push(unescaped); }

      // return in a or
      if (_separators.length > 1) {return _separators.join('|')}
      else if(_separators.length) {return _separators[0];}
      return '';
    };

    /**
     * replace params in given url.
     * **WARNING:** used params are removed.
     *
     * @param {String} url the raw url.
     * @param {Object} params the params to replace.
     * @return {String} the treated url.
     * @api private
     */
    function replace_params(url, params) {
        var _i,
            _url = url,
            _separators = Routing.segmentSeparators,
            _prefixes = regexify(Routing.variablePrefix),
            _suffixes = regexify(Routing.variableSuffix),
            _prefix = '(' + regexify(_separators, '^') + ')' + _prefixes,
            _suffix = _suffixes + '(' + regexify(_separators, '$') + ')';
        for (_i in params) {
          var _r = new RegExp(_prefix + _i + _suffix, '');

          // special cases
          if (null === params[_i] || false === params[_i]) {
            params[_i] = '';
          } else if (true === params[_i]) {
            params[_i] = '1';
          }

          if (_r.test(_url)) {
            _url = _url.replace(_r, '$1' + params[_i] + '$2');
            delete(params[_i]);
          }
        }

        return _url;
    }

    function buildParams( prefix, obj, traditional, add) {
        if ( Ext.isArray(obj) ) {
            // Serialize array item.
            Ext.each(obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    // If array item is non-scalar (array or object), encode its
                    // numeric index to resolve deserialization ambiguity issues.
                    // Note that rack (as of 1.0.0) can't currently deserialize
                    // nested arrays properly, and attempting to do so may cause
                    // a server error. Possible fixes are to modify rack's
                    // deserialization algorithm or to provide an option or flag
                    // to force array serialization to be shallow.
                    buildParams( prefix + "[" + ( typeof v === "object" || Ext.isArray(v) ? i : "" ) + "]", v, traditional, add );
                }
            });

        } else if ( !traditional && obj != null && typeof obj === "object" ) {
            // Serialize object item.
            for ( var name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }

	function param( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = Ext.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// If an array was passed in, assume that it is an array of form elements.
		if (Ext.isArray(a)) {
			// Serialize the form elements
			Ext.each(a, function() {
				add(this.name, this.value);
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (var prefix in a) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}

    return {
      /**
       * default routing parameters for every routes.
       *
       * @api public
       */
      defaults: {},
      /**
       * route parameter suffix.
       *
       * @type {String}
       * @api public
       */
      variableSuffix: '',
      /**
       * route parameter prefix.
       *
       * @type {String}
       * @api public
       */
      variablePrefix: ':',
      /**
       * route url separator list.
       *
       * @type {String|Array}
       * @api public
       */
      segmentSeparators: ['/', '.'],
      /**
       * route url prefix to use.
       *
       * @type {String}
       * @api public
       */
      prefix: '',
      /**
       * generate a route url from route id and params.
       *
       * @param {String}  route_id  the id of route to generate url for.
       * @param {Objects} params    the parameters to append to the route.
       * @return {String} generated url.
       * @api public
       */
      generate: function(route_id, params) {
        var _route = Routing.get(route_id),
            _params = Ext.merge({}, _defaults[route_id] || {}, params || {}),
            _queryString,
            _url = _route;

        if (!_url) {
          throw 'No matching route for ' + route_id;
        }

        // replace with params then defaults
        _url = replace_params(_url, _params);
        _url = replace_params(_url, Ext.apply({}, Routing.defaults || {}));

        // remaining params as query string
        _queryString = param(_params);

        if (_queryString.length) {
          _url += (rquery.test(_url) ? '&' : '?') + _queryString;
        }

        _url = (rabsurl.test(_url) ? '' : '/') + _url;
        _url = Routing.prefix.replace(/\/$/, '') + _url;
        _url = (rabsurl.test(_url) ? '' : '/') + _url;
        _url =  _url.replace(rdblslash, '/');

        // remove '/' due to special cases replacement
        if ('/' !== _route.charAt(_route.length - 1) && '/' === _url.charAt(_url.length - 1)) {
          _url = _url.slice(0, -1);
        }
        // remove '.' if not necessary
        if ('.' !== _route.charAt(_route.length - 1) && '.' === _url.charAt(_url.length - 1)) {
          _url = _url.slice(0, -1);
        }

        return _url;
      },
      /**
       * connect a route.
       *
       * @param {String} id       the route id.
       * @param {String} pattern  the url pattern.
       * @return {Object} Routing.
       * @api public
       */
      connect: function(id, pattern, defaults) {
        _routes[id] = pattern;
        _defaults[id] = defaults || {};
        return Routing;
      },
      /**
       * retrieve a route by it's id.
       *
       * @param {String} route_id the route id to retrieve.
       * @return {String} requested route.
       * @api public
       */
      get: function(route_id) {
        return _routes[route_id] || undefined;
      },
      /**
       * determines wether a route is registered or not.
       *
       * @param {String} route_id the route id to retrieve.
       * @return {Boolean} wether the route is registered or not.
       * @api public
       */
      has: function(route_id) {
        return (_routes[route_id] ? true : false);
      },
      /**
       * clears all routes
       *
       * @return {Object} Routing.
       * @api public
       */
      flush: function() {
        _routes = {};
        _defaults = {};
        return Routing;
      }
    }; // end of return
  })());
})(Routing);