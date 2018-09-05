if (!navigator.vibrate) {
    document.getElementById("intro").innerText = "Your device or browser does not support vibration";
}

var tada = new Audio("tada.mp3");

var canvas = document.getElementById('maze');
var ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
var w = canvas.width;
var h = canvas.height;
var dx = w * .8;
var dy = h * .1;
ctx.lineWidth = dy / 3;
function line(x1, x2, y1, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, x2);
    ctx.lineTo(y1, y2);
    ctx.stroke();
    ctx.closePath();
}

ctx.fillStyle = "green";
ctx.fillRect(0, 0, w, dy);
ctx.fillRect(0, h - dy, w, h);
for (var i = 1; i < 10; i++) {
    if (i % 2) {
        line(0, dy * i, dx, dy * i);
    } else {
        line(w - dx, dy * i, w, dy * i);
    }
}

var imageData = ctx.getImageData(0, 0, w, h).data;

var vibrateInterval = null;

function startPersistentVibrate(duration, interval) {
    if (!vibrateInterval) {
        navigator.vibrate(duration);
        vibrateInterval = setInterval(function() {
            console.log("vibrating for " + duration);
            navigator.vibrate(duration);
        }, duration + interval);
    }
}

function stopPersistentVibrate() {
    console.log("stopping vibration");
    clearInterval(vibrateInterval);
    vibrateInterval = null;
    navigator.vibrate(0);
}

function touch(e) {
    var touch = e.touches[0];
    if (touch.pageY < dy) {
        tada.play();
    }
    if (touch.pageY < dy || touch.pageY > (h - dy)) {
        startPersistentVibrate(100, 100);
    } else {
        var index = (Math.floor(touch.pageY) * w + Math.floor(touch.pageX)) * 4;
        var r = imageData[index];
        var g = imageData[index + 1]
        var b = imageData[index + 2];
        if (r + g + b == 0) {
            startPersistentVibrate(1000, 0);
        }
        else {
            stopPersistentVibrate();
        }
    }
}

canvas.addEventListener("touchstart", touch);
canvas.addEventListener("touchmove", touch);

canvas.addEventListener("touchend", function(e) {
    stopPersistentVibrate();
});
