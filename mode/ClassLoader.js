// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// Display Modes
var MODE_TRACK               = 0;
var MODE_VOLUME              = 1;
var MODE_SELECT              = 2;
var MODE_TRACK_TOGGLES       = 3;
var MODE_FUNCTIONS           = 4;
var MODE_MASTER              = 5;
var MODE_FIXED               = 6;
var MODE_FRAME               = 7;

var MODE_BANK_DEVICE         = 21;
var MODE_BANK_COMMON         = 22;
var MODE_BANK_ENVELOPE       = 23;
var MODE_BANK_MODULATE       = 24;
var MODE_BANK_USER           = 25;
var MODE_BANK_MACRO          = 26;
var MODE_PRESET              = 27;


load ("TrackMode.js");
load ("TrackTogglesMode.js");
load ("VolumeMode.js");
load ("FunctionMode.js");
load ("DeviceMode.js");
load ("ParamPageMode.js");
load ("FixedMode.js");
load ("MasterMode.js");
load ("FrameMode.js");
load ("PresetMode.js");
