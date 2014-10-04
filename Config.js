// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// ------------------------------
// Static configurations
// ------------------------------

// Inc/Dec of knobs
Config.fractionValue     = 1;
Config.fractionMinValue  = 0.5;
Config.maxParameterValue = 128;

// ------------------------------
// Editable configurations
// ------------------------------

Config.TOUCHPAD_MODE = 0;
// TODO "Preconfigured (like X/Y device)"
Config.TOUCHPAD_OPTIONS = [ "select another option", "Crossfader", "User Control (CCs)", "Macro Parameter 1&2" ];
Config.TOUCHPAD_MODE_PRECONFIGURED = Config.TOUCHPAD_OPTIONS[0];
Config.TOUCHPAD_MODE_CROSSFADER    = Config.TOUCHPAD_OPTIONS[1];
Config.TOUCHPAD_MODE_CCS           = Config.TOUCHPAD_OPTIONS[2];
Config.TOUCHPAD_MODE_MACRO         = Config.TOUCHPAD_OPTIONS[3];

Config.touchpadMode = 0;


Config.init = function ()
{
    var prefs = host.getPreferences ();

    ///////////////////////////
    // Accent

    Config.touchpadModeSetting = prefs.getEnumSetting ("Mode", "Touchpad", Config.TOUCHPAD_OPTIONS, Config.TOUCHPAD_OPTIONS[0]);
    Config.touchpadModeSetting.addValueObserver (function (value)
    {
        Config.touchpadMode = value;
        Config.notifyListeners (Config.TOUCHPAD_MODE);
    });
};


// ------------------------------
// Property listeners
// ------------------------------

Config.listeners = [];
for (var i = 0; i <= Config.TOUCHPAD_MODE; i++)
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
