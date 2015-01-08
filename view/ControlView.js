// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ControlView (model)
{
    AbstractView.call (this, model);
    
    this.stopPressed = false;
    this.isRewinding = false;
    this.isForwarding = false;
    this.isTempoInc = false;
    this.isTempoDec = false;
    
    this.currentDeviceMode = MODE_DEVICE_PARAMS;
    this.isMasterMode = false;
}
ControlView.prototype = new AbstractView ();
ControlView.prototype.constructor = ControlView;

//--------------------------------------
// Transport
//--------------------------------------

ControlView.prototype.onRewind = function (event)
{
    if (event.isDown ())
        this.isRewinding = true;
    else if (event.isUp ())
        this.isRewinding = false;
    this.doChangePosition ();
};

ControlView.prototype.onForward = function (event)
{
    if (event.isDown ())
        this.isForwarding = true;
    else if (event.isUp ())
        this.isForwarding = false;
    this.doChangePosition ();
};

ControlView.prototype.doChangePosition = function ()
{
    if (!this.isRewinding && !this.isForwarding)
        return;
    this.model.getTransport ().changePosition (this.isForwarding, false);
    scheduleTask (doObject (this, function ()
    {
        this.doChangePosition ();
    }), null, 100);
};

ControlView.prototype.onPlay = function (event)
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
};

ControlView.prototype.onStop = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().stop ();
};

ControlView.prototype.onRecord = function (event)
{
    if (!event.isDown ())
        return;
    if (this.surface.isShiftPressed ())
        this.model.getTransport ().toggleLauncherOverdub ();
    else
        this.model.getTransport ().record ();
};

ControlView.prototype.onLoop = function (event)
{
    if (event.isDown ())
        this.model.getTransport ().toggleLoop ();
};


//--------------------------------------
// Buttons
//--------------------------------------

ControlView.prototype.onButtonRow1 = function (index, event)
{
    if (!event.isDown ())
        return;

    var cm = this.surface.getCurrentMode ();
    if (cm != MODE_FUNCTIONS && cm != MODE_FIXED)
    {
        this.surface.setPendingMode (MODE_FUNCTIONS);
        cm = MODE_FUNCTIONS;
    }
        
    if (cm == MODE_FIXED)
    {
        this.model.getCurrentTrackBank ().setNewClipLength (index);
        return;
    }

    switch (index)
    {
        // Undo
        case 0:
            this.model.getApplication ().undo ();
            break;

        // Redo
        case 1:
            this.model.getApplication ().redo ();
            break;
            
        // Delete
        case 2:
            this.model.getApplication ().deleteSelection ();
            break;
            
        // Double
        case 3:
            this.model.getApplication ().duplicate ();
            break;
            
        // New
        case 4:
            var tb = this.model.getCurrentTrackBank ();
            var t = tb.getSelectedTrack ();
            if (t != null)
            {
                var slotIndexes = tb.getSelectedSlots (t.index);
                var slotIndex = slotIndexes.length == 0 ? 0 : slotIndexes[0].index;
                for (var i = 0; i < 8; i++)
                {
                    var sIndex = (slotIndex + i) % 8;
                    var s = t.slots[sIndex];
                    if (!s.hasContent)
                    {
                        var slots = tb.getClipLauncherSlots (t.index);
                        slots.createEmptyClip (sIndex, Math.pow (2, tb.getNewClipLength ()));
                        if (slotIndex != sIndex)
                            slots.select (sIndex);
                        slots.launch (sIndex);
                        this.model.getTransport ().setLauncherOverdub (true);
                        return;
                    }
                }
            }
            displayNotification ("In the current selected grid view there is no empty slot. Please scroll down.");
            break;
            
        // Toggle the browser
        case 5:
            this.model.getApplication ().toggleBrowserVisibility ();
            break;
            
        // Metronome
        case 6:
            this.model.getTransport ().toggleClick ();
            break;
            
        // Tap Tempo
        case 7:
            this.model.getTransport ().tapTempo ();
            break;
    }
};

