/* global parent, ResizeSensor, getPluginParameter */

var frameAdjust = getPluginParameter('frame_adjust')
if (frameAdjust == null) {
  frameAdjust = 0
} else if (!isNaN(frameAdjust)) {
  if (frameAdjust % 1 > 0) {
    frameAdjust = parseInt(frameAdjust)
    console.log('Frame adjust value is not an integer, so rounding down to ' + String(frameAdjust) + '.')
  }
} else {
  try {
    frameAdjust = parseInt(frameAdjust)
  } catch {
    console.log('Value given for frame adjust is invalid. Using 0 instead.')
    frameAdjust = 0
  }
}

var changingElement = document.querySelector('.choice-table')
var platform
if (document.body.className.indexOf('web-collect') >= 0) {
  platform = 'web'
} else {
  platform = 'mobile' // Currently, iOS or Android does not matter, but will add the distinction later if needed
}

if (platform === 'web') {
  parent.onresize = adjustWindow
  var parentDoc = parent.document

  var panelBody = parentDoc.querySelector('.panel-body') // The box with the actual field, within which is the field plug-in
  var iframe = parentDoc.querySelector('iframe') // Contains the field plug-in

  // document.querySelector('.panel-body').getBoundingClientRect().top
  try {
    changingElement.onscroll = function () {
      iframe.offsetHeight = 100 // Fixes an issue where during certain scroll events, the iframe becomes way to long, so this makes it smaller again
    }
  } catch (e) {
    Error(e) // Not a big deal if there is an error, since this is just a basic aethetic thing, so the respondent can continue even if there is an error here.
  }
} else {
  window.onresize = adjustWindow
}

adjustWindow()

ResizeSensor(changingElement, adjustWindow) // Adjust whenever the size of the changingElement changes

function adjustWindow () {
  var usedHeight // This will be an estimation of how much height has already been used by the interface
  var windowHeight // Height of the working area. In web forms, it's the height of the window, otherwise, it's the height of the device.

  if (platform === 'web') {
    windowHeight = parent.innerHeight // Height of the document of the web page.
    usedHeight = panelBody.getBoundingClientRect().top // How much of the screen is used until it gets to the actual field
    usedHeight += 149 // Used by the bottom of the screen
  } else {
    usedHeight = 200 // This is an estimation for mobile devices
    windowHeight = window.screen.height // Height of the device.
  }
  var shiftPos = changingElement.getBoundingClientRect().top // How much is used by the field until getting to the element that will change in size

  var containerHeight = Math.floor(windowHeight - shiftPos - usedHeight + frameAdjust) // What the height of the scrolling container should be

  changingElement.style.height = String(containerHeight) + 'px'
}
