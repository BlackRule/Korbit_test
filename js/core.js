var resources = [
    '0.png',
    '1.png',
    '2.png',
    '3.jpg'
];
var imgs = {};
var konvaImgs = {};
imgs.length = 0;
var stage;
var layer;
var currLevel = 0;
var MAX_LVL = 3;
var buttonWidth = 40;
var plusButton, minusButton;
var buttonBgColor = 'blue';
var buttonBgDesableColor = '#000';
var butTxtColor = "#000";
var animationDuration = 2;

var scaleFactor;
var initial= {

    '0.png': {
        scaleX: 1,
        scaleY: 1,
        opacity: 1
    },
    '1.png': {

        opacity: 0
    },
    '2.png': {
        opacity: 0
    },
    '3.jpg': {
        opacity: 0
    }

};

function preload() {
    [].forEach.call(resources, function (name) {
        imgs[name] = new Image();
        imgs[name].src = "images/" + name;
        imgs.length++;
    });


    var counter = 0;


    [].forEach.call(resources, function (name) {
        imgs[name].addEventListener('load', incrementCounter, false);
    });

    function incrementCounter() {
        counter++;
        if (counter === imgs.length) {
            Init();
        }
    }

}

//s=1=> enable
// 0=> disable
function enDisAble(but, s) {
    if (but == '+') {
        plusButton.setListening(s);
        plusButton.setFill(s ? buttonBgColor : buttonBgDesableColor);
    }
    if (but == '-') {
        minusButton.setListening(s);
        minusButton.setFill(s ? buttonBgColor : buttonBgDesableColor);
    }
    console.log("endis " + but + " " + (s ? "show" : "hide"));
}


function buttonsInit() {
    plusButton = new Konva.Circle({
        x: stage.getWidth() - buttonWidth / 2,
        y: stage.getHeight() - buttonWidth / 2,
        radius: buttonWidth / 2,
        fill: buttonBgColor,
        stroke: 'black',
        strokeWidth: 1
    });


    var plusButtonText = new Konva.Line({
        x: stage.getWidth() - buttonWidth,
        y: stage.getHeight() - buttonWidth,
        stroke: butTxtColor,
        points: [0, buttonWidth / 2, buttonWidth, buttonWidth / 2, //Horizontal of +
            buttonWidth / 2, buttonWidth / 2, //back to center
            buttonWidth / 2, 0, buttonWidth / 2, buttonWidth //Vertical of +
        ]
    });

    layer.add(plusButton);
    plusButton.on("click", function () {
        handler("+");
    });
    layer.add(plusButtonText);
    minusButton = new Konva.Circle({
        x: stage.getWidth() - buttonWidth / 2,
        y: stage.getHeight() - buttonWidth - buttonWidth / 2,
        radius: buttonWidth / 2,
        fill: buttonBgColor,
        stroke: 'black',
        strokeWidth: 1
    });
    var minusButtonText = new Konva.Line({
        x: stage.getWidth() - buttonWidth,
        y: stage.getHeight() - buttonWidth - buttonWidth,
        stroke: butTxtColor,
        points: [0, buttonWidth / 2, buttonWidth, buttonWidth / 2] //Horizontal of -
    });
    layer.add(minusButton);
    minusButton.on("click", function () {
        handler("-");
    });
    layer.add(minusButtonText);
}


function Init() {

    stage = new Konva.Stage({
        container: 'container',
        height: $(document).height(),
        width: $(document).width()

    });

    layer = new Konva.Layer();
    stage.add(layer);

    for (var curr in imgs) {
        if (curr == 'length') continue;
        konvaImgs[curr] = new Konva.Image({
            image: imgs[curr],
            height: imgs[curr].height,
            width: imgs[curr].width,
            draggable: false
        });

        layer.add(konvaImgs[curr]);
        konvaImgs[curr].setOpacity(0);
    }
   scaleFactor =  Math.min($(document).width() / imgs['0.png'].width, $(document).height() / imgs['0.png'].height);
    buttonsInit();

    enDisAble('-', 0);
    handle(0);
    layer.draw();
}

//s=1=>set
//s=0=>unset
//dir 1 +
//0 -
function handle(lvl) {


    var zoomTable = [ //Scripted levels table
        { //level 0 00
            '0.png': {
                scaleX: 1,
                scaleY: 1,
                opacity: 1
            },
            '1.png': {
                opacity: 0
            },
            '2.png': {
                opacity: 0
            },
            '3.jpg': {
                opacity: 0
            }
        },
        { //level 1 01
            '0.png': {
                scaleX: 1.5 ,
                scaleY: 1.5 ,
                y: -235 ,
                visible: 1
            },
            '1.png': {
                opacity: 0
            },
            '2.png': {
                opacity: 0
            },
            '3.jpg': {
                opacity: 0
            }
        },
        { //level 2 10
            pre: function () {
                konvaImgs['1.png'].setX(129* scaleFactor).setY(-2* scaleFactor).scale({x: 0.27 * scaleFactor, y: 0.27 * scaleFactor});
                konvaImgs['1.png'].setOpacity(1);
                console.log('pre');
            },
            unpre: function () {
                konvaImgs['1.png'].setOpacity(0);
                console.log('unpre');
            },
            '0.png': {
                scaleX: 3 ,
                scaleY: 3 ,
                y: -470 ,
                opacity: 1
            },
            '1.png': {
                scaleX: 0.51,
                scaleY: 0.51,
                x: 257 ,
                y: -7 ,
                opacity: 1
            },
            '2.png': {
                opacity: 0
            },
            '3.jpg': {
                opacity: 0
            }
        },
        { //level 3 11
            '0.png': {
                scaleX: 6,
                scaleY: 6,
                y: -917
            },
            '1.png': {
                scaleX: 1,
                scaleY: 1,
                x: 518,
                y: -3
            }
        }
    ];
    // if (zoomTable[lvl]['pre']) {
    //
    //     zoomTable[lvl]['pre']();
    // }
    // if (zoomTable[lvl+1]&&zoomTable[lvl+1]['unpre']) {
    //
    //     zoomTable[lvl]['unpre']();
    // }
    for (var curr in zoomTable[lvl]) {
            var tmpObj = {
            node: konvaImgs[curr],
            easing: Konva.Easings.EaseOut,
            duration: animationDuration
        };
        if (curr == 'pre'||curr == 'unpre') {
            continue;
        }
        for (var attrname in zoomTable[lvl][curr]) {
            tmpObj[attrname] = zoomTable[lvl][curr][attrname];
            if (attrname != 'opacity') tmpObj[attrname] *= scaleFactor;
        }
        konvaImgs[curr].tween = new Konva.Tween(tmpObj);
        konvaImgs[curr].tween.play();
    }

    console.log("handle " + lvl);

}


function handler(s) {

    if (s == '+') {
        if (currLevel == 0) {
            enDisAble('-', 1);
        }
        currLevel++;
        handle(currLevel);
        if (currLevel == MAX_LVL) {
            enDisAble('+', 0);
        }

    }
    if (s == '-') {
        if (currLevel == MAX_LVL) {
            enDisAble('+', 1);
        }
        currLevel--;
        handle(currLevel);
        if (currLevel == 0) {
            enDisAble('-', 0);
        }

    }


}


$(document).ready(function () {
    preload();
});