ControlView.prototype.onButtonRow2 = function (index, event)
{
    if (!event.isDown ())
        return;

    var cm = this.surface.getCurrentMode ();
    if (cm != MODE_TRACK_TOGGLES && cm != MODE_FRAME && cm != MODE_DEVICE_PRESETS)
    {
        this.surface.setPendingMode (MODE_TRACK_TOGGLES);
        cm = MODE_TRACK_TOGGLES;
    }
        
    if (cm == MODE_FRAME)
    {
        this.surface.getMode (MODE_FRAME).executeCommand (index);
        return;
    }
    else if (cm == MODE_DEVICE_PRESETS)
    {
        var cd = this.model.getCursorDevice ();
        switch (index)
        {
            case 2: cd.switchToPreviousPresetCategory (); break;
            case 3: cd.switchToNextPresetCategory ();     break;
            case 4: cd.switchToPreviousPresetCreator ();  break;
            case 5: cd.switchToNextPresetCreator ();      break;
            case 6: cd.switchToPreviousPreset ();         break;
            case 7: cd.switchToNextPreset ();             break;
        }
        return;
    }
    
        
    switch (index)
    {
        // Mute
        case 0:
            var tb = this.model.getCurrentTrackBank ();
            var track = tb.getSelectedTrack ();
            if (track != null)
                tb.toggleMute (track.index);
            break;

        // Solo
        case 1:
            var tb = this.model.getCurrentTrackBank ();
            var track = tb.getSelectedTrack ();
            if (track != null)
                tb.toggleSolo (track.index);
            break;
            
        // Arm
        case 2:
            var tb = this.model.getCurrentTrackBank ();
            var track = tb.getSelectedTrack ();
            if (track != null)
                tb.toggleArm (track.index);
            break;
            
        // Write
        case 3:
            this.model.getTransport ().toggleWriteArrangerAutomation ();
            break;
            
        // Browse
        case 4:
            this.surface.setPendingMode (MODE_DEVICE_PRESETS);
            break;
            
        // Dis-/Enable device
        case 5:
            this.model.getCursorDevice ().toggleEnabledState ();
            break;
            
        // Previous device
        case 6:
            this.model.getCursorDevice ().selectPrevious ();
            break;
            
        // Next device
        case 7:
            this.model.getCursorDevice ().selectNext ();
            break;
    }
};

ControlView.prototype.onButtonRow3 = function (index, event)
{
    this.model.getCurrentTrackBank ().select (index);
};

ControlView.prototype.onButtonRow4 = function (index, event)
{
    switch (index)
    {
        // Decrease tempo
        case 0:
            if (event.isDown ())
                this.isTempoDec = true;
            else if (event.isUp ())
                this.isTempoDec = false;
            this.doChangeTempo ();
            break;

        // Increase tempo
        case 1:
            if (event.isDown ())
                this.isTempoInc = true;
            else if (event.isUp ())
                this.isTempoInc = false;
            this.doChangeTempo ();
            break;
            
        case 2:
            // Not used
            break;
            
        case 3:
            // Not used
            break;
            
        case 4:
            // Not used
            break;
            
        // Toggle launcher overdub
        case 5:
            if (event.isDown ())
                this.model.getTransport ().toggleLauncherOverdub ();
            break;
            
        case 6:
            // Not used
            break;
            
        case 7:
            // Not used
            break;
    }
};

ControlView.prototype.doChangeTempo = function ()
{
    if (!this.isTempoInc && !this.isTempoDec)
        return;
    this.model.getTransport ().changeTempo (this.isTempoInc);
    scheduleTask (doObject (this, function ()
    {
        this.doChangeTempo ();
    }), null, 200);
};


//--------------------------------------
// Knobs & Sliders
//--------------------------------------

ControlView.prototype.onKnobRow1 = function (index, value)
{
    if (!this.model.hasSelectedDevice ())
        return;
    if (value > 64) // Convert negative relative value
        value = 127 - (value - 64);
    var cd = this.model.getCursorDevice ();
    
    var cm = this.surface.getCurrentMode ();
    if (cm < MODE_DEVICE_PARAMS || cm > MODE_DEVICE_DIRECT)
    {
        this.surface.setPendingMode (MODE_DEVICE_PARAMS);
        cm = MODE_DEVICE_PARAMS;
    }
    this.surface.getMode (cm).onValueKnob (index, value);
};

ControlView.prototype.onKnobRow2 = function (index, value)
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
            tb.setCrossfadeModeAsNumber (track.index, value == 0 ? 0 : (value == 127 ? 2 : 1));
            break;
            
        // Send 1 - 5
        default:
            tb.setSend (track.index, index - 3, value);
            break;
    }
};

ControlView.prototype.onSlider = function (index, value)
{
    if (this.surface.getCurrentMode () != MODE_VOLUME)
        this.surface.setPendingMode (MODE_VOLUME);
    this.model.getCurrentTrackBank ().setVolume (index, value);
};


//--------------------------------------
// Row selections
//--------------------------------------

ControlView.prototype.onButtonRow1Select = function ()
{
    if (this.surface.getCurrentMode () == MODE_FUNCTIONS)
        this.surface.setPendingMode (MODE_FIXED);
    else
        this.surface.setPendingMode (MODE_FUNCTIONS);
};

