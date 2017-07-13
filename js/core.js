

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
    scaleFactor =  Math.min($(document).width() / imgs['0.png'].width, $(document).height() / imgs['0.png'].height);
    stage = new Konva.Stage({
        container: 'container',
        height: $(document).height(),
        width: $(document).width()

    });

    layer = new Konva.Layer();
    stage.add(layer);

    for (var curr in imgs) {
        if (curr == 'length') continue;
        var obj={
            image: imgs[curr],
            height: imgs[curr].height,
            width: imgs[curr].width,
            scaleX: initial[curr].scale*scaleFactor,
            scaleY:  initial[curr].scale*scaleFactor,
            x: initial[curr].x*scaleFactor*initial[curr].scale,
            y: initial[curr].y*scaleFactor*initial[curr].scale,
            opacity:initial[curr].opacity,
            draggable: false
        };
        console.log(obj);
        console.log(initial['1.png'].scale*scaleFactor);
        konvaImgs[curr] = new Konva.Image(obj);
        // konvaImgs[curr].scale({x:4*scaleFactor*initial[curr].scale,y:4*scaleFactor*initial[curr].scale});
        layer.add(konvaImgs[curr]);
    }

    buttonsInit();

    enDisAble('-', 0);
    // handle(0);
    layer.draw();
}

//s=1=>set
//s=0=>unset
//dir 1 +
//0 -
function handle(lvl) {

    for(var curr in konvaImgs) {

            var tmpObj = {
                node: konvaImgs[curr],
                easing: Konva.Easings.EaseOut,
                scaleX: initial[curr].scale*scaleFactor*views[lvl].scale,
                scaleY: initial[curr].scale*scaleFactor*views[lvl].scale,
                x: (initial[curr].x)*scaleFactor*initial[curr].scale*views[lvl].scale+views[lvl].x*scaleFactor,
                y: (initial[curr].y)*scaleFactor*initial[curr].scale*views[lvl].scale+views[lvl].y*scaleFactor,
                duration: animationDuration,
                opacity: visibility[lvl].hasOwnProperty(curr)?1:0
            };

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

