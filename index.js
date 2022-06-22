let timeInSeconds = 0;
let isTimerRunning = false;
let timerIntervalId;

function renderTime() {
  $("#timer-container").text(secondsToTimeString(timeInSeconds));
}

function tickOneSecond() {
  timeInSeconds += 1;
  renderTime();
}

function secondsToTimeString(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let secondsString =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${secondsString}`;
}

function handleTimerStart() {
  renderTime();
  timerIntervalId = setInterval(tickOneSecond, 1000);
}

$("#timer-start-button").click(function (e) {
  if (!isTimerRunning) {
    handleTimerStart();
    isTimerRunning = true;
  }
});

function handleTimerStop() {
  renderTime();
  clearInterval(timerIntervalId);
}

$("#timer-stop-button").click(function (e) {
  if (isTimerRunning) {
    handleTimerStop();
    isTimerRunning = false;
  }
});
