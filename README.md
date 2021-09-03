# Timed categories

<img src="extras/readme-images/all-set.png" alt="All set" title="All set" width="300px"/>

| Not complete | Confirmation | Working |
| --- | --- | --- |
| <img src="extras/readme-images/not-complete.png" alt="Not complete" title="Not complete" width="150px"/> | <img src="extras/readme-images/confirmation.png" alt="Confirmation" title="Confirmation" width="150px"/> | <img src="extras/readme-images/working.png" alt="Working" title="Working" width="150px"/> |

## Description

This field plug-in presents a number of choices, and the the respondent can select a choice using either a keyboard key, or tapping the area below the choice. They must select a choice within a certain period of time.

Great for implicit association tests (IAT)!

[![](extras/readme-images/beta-release-download.jpg)](https://github.com/surveycto/timed-categories/raw/master/timed-categories.fieldplugin.zip)


*This plug-in is currently under beta. If you you find a problem with the field plug-in, please email support@surveycto.com.*

### Features

* Timer with customizable time and units (seconds, deciseconds, centiseconds, and milliseconds) (can be turned off).
* Auto-advances after time runs out.
* Can select a choice using either the corresponding keyboard key, or area below the choice (either can be turned off).
* Display the keyboard key corresponding with each choice (can be turned off).
* Choice is given a "pass" value if a choice is not selected in time.
* Show if selected choice is correct choice (optional)
* If the respondent selects a choice they didn't mean to, and there was time remaining, they can go back and correct it (this can be turned off).
* Support images for both the field and choices.

To learn how to customize the field plug-in, check out the [parameters](#parameters) below.

### Data format

The field will have a value of the selected choice, or of the "pass" choice (discussed more later) if a choice is not selected in time.

## How to use

### Getting started

**To use this field plug-in as-is**, just download the [timed-categories.fieldplugin.zip](https://github.com/surveycto/timed-categories/raw/master/timed-categories.fieldplugin.zip) file from this repo, and attach it to your form.

**To use with the sample form:**

1. Download the [sample form](https://github.com/surveycto/timed-categories/raw/master/extras/sample-form/Sample%20form%20-%20Delete%20Twilio%20recording.xlsx) from this repo.
1. Download the [crops_list.csv](https://github.com/surveycto/twilio-call/raw/master/extras/sample-form/twilio_access.csv) dataset template (right-click the link, click *Save link as*, set format to *All Files*, add `.csv` to the file name, and save).
1. Download the [timed-categories.fieldplugin.zip](https://github.com/surveycto/timed-categories/raw/master/timed-categories.fieldplugin.zip) file from this repo.
1. Upload the form to your server with the CSV and ZIP files attached.

#### Setting up the choice list

All choices in the choice list, except for the last choice, will be choices the respondent can select. Each of those will have a column in the field display, and they will be selectable by the respondent.

The last choice will be automatically selected if time runs out before a choice is selected. This will be hidden in the field. This is needed even if the field is not timed.

### Parameters

All parameters are **optional**, but they can be used to customize the field plug-in.

#### Main parameters

These are by far the most common parameters you will use.

|Name|Description|Default|
|:---|:---|:---|
|`duration`|<p>How long the respondent has to answer the field until it automatically moves on to the next page. No matter the value of `unit`, this should always be defined in **seconds**.</p><p>If this is undefined, then the field will be untimed, and the timer will not appear.</p>|None|
|`unit`|<p>Unit to be used for the display time. For example, if `duration` has a value of 5, and `unit` has a value of `'cs'` for "centiseconds", then the time will start at 500, and count down to 0 over five seconds (500 centiseconds)</p><p>You can use `'s'` (seconds), `'ds'` (deciseconds), `'cs'` (centiseconds), or `'ms'` (milliseconds).</p>|`'s'`|
|`correct`|<p>If a field has a "correct" value, you can define that in this parameter. If the respondent selects the correct answer, then the selected choice will turn green, and show a checkmark. If they select the wrong answer, the selected choice will turn red, and show an X. That way, the respondent gets instant feedback.</p><p>The value of this parameter should be the same as the correct choice value, but in quotes. For example, if the correct choice has a value of `e`, then this parameter should have a value of `'e'`. If the choice with a value of `e` is selected, then the selected choice will turn green; otherwise, it will turn red.</p><p>This parameter is optional, so even if a field has a "correct" value, id you don't want to give immediate feedback, you can simply leave this parameter out. If this parameter is not defined, then the selected choice will turn blue, whether or not it is right.</p>|None|

#### Other parameters

These are other parameters you can use in your form, but they are a lot less common.

|Name|Description|Default|
|:---|:---|:---|
|`hidekeys`|Normally, the keyboard key used to select a choice will appear below the choice label. If this parameter has a value of `1`, then it will not show those keyboard keys. This can be helpful if the form will only be completed on a mobile device, where the correct choice will only be selected with clicking/tapping.|`0`|
|`continue`|<p>Whether or not the respondent can continue with the time they have left. For example, if the field has a `duration` of 10, and the respondent goes to the field, stays for two seconds, goes back to the previous field for five seconds, then returns to the timed-categories field, they will still have three seconds to answer the field.</p><p>If this parameter has a value of `0`, then if the respondent accidentally swipes backwards while on the field, then the field will automatically be assigned the "Pass" value.</p>|`1`|
|`allowchange`|Related to `continue`, if the respondent answers a field, but they **still have time remaining**, then they can go back and change their answer. This can be helpful if the respondent is tapping the screen too much, accidentally answering a question before they actually get a chance to read it.|`1`|
|`allowkeys`|Whether or not keyboard keys can be used to select a choice. If this parameter has a value of `0`, then keyboard keys cannot be used to select a choice, only clicking/tapping.|`1`|
|`allowclick`|Whether or not clicking/tapping a choice on the screen can be used to select a choice. If this parameter has a value of `0`, then clicking/tapping the choice cannot be used to select a choice, only keyboard keys.|`1`|
|`frame_adjust` (advanced)|The field plug-in has been formatted so the tappable area takes up as much of the screen as possible, but without making it so big that the page becomes scrollable. If you would like to make the clickable area bigger or smaller, use this parameter to define how many pixels it should be adjusted by. For example, to make the clickable area 50 pixels longer, give this parameter a value of `50`. To make the clickable area 10 pixels shorter, give this parameter a value of `-10`.|`0`|

### Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `select_one` |
| Default values | No |
| Custom constraint message | No |
| Custom required message | No |
| Read only | Yes |
| media:image | Yes |
| media:audio | Yes |
| media:video | Yes |
| `label` appearance | No |
| `list-nolabel` appearance | No |
| `quick` appearance | No |
| `minimal` appearance | No |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `quickcompact` appearance | No |
| `quickcompact-#` appearance | No |
| `likert` appearance | No |
| `likert-min` appearance | No  |
| `likert-mid` appearance | No |

## More resources

* **Sample form**  
You can find a form definition in this repo [here](extras/sample-form/simple/Timed%20categories%20sample%20form). You will also need the [crops_list.csv file](extras/sample-form/simple/crops_list.csv).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)