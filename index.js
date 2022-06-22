let timeInSeconds = 0;
let isTimerRunning = false;

function renderTime() {
  $("#timer-container").text(secondsToTimeString(timeInSeconds));
}

function tickOneSecond() {
  console.log("tick");
  console.log(timeInSeconds);
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
  setInterval(tickOneSecond, 10);
}

$("#timer-start-button").click(function (e) {
  if (!isTimerRunning) {
    handleTimerStart();
    isTimerRunning = true;
  }
});
