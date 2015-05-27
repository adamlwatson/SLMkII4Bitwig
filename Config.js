// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// ------------------------------
// Static configurations
// ------------------------------

// remote sl model indicator
Config.REMOTE_SL_MKI     = "MKI"
Config.REMOTE_SL_MKII    = "MKII"

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;

// ------------------------------
// Editable configurations
// ------------------------------

Config.TOUCHPAD_MODE      = 0;
Config.DISPLAY_CROSSFADER = 1;

Config.TOUCHPAD_OPTIONS = [ "Crossfader", "User Control (CCs)", "Macro Parameter 1&2" ];
Config.TOUCHPAD_MODE_CROSSFADER    = Config.TOUCHPAD_OPTIONS[0];
Config.TOUCHPAD_MODE_CCS           = Config.TOUCHPAD_OPTIONS[1];
Config.TOUCHPAD_MODE_MACRO         = Config.TOUCHPAD_OPTIONS[2];

Config.touchpadMode      = 2;
Config.displayCrossfader = true;


Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Accent

    Config.touchpadModeSetting = prefs.getEnumSetting ("Mode", "Touchpad", Config.TOUCHPAD_OPTIONS, Config.TOUCHPAD_OPTIONS[2]);
    Config.touchpadModeSetting.addValueObserver (function (value)
    {
        Config.touchpadMode = value;
        Config.notifyListeners (Config.TOUCHPAD_MODE);
    });
    
    ///////////////////////////
    // Workflow

    Config.displayCrossfaderSetting = prefs.getEnumSetting ("Display Crossfader on Track", "Workflow", [ "Off", "On" ], "On");
    Config.displayCrossfaderSetting.addValueObserver (function (value)
    {
        Config.displayCrossfader = value == "On";
        Config.notifyListeners (Config.DISPLAY_CROSSFADER);
    });   
};

Config.setDisplayCrossfader = function (enabled)
{
    Config.displayCrossfaderSetting.set (enabled ? "On" : "Off");
};

// ------------------------------
// Property listeners
// ------------------------------

Config.listeners = [];
for (var i = 0; i <= Config.DISPLAY_CROSSFADER; i++)
    Config.listeners[i] = [];

Config.addPropertyListener = function (property, listener)
{
    Config.listeners[property].push (listener);
};

Config.notifyListeners = function (property)
{
    var ls = Config.listeners[property];
    for (var i = 0; i < ls.length; i++)
        ls[i].call (null);
};

function Config () {}
