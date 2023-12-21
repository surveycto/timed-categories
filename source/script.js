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
/* In space separated list:
    * Timestamp of when field was first entered.
    * 1 if answered correctly the first time, 0 if incorrect the first time.
    * Time in milliseconds it took to select an answer the first time.
    * Time in milliseconds it took to select the correct answer. If the correct answer was selected first, then this will be the same as the third number.
*/
var timeUnit // {string} Time unit to be displayed
var timeDivider // {number} Based on the timeUnit, what the ms time will be divided by for display to the user

var showTimer = getPluginParameter('showtimer')
var allowkeys = getPluginParameter('allowkeys')
var allowclick = getPluginParameter('allowclick')
var hidekeys = getPluginParameter('hidekeys')
var correctVal = getPluginParameter('correct')

var timerContainer = document.querySelector('.timer-container')
var timeNumberContainer = timerContainer.querySelector('.timer')

var timerCircle = document.querySelector('.timer-circle')

var keyContainers = document.querySelectorAll('#key') // {Array<Element>} Where the key to press will be displayed
var clickAreas = document.querySelectorAll('.main-cell') // {Array<Element>} Clickable areas
var choiceLabelContainers = document.querySelectorAll('.choice-label') // {Array<Element>} Used later to unEntity

if (showTimer == 0) {
  showTimer = false
} else {
  showTimer = true
}

var tdObj = {} // Key is the choice value, and value is the corresponding TD element. Used to highlight the element later
for (var e = 0; e < numChoices; e++) {
  var thisElement = clickAreas[e]
  var elementId = thisElement.id.substr(7) // Remove the "choice-" from the ID to get the choice value
  tdObj[elementId] = thisElement
}

if (typeof correctVal === 'string') { // Make lowercase to match more common choice values
  correctVal = correctVal.toLocaleLowerCase()
} else if (correctVal == null) {
  correctVal = fieldProperties.CHOICES[0].CHOICE_VALUE
}

if ((hidekeys === 1) || (allowkeys === 0)) { // Hide the keys to press if the user prefers
  var keyRows = document.querySelectorAll('.key-row')
  var numKeyRows = keyRows.length
  for (var r = 0; r < numKeyRows; r++) {
    keyRows[r].style.display = 'none'
  }
}


for (let c = 0; c < numChoices; c++) {
  // Might as well un-entity while here
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

if (metadataString == null) {
  var startTime = Date.now()
  var complete = false
  var metadata = [startTime]
} else {
  var metadata = metadataString.split(' ')
  var startTime = parseInt(metadataString[0])
  if (metadata.length == 4) {
    complete = true
  } else {
    complete = false
  }
}

if (!complete) {
  if (selectable && (allowclick !== 0)) { // Set up click/tap on region
    for (var tdNum = 0; tdNum < numChoices; tdNum++) {
      var clickArea = clickAreas[tdNum]
      clickArea.addEventListener('click', function (e) {
        var eventTarget = e.currentTarget
        var choiceId = eventTarget.id.substr(7)
        choiceSelected(choiceId)
      })
    }
  }
  
  if (selectable && (allowkeys !== 0)) { // Set up keyboard event listener if allowed
    document.addEventListener('keyup', keypress)
  }
  

}
if (showTimer) {
  timerContainer.style.display = ''
  setUnit()
  setInterval(timer, 1)
  if (complete) {
    timeNumberContainer.innerHTML = String(Math.floor(metadata[3] / timeDivider, 0)) // Set time display
  }
}

/**
 * Runs as much as possible. Takes the current time stamp with the starting time stamp, and determines how much time is remaining. When time runs out, move on to the next field.
 */
function timer () {
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
    if (selectedCol !== -1) {
      var highlightElement = tdObj[choiceValue] // Find element to highlight
      var checkElement = document.createElement('div')
      checkElement.classList.add('correct-symbol')
      if (correctVal === choiceValue) {
        switch (metadata.length) { // Only one case for now, but may update later
          case 1:
            metadata[1] = '1'
            metadata[2] = String(Date.now() - startTime)
            metadata[3] = String(Date.now() - startTime)
            break
          case 2: // Should never be the case, but adding just in case
            metadata[2] = '-1'
          case 3:
            metadata[3] = String(Date.now() - startTime)
            break
        }
        highlightElement.classList.add('correct')
        checkElement.appendChild(document.createTextNode(String.fromCharCode(0x2713)))
        setAnswer(choiceValue)
        complete = true // Probably not needed by this point, since "complete" is not used once a choice is selected, but will keep for now.

        setTimeout(
          function () {
            goToNextField()
          }, 200)
      } else {
        switch (metadata.length) { // Only one case for now, but may update later
          case 1:
            metadata[1] = '0'
            metadata[2] = String(Date.now() - startTime)
            break
        }
        highlightElement.classList.add('wrong')
        checkElement.appendChild(document.createTextNode(String.fromCharCode(0x2717)))
      }
      metadataString = metadata.join(' ')
      console.log(metadataString)
      setMetaData(metadataString)
      highlightElement.appendChild(checkElement)
    }
  }
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
