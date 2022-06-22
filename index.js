let timeInSeconds = 0;
let isTimerRunning = false;
let isCurrentlyHoldingBreath = false;
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

function logEvent(eventToLog) {
  eventsLog.push([secondsToTimeString(timeInSeconds), eventToLog]);
}

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
  logEvent(event_sessionStart);
}

function handleSessionStop() {
  clearInterval(timerIntervalId);
  $("#session-start-button").prop("disabled", false);
  $("#session-stop-button").prop("disabled", true);
  logEvent(event_sessionStop);
  timeInSeconds = 0;
  renderTime();
  console.log(eventsLog);
  // TODO: prompt user for additional info, then log me to a CSV, then clear event log
}

function handleBreathHoldClick() {
  if (isCurrentlyHoldingBreath) {
    logEvent(event_breathHoldStop);
    $("#mark-breath-hold-start-stop-button").text("Breath Hold Start");
    isCurrentlyHoldingBreath = false;
  } else {
    logEvent(event_breathHoldStart);
    $("#mark-breath-hold-start-stop-button").text("Breath Hold Stop");
    isCurrentlyHoldingBreath = true;
  }
}

function handleStartExerciseClick() {
  $("iframe")[0].src += "&autoplay=1";
  logEvent(event_exerciseStart);
  $("#start-exercise-button").prop("disabled", true);
}

function handleStopExerciseClick() {
  logEvent(event_exerciseStop);
  $("#stop-exercise-button").prop("disabled", true);
}

$("#session-start-button").click(function (e) {
  if (!isTimerRunning) {
    handleSessionStart();
    isTimerRunning = true;
  }
});

$("#session-stop-button").click(function (e) {
  if (isTimerRunning) {
    handleSessionStop();
    isTimerRunning = false;
  }
});

$("#mark-breath-hold-start-stop-button").click(function (e) {
  handleBreathHoldClick();
});

$("#start-exercise-button").click(function (e) {
  handleStartExerciseClick();
});

$("#stop-exercise-button").click(function (e) {
  handleStopExerciseClick();
});
