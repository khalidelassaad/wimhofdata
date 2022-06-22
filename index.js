let timeInSeconds = 0;
let isTimerRunning = false;
let isCurrentlyHoldingBreath = false;
let timerIntervalId;
let eventsLog = [];
let textFile;

const event_sessionStart = "Session Start";
const event_sessionStop = "Session Stop";
const event_exerciseStart = "Exercise Start"; // This starts the video
const event_breathHoldStart = "Breath Hold Start";
const event_breathHoldStop = "Breath Hold Stop";
const event_exerciseStop = "Exercise Stop";

const sensationButtons = [
  // Event to log, button id for html, button text
  ["Sensation: Chills", "sensation-chills-button", "Chills"],
  ["Sensation: Heat", "sensation-heat-button", "Heat"],
  ["Sensation: Light-Headed", "sensation-light-headed-button", "Light-Headed"],
  ["Sensation: Compression", "sensation-compression-button", "Compression"],
  [
    "Sensation: Muscle Clenching",
    "sensation-muscle-clenching-button",
    "Muscle Clenching",
  ],
  ["Sensation: Muscle Spasm", "sensation-muscle-spasm-button", "Muscle Spasm"],
  ["Sensation: Air Hunger", "sensation-air-hunger-button", "Air Hunger"],
  ["Sensation: Calm", "sensation-calm-button", "Calm"],
  ["Sensation: ???", "sensation-wildcard-button", "???"],
];

function generateSensationButtonsAndEventHandlers() {
  for (const sensationButton of sensationButtons) {
    // sensationButton = ["Sensation: Calm", "sensation-calm-button", "Calm"]
    $("#sensation-markers-container").append(
      `<button id=${sensationButton[1]}>${sensationButton[2]}</button>`
    );
    $(`#${sensationButton[1]}`).click(function (e) {
      logEvent(sensationButton[0]);
    });
  }
}

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
  promptUserForAdditionalInfo();
  enableDownloadLinkWithCSV();
  eventsLog = [];
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

function promptUserForAdditionalInfo() {
  for (let i = 0; i < eventsLog.length; i++) {
    let currentEvent = eventsLog[i][1];
    let eventTime = eventsLog[i][0];
    if (currentEvent.slice(0, 9) == "Sensation") {
      let location = prompt(
        `At time ${eventTime}, you recorded ${currentEvent}.\nWhere on your body did you feel this sensation?`
      );
      eventsLog[i].push(location);
      let intensity = prompt(
        `At time ${eventTime}, you recorded ${currentEvent}.\nHow strongly did you feel this sensation from 1 to 10?`
      );
      eventsLog[i].push(intensity);
      if (currentEvent == "Sensation: ???") {
        let description = prompt(
          `At time ${eventTime}, you recorded ${currentEvent}.\nPlease describe the sensation:`
        );
        eventsLog[i].push(description);
      }
    }
  }
}

function dumpEventLogToCSVString() {
  let returnString =
    "Timestamp,Event,Location On Body,Intensity,Sensation Description\n";
  for (const currentEvent of eventsLog) {
    let eventString = currentEvent.join(",");
    returnString += eventString + "\n";
  }
  return returnString;
}

function makeTextFile(text) {
  var data = new Blob([text], { type: "text/plain" });

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  // returns a URL you can use as a href
  return textFile;
}

function enableDownloadLinkWithCSV() {
  const csvString = dumpEventLogToCSVString();
  $("#csv-download-link").attr("download", "eventLog.csv");
  $("#csv-download-link").attr("href", makeTextFile(csvString));
  $("#csv-download-link").prop("hidden", false);
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

generateSensationButtonsAndEventHandlers();
