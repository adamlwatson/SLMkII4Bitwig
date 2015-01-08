// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function Controller ()
{
    Config.init ();

    var output = new MidiOutput ();
    var input = new MkIIMidiInput ();
    this.keysInput = new MkIIMidiInputKeys ();
    this.keysInput.init ();
    this.keysNoteInput = this.keysInput.createNoteInput ();

    this.model = new Model (0);
    this.model.getTrackBank ().addTrackSelectionListener (doObject (this, function (index, isSelected)
    {
        if (isSelected && this.surface.isActiveMode (MODE_MASTER))
            this.surface.setPendingMode (MODE_TRACK);
    }));
    this.model.getMasterTrack ().addTrackSelectionListener (doObject (this, function (isSelected)
    {
        this.surface.setPendingMode (isSelected ? MODE_MASTER : this.surface.getPreviousMode ());
    }));
    
    this.surface = new SLMkII (output, input);
    this.surface.setDefaultMode (MODE_TRACK);

    this.surface.addMode (MODE_TRACK, new TrackMode (this.model));
    var volumeMode = new VolumeMode (this.model);
    this.surface.addMode (MODE_VOLUME, volumeMode);
    this.surface.addMode (MODE_SELECT, volumeMode);
    this.surface.addMode (MODE_TRACK_TOGGLES, new TrackTogglesMode (this.model));
    this.surface.addMode (MODE_FUNCTIONS, new FunctionMode (this.model));
    this.surface.addMode (MODE_FIXED, new FixedMode (this.model));
    this.surface.addMode (MODE_MASTER, new MasterMode (this.model));
    this.surface.addMode (MODE_FRAME, new FrameMode (this.model));
    
    this.surface.addMode (MODE_DEVICE_PARAMS, new DeviceParamsMode (this.model));
    this.surface.addMode (MODE_DEVICE_COMMON, new DeviceCommonMode (this.model));
    this.surface.addMode (MODE_DEVICE_ENVELOPE, new DeviceEnvelopeMode (this.model));
    this.surface.addMode (MODE_DEVICE_MACRO, new DeviceMacroMode (this.model));
    this.surface.addMode (MODE_DEVICE_MODULATE, new DeviceModulationMode (this.model));
    this.surface.addMode (MODE_DEVICE_USER, new DeviceUserMode (this.model));
    this.surface.addMode (MODE_DEVICE_DIRECT, new DeviceDirectMode (this.model, MODE_DEVICE_DIRECT, 'Direct'));
    this.surface.addMode (MODE_DEVICE_PRESETS, new DevicePresetsMode (this.model));
    

    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));

    this.surface.addView (VIEW_CONTROL, new ControlView (this.model));

    // Initialise 2nd display
    this.surface.getMode (MODE_VOLUME).updateDisplay ();

    this.surface.setActiveView (VIEW_CONTROL);
    this.surface.setActiveMode (MODE_TRACK);
}
Controller.prototype = new AbstractController ();

Controller.prototype.flush = function ()
{
    AbstractController.prototype.flush.call (this);

    // Transport buttons
    var t = this.model.getTransport ();
    this.surface.setButton (MKII_BUTTON_ROW4_3, this.surface.isTransportActive && !t.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_4, this.surface.isTransportActive && t.isPlaying ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_5, this.surface.isTransportActive && t.isLooping ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROW4_6, this.surface.isTransportActive && t.isRecording ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
};

Controller.prototype.updateMode = function (mode)
{
    var isTrack        = mode == MODE_TRACK;
    var isTrackToggles = mode == MODE_TRACK_TOGGLES;
    var isVolume       = mode == MODE_VOLUME;
    var isSelect       = mode == MODE_SELECT;
    var isFunctions    = mode == MODE_FUNCTIONS;
    var isMaster       = mode == MODE_MASTER;
    var isFixed        = mode == MODE_FIXED;
    var isFrame        = mode == MODE_FRAME;
    var isPreset       = mode == MODE_DEVICE_PRESETS;
    var isDevice       = mode >= MODE_DEVICE_PARAMS && mode <= MODE_DEVICE_DIRECT;

    this.updateIndication (mode);

    this.surface.setButton (MKII_BUTTON_ROWSEL1, isFunctions || isFixed ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL2, isDevice ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL3, isTrackToggles || isFrame || isPreset ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL4, isTrack || isMaster ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL6, isVolume ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
    this.surface.setButton (MKII_BUTTON_ROWSEL7, isSelect ? MKII_BUTTON_STATE_ON : MKII_BUTTON_STATE_OFF);
};

Controller.prototype.updateIndication = function (mode)
{
    var mt = this.model.getMasterTrack ();
    mt.setVolumeIndication (mode == MODE_MASTER);
    mt.setPanIndication (mode == MODE_MASTER);

    var isVolume = mode == MODE_VOLUME;
    
    var tb = this.model.getCurrentTrackBank ();
    var selectedTrack = tb.getSelectedTrack ();
    for (var i = 0; i < 8; i++)
    {
        var hasTrackSel = selectedTrack != null && selectedTrack.index == i && mode == MODE_TRACK;
        tb.setVolumeIndication (i, isVolume || hasTrackSel);
        tb.setPanIndication (i, hasTrackSel);
        for (var j = 0; j < 6; j++)
            tb.setSendIndication (i, j, hasTrackSel);

        var cd = this.model.getCursorDevice ();
        cd.getParameter (i).setIndication (mode == MODE_DEVICE_PARAMS);
        cd.getCommonParameter (i).setIndication (mode == MODE_DEVICE_COMMON);
        cd.getEnvelopeParameter (i).setIndication (mode == MODE_DEVICE_ENVELOPE);
        cd.getMacro (i).getAmount ().setIndication (mode == MODE_DEVICE_MACRO);

        var uc = this.model.getUserControlBank ();
        uc.getControl (i).setIndication (mode == MODE_DEVICE_USER);
    }
};
