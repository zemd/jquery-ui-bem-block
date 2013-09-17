(function(window) {
    var $ = window.jQuery;

    // statics



    // widget
    $.widget('opesho.block', {
        options: {
            mod_delim: '_',
            elem_delim: "--",
            name_pattern: "[a-zA-Z0-9]"
        },
        _create: function() {
            var classes = this.element.attr('class').split(' '),
                self = this,
                options = this.options;
            $.each(classes, function(index, value) {
                if (value.indexOf(options.mod_delim) === -1 && value.indexOf(options.elem_delim) === -1) {
                    self.mainClass = value;
                    return false;
                }
            });

            if (!this.mainClass) {
                return false;
            }
        },

        // private
        /**
         * Bind event for block elems. By default suppressDisabledCheck set to false.
         *
         * @param event
         * @param element
         * @param handler
         * @private
         */
        _onElem: function (event, element, handler) {
            var conf = {};
            conf[event + ' ' + this._getElemClassName(element)] = handler;
            this._on(conf);
        },
        _toggleMod: function(key, value, elem) {
            var el = elem || this.element;
            value = value || true;
            if (this._getModVal(key, elem) == value) {
                this._delMod(key, elem);
                return;
            }
            this._setMod(key, value, elem);
        },
        /**
         * Set modifier to element or block. If there is already mod with this key - function replaces it
         *
         * @param key
         * @param value
         * @param elem
         * @private
         */
        _setMod: function(key, value, elem) {
            var el = elem || this.element;
            this._delMod(key, value, elem);
            el.addClass(this._getModClass(key, value, elem));
            this._trigger('onSetMod');
        },
        /**
         * Remove mod from element or block
         *
         * @private
         */
        _delMod: function(key, value, elem) {
            var el = elem || this.element,
                classToRemove = this._getModClass(key, this._getModVal(key, elem), elem);
            el.removeClass(classToRemove);
        },
        /**
         *
         * @param key string
         * @param elem jQuery
         * @returns {*}
         * @private
         */
        _getModVal: function(key, elem) {
            var mods = this._getMods(elem),
                result = false;
            $.each(mods, function(index, value) {
                if (value.mod == key) {
                    result = value.val;
                    return false;
                }
            });
            return result;
        },
        /**
         * Get all mods for current BLOCK or selected ELEMENT.
         *
         * @param elem jQuery
         * @returns {array}
         * @private
         */
        _getMods: function(elem) {
            var element = this.element,
                el =  element,
                options = this.options,
                mainClass = this.mainClass,
                elem_delim = options.elem_delim,
                mod_delim = options.mod_delim,
                name_pattern = options.name_pattern,
                modRegex = new RegExp(mainClass + mod_delim + "("+name_pattern+"+)(" + mod_delim + ")?(.*)?"),
                classes = [],
                mods = [],
                self = this;

            if (elem) {
                el = elem;
                var elemName = this._getElemName(elem);
                modRegex = new RegExp(mainClass + elem_delim + "" +elemName+ "" + mod_delim + "("+name_pattern+"+)?(" + mod_delim + ")?(.*)?");
            }
            classes = el.attr('class').toString().split(' ');
            $.each(classes, function(index, value) {
                var matches;
                if (matches = value.match(modRegex)) {
                    mods.push({ block: self.mainClass, elem: elemName || false, mod: matches[1], val: matches[3] || true})
                }
            });
            return mods;
        },
        _getModClassName: function(mod, val, elem) {
            return '.' + this._getModClass(mod, val, elem);
        },
        /**
         *
         * @param mod
         * @param val
         * @param elem
         * @returns {string}
         * @private
         */
        _getModClass: function(mod, val, elem) {
            var options = this.options,
                mod_delim = options.mod_delim,
                elem_delim = options.elem_delim,
                mainClass = this.mainClass;

            if (val && typeof val !== "boolean") {
                mod += mod_delim + val;
            }
            if (!elem) {
                return mainClass + mod_delim + mod;
            }
            return mainClass + elem_delim + elem +  mod_delim + mod;
        },
        _hasElem: function (elem) {
            return this._getElems(elem) !== false ? true: false;
        },
        /**
         * Get elements for current block. Returns jquery object
         *
         * @param elem string
         * @returns {jQuery}
         * @private
         */
        _getElems: function(elem) {
            var find = this.element.find(this._getElemClassName(elem));
            return find.length > 0 ? find : false;
        },
        /**
         * Get full classname for current block, that can be used in find expression
         *
         * @param elem string
         * @returns {string}
         * @private
         */
        _getElemClassName: function (elem) {
            return '.' + this._getElemClass(elem);
        },
        /**
         * Get classname without prefixed dot
         *
         * @param elem string
         * @returns {string}
         * @private
         */
        _getElemClass: function (elem) {
            var options = this.options;
            return this.mainClass + options.elem_delim + elem;
        },
        /**
         * Returns element name by its jquery object
         *
         * @param elem jQuery
         * @returns {string}
         * @private
         */
        _getElemName: function(elem) {
            var classes = elem.attr('class').split(' '),
                options = this.options,
                elemRegExp = new RegExp('^' + this.mainClass + options.elem_delim + "(" +options.name_pattern + "+)$"),
                elementName = false;
            $.each(classes, function(index, value) {
                var matches;
                if (matches = value.match(elemRegExp)) {
                    elementName = matches[1];
                    return false;
                }
            });
            return elementName;
        }
    });

} (this));
