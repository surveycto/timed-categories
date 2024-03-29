/* global getMetaData, setMetaData, setAnswer, goToNextField, fieldProperties, getPluginParameter */

var complete = false // {bool} If field is complete, then don't set up the even listeners, so a fast respondent can't change their answer
var selectable = true // Whether choices can still be selected
var allowedKeys = [] // Each goes into an array so it can be confirmed a legitimate keyboard key was pressed
var choices = fieldProperties.CHOICES
var numChoices = choices.length
var startTime = Date.now() // {number} Time code when the field starts
var timeStart // {number} How much time the timer should start with. To be set by field plug-in parameter
var timeLeft // {number} How much time is left on the timer
var metadataString = getMetaData()
var timeUnit // {string} Time unit to be displayed
var timeDivider // {number} Based on the timeUnit, what the ms time will be divided by for display to the user
var selectedCorrect = 0 // This starts with a value of 0, but if the correct answer is selected, it is assigned a value of 1, and added to the metadata

var version = getPluginParameter('version')
var showTimer = getPluginParameter('showtimer')
var durationStart = getPluginParameter('duration')
var allowContinue = getPluginParameter('continue')
var allowChange = getPluginParameter('allowchange')
var allowkeys = getPluginParameter('allowkeys')
var allowclick = getPluginParameter('allowclick')
var hidekeys = getPluginParameter('hidekeys')
var correctVal = getPluginParameter('correct')

var missedValue // There is only a "missed" value in version 1
if (version != 2) {
  version = 1
  missedValue = choices[numChoices - 1].CHOICE_VALUE
}

if ((showTimer == 0) || ((durationStart == null) && (version == 1))) {
  showTimer = false
} else {
  showTimer = true
}

if (typeof correctVal === 'string') { // Make lowercase to match more common choice values
  correctVal = correctVal.toLocaleLowerCase()
}

var timerContainer = document.querySelector('.timer-container')
var timeNumberContainer = timerContainer.querySelector('.timer')

var timerCircle = document.querySelector('.timer-circle')

var keyContainers = document.querySelectorAll('#key') // {Array<Element>} Where the key to press will be displayed
var clickAreas = document.querySelectorAll('.main-cell') // {Array<Element>} Clickable areas
var choiceLabelContainers = document.querySelectorAll('.choice-label') // {Array<Element>} Used later to unEntity

var tdObj = {} // Key is the choice value, and value is the corresponding TD element. Used to highlight the element later.
for (var e = 0; e < numChoices; e++) {
  var thisElement = clickAreas[e]
  var elementId = thisElement.id.substr(7) // Remove the "choice-" from the ID to get the choice value
  tdObj[elementId] = thisElement
}

if ((version == 1) && (numChoices > 1)) { // Used to remove the last choice, which is used for the "pass" value when time runs out.
  numChoices -= 1
  clickAreas[numChoices].style.display = 'none' // Hide the "pass" element
}

if ((hidekeys === 1) || (allowkeys === 0)) { // Hide the keys to press if the user prefers
  var keyRows = document.querySelectorAll('.key-row')
  var numKeyRows = keyRows.length
  for (var r = 0; r < numKeyRows; r++) {
    keyRows[r].style.display = 'none'
  }
}

if ((allowContinue === 0) && (version == 1)) {
  allowContinue = false
} else {
  allowContinue = true
}

if ((allowChange === 0) || (version == 2)) {
  allowChange = false
} else {
  allowChange = true
}

for (let c = 0; c < numChoices; c++) {
  // Might as well un-entity while cycling through the choices
  var labelContainer = choiceLabelContainers[c]
  labelContainer.innerHTML = unEntity(labelContainer.innerHTML)

  // Stores choice values (aka the accepted keys) into an array so the field knows when an actually assigned key has been pressed.
  var choice = choices[c]
  if (choice.CHOICE_SELECTED) {
    complete = true // If a choice has been selected, then the field is complete, which might lead to some of the event listeners not being created. That way, a fast respondent cannot change their answer
  }
  var key = choice.CHOICE_VALUE
  allowedKeys.push(key)
  keyContainers[c].innerHTML = key.toUpperCase()
}

if ((version == 2) && (correctVal == null)) {
  correctVal = choices[0].CHOICE_VALUE
}

