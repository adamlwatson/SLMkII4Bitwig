// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2015
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractView.prototype.stopPressed  = false;
AbstractView.prototype.isRewinding  = false;
AbstractView.prototype.isForwarding = false;
AbstractView.prototype.isTempoInc   = false;
AbstractView.prototype.isTempoDec   = false;

AbstractView.prototype.isMasterMode = false;

//--------------------------------------
// Transport
//--------------------------------------

AbstractView.prototype.onRewind = function (event)
{
    if (event.isDown ())
        this.isRewinding = true;
    else if (event.isUp ())
        this.isRewinding = false;
    this.doChangePosition ();
};

AbstractView.prototype.onForward = function (event)
{
    if (event.isDown ())
        this.isForwarding = true;
    else if (event.isUp ())
        this.isForwarding = false;
    this.doChangePosition ();
};

AbstractView.prototype.doChangePosition = function ()
{
    if (!this.isRewinding && !this.isForwarding)
    {
        this.turnOffTransport ();
        return;
    }
    this.model.getTransport ().changePosition (this.isForwarding, false);
    scheduleTask (doObject (this, function ()
    {
        this.doChangePosition ();
    }), null, 100);
};

AbstractView.prototype.onPlay = function (event)
{
    if (!event.isDown ())
        return;
    if (!this.restartFlag)
    {
        this.model.getTransport ().play ();
        this.doubleClickTest ();
    }
    else
    {
        this.model.getTransport ().stopAndRewind ();
        this.restartFlag = false;
    }
    this.turnOffTransport ();
};

AbstractView.prototype.onStop = function (event)
{
    if (!event.isDown ())
        return;
    this.model.getTransport ().stop ();
    this.turnOffTransport ();
};

AbstractView.prototype.onRecord = function (event)
{
    // Toggle launcher overdub
    if (!event.isDown ())
        return;
    this.model.getTransport ().toggleLauncherOverdub ();
    this.turnOffTransport ();
};

AbstractView.prototype.onLoop = function (event)
{
    if (!event.isDown ())
        return;
    this.model.getTransport ().toggleLoop ();
    this.turnOffTransport ();
};

//--------------------------------------
// Knobs & Sliders
//--------------------------------------

AbstractView.prototype.onKnobRow1 = function (index, value)
{
    if (!this.model.hasSelectedDevice ())
        return;
    if (value > 64) // Convert negative relative value
        value = 127 - (value - 64);
    
    var cm = this.surface.getCurrentMode ();
    if (cm < MODE_DEVICE_PARAMS || cm > MODE_DEVICE_DIRECT)
    {
        this.surface.setPendingMode (MODE_DEVICE_PARAMS);
        cm = MODE_DEVICE_PARAMS;
    }
    this.surface.getMode (cm).onValueKnob (index, value);
};

AbstractView.prototype.onKnobRow2 = function (index, value)
{
    var cm = this.surface.getCurrentMode ();
    if (cm != MODE_TRACK && cm != MODE_MASTER)
    {
        this.surface.setPendingMode (MODE_TRACK);
        cm = MODE_TRACK;
    }

    if (cm == MODE_MASTER)
    {
        if (index == 0)
            this.model.getMasterTrack ().setVolume (value);
        else if (index == 1)
            this.model.getMasterTrack ().setPan (value);
        return;
    }
        
    var tb = this.model.getCurrentTrackBank ();
    var track = tb.getSelectedTrack ();
    if (track == null)
        return;

    switch (index)
    {
        // Volume
        case 0:
            tb.setVolume (track.index, value);
            break;

        // Pan
        case 1:
            tb.setPan (track.index, value);
            break;
            
        case 2:
            if (Config.displayCrossfader)
                tb.setCrossfadeModeAsNumber (track.index, value == 0 ? 0 : (value == 127 ? 2 : 1));
            else
                tb.setSend (track.index, 0, value);
            break;
            
        // Send 1 - 5
        default:
            tb.setSend (track.index, index - (Config.displayCrossfader ? 3 : 2), value);
            break;
    }
};

AbstractView.prototype.onSlider = function (index, value)
{
    if (this.surface.getCurrentMode () != MODE_VOLUME)
        this.surface.setPendingMode (MODE_VOLUME);
    this.model.getCurrentTrackBank ().setVolume (index, value);
};

//--------------------------------------
// Row selections
//--------------------------------------

