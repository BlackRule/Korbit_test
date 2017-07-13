var resources = [
    '0.png',
    '01.png',
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
var MAX_LVL = 6;
var buttonWidth = 40;
var plusButton, minusButton;
var buttonBgColor = 'blue';
var buttonBgDesableColor = '#000';
var butTxtColor = "#000";
var animationDuration = 2;
var currSkin=0;

var scaleFactor;
var initial = {

    '0.png': {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1
    },
    '01.png': {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1
    },
    '1.png': {
        scale: 0.55 / 3,
        x: 459,
        y: 842,
        opacity: 0
    },
    '2.png': {
        scale: 0.0778,
        x: 1125,
        y: 2060,
        opacity: 0
    },
    '3.jpg': {
        scale: 0.0489,
        x: 1948,
        y: 3500,
        opacity: 0
    }

};

var visibility = [
    {'0.png': 1}, //0
    {'0.png': 1}, //1
    {'0.png': 1, '1.png': 1}, //2
    {'0.png': 1, '1.png': 1}, //3
    {'1.png': 1, '2.png': 1}, //4
    {'1.png': 1, '2.png': 1}, //5
    {'2.png': 1, '3.jpg': 1} //6
];

var views = [
    {scale: 1, //0
        x: 0,
        y: 0
    },
    {scale: 1.5, //1
        x: 0,
        y: -156
    },
    {scale: 3, //2
        x: 0,
        y: -456
    },
    {scale: 6, //3
        x: -100,
        y: -956
    },
    {scale: 14, //4
        x: -1000,
        y: -2270
    },
    {scale: 30, // 5
        x: -2980,
        y: -5100
    },
    {scale: 60, // 6
        x: -6200,
        y: -10500
    }
];