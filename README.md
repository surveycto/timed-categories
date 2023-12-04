# Timed categories

<img src="extras/readme-images/timer.png" width="300px"/>

| <img src="extras/readme-images/no-timer.png" width="100px"/> | <img src="extras/readme-images/choice-images.png"  width="100px"/> | <img src="extras/readme-images/hide-keys.png" width="100px"/> | <img src="extras/readme-images/randomized.png" width="100px"/> |
|:---:|:---:|:---:|:---:|
| No timer | Choice images | Hide keys | Randomized |

| <img src="extras/readme-images/choice-selected.png" width="100px" /> | <img src="extras/readme-images/right-selected.png" width="100px" /> | <img src="extras/readme-images/wrong-selected.png" width="100px"/> |
|:---:|:---:|:---:|
| Choice selected | Correct selected | Wrong selected |

| <img src="extras/readme-images/web-mobile.png" width="100px"/> | <img src="extras/readme-images/web-desktop.png"  width="210px"/> |
|:---:|:---:|
| Web view on mobile | Web view on desktop |

## Description

This field plug-in presents a number of choices as columns, and the respondent can select a choice using either a keyboard key, or tapping the area below the choice. They must select a choice within a certain period of time, or the field will be marked as "passed".

Great for implicit association tests (IAT)!

We also have a **webinar** on this field plug-in that demonstrates how to set it up and how to use it, which you can check out [here](https://www.surveycto.com/videos/iat-plugin-webinar/).

[![Download](extras/readme-images/download-button.png)](https://github.com/surveycto/timed-categories/raw/main/timed-categories.fieldplugin.zip)

### Features

There are two versions of this field plug-in. They are contained in the same field plug-in file, and which one is determined by the field plug-in parameters. To use version 2, give the `version` parameter a value of `'2'`; to use version 1, simply don't include the `version` parameter.

Click the link in the section to learn about that version.

#### Both

* Can select a choice using either the corresponding keyboard key, or clicking/tapping its choice column (both optional).
* Show if the selected choice is the correct choice (optional).
* Supports images for both the field and choices.

#### Version 1

* Timer with customizable start time and units (seconds, deciseconds, centiseconds, and milliseconds) (optional).
* Auto-advances after choice is selected or time runs out.
* Field is given a "pass" value if a choice is not selected in time.
* Display the keyboard key corresponding with each choice (optional).
* If the respondent selects a choice they didn't mean to, and there was time remaining, they can go back and correct it (optional).

[Click here to learn more about version 1...](version_readmes/v1.md)

#### Version 2

* Track time spent on the field with customizable units (seconds, deciseconds, centiseconds, and milliseconds) (optional).
* Inform the respondent if they selected the wrong choice, and give them a chance to select the correct choice.
* Prevent the respondent from moving forward until they select the correct choice.
* Track if the correct choice was selected the first time, the time it took to select a choice initially, and the time it took to select the correct choice.

[Click here to learn more about version 2...](version_readmes/v2.md)
