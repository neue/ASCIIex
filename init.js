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
var colorkeys = {
  '000000': '&nbsp;',
  '001100': '.',
  '002200': '-',
  '003400': '/',
  '00FF00': '|',
  'FF0000': 'X'
};


function setup() {
  createCanvas(1,1);
  frameRate(20);
  pixelDensity(2);
  gif = loadGif('yourcpu.gif');
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
  var jsonString = JSON.stringify(asciiFrames);
  dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonString);
  exportButton = createA(dataUri,'Export');
  exportButton.attribute("download", "ASCIIAnim.json");
  
  exportButton.parent("tools");
  exportButton.mouseReleased(exportJSON);
  
  console.log("😁 DONE");  
}


function processASCII(frame) {
  var asciistring = "";
  if (mode == 0) {    
    //
    // Brightness Mode
    //
    for (var y = 0; y < frame.height; y++) {
      for (var x = 0; x < frame.width; x++) {
        var brightnum = Math.floor(brightness(frame.get(x,y))/10) - 1;
        if (brightnum == -1) {brightnum = 0;}
        asciistring += brightnessMap[brightnum];
      }
      asciistring += "<br>";
    }
  } else {
    //
    // Mapping Mode
    //
    for (var y = 0; y < frame.height; y++) {
      for (var x = 0; x < frame.width; x++) {
        var hexValue = hex(frame.get(x,y)[0],2).toString() + 
                       hex(frame.get(x,y)[1],2).toString() +
                       hex(frame.get(x,y)[2],2).toString();
        asciistring += colorkeys[hexValue];
      }
      asciistring += "\n";
    }    
  }
  return asciistring;
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



function exportJSON() {
  console.log(jsonString);
}