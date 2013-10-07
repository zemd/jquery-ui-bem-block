(function (window) {
    "use strict";
    var $ = window.jQuery,
        QUnit = window.QUnit;

    QUnit.test("Count menu elements", function () {
        var menu = $(".b-menu").block(),
            elems = menu.block("elems", "element");
        QUnit.strictEqual(elems.length, 4);
    });

    QUnit.test("Check mainclass", function () {
        var menu = $(".b-menu").block();
        QUnit.strictEqual(menu.block("getBlockClass"), "b-menu");
    });

    QUnit.test("Check block modifier", function () {
        var menu = $(".b-menu").block(),
            mod = [{
                "block": "b-menu",
                "elem": false,
                "mod": "with",
                "val": "mod"
            }];

        QUnit.deepEqual(menu.block("mods"), mod);
    });

    QUnit.test("Check element modifier", function () {
        var menu = $(".b-menu").block(),
            mod = [{
                "block": "b-menu",
                "elem": "element",
                "mod": "mod",
                "val": "val"
            }];
        QUnit.deepEqual(menu.block("mods", $("#test1")), mod);
    });

    QUnit.test("Set modifier to the block", function () {
        var menu = $(".b-menu").block(),
            mod = [{
                "block": "b-menu",
                "elem": false,
                "mod": "with",
                "val": "mod"
            }, {
                "block": "b-menu",
                "elem": false,
                "mod": "custom",
                "val": true
            }];
        menu.block("setMod", "custom");
        QUnit.deepEqual(menu.block("mods"), mod);
    });

    QUnit.test("Set modifier to the element", function () {
        var menu = $(".b-menu").block(),
            mod = [{
                "block": "b-menu",
                "elem": "element",
                "mod": "mod",
                "val": "val"
            }, {
                "block": "b-menu",
                "elem": "element",
                "mod": "custom",
                "val": "value2"
            }];
        menu.block("setMod", "custom", "value2", $("#test1"));
        QUnit.deepEqual(menu.block("mods", $("#test1")), mod);
    });

}(this));

