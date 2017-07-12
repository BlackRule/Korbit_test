var resources = [
    '0.png',
    'guts.png'
];
var imgs = {};
var konvaImgs = {};
imgs.length = konvaImgs.length = 0;
var scaleBy = 1.5;
var stage;


function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function organs() {

}

function main() {

    [].forEach.call(resources, function (img) {
        konvaImgs[img] = new Konva.Image({
            image: imgs[img],
            height: imgs[img].height,
            width: imgs[img].width,
            draggable: true
        });
        konvaImgs.length++;
    });

    var viewPort = {
        width: $(document).width(),
        height: $(document).height()

    };

    stage = new Konva.Stage({
        container: 'container',
        height: viewPort.height,
        width: viewPort.width

    });

    function wheelF(e) {
        e.preventDefault();
        var oldScale = stage.scaleX();
        var mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };
        var newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({x: newScale, y: newScale});
        var newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };
        stage.position(newPos);

        stage.batchDraw();
    }


    konvaImgs['0.png'].on("mousemove", function () {
        var mousePos = stage.getPointerPosition();
        var x = mousePos.x - 190;
        var y = mousePos.y - 40;
        if (stage.getAbsoluteScale().x > 1) {
            organs();
        }

    });

    var layer = new Konva.Layer();
    [].forEach.call(resources, function (img) {
        layer.add(konvaImgs[img]);
    });
    stage.add(layer);
    layer.draw();

    window.addEventListener('wheel', wheelF);

}

function preload() {
    [].forEach.call(resources, function (name) {
        imgs[name] = new Image();
        imgs[name].src = "images/" + name;
        imgs.length++;
    });

    var len = imgs.length,
        counter = 0;


    [].forEach.call(resources, function (name) {
        imgs[name].addEventListener('load', incrementCounter, false);
    });

    function incrementCounter() {
        counter++;
        alert("len" + len + "c" + counter);
        if (counter === len) {
            main();
        }
    }

}

$(document).ready(function () {
    preload();
    alert(1);

//         layer.on('mouseenter', function () {
//         layer.scale({
//         x: zoomLevel,
//         y: zoomLevel
//         });
//         layer.draw();
//         });
//         layer.on('mousemove', function (e) {
//         var pos = stage.getPointerPosition();
//         layer.x(-(pos.x));
//         layer.y(-(pos.y));
//         layer.draw();
//         });
//         layer.on('mouseleave', function () {
//         layer.x(0);
//         layer.y(0);
//         layer.scale({
//         x: 1,
//         y: 1
//         });
//         layer.draw();
//         });
});