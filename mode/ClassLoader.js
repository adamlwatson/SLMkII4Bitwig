// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Display Modes
var MODE_TRACK               = 0;
var MODE_VOLUME              = 1;
var MODE_TRACK_TOGGLES       = 3;
var MODE_FUNCTIONS           = 4;
var MODE_MASTER              = 5;
var MODE_FIXED               = 6;
var MODE_FRAME               = 7;
var MODE_VIEW_SELECT         = 8;

var MODE_DEVICE_PARAMS       = 10;
var MODE_DEVICE_COMMON       = 11;
var MODE_DEVICE_ENVELOPE     = 12;
var MODE_DEVICE_MODULATE     = 13;
var MODE_DEVICE_USER         = 14;
var MODE_DEVICE_MACRO        = 15;
var MODE_DEVICE_DIRECT       = 16;

var MODE_DEVICE_PRESETS      = 17;

var MODE_SESSION             = 20;
var MODE_PLAY_OPTIONS        = 21;


load ("TrackMode.js");
load ("TrackTogglesMode.js");
load ("VolumeMode.js");
load ("FunctionMode.js");
load ("FixedMode.js");
load ("MasterMode.js");
load ("FrameMode.js");
load ("ViewSelectMode.js");

load ("device/AbstractDeviceMode.js");
load ("device/AbstractDeviceFixedMode.js");
load ("device/DeviceCommonMode.js");
load ("device/DeviceDirectMode.js");
load ("device/DeviceEnvelopeMode.js");
load ("device/DeviceMacroMode.js");
load ("device/DeviceModulationMode.js");
load ("device/DeviceParamsMode.js");
load ("device/DeviceUserMode.js");
load ("device/DevicePresetsMode.js");

load ("SessionMode.js");
load ("PlayOptionsMode.js");
