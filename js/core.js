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

    var viewPort = {
        width: $(document).width(),
        height: $(document).height()

    };

    stage = new Konva.Stage({
        container: 'container',
        height: viewPort.height,
        width: viewPort.width

    });

    layer = new Konva.Layer();
    stage.add(layer);

    for (var curr in imgs) {
        konvaImgs[curr] = new Konva.Image({
            image: imgs[curr],
            height: imgs[curr].height,
            width: imgs[curr].width,
            draggable: false
        });
        layer.add(konvaImgs[curr]);
        konvaImgs[curr].hide();
    }

    buttonsInit();

    enDisAble('-', 0);
    handle(0, 1);

    layer.draw();
}

//s=1=>set
//s=0=>unset
function handle(lvl, s) {
    console.log("handle " + lvl + " " + (s ? "show" : "hide"));
    var curr = lvl + '.png';
    if (lvl == 3) curr = '3.jpg';
    if (s) {
        konvaImgs[curr].show();
    } else {
        konvaImgs[curr].hide();
    }
}


function handler(s) {
    handle(currLevel, 0);
    if (s == '+') {
        if (currLevel == 0) {
            enDisAble('-', 1);
        }
        currLevel++;
        if (currLevel == MAX_LVL) {
            enDisAble('+', 0);
        }
    }
    if (s == '-') {
        if (currLevel == MAX_LVL) {
            enDisAble('+', 1);
        }
        currLevel--;
        if (currLevel == 0) {
            enDisAble('-', 0);
        }
    }
    handle(currLevel, 1);
    layer.draw();
}


$(document).ready(function () {
    preload();
});

