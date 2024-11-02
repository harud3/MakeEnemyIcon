var img = document.getElementById('myImage');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
};

var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imageData.data;

for (var i = 0; i < data.length; i += 4) {
  var red = data[i];
  var green = data[i + 1];
  var blue = data[i + 2];

  // 赤色を識別
  if (red > 200 && green < 50 && blue < 50) {
    // 透明にする
    data[i + 3] = 0;
  }
}

ctx.putImageData(imageData, 0, 0);