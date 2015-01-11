// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

PlayView.NUM_DISPLAY_COLS = 16;
PlayView.NOTE_VELOCITY    = 127;

function PlayView (model)
{
    if (!model) // Called on first prototype creation
        return;
    AbstractSequencerView.call (this, model, 128, PlayView.NUM_DISPLAY_COLS);
    this.currentDeviceMode = MODE_DEVICE_PARAMS;
    
    this.offsetY = Scales.DRUM_NOTE_START;
    this.selectedPad = 0;
    this.pressedKeys = initArray (0, 128);

    this.noteMap = this.scales.getEmptyMatrix ();
    
    this.isPlayMode = true;
    
    var tb = model.getTrackBank ();
    tb.addNoteListener (doObject (this, function (pressed, note, velocity)
    {
        // Light notes send from the sequencer
        this.pressedKeys[note] = pressed ? velocity : 0;
    }));
    tb.addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        this.clearPressedKeys ();
    }));
}
PlayView.prototype = new AbstractSequencerView ();
PlayView.prototype.constructor = PlayView;

//--------------------------------------
// Buttons
//--------------------------------------

PlayView.prototype.onButtonRow1 = function (index, event)
{
    if (!event.isDown ())
        return;

    if (this.surface.getCurrentMode () == MODE_VIEW_SELECT)
    {
        if (index == 0)
        {
            this.surface.setActiveView (VIEW_CONTROL);
            this.surface.setPendingMode (this.surface.getPreviousMode () == MODE_VOLUME ? MODE_VOLUME : MODE_TRACK);
        }
        this.turnOffTransport ();
        return;
    }    

    var cm = this.surface.getCurrentMode ();
    if (cm != MODE_SESSION)
        this.surface.setPendingMode (MODE_SESSION);
    
    this.model.getSceneBank ().launchScene (index);
};

PlayView.prototype.onButtonRow2 = function (index, event)
{
    if (!event.isDown ())
        return;

    var cm = this.surface.getCurrentMode ();
    if (cm != MODE_PLAY_OPTIONS)
        this.surface.setPendingMode (MODE_PLAY_OPTIONS);
    
    switch (index)
    {
        // Down
        case 0:
            this.clearPressedKeys ();
            this.scales.decDrumOctave ();
            this.model.getTrackBank ().primaryDevice.scrollDrumPadsPageUp ();
            this.offsetY = Scales.DRUM_NOTE_START + this.scales.getDrumOctave () * 16;
            this.updateNoteMapping ();
            displayNotification (this.scales.getDrumRangeText ());
            break;

        // Up
        case 1:
            this.clearPressedKeys ();
            this.scales.incDrumOctave ();
            this.model.getTrackBank ().primaryDevice.scrollDrumPadsPageDown ();
            this.offsetY = Scales.DRUM_NOTE_START + this.scales.getDrumOctave () * 16;
            this.updateNoteMapping ();
            displayNotification (this.scales.getDrumRangeText ());
            break;
            
        case 2:
            this.changeResolution (0);
            displayNotification (this.resolutionNames[this.selectedIndex]);
            break;
            
        case 3:
            this.changeResolution (127);
            displayNotification (this.resolutionNames[this.selectedIndex]);
            break;
            
        case 4:
            this.changeScrollPosition (0);
            break;
            
        case 5:
            this.changeScrollPosition (127);
            break;
            
        case 6:
            break;

        // Toggle play / sequencer
        case 7:
            this.isPlayMode = !this.isPlayMode;
            displayNotification (this.isPlayMode ? "Play/Select" : "Sequence");
            this.updateNoteMapping ();
            break;
    }
};

PlayView.prototype.onButtonRow3 = function (index, event)
{
    if (event.isDown ())
        this.onSeqGridNote (44 + index, PlayView.NOTE_VELOCITY);
    else if (event.isUp ())
        this.onSeqGridNote (44 + index, 0);
};

PlayView.prototype.onButtonRow4 = function (index, event)
{
    if (event.isDown ())
        this.onSeqGridNote (36 + index, PlayView.NOTE_VELOCITY);
    else if (event.isUp ())
        this.onSeqGridNote (36 + index, 0);
};

//--------------------------------------
// Row selections
//--------------------------------------

PlayView.prototype.onButtonRow1Select = function ()
{
    this.surface.setPendingMode (MODE_SESSION);
};

PlayView.prototype.onButtonRow2Select = function ()
{
    this.surface.setPendingMode (MODE_PLAY_OPTIONS);
};

