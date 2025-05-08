const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

const lang = params.lang || 'en';

const translations = {
    "en": {
        "copy_to_clipboard": "Copy frames to clipboard ?",
        "few_frames": "Too few frames, you need to create 15 frames minimum",
        "insert_data": "Insert your data here",
        "insert_error": "Something went wrong, try again !",
        "animation_speed": "Animation Speed",
    },
    "hy": {
        "copy_to_clipboard": "Պատճենի ՛ր կադրերը",
        "few_frames": "Կադրերը շատ քիչ են: Պետք է առնվազն 15 կադր ստեղծես:",
        "insert_data": "Մուտքագրի ՛ր տվյալներդ այստեղ",
        "insert_error": "Տեղի ունեցավ սխալ",
        "animation_speed": "Անիմացիայի արագությունը",
    },
    "fr": {
        "copy_to_clipboard": "Copier les images dans le presse-papier ?",
        "few_frames": "Pas assez d'images, tu dois en créer au minimum 15.",
        "insert_data": "Insère tes données ici",
        "insert_error": "Oups quelque chose s'est mal passé",
        "animation_speed": "Vitesse de l'animation",
    },
    "ja": {
        "copy_to_clipboard": "フレームをクリップボードにコピーしますか？",
        "few_frames": "フレーム数が少なすぎます。最低15フレーム作成する必要があります。",
        "insert_data": "ここにデータを挿入してください。",
        "insert_error": "何かが間違っています！",
        "animation_speed": "アニメーションのスピード",
    },
};

const localizedText = translations[lang];

function copyToClipboard(str) { // Copy a string to the clipboard
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function playAnimation() {
    background('#f3f3f3') // The background image
    _drawFrame(lastPlayedFrame, 255, _ballColor); // Draw the currently played frame with alpha of 255 (100 %)
    if (lastPlayedFrame != _frameCount - 1 && frames[lastPlayedFrame + 1].edited) { // Continue if there are frames left
        return lastPlayedFrame++; // Continue to the next frame
    }
    return lastPlayedFrame = 0; // If frames ended, restart
}

function drawFrames(index) {
    // Clear the screen
    background('#f3f3f3');

    // Draw previous frames
    let _alpha = _previouseFrameAlphaFirstValue / 100 * 255;
    for (let i = 0; i < _previouseFrameCount && i < currentFrame; i++) {
        _drawFrame(index - i - 1, _alpha - (i * (_previouseFrameAlphaDiff / 100 * 255)), _previousFramesColor); // Looks scary, isn't it ?
    }

    if (showNextFrames) {
        // Draw next frames
        for (let i = 0; i < _nextFrameCount && index + i + 1 < _frameCount; i++) {
            _drawFrame(index + i + 1, _alpha - (i * (_nextFrameAlphaDiff / 100 * 255)), _nextFramesColor);
        }
    }

    // Draw the current frame
    _drawFrame(index, 255, _ballColor);
}

function _drawFrame(index, _alpha, _color) { // Draws a single frame with the given alpha
    const { x, y } = frames[index];
    fill(..._color, _alpha);
    ellipse(x, y, _ballSize, _ballSize);
}

function nextFrame() { // Switches to the next frame (in edit mode)
    if (currentFrame < frames.length - 1) {
        currentFrame++;
    }
}

function previousFrame() { // Switches to the previous frame (in edit mode)
    if (currentFrame > 0) {
        currentFrame--;
    }
}

function setupFrames() { // Setup the  frames
    isAnimationPlaying ? Play() : null; // Stop animation if it is playing
    lastPlayedFrame = 0; // Reset the animation play frame
    frames = []; // Empty the frames
    currentFrame = 0; // Reset the edit mode frame
    for (let i = 0; i < _frameCount; i++) { // Filling the frames with default positioned balls
        frames.push({ x: _defaultBallX, y: _defaultBallY, edited: false });
    }
}

function Play() { // Play or pause the animation
    const div = document.getElementById('play'); // The "Play" button
    if (isAnimationPlaying) { // If animation is playing, stop
        div.classList.remove('pause'); // Reset the button image
        lastPlayedFrame = 0; // Reset the animation play frame
        return isAnimationPlaying = false; // Stop animation
    }
    // If animation is not playing, start
    div.classList.add('pause'); // Change the 'Play' button to the 'Pause' button
    return isAnimationPlaying = true; // Start the animation
}

function Save() { // Save the animation
    let activeFramesCount = 0;
    for (let i in frames) if (frames[i].edited) activeFramesCount++;
    if (activeFramesCount >= 15) {
        if (confirm(localizedText['copy_to_clipboard'])) {
            copyToClipboard(JSON.stringify(frames));
        }

    }
    else alert(localizedText['few_frames']);
}

function Import() { // Import an animation
    // Prompt for the animation
    const res = prompt(localizedText['insert_data']);
    try {
        if (!res) throw new Error('This error will be catched, baby.')
        frames = JSON.parse(res); // Parse the data
        isAnimationPlaying ? Play() : null; // Stop animation if it is playing
        currentFrame = 0; // Go to frame 0
    }
    catch (e) { // Wrong data was inserted
        alert(localizedText['insert_error']);
    }
}

function drawProgressBar(frame, animate) { // Draw the progress bar with the given frame and animate? it
    stroke('green'); // Line color
    strokeWeight(10); // Weight is 3px

    // Animate the progress bar using linear interpolation or just set it's value immediately
    progressBarWidth = animate ? lerp(progressBarWidth, progressBarStepWidth * (frame), 0.2) : progressBarStepWidth * (frame);

    // Draw the progress bar
    line(0, 0, progressBarWidth, 0);

    // Displaying the frame number
    strokeWeight(4);
    fill(..._nextFramesColor);
    textSize(48);
    text(frame + 1, 12, 54);

    // Disable stroke
    return noStroke();
}

function nextFrames() {
    const div = document.getElementById('nextframes');
    if (showNextFrames) {
        showNextFrames = false;
        return div.classList.remove('nonextframes');
    }
    showNextFrames = true;
    div.classList.add('nonextframes')
}