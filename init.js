var gif;
var ascii;
var mode = 1;
var currentFrame = 0;
var playing = true;
var exportButton;
var dataUri;
var asciiFrames = [];
var gifProcessed = false;
var brightnessMap = [" ",".",",","•","*","%","@","O","X","⌷"];
var dictionary = dictPong;

function setup() {
  createCanvas(1,1);
  frameRate(20);
  pixelDensity(2);
  gif = loadGif('Pong.gif');
  ascii = createElement('pre','');
}

function draw() {
  background(100); 
  if (gif.loaded() && !gifProcessed) {
    processGIF();
  }
  if (gifProcessed) {
    ascii.html(asciiFrames[currentFrame]);    
    if (playing) {
      nextFrame();
    }
  }
}


function processGIF() {
  console.log("🤔 PROCESSING "+gif.totalFrames()+" FRAMES");
  gif.pause();
  for (var i = 0; i < gif.totalFrames(); i++) {
    gif.frame(i);
    console.log("✅ FRAME "+i);
    asciiFrames.push(processASCII(gif));
  }
  gifProcessed = true;
  generateExport();
  console.log("😁 DONE");  
}


function processASCII(frame) {
  var lines = [];
  if (mode == 0) {    
    //
    // Brightness Mode
    //
    for (var y = 0; y < frame.height; y++) {
      lines[y] = "";
      for (var x = 0; x < frame.width; x++) {
        var brightnum = Math.floor(brightness(frame.get(x,y))/10) - 1;
        if (brightnum == -1) {brightnum = 0;}
        lines[y] += brightnessMap[brightnum];
      }
    }
  } else {
    //
    // Mapping Mode
    //
    
    for (var y = 0; y < frame.height; y++) {
      lines[y] = "";
      for (var x = 0; x < frame.width; x++) {
        var hexValue = hex(frame.get(x,y)[0],2).toString() + 
                       hex(frame.get(x,y)[1],2).toString() +
                       hex(frame.get(x,y)[2],2).toString();
         if (!dictionary[hexValue]) {
           console.log(hexValue);
         }
        if (dictionary[hexValue][1]) {
          lines[y] += "<font color='"+dictionary[hexValue][1]+"'>"+dictionary[hexValue][0]+"</font>";
        } else {
          lines[y] += dictionary[hexValue][0]; 
        }
      }
    }
  }

  // Remove trailing whitespace
  for(var y = 0; y < lines.length; y++){
    while(lines[y].endsWith("&nbsp;")){
      lines[y] = lines[y].substr(0,lines[y].length - 6);
    }
  }
  return lines.join("<br>");
}


function nextFrame() { currentFrame = (currentFrame+1) % asciiFrames.length; }
function prevFrame() { currentFrame = (currentFrame-1) % asciiFrames.length; }

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    prevFrame();
  }
  if (keyCode == RIGHT_ARROW) {
    nextFrame();
  }
  if (keyCode == 32) {
    playing = !playing;
  }
 
}



var exportFile = "";
function generateExport() {
  // var jsonString = JSON.stringify(asciiFrames);
  exportFile += 'var frames = [';
  for (var i = 0; i < asciiFrames.length; i++) {
    exportFile += 'qsTr("'+asciiFrames[i]+'"),';
    if (i == asciiFrames.length-1) {
      exportFile += 'qsTr("'+asciiFrames[i]+'")';
    }
  }
  exportFile += '];';
  dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(exportFile);
  exportButton = createA(dataUri,'Export');
  exportButton.attribute("download", "ASCIIAnim.js");
  exportButton.parent("tools");
}