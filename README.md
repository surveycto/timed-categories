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
* If the respondent selects a choice they didn't mean to, and there was time remaining, they can go back and correct it (this can be turned off).
* Support images for both the field and choices. 

### Data format

The field will have a value of the selected choice, or of the "pass" choice (discussed more later) if a choice is not selected in time.

## How to use

### Getting started

**To use this field plug-in as-is**, just download the [timed-categories.fieldplugin.zip](https://github.com/surveycto/timed-categories/raw/master/timed-categories.fieldplugin.zip) file from this repo, and attach it to your form.

**To use with the sample form:**

1. Download the [sample form](https://github.com/surveycto/timed-categories/raw/master/extras/sample-form/Sample%20form%20-%20Delete%20Twilio%20recording.xlsx) from this repo.
1. Download the [timed-categories.fieldplugin.zip](https://github.com/surveycto/timed-categories/raw/master/timed-categories.fieldplugin.zip) file from this repo.
1. Download the [twilio-call.fieldplugin.zip](https://github.com/surveycto/twilio-call/blob/master/twilio-call.fieldplugin.zip?raw=true) file from the [twilio-call](https://github.com/surveycto/twilio-call/blob/master/README.md) repo.
1. Download the [twilio_access.csv](https://github.com/surveycto/twilio-call/raw/master/extras/sample-form/twilio_access.csv) dataset template (right-click the link, click *Save link as*, set format to *All Files*, add `.csv` to the file name, and save).
1. Update and save the twilio_access.csv file with information about your own Twilio account.
1. Upload the sample form to your server with both field plug-ins and the CSV file attached.
1. Adjust the parameters as you see fit.


#### Setting up the choice list

All choices in the choice list, except for the last choice, will be choices the respondent can select. Each of those will have a column in the field display.

The last choice will be what is selected if time runs out before a choice is selected. This will be hidden from the field. This is needed even if the field is not timed.

### Parameters

| Name | Description |
|:---|:---|
|`action` (required)|What happens when a choice is selected. See [Actions](#actions) below for a list of values you can use.|
|`call_url` (required)|The URL to access the call information. In both this field plug-in's sample form, as well as the twilio-call field plug-in, this is stored in the field called "twilio_call_url"|
|`auth_token` (required)|The authorization token for your Twilio account. (Note: The account SID is not needed, because this is extracted from the `call_url` value.)|
|`timeout` (optional)|How long to wait with no response from Twilio until the enumerator can move on. See [Timeout](#Timeout) below for more information. Takes value in number of seconds.|`8`|
|`waiting_text` (optional)|Message displayed after the consent choice has been confirmed by the enumerator, but a response has not yet been received by the Twilio server.|`'Enumerator: Please wait...'`|
|`complete_text` (optional)|Message displayed when the enumerator can move on to the next field. This means either the action has been completed and a response has been received by the server, or it has timed out.|`'All set! You can now move to the next field.'`|
|`yes` (optional)|Text to display for the "Yes" confirmation button after a choice has been selected.|`'Yes'`|
|`no` (optional)|Text to display for the "No" confirmation button after a choice has been selected.|`'No'`|

#### Actions

These are the values you can give to the `action` parameter. In this table, 'Value' is the value you give to the `action` parameter, and 'Trigger' is the selected choice value that triggers the action. For example, if the `action` parameter has a value of 'delete', then nothing will happen if the choice selected has a value of `1` (when consent is granted), only if the choice selected has a value of `0` (when consent for recording is withheld).

|Value|Trigger|Description|
|:---|:---|:---|
|`'delete'`|`0`|Deletes the recording. If consent is denied, then the recording is stopped, and then deleted.|
|`'stop'`|`0`|Stops the recording only. If consent is denied, then the recording is stopped, but not deleted. That way, you have a recording of the respondent denying consent.|
|`'start'`|`1`|Starts a recording for the active call. If consent is approved, then the call recording starts. Also, the second part of the metadata will store the URL in the call recording information (see [Metadata](#Metadata) above for more information).|

In the sample form, the field "action" on row 26 asks which action should be taken, and this is used for the `action` parameter of the field plug-in. For actual data collection, this will be explicitly stated, like this: `action='deleted'`

#### Timeout

In this field plug-in, the enumerator cannot move on from the field until it has been confirmed that the action is complete (e.g. the recording has been deleted, the recording has been stopped, etc). While this should just take a second or two, in places with slower internet connections, this can take longer. By default, if there is no response within `8` seconds, then the field plug-in will allow the enumerator to move forward. This does not mean the action failed, just that the enumerator should just move on and complete the form so they don't keep the respondent waiting.

If 8 seconds is too long or too short, you can use the `timeout` parameter to adjust it. For example, `timeout=5` shortens the timeout time to 5 seconds.

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
| `minimal` appearance | Yes |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `quickcompact` appearance | No |
| `quickcompact-#` appearance | No |
| `likert` appearance | No |
| `likert-min` appearance | No  |
| `likert-mid` appearance | No |

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](extras/sample-form). You will also need the [twilio-call](https://github.com/surveycto/twilio-call/blob/master/README.md) field plug-in, as well as its [twilio_access.csv file](https://github.com/surveycto/twilio-call/blob/master/extras/sample-form/twilio_access.csv), which you can learn more about in its documentation.

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)