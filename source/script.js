/* global getMetaData, setMetaData, setAnswer, goToNextField, fieldProperties, getPluginParameter */

var complete = false
var allowedKeys = [] // Each goes into an array so they can be joined by a non-breaking space.
var choices = fieldProperties.CHOICES
var numChoices = choices.length
var missedValue = choices[numChoices - 1].CHOICE_VALUE
var startTime = Date.now() // Time code when the field starts
var timeStart // This will be how much time the timer should start with
var timeLeft // This will be how much time is left on the timer
var metadata = getMetaData()
var allowContinue = getPluginParameter('continue')

var timerH = document.querySelector('#timer')
var choiceTds = document.querySelectorAll('.choice')
var keyContainers = document.querySelectorAll('#key')
var missedChoice = choiceTds[numChoices - 1] // Choice with a value of 0, which will be used for when the choice is missed

var choiceTable = document.querySelector('.choice-table')
var choiceRows = choiceTable.querySelectorAll('tr')
var clickAreas = choiceRows[1].querySelectorAll('td') // The bottom row is the clickable areas

// Hide the last column, which is the one for missing it.
for (var rowNum = 0; rowNum < 2; rowNum++) {
  var rowTds = choiceRows[rowNum].querySelectorAll('td')
  var missedTd = rowTds[numChoices - 1]
  missedTd.style.display = 'none'
}

for (let c = 0; c < numChoices; c++) { // Stores choice values (aka the accepted keys) into an array so the field knows when an assigned key has been pressed. Also moves to the next field if a choice has already been selected.
  var choice = choices[c]
  if (choice.CHOICE_SELECTED) {
    complete = true
    goToNextField()
  }

  var key = choice.CHOICE_VALUE
  allowedKeys.push(key)
  keyContainers[c].innerHTML = key.toUpperCase()
}

if (allowContinue !== 1) { // If not allowed to continue the timer after swiping away, this sets the answer as the missed choice so that if someone tries to swipe back to this, then it will already have a value, so the field will automatically advance
  setAnswer(missedChoice)
}

if ((allowContinue === 1) && (metadata != null)) {
  timeStart = parseInt(metadata) // If there was time left previously (such as if the respondent accidentally swiped back), this lets them continue where they left off
} else {
  timeStart = getPluginParameter('duration') // Time limit on each field in seconds

  if (timeStart == null) {
    timeStart = 5000
  } else {
    timeStart *= 1000 // Converts to ms
  }
}

for (var tdNum = 0; tdNum < clickAreas - 1; tdNum++) {
  var clickArea = clickAreas[tdNum]
  clickArea.addEventListener('click', clicked)
}

document.addEventListener('keyup', keypress)
setInterval(timer, 1)

function timer () {
  if (!complete) {
    timeLeft = startTime + timeStart - Date.now()
    setMetaData(timeLeft)
  }

  if (timeLeft < 0) {
    timeLeft = 0
    complete = true
    setAnswer(missedValue)
    goToNextField()
  }
  timerH.innerHTML = timeLeft + ' ms'
}

function clicked (e) {
  var target = e.srcElement
  var targetId = target.id.substring(7)
  choiceSelected(targetId)
}

function keypress (e) {
  var key = e.key
  var keyIndex = allowedKeys.indexOf(key) // If this is -1, then a key that is not a choice was pressed
  if ((!complete) && (keyIndex !== -1)) {
    complete = true
    var selectedTd = choiceTds[keyIndex]
    selectedTd.style.border = '1px solid #078edf'
    selectedTd.style.backgroundColor = '#00b2be40'
    selectedTd.style.borderRadius = '7px'
    setTimeout(
      function () {
        complete = true
        setAnswer(key)
        goToNextField()
      }, 200) // End timeout
  } // End IF
} // End keypress

function choiceSelected (choiceValue) {
  var selectedCol = allowedKeys.indexOf(choiceValue)
  if (selectedCol !== -1) {

  }
}

function clearAnswer () {
  setAnswer('')
  startTime = Date.now()
}

