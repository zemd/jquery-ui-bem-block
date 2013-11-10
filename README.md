[![Code Climate](https://codeclimate.com/github/hunterman/jquery-ui-bem-block.png)](https://codeclimate.com/github/hunterman/jquery-ui-bem-block)

jquery-ui-bem-block
===================
Base jquery-ui widget to manipulate classes like in bem methodology

 * https://github.com/bem/
 * http://api.jqueryui.com/jQuery.widget/

Disclosure
==========
This widget do not use standard BEM naming convention(b-block__element_mod). Instead, I am using such naming
b-block--element_mod to make selection in editor more convenient. But you can change this behavior by setting options to
widget:
 * mod_delim
 * elem_delim

Usage
=====
To make your own widget with BEM support simple inherit from $.opesho.block:

```javascript
$.widget('ns.myWidget', $.opesho.block, {
    _create: function() {
        this._super();
    }
});
```

Public API
==========

Get elements by name
--------------------
```javascript
/**
 * @param {String} name
 */
elems(name)
```

Example:

```javascript
/**
 * return all nodes with classname b-block--item
 */
var blockElements = $('#mywidget').block('elems', 'item');
```

Check element exists in block
-----------------------------
```javascript
/**
 * @param {String} name
 */
hasElems(name)
```


Get modifiers array for given element.
--------------------------------------
```javascript
/**
 * @param {String} [elem="widget block element"] The elem is optional.
 */
mods(elem)
```

Example:

```javascript
/*
 * Returns array, for example, ["state", "theme"]
 */
var blockElements = $('#mywidget').block('mods');
```

Apply modifier to element.
--------------------------
```javascript
/**
 * @param {String} key
 * @param {String|Boolean} [value]
 * @param {jQuery} [elem]
 */
setMod(mod, value, elem)
```

Delete modifier from element
----------------------------
```javascript
/**
 * Delete mod from element or block
 *
 * @param {String} key
 * @param {String|Boolean} [value]
 * @param {jQuery} [elem]
 */
delMod(mod, value, elem)
```

Toggle modifier
---------------
```javascript
/**
 * @param {String} key
 * @param {String|Boolean} [value]
 * @param {jQuery} [elem]
 */
toggleMod(mod, value, elem)
```

Get modifier value
------------------
```javascript
/**
 * @param {String} key
 * @param {jQuery} elem
 */
modVal(mod, elem)
```


Extend block widget example
===========================

```javascript
    var $document = $(document);

    $document.on('click', function (event) {
        $document.trigger('custom:click', event.target);
    });

    // provide simple widget communication
    $.widget('custom.clickable', {
        _create: function() {
            var self = this,
                element = this.element;
            this.document.on('custom:click', function (event, origTarget) {
                var sendEvent = !element.is(origTarget) && !element.has(origTarget).length;
                if (sendEvent) {
                    self._trigger('custom:click');
                }
            });
        }
    });
```


```javascript
    // extend base block
    $.widget('opesho.block', $.opesho.block, {
        _create: function () {
            this._super();
            this.element.clickable({
               "custom:click": $.proxy(this._onCustomClick, this)
            });
        }
    });
```

```javascript
    //make your base panel widget that can be closed on document click or another widget click
    $.widget('custom.panel', $.opesho.block, {
        _create: function () {
            this._isOpen = false;
        },
        _onCustomClick: function () {
            if (this._isOpen) {
                this.close();
            }
        },
        close: function () {
            this.element.hide();
            this._isOpen = false;
        },
        open: function () {
            this.element.show();
            this._isOpen = true;
        },
        toggle: function() {
            var self = this;
            this._isOpen = false;
            setTimeout(function() {
                self.element.toggle();
                if (self.element.is(':hidden') === false) {
                    self._isOpen = true;
                }
            }, 0);
        }
    });
```

Using block without inherit
===========================

```javascript
//TODO
```


 
TODO
====

 * trigger events
 * make unit tests
 * cache
 * documentation

License
=======
Apache 2.0