PlayView.prototype.onButtonP1 = function (isUp, event)
{
    if (!event.isDown ())
        return;

    switch (this.surface.getCurrentMode ())
    {
        case MODE_SESSION:
            if (isUp)
                this.model.getSceneBank ().scrollPageDown ();
            else
                this.model.getSceneBank ().scrollPageUp ();
            break;
        
        case MODE_VOLUME:
            this.onButtonP2 (isUp, event);
            break;
        
        case MODE_TRACK:
        case MODE_MASTER:
            this.onKnobRow2Select ();
            break;
        
        case MODE_PLAY_OPTIONS:
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

PlayView.prototype.updateButtons = function ()
{
    // Button row 1: Launch Scene
    for (var i = 0; i < 8; i++)
        this.surface.setButton (MKII_BUTTON_ROW1_1 + i, MKII_BUTTON_STATE_OFF);
    
    // Button row 2: Track toggles
    for (var i = 0; i < 8; i++)
        this.surface.setButton (MKII_BUTTON_ROW2_1 + i, MKII_BUTTON_STATE_OFF);

    // LED indications for device parameters
    this.surface.getMode (this.currentDeviceMode).setLEDs ();
    
    // Transport buttons
    if (this.surface.isTransportActive)
    {
        for (var i = 0; i < 8; i++)
            this.surface.setButton (MKII_BUTTON_ROW3_1 + i, MKII_BUTTON_STATE_OFF);
        var transport = this.model.getTransport ();
        this.surface.setButton (MKII_BUTTON_ROW4_3, !transport.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW4_4, transport.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW4_5, transport.isLooping ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
        this.surface.setButton (MKII_BUTTON_ROW4_6, transport.isRecording ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    }
    else
    {
        // Draw sequencer
        this.drawDrumGrid ();
    }
    
    var mode = this.surface.getCurrentMode ();
    var isSession      = mode == MODE_SESSION;
    var isDevice       = mode >= MODE_DEVICE_PARAMS && mode <= MODE_DEVICE_DIRECT;
    var isPlayOptions  = mode == MODE_PLAY_OPTIONS;
    var isTrack        = mode == MODE_TRACK;
    var isMaster       = mode == MODE_MASTER;
    var isVolume       = mode == MODE_VOLUME;
    this.surface.setButton (MKII_BUTTON_ROWSEL1, isSession ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL2, isDevice ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL3, isPlayOptions ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL4, isTrack || isMaster ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL6, isVolume ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL7, MKII_BUTTON_STATE_OFF);
};

PlayView.prototype.drawDrumGrid = function ()
{
    if (!this.canSelectedTrackHoldNotes ())
    {
        for (var i = 0; i < 8; i++)
            this.surface.setButton (MKII_BUTTON_ROW3_1 + i, MKII_BUTTON_STATE_OFF);
        for (var i = 0; i < 8; i++)
            this.surface.setButton (MKII_BUTTON_ROW4_1 + i, MKII_BUTTON_STATE_OFF);
        return;
    }

    if (this.isPlayMode)
    {
        var primary = this.model.getTrackBank ().primaryDevice;
        var hasDrumPads = primary.hasDrumPads ();
        var isSoloed = false;
        if (hasDrumPads)
        {
            for (var i = 0; i < 16; i++)
            {
                if (primary.getDrumPad (i).solo)
                {
                    isSoloed = true;
                    break;
                }
            }
        }
        var isRecording = this.model.hasRecordingState ();
        for (var y = 0; y < 2; y++)
        {
            for (var x = 0; x < 8; x++)
            {
                var index = 8 * y + x;
                var color = this.getPadColor (index, primary, hasDrumPads, isSoloed, isRecording);
                if (y == 0)
                    this.surface.setButton (MKII_BUTTON_ROW4_1 + x, color);
                else
                    this.surface.setButton (MKII_BUTTON_ROW3_1 + x, color);
            }
        }
    }
    else
    {    
        // Paint the sequencer steps
        var step = this.clip.getCurrentStep ();
        var hiStep = this.isInXRange (step) ? step % PlayView.NUM_DISPLAY_COLS : -1;
        for (var col = 0; col < PlayView.NUM_DISPLAY_COLS; col++)
        {
            var isSet = this.clip.getStep (col, this.offsetY + this.selectedPad);
            var hilite = col == hiStep;
            var x = col % 8;
            var y = Math.floor (col / 8);
            var color = isSet ? MKII_BUTTON_STATE_ON : hilite ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF;
            if (y == 0)
                this.surface.setButton (MKII_BUTTON_ROW3_1 + x, color);
            else
                this.surface.setButton (MKII_BUTTON_ROW4_1 + x, color);
        }
    }
};

//--------------------------------------
// Drum Sequencer specific
//--------------------------------------

PlayView.prototype.clearPressedKeys = function ()
{
    for (var i = 0; i < 128; i++)
        this.pressedKeys[i] = 0;
};

PlayView.prototype.onSeqGridNote = function (note, velocity)
{
    if (!this.canSelectedTrackHoldNotes ())
        return;

    var index = note - 36;
   
    if (this.isPlayMode)
    {
        this.selectedPad = index;   // 0-16

        // Mark selected note
        this.pressedKeys[this.offsetY + this.selectedPad] = velocity;
        
        this.surface.sendMidiEvent (0x90, this.noteMap[note], velocity);
    }
    else
    {
        if (velocity != 0)
            this.clip.toggleStep (index < 8 ? index + 8 : index - 8, this.offsetY + this.selectedPad, Config.accentActive ? Config.fixedAccentValue : velocity);
    }
};

PlayView.prototype.updateNoteMapping = function ()
{
    this.noteMap = this.canSelectedTrackHoldNotes () && this.isPlayMode ? this.scales.getDrumMatrix () : this.scales.getEmptyMatrix ();
    this.surface.setKeyTranslationTable (this.noteMap);
};

PlayView.prototype.getPadColor = function (index, primary, hasDrumPads, isSoloed, isRecording)
{
    // Playing note?
    if (this.pressedKeys[this.offsetY + index] > 0)
        return MKII_BUTTON_STATE_ON;
    // Selected?
    if (this.selectedPad == index)
        return MKII_BUTTON_STATE_ON;
    // Exists and active?
    var drumPad = primary.getDrumPad (index);
    if (!drumPad.exists || !drumPad.activated)
        return MKII_BUTTON_STATE_OFF;
    // Muted or soloed?
    if (drumPad.mute || (isSoloed && !drumPad.solo))
        return MKII_BUTTON_STATE_OFF;
    return MKII_BUTTON_STATE_OFF;
};
