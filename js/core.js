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
    return; //TODO remove
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


function changeSkin() {
    if (currSkin == 0) {
        currSkin = 1;
        konvaImgs['0.png'].setImage(imgs['01.png']);
        konvaImgs['0.png'].getLayer().draw();
    } else {
        currSkin = 0;
        konvaImgs['0.png'].setImage(imgs['0.png']);
        konvaImgs['0.png'].getLayer().draw();
    }
}

function buttonsInit() {
    return; //TODO remove
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
        ],
        listening: false
    });

    layer.add(plusButton);
    plusButton.on("click", function () {
        handler("+");
    });
    plusButton.on("tap", function () {
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
        points: [0, buttonWidth / 2, buttonWidth, buttonWidth / 2], //Horizontal of -
        listening: false
    });
    layer.add(minusButton);
    minusButton.on("click", function () {
        handler("-");
    });
    minusButton.on("tap", function () {
        handler("-");
    });
    layer.add(minusButtonText);
    var changeButton = new Konva.Circle({
        x: stage.getWidth() - buttonWidth / 2,
        y: stage.getHeight() - 2 * buttonWidth - buttonWidth / 2,
        radius: buttonWidth / 2,
        fill: buttonBgColor,
        stroke: 'black',
        strokeWidth: 1
    });
    var changeButtonText = new Konva.Line({
        x: stage.getWidth() - buttonWidth,
        y: stage.getHeight() - buttonWidth - 2 * buttonWidth,
        stroke: butTxtColor,
        points: [0, 0, buttonWidth, buttonWidth], // slash
        listening: false
    });
    layer.add(changeButton);
    changeButton.on("click", function () {
        changeSkin();
    });
    changeButton.on("tap", function () {
        changeSkin();
    });
    layer.add(changeButtonText);
}


function Init() {
    scaleFactor = Math.min($(document).width() / imgs['0.png'].width, $(document).height() / imgs['0.png'].height);
    stage = new Konva.Stage({
        container: 'container',
        height: $(document).height(),
        width: $(document).width()

    });

    layer = new Konva.Layer();
    layer.setDraggable(true);
    stage.add(layer);

    for (var curr in imgs) {
        if (curr == 'length' || curr == '01.png') continue;
        var obj = {
            image: imgs[curr],
            height: imgs[curr].height,
            width: imgs[curr].width,
            scaleX: initial[curr].scale * scaleFactor,
            scaleY: initial[curr].scale * scaleFactor,
            x: initial[curr].x * scaleFactor * initial[curr].scale,
            y: initial[curr].y * scaleFactor * initial[curr].scale,
            opacity: initial[curr].opacity,
            draggable: false
        };
        console.log(obj);
        console.log(initial['1.png'].scale * scaleFactor);
        konvaImgs[curr] = new Konva.Image(obj);
        // konvaImgs[curr].scale({x:4*scaleFactor*initial[curr].scale,y:4*scaleFactor*initial[curr].scale});
        layer.add(konvaImgs[curr]);
    }

    buttonsInit();

    enDisAble('-', 0);

    window.addEventListener('wheel', wheelF);
    stage.getContent().addEventListener('touchmove', touchF, false);
    stage.getContent().addEventListener('touchend', function () {
        lastDist = 0;
    }, false);


    handle(0);


    layer.draw();
}


function getDistance(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}


//s=1=>set
//s=0=>unset
//dir 1 +
//0 -
function handle(lvl) {

    for (var curr in konvaImgs) {

        var tmpObj = {
            node: konvaImgs[curr],
            easing: Konva.Easings.EaseOut,
            scaleX: initial[curr].scale * scaleFactor * views[lvl].scale,
            scaleY: initial[curr].scale * scaleFactor * views[lvl].scale,
            x: (initial[curr].x) * scaleFactor * initial[curr].scale * views[lvl].scale + views[lvl].x * scaleFactor,
            y: (initial[curr].y) * scaleFactor * initial[curr].scale * views[lvl].scale + views[lvl].y * scaleFactor,
            duration: animationDuration,
            opacity: visibility[lvl].hasOwnProperty(curr) ? 1 : 0
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

function wheelF(e) {
    e.preventDefault();
    var oldScale = stage.scaleX();
    var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };
    var newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    for (var i in konvaImgs) {
        konvaImgs[i].opacity(newScale >= load[i] ? 1 : 0);
    }

    stage.scale({x: newScale, y: newScale});
    var newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    };
    stage.position(newPos);

    stage.batchDraw();
}

var lastDist;

function touchF(evt) {
    var touch1 = evt.touches[0];
    var touch2 = evt.touches[1];
    if (touch1 && touch2) {
        var dist = getDistance({
            x: touch1.clientX,
            y: touch1.clientY
        }, {
            x: touch2.clientX,
            y: touch2.clientY
        });
        if (!lastDist) {
            lastDist = dist;
        }
        var scale = stage.scaleX() * dist / lastDist;
        for (var i in konvaImgs) {
            konvaImgs[i].opacity(scale >= load[i] ? 1 : 0);
        }
        var oldScale = stage.scaleX();
        var mousePointTo = {
            x: (touch1.clientX) / oldScale - stage.x() / oldScale,
            y: (touch1.clientY) / oldScale - stage.y() / oldScale
        };
        stage.scale({x: scale, y: scale});
        touch1 = evt.touches[0];
        // touch2 = evt.touches[1];
        var newPos = {
            x: -(mousePointTo.x - (touch1.clientX) / scale) * scale,
            y: -(mousePointTo.y - (touch1.clientY) / scale) * scale
        };
        console.log(stage.x() + " " +
            stage.y() + ";" + newPos.x + " " + newPos.y);
        stage.position(newPos);

        stage.batchDraw();
        lastDist = dist;
    }
}

$(document).ready(function () {
    preload();
});