if (complete && !allowChange) { // Already answered and cannot change
  selectable = false
  goToNextField()
} else if ((metadataString != null) && !allowContinue) { // They were here before, and not allowed to continue
  if (!complete) { // Field was not answered last time
    setAnswer(missedValue)
    selectable = false // Not allowed to change
    complete = true
  }

  goToNextField()
} else if (version == 1) {
  if (durationStart == null) { // Field is not timed
    if (metadataString == null) {
      setMetaData('1') // Set metadata so the field later knows the respondent was already here, just in case.
    }
  } else { // COMMON: The field is timed, and can work on field
    timerContainer.style.display = ''
    setUnit()
    if (metadataString == null) { // COMMON: Starting with a fresh page
      timeStart = durationStart * 1000 // Converts to ms
    } else { // Respondent has been to the field before, and they are continuing
      var lastLeft // {number} Time remaining from last time. Will remove the time passed since last at the field
      var metadata = metadataString.match(/[^ ]+/g) // List is space-separated, so use regex to get it here
      if (metadata.length > 2) {
        selectedCorrect = metadata[2]
      }
      timeStart = parseInt(metadata[0])
      lastLeft = parseInt(metadata[1])
      var timeSinceLast = Date.now() - lastLeft
      timeStart -= timeSinceLast // Remove time spent away from the field

      for (var i = 0; i < numChoices; i++) { // If choice is selected, then highlight it. That way, if the respondent would like to change their choice, they can see what they already selected.
        var choice = choices[i]
        if (choice.CHOICE_SELECTED) {
          tdObj[choice.CHOICE_VALUE].classList.add('tapped')
        }
      }

      if (timeStart <= 0) { // If the time remaining is 0 or less, then skip ahead. This is to keep the original metadata.
        selectable = false
        if (!complete) { // Time has run out, so if there is no set answer, then set one.
          setAnswer(missedValue)
          selectable = false
          complete = true // Probably not necessary here, but good in case update later.
        }
        goToNextField()
      }
    }
  }
} else { // Version 2
  setUnit()
  if (metadataString == null) {
    startTime = Date.now()
    var complete = false
    var metadata = [startTime]
    setV2Metadata()
  } else {
    var metadata = metadataString.split(' ')
    startTime = parseInt(metadata[0])
    if (metadata.length == 4) {
      complete = true
    } else {
      complete = false
    }
  }
}

if (selectable) {
  if (allowclick !== 0) { // Set up click/tap on region
    for (var tdNum = 0; tdNum < numChoices; tdNum++) {
      var clickArea = clickAreas[tdNum]
      clickArea.addEventListener('click', function (e) {
        var eventTarget = e.currentTarget
        var choiceId = eventTarget.id.substr(7)
        choiceSelected(choiceId)
      })
    }
  }

  if (allowkeys !== 0) { // Set up keyboard event listener if allowed
    document.addEventListener('keyup', keypress)
  }
}

if (showTimer) {
  timerContainer.style.display = ''
  if (!complete || allowChange) {
    if (version == 1) {
      if ((durationStart != null) && selectable) {
        timerCircle.style.animation = String(durationStart) + 's' + ' circletimer linear forwards'
        timerCircle.style.animationDelay = '-' + String(Math.ceil(durationStart - (timeStart / 1000))) + 's' // Delay in case returning to field
      }
      var timeRemaining
      if (metadata == null) {
        timeRemaining = String(durationStart)
      } else {
        timeRemaining = String(Math.ceil(metadata[0] / timeDivider, 0)) // Set time display
      }
      timeNumberContainer.innerHTML = timeRemaining
      setInterval(timer1, 1)
    } else {
      var timePassed
      if (metadata == null) {
        timePassed = 0
      } else {
        timePassed = Date.now() - metadata[0]
      }
      timeNumberContainer.innerHTML = String(Math.floor(timePassed / timeDivider, 0)) // Set time display

      setInterval(timer2, 1)
    }
  }
}

/**
 * Runs as much as possible. Takes the current time stamp with the starting time stamp, and determines how much time is remaining. When time runs out, move on to the next field.
 */
