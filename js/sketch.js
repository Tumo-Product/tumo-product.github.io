/**
 * @description The black box for the franchise animation activity
 * @author Mark Amiraghyan 
 */

// All constants that are starting with '_' are config variables
const _width = 640, _height = 640; // Canvas size
const _ballSize = 80; // Size of the ball (Ball radius times 2)
const _ballColor = [36, 36, 36]; // Color of the ball [R, G, B]
const _previousFramesColor = [229, 57, 53];
const _nextFramesColor = [139, 195, 74];
const _frameCount = 24; // Count of animation frames
const _defaultBallX = _width / 2, _defaultBallY = _height / 2;
const _previouseFrameCount = 5; // Count for seen previous frames
const _nextFrameCount = 5; // Count for seen next frames
const _previouseFrameAlphaFirstValue = 70; // Alpha value for the first previous frame (in percents)
const _previouseFrameAlphaDiff = 15; // Alpha differance
const _nextFrameAlphaDiff = 8; // Alpha differance
const _defaultFrameRate = 18; // Default frame rate for animation
const _frameRateSliderWidth = _width / 2; // Width of the frame rate slider

const progressBarStepWidth = _width / (_frameCount - 1); // Progress bar's step width

let frames = []; // Create the frames
let currentFrame = 0; // Current active frame
let isDragging = false; // Is mouse dragging the ball now ?
let Canvas; // The p5 Canvas element
let progressBarWidth = 0; // Progress bar's width
let isAnimationPlaying = false; // Is Animation playing ?
let lastPlayedFrame = 0; // Last frame played
let FrameRate; // The frame rate slider
let FrameRateP; // The frame rate paragraph
let showNextFrames = true; // Show next frames or not

function preload() {

}

function setup() {
    Canvas = createCanvas(_width, _height); // Create the canvas with size of _width and _height
    Canvas.parent('animationCanvas'); // Setting the location of the canvas

    background('#f3f3f3'); // Fill the background image
    noStroke(); // We don't need stroke here

    FrameRateP = document.getElementById('slider-fps');

    FrameRate = createSlider(1, 60, _defaultFrameRate); // Create the FPS slider
    FrameRate.parent('slider'); // Place it in the <div id = "slider">
    FrameRate.style('width', `${_frameRateSliderWidth}px`) // Configure the width

    setupFrames(); // Setup the frames
}

function draw() {
    FrameRateP.innerText = `${localizedText['animation_speed']}: ${FrameRate.value()} FPS`;
    if (!isAnimationPlaying) { // Edit mode
        frameRate(60); // FPS is always 60 in the edit mode
        drawFrames(currentFrame); // Draw the frames
        return drawProgressBar(currentFrame, true); // Draw the progress bar for the current frame and animate it
    }
    // Play mode
    frameRate(FrameRate.value()); // Take the FPS value fomr the slider
    playAnimation(); // Play the animation
    drawProgressBar(lastPlayedFrame, false); // Draw the progress bar without animation
}

function mouseDragged() { // Works when mouse is dragged
    if (!isAnimationPlaying) { // User can't edit anything when animation is playing
        const { x, y } = frames[currentFrame]; // Current ball's X and Y coordinates
        if ((dist(mouseX, mouseY, x, y) <= (_ballSize / 2)) || isDragging) { // if user is dragging the ball
            isDragging = true; // Make sure user is still dragging
            background('#f3f3f3'); // Clear the background
            frames[currentFrame].x += mouseX - pmouseX; // Change ball's X position
            frames[currentFrame].y += mouseY - pmouseY; // Change ball's Y postiion
            frames[currentFrame].edited = true; // Activate the frame
        }
    }
}

function mouseReleased() { // Works when mouse is released
    isDragging = false; // User is not dragging anymore
}

function keyPressed() { // Works when a key is pressed
    if (!isAnimationPlaying) {
        switch (keyCode) { // Switch the frame to right or to left
            case RIGHT_ARROW:
                nextFrame(); // Switch to the next frame
                break;
            case LEFT_ARROW:
                previousFrame(); // Switch to the previous frame
                break;
        }
    }
}
