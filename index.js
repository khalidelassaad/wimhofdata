let timeInSeconds = 0;

function secondsToTimeString(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let secondsString =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${secondsString}`;
}

function handleTimerStart() {
  console.log("START THE TIMER!!!");
  $("#timer-container").text(secondsToTimeString(timeInSeconds));
  timeInSeconds += 1;
}

$("#timer-start-button").click(function (e) {
  handleTimerStart();
});
