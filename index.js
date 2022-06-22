let timeInSeconds = 0;
let isTimerRunning = false;
let timerIntervalId;
let eventsLog = [];

// Possible events:
const event_sessionStart = "Session Start";
const event_sessionStop = "Session Stop";
const event_exerciseStart = "Exercise Start"; // This starts the video
const event_breathHoldStart = "Breath Hold Start";
const event_breathHoldStop = "Breath Hold Stop";
const event_exerciseStop = "Exercise Stop";
const event_sensation_chills = "Sensation: Chills";
const event_sensation_wildcard = "Sensation: ???";

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

function handleSessionStart() {
  renderTime();
  timerIntervalId = setInterval(tickOneSecond, 1000);
  $("#session-start-button").prop("disabled", true);
  $("#session-stop-button").prop("disabled", false);
}

$("#session-start-button").click(function (e) {
  if (!isTimerRunning) {
    handleSessionStart();
    isTimerRunning = true;
  }
});

function handleSessionStop() {
  renderTime();
  clearInterval(timerIntervalId);
  $("#session-start-button").prop("disabled", false);
  $("#session-stop-button").prop("disabled", true);
}

$("#session-stop-button").click(function (e) {
  if (isTimerRunning) {
    handleSessionStop();
    isTimerRunning = false;
  }
});
