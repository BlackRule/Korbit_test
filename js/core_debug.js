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
            draggable: true
        });
        layer.add(konvaImgs[curr]);
        konvaImgs[curr].hide();
    }
    konvaImgs['0.png'].show();
    konvaImgs['1.png'].show();
    // konvaImgs[curr].tween = new Konva.Tween({
    //     node: konvaImgs[curr],
    //
    //     easing: Konva.Easings.EaseOut,
    //     duration: animationDuration
    // });
    layer.draw();
}






$(document).ready(function () {
    preload();
});