AbstractView.prototype.onKnobRow1Select = function ()
{
    var cm = this.surface.getCurrentMode ();
    switch (cm)
    {
        case MODE_DEVICE_DIRECT:
            this.currentDeviceMode = MODE_DEVICE_PARAMS;
            displayNotification ("Device Parameters");
            break;
            
        case MODE_DEVICE_COMMON:
        case MODE_DEVICE_ENVELOPE:
        case MODE_DEVICE_MODULATE:
        case MODE_DEVICE_USER:
        case MODE_DEVICE_MACRO:
            this.currentDeviceMode = MODE_DEVICE_DIRECT;
            displayNotification ("Direct Parameters");
            break;
        
        case MODE_DEVICE_PARAMS:
            this.currentDeviceMode = MODE_DEVICE_COMMON;
            displayNotification ("Fixed Parameters");
            break;
    }
    this.surface.setPendingMode (this.currentDeviceMode);
};

AbstractView.prototype.onKnobRow2Select = function ()
{
    switch (this.surface.getCurrentMode ())
    {
        case MODE_MASTER:
            this.surface.setPendingMode (MODE_TRACK);
            this.isMasterMode = false;
            if (this.model.isEffectTrackBankActive ())
                this.model.toggleCurrentTrackBank ();
            displayNotification ("Tracks");
            break;
            
        case MODE_TRACK:
            if (this.model.isEffectTrackBankActive ())
            {
                this.surface.setPendingMode (MODE_MASTER);
                displayNotification ("Master");
                this.isMasterMode = true;
            }
            else
            {
                this.model.toggleCurrentTrackBank ();
                displayNotification ("Effects");
            }
            break;
            
        default:
            this.surface.setPendingMode (this.isMasterMode ? MODE_MASTER : MODE_TRACK);
            break;
    }
    
    var tb = this.model.getCurrentTrackBank ();
    var track = tb.getSelectedTrack ();
    if (track == null)
        tb.select (0);
};

AbstractView.prototype.onDrumPadRowSelect = function ( value )
{
    if ( controller_type == "MKI" ) {
        this.surface.setPendingMode (MODE_VIEW_SELECT);
    } else if ( controller_type == "MKII" ) {
        // Not used
    }

};

AbstractView.prototype.onSliderRowSelect = function ()
{
    this.surface.setPendingMode (MODE_VOLUME);
};

AbstractView.prototype.onButtonRow3Select = function ()
{
    this.surface.setPendingMode (MODE_VOLUME);
};

AbstractView.prototype.onButtonRow4Select = function ()
{
    if ( controller_type == "MKI" ) {
        this.surface.setPendingMode (MODE_VIEW_SELECT);

    } else if ( controller_type == "MKII" ) {
        this.surface.setPendingMode (MODE_VOLUME);
    }

};

AbstractView.prototype.onButtonP2 = function (isUp, event)
{
    if (!event.isDown ())
        return;

    var tb = this.model.getCurrentTrackBank ();
    if (isUp)
    {
        if (!tb.canScrollTracksDown ())
            return;
        tb.scrollTracksPageDown ();
    }
    else
    {
        if (!tb.canScrollTracksUp ())
            return;
        tb.scrollTracksPageUp ();
    }
    tb.select (0);
};

//--------------------------------------
// Touchpad
//--------------------------------------

AbstractView.prototype.onTouchpadX = function (value)
{
    switch (Config.touchpadMode)
    {
        case Config.TOUCHPAD_MODE_CROSSFADER:
            this.model.getTransport ().setCrossfade (value);
            break;
        case Config.TOUCHPAD_MODE_CCS:
            this.model.getUserControlBank ().getControl (0).set (value, Config.maxParameterValue);
            break;
        case Config.TOUCHPAD_MODE_MACRO:
            this.model.getCursorDevice ().getMacro (0).getAmount ().set (value, Config.maxParameterValue);
            break;
    }
};

AbstractView.prototype.onTouchpadY = function (value)
{
    switch (Config.touchpadMode)
    {
        case Config.TOUCHPAD_MODE_CROSSFADER:
            // Crossfade only in X direction
            break;
        case Config.TOUCHPAD_MODE_CCS:
            this.model.getUserControlBank ().getControl (1).set (value, Config.maxParameterValue);
            break;
        case Config.TOUCHPAD_MODE_MACRO:
            this.model.getCursorDevice ().getMacro (1).getAmount ().set (value, Config.maxParameterValue);
            break;
    }
};

AbstractView.prototype.turnOffTransport = function ()
{
    this.surface.turnOffTransport ();
    if (this.surface.getCurrentMode () == MODE_VIEW_SELECT)
        this.surface.restoreMode ();
};

AbstractView.prototype.canSelectedTrackHoldNotes = function ()
{
    var t = this.model.getCurrentTrackBank ().getSelectedTrack ();
    return t != null && t.canHoldNotes;
};

// The Drum Pads
AbstractView.prototype.onGridNote = function (note, velocity)
{
    this.surface.sendMidiEvent (0x90, note, velocity);
};