function timer1 () {
  if (selectable) {
    var timeNow = Date.now()
    timeLeft = startTime + timeStart - timeNow
    setMetaData(String(timeLeft) + ' ' + String(timeNow) + (correctVal == null ? '' : ' ' + String(selectedCorrect))) // Save the time, so if the respondent leaves and comes back, can remove the time passed so far, as well as the time passed while they were gone. If there is a correct value, then add if the selected value is correct or not.
  }

  if (timeLeft < 0) { // Stop the timer when time runs out. Using <0 instead of <=0 so does not keep setting the answer and going to the next field, and will only do it once.
    timeLeft = 0
    if (!complete) {
      setAnswer(missedValue)
      complete = true
    }
    selectable = false
    goToNextField()
  }
  timeNumberContainer.innerHTML = String(Math.ceil(timeLeft / timeDivider, 0)) // Set time display
}

function timer2 () {
  if (!complete) {
    var time = Date.now() - startTime
    timeNumberContainer.innerHTML = String(Math.floor(time / timeDivider, 0)) // Set time display
  }
}

/**
 * Called when a keyboard key is pressed
 * @param {Event} e Key press event, used to get key pressed
 */
function keypress (e) {
  var key = e.key
  choiceSelected(key)
} // End keypress

/**
 * Check the key pressed (or box clicked), and make sure it is a valid choice value. If it is, highlight the corresponding box, set the field value, quick pause to see highlighting, and move on to the next field
 * @param {string} choiceValue Value of box clicked, or key pressed
 */
function choiceSelected (choiceValue) { // When a box is clicked or a key is pressed
  if (selectable) {
    if (choiceValue === ' ') { // If the spacebar was pressed, then that corresponds to the "space" choice value
      choiceValue = 'space'
    }
    var selectedCol = allowedKeys.indexOf(choiceValue)
    if (selectedCol !== -1) { // Choice selected actually exists
      var highlightElement = tdObj[choiceValue] // Find element to highlight
      if (correctVal == null) { // There is no "correct" answer
        highlightElement.classList.add('tapped') // Highlight the corresponding cell to show what was selected
        completeField(choiceValue)
      } else { // Will show if selection was correct or not
        var checkElement = document.createElement('div') // This will be used to display a checkmark or an X.
        checkElement.classList.add('correct-symbol')
        if (correctVal === choiceValue) { // Selected choice was correct
          selectedCorrect = 1
          highlightElement.classList.add('correct')
          checkElement.appendChild(document.createTextNode(String.fromCharCode(0x2713))) // Add checkmark
          highlightElement.appendChild(checkElement)
          if (version == 2) {
            switch (metadata.length) {
              case 1: // This is the first time a choice was selected.
                metadata[1] = '1'
                metadata[2] = String(Date.now() - startTime)
                metadata[3] = String(Date.now() - startTime)
                break
              case 2: // Should never be the case, but adding to be safe.
                metadata[2] = '-1'
              case 3: // This is NOT the first time a choice was selected. 
                metadata[3] = String(Date.now() - startTime)
                break
            }
            setV2Metadata()
          }
          completeField(choiceValue)
        } else { // Selected choice was incorrect
          selectedCorrect = 0
          highlightElement.classList.add('wrong')
          checkElement.appendChild(document.createTextNode(String.fromCharCode(0x2717)))
          highlightElement.appendChild(checkElement)
          if (version == 1) {
            completeField(choiceValue)
          } else {
            switch (metadata.length) { // Only one case for now, but may update later
              case 1:
                metadata[1] = '0'
                metadata[2] = String(Date.now() - startTime)
                break
            }
            setV2Metadata()
          }
        }
      }
    }
  }
}

function setV2Metadata() {
  setMetaData(metadata.join(' '))
}

function completeField (choiceValue) {
  setAnswer(choiceValue)
  selectable = false
  complete = true // Probably not needed by this point, since "complete" is not used once a choice is selected, but will keep for now.
  setTimeout(
    function () {
      goToNextField()
    }, 200)
}

/**
 * Used to display time with preferred unit
 */
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

/**
 * Takes HTML entities for < and >, and replaces them with the actual characters so HTML styling can be taken from field references
 * @param {string} str String that should be unentitied
 * @returns {string}
 */
function unEntity (str) {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

/**
 * Clear the current answer, starting over
 */
function clearAnswer () {
  setAnswer('')
  startTime = Date.now()
}
