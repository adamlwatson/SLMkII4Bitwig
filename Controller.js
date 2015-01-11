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

    this.scales = new Scales (36, 52, 8, 2);
    this.model = new Model (0, this.scales);
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
    this.surface.addMode (MODE_TRACK_TOGGLES, new TrackTogglesMode (this.model));
    this.surface.addMode (MODE_FUNCTIONS, new FunctionMode (this.model));
    this.surface.addMode (MODE_FIXED, new FixedMode (this.model));
    this.surface.addMode (MODE_MASTER, new MasterMode (this.model));
    this.surface.addMode (MODE_FRAME, new FrameMode (this.model));
    this.surface.addMode (MODE_VIEW_SELECT, new ViewSelectMode (this.model));
    
    this.surface.addMode (MODE_DEVICE_PARAMS, new DeviceParamsMode (this.model));
    this.surface.addMode (MODE_DEVICE_COMMON, new DeviceCommonMode (this.model));
    this.surface.addMode (MODE_DEVICE_ENVELOPE, new DeviceEnvelopeMode (this.model));
    this.surface.addMode (MODE_DEVICE_MACRO, new DeviceMacroMode (this.model));
    this.surface.addMode (MODE_DEVICE_MODULATE, new DeviceModulationMode (this.model));
    this.surface.addMode (MODE_DEVICE_USER, new DeviceUserMode (this.model));
    this.surface.addMode (MODE_DEVICE_DIRECT, new DeviceDirectMode (this.model, MODE_DEVICE_DIRECT, 'Direct'));
    this.surface.addMode (MODE_DEVICE_PRESETS, new DevicePresetsMode (this.model));
    
    this.surface.addMode (MODE_SESSION, new SessionMode (this.model));
    this.surface.addMode (MODE_PLAY_OPTIONS, new PlayOptionsMode (this.model));
    
    this.surface.addModeListener (doObject (this, function (oldMode, newMode)
    {
        this.updateMode (-1);
        this.updateMode (newMode);
    }));

    this.surface.addView (VIEW_CONTROL, new ControlView (this.model));
    this.surface.addView (VIEW_PLAY, new PlayView (this.model));

    // Initialise 2nd display
    this.surface.getMode (MODE_VOLUME).updateDisplay ();

    this.surface.setActiveView (VIEW_CONTROL);
    this.surface.setActiveMode (MODE_TRACK);
}
Controller.prototype = new AbstractController ();

Controller.prototype.updateMode = function (mode)
{
    if (this.surface.isTransportActive && mode != -1 && mode != MODE_VIEW_SELECT)
        this.surface.turnOffTransport ();
    
    this.updateIndication (mode);
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

Scales.DRUM_NOTE_END = 52;
Scales.DRUM_MATRIX =
[
    0,   1,  2,  3,  4,  5,  6,  7,
    8,   9, 10, 11, 12, 13, 14, 15,
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1, 
    -1, -1, -1, -1, -1, -1, -1, -1
];
