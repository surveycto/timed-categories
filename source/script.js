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
var keyContainers = document.querySelectorAll('#key')
var choiceTable = document.querySelector('.choice-table')
var choiceRows = choiceTable.querySelectorAll('.main-row')
var clickAreas = choiceRows[1].querySelectorAll('td') // The bottom row is the clickable areas

var tableMatrix = []
for (var rowNum = 0; rowNum < 2; rowNum++) {
  var rowList = choiceRows[rowNum].querySelectorAll('.main-cell')
  tableMatrix.push(rowList)
  rowList[numChoices - 1].style.display = 'none' // Hide the last column, which is the one for running out of time
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
  console.log('Point 1')
  setAnswer(missedValue)
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
    console.log('Point 2')
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
  choiceSelected(key)
} // End keypress

function choiceSelected (choiceValue) {
  var selectedCol = allowedKeys.indexOf(choiceValue)
  if (selectedCol !== -1) {
    for (var rowNum = 0; rowNum < 2; rowNum++) {
      var selectedCell = tableMatrix[rowNum][selectedCol]
      var cellStyle = selectedCell.style
      cellStyle.border = '1px solid #078edf'
      cellStyle.backgroundColor = '#00b2be40'
      cellStyle.borderRadius = '7px'
    }
    setTimeout( // Use timeout to see what was selected before moving on
      function () {
        complete = true
        console.log('Point 4')
        setAnswer(key)
        goToNextField()
      }, 200) // End timeout
  }
}

function clearAnswer () {
  console.log('Point 5')
  setAnswer('')
  startTime = Date.now()
}
