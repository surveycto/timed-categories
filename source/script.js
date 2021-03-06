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
var timeUnit
var timeDivider

var allowContinue = getPluginParameter('continue')
var allowchange = getPluginParameter('allowchange')
var allowkeys = getPluginParameter('allowkeys')
var allowclick = getPluginParameter('allowclick')
var hidekeys = getPluginParameter('hidekeys')

var timerContainer = document.querySelector('#timer')
var keyContainers = document.querySelectorAll('#key')
var choiceTable = document.querySelector('.choice-table')
var choiceRows = choiceTable.querySelectorAll('.main-row')
var clickAreas = choiceRows[1].querySelectorAll('td') // The bottom row is the clickable areas

if (hidekeys === 1) { // Hide the keys to press if the user prefers
  var keyRows = document.querySelectorAll('.key-row')
  var numKeyRows = keyRows.length
  for (var r = 0; r < numKeyRows; r++) {
    keyRows[r].style.display = 'none'
  }
}

if (allowContinue === 0) {
  allowContinue = false
} else {
  allowContinue = true
}

if (allowchange === 0) {
  allowchange = false
} else {
  allowchange = true
}

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
  }

  var key = choice.CHOICE_VALUE
  if (key === 'space') {
    key = ' '
  }
  allowedKeys.push(key)
  keyContainers[c].innerHTML = key.toUpperCase()
}

if (metadata == null) {
  timeStart = getPluginParameter('duration') // Time limit on each field in seconds
  if (timeStart == null) {
    timerContainer.style.display = 'none'
    setMetaData('1') // Set metadata to indicate field has already been opened
  } else {
    setUnit()
    timeStart *= 1000 // Converts to ms
  }
} else if (allowContinue && (!complete || allowchange)) { // The field was previous opened, but can continue
  complete = false
  if (getPluginParameter('duration') == null) {
    timerContainer.style.display = 'none'
  } else {
    setUnit()
    var lastLeft
    [timeStart, lastLeft] = metadata.match(/[^ ]+/g)
    timeStart = parseInt(timeStart)
    lastLeft = parseInt(lastLeft)
    var timeSinceLast = Date.now() - lastLeft
    timeStart -= timeSinceLast // Remove time spent away from the field
  }
} else { // The field was previously opened, but not allowed to continue
  if (!complete) {
    setAnswer(missedValue)
    complete = true
  }
  timeLeft = -1
}

if (!complete || (allowclick !== 0)) { // Set up click/tap on region
  for (var tdNum = 0; tdNum < numChoices - 1; tdNum++) {
    var clickArea = clickAreas[tdNum]
    clickArea.addEventListener('click', clicked)
  }
}

if (!complete || (allowkeys !== 0)) { // Set up press keyboard
  document.addEventListener('keyup', keypress)
}

if (timeStart != null) {
  setInterval(timer, 1)
}

function timer () {
  if (!complete) {
    var timeNow = Date.now()
    timeLeft = startTime + timeStart - timeNow
    setMetaData(String(timeLeft) + ' ' + String(timeNow))
  }

  if (timeLeft < 0) {
    timeLeft = 0
    if (!complete) {
      setAnswer(missedValue)
      complete = true
    }
    goToNextField()
  }
  timerContainer.innerHTML = String(Math.ceil(timeLeft / timeDivider, 0)) + ' ' + timeUnit
}

function clicked (e) {
  var target = e.srcElement
  var targetId = target.id.substring(7)
  if (targetId === 'space') {
    targetId = ' '
  }
  choiceSelected(targetId)
}

function keypress (e) {
  var key = e.key
  choiceSelected(key)
} // End keypress

function choiceSelected (choiceValue) {
  complete = true
  var selectedCol = allowedKeys.indexOf(choiceValue)
  if (selectedCol !== -1) {
    for (var rowNum = 0; rowNum < 2; rowNum++) {
      var selectedCell = tableMatrix[rowNum][selectedCol]
      var cellStyle = selectedCell.style
      cellStyle.border = '1px solid #078edf'
      cellStyle.backgroundColor = '#00b2be40'
      cellStyle.borderRadius = '7px'
    }
    if (choiceValue === ' ') {
      setAnswer('space')
    } else {
      setAnswer(choiceValue)
    }
    setTimeout( // Use timeout to see what was selected before moving on
      function () {
        goToNextField()
      }, 200) // End timeout
  }
}

function setUnit () {
  timeUnit = getPluginParameter('unit')
  if (timeUnit === 'ms') {
    timeDivider = 1
  } else if (timeUnit === 'cs') {
    timeDivider = 10
  } else if (timeUnit === 'ds') {
    timeDivider = 100
  } else {
    timeUnit = 's'
    timeDivider = 1000
  }
}

function clearAnswer () {
  setAnswer('')
  startTime = Date.now()
}
