import { Pane } from "tweakpane";

// Creates audio context, audio element, analyser
// Plays audio and returns analyser
const setupAudio = function () {
  const audioCtx = new AudioContext();

  const audioElement = document.createElement("audio");
  document.body.appendChild(audioElement);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const player = audioCtx.createMediaElementSource(audioElement);
  player.connect(audioCtx.destination);
  player.connect(analyser);

  audioElement.src = "./test-audio.wav";
  audioElement.play();

  return analyser;
};

// Clears the canvas and returns the context
const clearCanvas = function () {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return ctx;
};

const play = function () {
  const analyser = setupAudio();

  const results = new Uint8Array(analyser.frequencyBinCount);

  const draw = function () {
    window.requestAnimationFrame(draw);

    const ctx = clearCanvas();

    ctx.fillStyle = "white";
    //ctx.fillStyle = pane.color;
    analyser.getByteFrequencyData(results);

    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      ctx.fillRect(i, 512, 1, -1 * results[i]);
    }
  };
  draw();
};

window.onload = async function () {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const PARAMS = {
    factor: 123,
    color: "#ff0055",
  };

  const pane = new Pane({ title: "Controls" });

  pane.addBinding(PARAMS, "factor");
  pane.addBinding(PARAMS, "color");

  document.querySelector("button").onclick = play;
};