ControlView.prototype.onKnobRow1Select = function ()
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

ControlView.prototype.onButtonRow2Select = function ()
{
    if (this.surface.getCurrentMode () == MODE_TRACK_TOGGLES)
        this.surface.setPendingMode (MODE_FRAME);
    else
        this.surface.setPendingMode (MODE_TRACK_TOGGLES);
};

ControlView.prototype.onKnobRow2Select = function ()
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

ControlView.prototype.onDrumPadRowSelect = function ()
{
    // Not used
};

ControlView.prototype.onSliderRowSelect = function ()
{
    this.surface.setPendingMode (MODE_VOLUME);
};

ControlView.prototype.onButtonRow3Select = function ()
{
    // this.surface.setPendingMode (MODE_SELECT);
};

ControlView.prototype.onButtonRow4Select = function ()
{
    // Not used
};

ControlView.prototype.onButtonP1 = function (isUp, event)
{
    if (!event.isDown ())
        return;

    switch (this.surface.getCurrentMode ())
    {
        case MODE_FUNCTIONS:
        case MODE_FIXED:
            this.onButtonRow1Select ();
            break;
        
        case MODE_VOLUME:
        case MODE_SELECT:
            this.onButtonP2 (isUp, event);
            break;
        
        case MODE_TRACK:
        case MODE_MASTER:
            this.onKnobRow2Select ();
            break;
        
        case MODE_TRACK_TOGGLES:
        case MODE_FRAME:
            this.onButtonRow2Select ();
            break;

        default:
            if (isUp)
                this.surface.getMode (this.currentDeviceMode).nextPage ();
            else
                this.surface.getMode (this.currentDeviceMode).previousPage ();
            this.currentDeviceMode = this.surface.getCurrentMode ();
            break;
    }
};

ControlView.prototype.onButtonP2 = function (isUp, event)
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

ControlView.prototype.onGridNote = function (note, velocity)
{
    this.surface.sendMidiEvent (0x90, note, velocity);
};

//--------------------------------------
// Touchpad
//--------------------------------------

ControlView.prototype.onTouchpadX = function (value)
{
    switch (Config.touchpadMode)
    {
        case Config.TOUCHPAD_MODE_PRECONFIGURED:
            // TODO FIX - Requires direct parameters which is currently broken
            break;
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

ControlView.prototype.onTouchpadY = function (value)
{
    switch (Config.touchpadMode)
    {
        case Config.TOUCHPAD_MODE_PRECONFIGURED:
            // TODO FIX - Requires direct parameters which is currently broken
            break;
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

//--------------------------------------
// Protected API
//--------------------------------------

ControlView.prototype.updateButtons = function ()
{
    var tb = this.model.getCurrentTrackBank ();
    var track = tb.getSelectedTrack ();
    var cd = this.model.getCursorDevice ();
    var transport = this.model.getTransport ();
    var cm = this.surface.getCurrentMode ();
    var overlayMode = cm == MODE_FRAME || cm == MODE_DEVICE_PRESETS;
    var isFunctions = cm == MODE_FUNCTIONS;
    var hasTrack = track != null && !overlayMode;
    var clipLength = tb.getNewClipLength ();

    // Button row 1: Clip length or functions
    this.surface.setButton (MKII_BUTTON_ROW1_1, !isFunctions && clipLength == 0 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_2, !isFunctions && clipLength == 1 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_3, !isFunctions && clipLength == 2 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_4, !isFunctions && clipLength == 3 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_5, !isFunctions && clipLength == 4 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_6, !isFunctions && clipLength == 5 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_7, (isFunctions && transport.isClickOn) || (!isFunctions && clipLength == 6) ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW1_8, !isFunctions && clipLength == 7 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    
    // Button row 2: Track toggles
    this.surface.setButton (MKII_BUTTON_ROW2_1, hasTrack && track.mute ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_2, hasTrack && track.solo ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_3, hasTrack && track.recarm ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_4, transport.isWritingArrangerAutomation ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_5, MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_6, this.model.getSelectedDevice ().enabled ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_7, !overlayMode && cd.canSelectPreviousFX () ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW2_8, !overlayMode && cd.canSelectNextFX () ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);

    // Button row 3: Selected track indication
    for (var i = 0; i < 8; i++)
        this.surface.setButton (MKII_BUTTON_ROW3_1 + i, tb.getTrack (i).selected ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        
    // LED indications for device parameters
    this.surface.getMode (this.currentDeviceMode).setLEDs ();
};
