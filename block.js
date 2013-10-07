(function (window) {
    "use strict";
    var $ = window.jQuery;

    $.widget("opesho.block", {
        version: "0.1alpha",
        options: {
            mod_delim: "_",
            elem_delim: "--",
            name_pattern: "[a-zA-Z0-9]"
        },
        mainClass: "",
        /**
         * @constructor
         * @private
         */
        _create: function () {
            var classes = this.element.attr("class").split(" "),
                self = this,
                options = this.options;

            $.each(classes, function (index, value) {
                if (value.indexOf(options.mod_delim) === -1 && value.indexOf(options.elem_delim) === -1) {
                    self.mainClass = value;
                    return false;
                }
                return true;
            });

            if (!this.mainClass) {
                throw new Error("Can't assign element as BEM block. There is no class for specified element.");
            }
        },
        /**
         * @returns {String}
         */
        getBlockClass: function () {
            return this.mainClass;
        },
        // -------------------------------------------------------------------------------------------------------------
        // public
        // -------------------------------------------------------------------------------------------------------------
        /**
         * Returns all elements for block
         *
         * @param {String} name
         * @returns {jQuery}
         */
        elems: function (name) {
            return this._getElems(name);
        },
        /**
         * Check whether there are elements with given name
         * @param {String} name
         * @returns {Boolean}
         */
        hasElems: function (name) {
            return this._hasElems(name);
        },
        /**
         * Returns modifiers array for given element. If there is no element, current block is used
         * @param {String|jQuery} elem
         * @returns {Array}
         */
        mods: function (elem) {
            return this._getMods(elem);
        },
        /**
         *
         */
        hasMod: function (mod, val, elem) {
            this._hasMod(mod, val, elem);
        },
        /**
         * Set modifier to element or block. If there is already mod with this key - function replaces it
         *
         * @param {String} key
         * @param {String|Boolean} value
         * @param {jQuery} elem
         * @private
         */
        setMod: function (key, value, elem) {
            this._setMod(key, value, elem);
        },
        /**
         * Delete mod from element or block
         *
         * @param {String} key
         * @param {String|Boolean} value
         * @param {jQuery} elem
         * @private
         */
        delMod: function (key, value, elem) {
            this._delMod(key, value, elem);
        },
        /**
         *
         * @param {String} key
         * @param {jQuery} elem
         * @returns {Boolean|String}
         * @private
         */
        modVal: function (key, elem) {
            return this._getModVal(key, elem);
        },
        // -------------------------------------------------------------------------------------------------------------
        // private
        // -------------------------------------------------------------------------------------------------------------
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
            conf[event + this._getElemClassName(element)] = handler;
            this._on(conf);
        },
        /**
         * Get all mods for current BLOCK or selected ELEMENT.
         *
         * @param {jQuery} [elem]
         * @returns {Array}
         * @private
         */
        _getMods: function (elem) {
            var element = this.element,
                el =  element,
                options = this.options,
                mainClass = this.mainClass,
                elem_delim = options.elem_delim,
                mod_delim = options.mod_delim,
                name_pattern = options.name_pattern,
                modRegex = new RegExp(mainClass + mod_delim + "(" + name_pattern + "+)(" + mod_delim + ")?(.*)?"),
                classes = [],
                mods = [],
                self = this,
                elemName = "";

            // if we are working not with block
            if (elem && !elem.is(element)) {
                el = elem;
                elemName = this._getElemName(elem);
                modRegex = new RegExp(mainClass + elem_delim + elemName + mod_delim + "(" + name_pattern + "+)?(" + mod_delim + ")?(.*)?");
            }
            classes = el.attr("class").toString().split(" ");
            $.each(classes, function (index, value) {
                var matches = value.match(modRegex);
                if (matches) {
                    mods.push({ block: self.mainClass, elem: elemName || false, mod: matches[1], val: matches[3] || true});
                }
            });
            return mods;
        },
        /**
         * Set modifier to element or block. If there is already mod with this key - function replaces it
         *
         * @param {String} key
         * @param {String|Boolean} value
         * @param {jQuery} elem
         * @private
         */
        _setMod: function (key, value, elem) {
            var el = elem || this.element;
            this._delMod(key, value, elem);
            el.addClass(this._getModClass(key, value, elem));
            this._trigger("onSetMod");
        },
        /**
         * Delete mod from element or block
         *
         * @param {String} key
         * @param {String|Boolean} value
         * @param {jQuery} elem
         * @private
         */
        _delMod: function (key, value, elem) {
            var el = elem || this.element,
                classToRemove;
            if (!elem && value && typeof value !== "string") {
                el = value;
            }
            classToRemove = this._getModClass(key, this._getModVal(key, el), el);
            el.removeClass(classToRemove);
        },
        /**
         *
         * @param {String} key
         * @param {String|Boolean} value
         * @param {jQuery} elem
         * @private
         */
        _toggleMod: function (key, value, elem) {
            var el = elem || this.element,
                val = true;

            if (elem && value) {
                val =  value;
            } else if (value && typeof value !== "string") {
                el = value;
            }

            if (this._getModVal(key, el) === val) {
                this._delMod(key, val, el);
                return;
            }
            this._setMod(key, val, el);
        },
        /**
         *
         * @param {String} key
         * @param {String} val
         * @param {String} elem
         * @private
         */
        _hasMod: function (key, val, elem) {
            throw new Error("stub");
        },
        /**
         *
         * @param {String} key
         * @param {jQuery} elem
         * @returns {Boolean|String}
         * @private
         */
        _getModVal: function (key, elem) {
            var mods = this._getMods(elem),
                result = false;
            $.each(mods, function (index, value) {
                if (value.mod === key) {
                    result = value.val;
                    return false;
                }
                return true;
            });
            return result;
        },
        /**
         *
         * @param {String} mod
         * @param {String|Boolean} val
         * @param {String|jQuery} elem
         * @returns {String}
         * @private
         */
        _getModClassName: function (mod, val, elem) {
            return "." + this._getModClass(mod, val, elem);
        },
        /**
         *
         * @param {String} mod
         * @param {String} val
         * @param {String|jQuery} elem
         * @returns {String}
         * @private
         */
        _getModClass: function (mod, val, elem) {
            var options = this.options,
                mod_delim = options.mod_delim,
                elem_delim = options.elem_delim,
                mainClass = this.mainClass;
            if (val && typeof val !== "boolean" && elem) {
                mod += mod_delim + val;
            }
            if (elem && typeof elem !== "string") {
                elem = this._getElemName(elem);
            }
            if (!elem) {
                return mainClass + mod_delim + mod;
            }
            return mainClass + elem_delim + elem +  mod_delim + mod;
        },

        /**
         * Get elements by name for current block. Returns jquery object
         *
         * @param {String} elem
         * @param {String} [parents]
         * @returns {jQuery}
         * @private
         */
        _getElems: function (elem, parents) {
            if (parents) {
                return this._getElemsParents(this._getElems(elem), parents);
            }
            return this.element.find(this._getElemClassName(elem));
        },
        /**
         * Get elements inside another element. if no elem provided, current block is used.
         *
         * @param {String} child
         * @param {jQuery} [elem]
         * @returns {jQuery}
         * @private
         */
        _getElemChildren: function (child, elem) {
            var el = elem || this.element;
            return el.find(this._getElemClassName(child));
        },
        /**
         * Get nearest parent element
         *
         * @param {jQuery} elem
         * @param {String} parents
         *
         * @private
         */
        _getElemsParents: function (elem, parents) {
            return elem.parents(this._getElemClassName(parents));
        },
        /**
         * Check if element exists.
         *
         * @param {String} elem
         * @returns {boolean}
         * @private
         */
        _hasElems: function (elem) {
            return this._getElems(elem).length > 0;
        },
        /**
         * Get full classname for current block, that can be used in find expression
         *
         * @param {String} elem
         * @returns {String}
         * @private
         */
        _getElemClassName: function (elem) {
            return "." + this._getElemClass(elem);
        },
        /**
         * Get classname without prefixed dot
         *
         * @param {String} elem
         * @returns {String}
         * @private
         */
        _getElemClass: function (elem) {
            return this.mainClass + this.options.elem_delim + elem;
        },
        /**
         * Returns element name by its jquery object
         *
         * @param {jQuery} elem
         * @returns {String|Boolean}
         * @private
         */
        _getElemName: function (elem) {
            var classes = elem.attr("class").split(" "),
                options = this.options,
                elemRegExp = new RegExp("^" + this.mainClass + options.elem_delim + "(" + options.name_pattern + "+)$"),
                elementName = false;

            $.each(classes, function (index, value) {
                var matches = value.match(elemRegExp);
                if (matches) {
                    elementName = matches[1];
                    return false;
                }
                return true;
            });
            return elementName;
        }
    });

}(this));
