// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ControlView (model)
{
    if (!model) // Called on first prototype creation
        return;
    AbstractView.call (this, model);
    this.currentDeviceMode = MODE_DEVICE_PARAMS;
}
ControlView.prototype = new AbstractView ();
ControlView.prototype.constructor = ControlView;

//--------------------------------------
// Buttons
//--------------------------------------

ControlView.prototype.onButtonRow1 = function (index, event)
{
    if (!event.isDown ())
        return;
    
    if (this.surface.getCurrentMode () == MODE_VIEW_SELECT)
    {
        if (index == 1)
        {
            this.surface.setActiveView (VIEW_PLAY);
            this.surface.setPendingMode (this.surface.getPreviousMode () == MODE_VOLUME ? MODE_VOLUME : MODE_SESSION);
        }
        this.turnOffTransport ();
        return;
    }    

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
        case 0:
            this.onRewind (event);
            break;

        case 1:
            this.onForward (event);
            break;
            
        case 2:
            this.onStop (event);
            break;
            
        case 3:
            this.onPlay (event);
            break;
            
        case 4:
            this.onLoop (event);
            break;
            
        case 5:
            if (event.isDown ())
                this.model.getTransport ().record ();
            break;
            
        case 6:
            // Decrease tempo
            if (event.isDown ())
                this.isTempoDec = true;
            else if (event.isUp ())
                this.isTempoDec = false;
            this.doChangeTempo ();
            break;
            
        case 7:
            // Increase tempo
            if (event.isDown ())
                this.isTempoInc = true;
            else if (event.isUp ())
                this.isTempoInc = false;
            this.doChangeTempo ();
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
// Row selections
//--------------------------------------

ControlView.prototype.onButtonRow1Select = function ()
{
    this.surface.setPendingMode (this.surface.getCurrentMode () == MODE_FUNCTIONS ? MODE_FIXED : MODE_FUNCTIONS);
};

ControlView.prototype.onButtonRow2Select = function ()
{
    this.surface.setPendingMode (this.surface.getCurrentMode () == MODE_TRACK_TOGGLES ? MODE_FRAME : MODE_TRACK_TOGGLES);
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

    if (cm == MODE_VIEW_SELECT)
    {
        for (var i = 0; i < 8; i++)
            this.surface.setButton (MKII_BUTTON_ROW1_1 + i, MKII_BUTTON_STATE_OFF);
    }
    else
    {
        // Button row 1: Clip length or functions
        this.surface.setButton (MKII_BUTTON_ROW1_1, !isFunctions && clipLength == 0 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_2, !isFunctions && clipLength == 1 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_3, !isFunctions && clipLength == 2 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_4, !isFunctions && clipLength == 3 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_5, !isFunctions && clipLength == 4 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_6, !isFunctions && clipLength == 5 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_7, (isFunctions && transport.isClickOn) || (!isFunctions && clipLength == 6) ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW1_8, !isFunctions && clipLength == 7 ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    }
    
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
    
    // Transport buttons
    this.surface.setButton (MKII_BUTTON_ROW4_3, !transport.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_4, transport.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_5, transport.isLooping ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_6, transport.isRecording ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    
    var mode = this.surface.getCurrentMode ();
    var isTrack        = mode == MODE_TRACK;
    var isTrackToggles = mode == MODE_TRACK_TOGGLES;
    var isVolume       = mode == MODE_VOLUME;
    var isFunctions    = mode == MODE_FUNCTIONS;
    var isMaster       = mode == MODE_MASTER;
    var isFixed        = mode == MODE_FIXED;
    var isFrame        = mode == MODE_FRAME;
    var isPreset       = mode == MODE_DEVICE_PRESETS;
    var isDevice       = mode >= MODE_DEVICE_PARAMS && mode <= MODE_DEVICE_DIRECT;
    this.surface.setButton (MKII_BUTTON_ROWSEL1, isFunctions || isFixed ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL2, isDevice ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL3, isTrackToggles || isFrame || isPreset ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL4, isTrack || isMaster ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL6, isVolume ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL7, MKII_BUTTON_STATE_OFF);
};
