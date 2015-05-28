// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

var MKII_BUTTON_STATE_OFF = 0;
var MKII_BUTTON_STATE_ON  = 1;

var MKII_KNOB_ROW2_1      =  8;
var MKII_KNOB_ROW2_2      =  9;
var MKII_KNOB_ROW2_3      = 10;
var MKII_KNOB_ROW2_4      = 11;
var MKII_KNOB_ROW2_5      = 12;
var MKII_KNOB_ROW2_6      = 13;
var MKII_KNOB_ROW2_7      = 14;
var MKII_KNOB_ROW2_8      = 15;
var MKII_SLIDER1          = 16;
var MKII_SLIDER2          = 17;
var MKII_SLIDER3          = 18;
var MKII_SLIDER4          = 19;
var MKII_SLIDER5          = 20;
var MKII_SLIDER6          = 21;
var MKII_SLIDER7          = 22;
var MKII_SLIDER8          = 23;
var MKII_BUTTON_ROW1_1    = 24;
var MKII_BUTTON_ROW1_2    = 25;
var MKII_BUTTON_ROW1_3    = 26;
var MKII_BUTTON_ROW1_4    = 27;
var MKII_BUTTON_ROW1_5    = 28;
var MKII_BUTTON_ROW1_6    = 29;
var MKII_BUTTON_ROW1_7    = 30;
var MKII_BUTTON_ROW1_8    = 31;
var MKII_BUTTON_ROW2_1    = 32;
var MKII_BUTTON_ROW2_2    = 33;
var MKII_BUTTON_ROW2_3    = 34;
var MKII_BUTTON_ROW2_4    = 35;
var MKII_BUTTON_ROW2_5    = 36;
var MKII_BUTTON_ROW2_6    = 37;
var MKII_BUTTON_ROW2_7    = 38;
var MKII_BUTTON_ROW2_8    = 39;
var MKII_BUTTON_ROW3_1    = 40;
var MKII_BUTTON_ROW3_2    = 41;
var MKII_BUTTON_ROW3_3    = 42;
var MKII_BUTTON_ROW3_4    = 43;
var MKII_BUTTON_ROW3_5    = 44;
var MKII_BUTTON_ROW3_6    = 45;
var MKII_BUTTON_ROW3_7    = 46;
var MKII_BUTTON_ROW3_8    = 47;
var MKII_BUTTON_ROW4_1    = 48;
var MKII_BUTTON_ROW4_2    = 49;
var MKII_BUTTON_ROW4_3    = 50;
var MKII_BUTTON_ROW4_4    = 51;
var MKII_BUTTON_ROW4_5    = 52;
var MKII_BUTTON_ROW4_6    = 53;
var MKII_BUTTON_ROW4_7    = 54;
var MKII_BUTTON_ROW4_8    = 55;
var MKII_KNOB_ROW1_1      = 56;
var MKII_KNOB_ROW1_2      = 57;
var MKII_KNOB_ROW1_3      = 58;
var MKII_KNOB_ROW1_4      = 59;
var MKII_KNOB_ROW1_5      = 60;
var MKII_KNOB_ROW1_6      = 61;
var MKII_KNOB_ROW1_7      = 62;
var MKII_KNOB_ROW1_8      = 63;
var MKII_TOUCHPAD_X       = 68;     // This is also the crossfader on the Zero
var MKII_TOUCHPAD_Y       = 69;
var MKII_BUTTON_REWIND    = 72;
var MKII_BUTTON_FORWARD   = 73;
var MKII_BUTTON_STOP      = 74;
var MKII_BUTTON_PLAY      = 75;
var MKII_BUTTON_RECORD    = 76;
var MKII_BUTTON_LOOP      = 77;
var MKII_BUTTON_TRANSPORT = 79;
var MKII_BUTTON_ROWSEL1   = 80;
var MKII_BUTTON_ROWSEL2   = 81;
var MKII_BUTTON_ROWSEL3   = 82;
var MKII_BUTTON_ROWSEL4   = 83;
var MKII_BUTTON_ROWSEL5   = 84;
var MKII_BUTTON_ROWSEL6   = 85;
var MKII_BUTTON_ROWSEL7   = 86;
var MKII_BUTTON_ROWSEL8   = 87;
var MKII_BUTTON_P1_UP     = 88;     // Page left on the Zero
var MKII_BUTTON_P1_DOWN   = 89;     // Page right on the Zero
var MKII_BUTTON_P2_UP     = 90;     // Preview + Page left on the Zero
var MKII_BUTTON_P2_DOWN   = 91;     // Preview + Page right on the Zero


var MKI_BUTTON_TAP_TEMPO         = 94;
var MKI_BUTTON_TAP_TEMPO_VALUE   = 95;


// with the enhanced template, the drumpads emit cc 101-108
var ENH_DPAD_1         = 120;
var ENH_DPAD_2         = 121;
var ENH_DPAD_3         = 122;
var ENH_DPAD_4         = 123;
var ENH_DPAD_5         = 124;
var ENH_DPAD_6         = 125;
var ENH_DPAD_7         = 126;
var ENH_DPAD_8         = 127;


// the following is necessary to store the value of CC94
// since it comprises part of the temp value
var last_cc94_value        = 0


var MKI_BUTTONS_ALL =
[
    MKII_BUTTON_ROW1_1,
    MKII_BUTTON_ROW1_2,
    MKII_BUTTON_ROW1_3,
    MKII_BUTTON_ROW1_4,
    MKII_BUTTON_ROW1_5,
    MKII_BUTTON_ROW1_6,
    MKII_BUTTON_ROW1_7,
    MKII_BUTTON_ROW1_8,
    MKII_BUTTON_ROW2_1,
    MKII_BUTTON_ROW2_2,
    MKII_BUTTON_ROW2_3,
    MKII_BUTTON_ROW2_4,
    MKII_BUTTON_ROW2_5,
    MKII_BUTTON_ROW2_6,
    MKII_BUTTON_ROW2_7,
    MKII_BUTTON_ROW2_8,
    MKII_BUTTON_ROW3_1,
    MKII_BUTTON_ROW3_2,
    MKII_BUTTON_ROW3_3,
    MKII_BUTTON_ROW3_4,
    MKII_BUTTON_ROW3_5,
    MKII_BUTTON_ROW3_6,
    MKII_BUTTON_ROW3_7,
    MKII_BUTTON_ROW3_8,
    MKII_BUTTON_ROW4_1,
    MKII_BUTTON_ROW4_2,
    MKII_BUTTON_ROW4_3,
    MKII_BUTTON_ROW4_4,
    MKII_BUTTON_ROW4_5,
    MKII_BUTTON_ROW4_6,
    MKII_BUTTON_ROW4_7,
    MKII_BUTTON_ROW4_8,
    MKII_BUTTON_REWIND,
    MKII_BUTTON_FORWARD,
    MKII_BUTTON_STOP,
    MKII_BUTTON_PLAY, 
    MKII_BUTTON_LOOP, 
    MKII_BUTTON_RECORD,
    //MKII_BUTTON_TRANSPORT,
    MKII_BUTTON_ROWSEL1,
    MKII_BUTTON_ROWSEL2,
    MKII_BUTTON_ROWSEL3,
    MKII_BUTTON_ROWSEL4,
    MKII_BUTTON_ROWSEL5,
    MKII_BUTTON_ROWSEL6,
    MKII_BUTTON_ROWSEL7,
    MKII_BUTTON_ROWSEL8,
    MKII_BUTTON_P1_UP,
    MKII_BUTTON_P1_DOWN,
    MKII_BUTTON_P2_UP,
    MKII_BUTTON_P2_DOWN,
    
    // Enhanced Template Drum pads
    ENH_DPAD_1,
    ENH_DPAD_2,
    ENH_DPAD_3,
    ENH_DPAD_4,
    ENH_DPAD_5,
    ENH_DPAD_6,
    ENH_DPAD_7,
    ENH_DPAD_8
];


SLMkI.SYSEX_HEADER    = "F0 00 20 29 03 03 12 00 04 00 ";
SLMkI.SYSEX_AUTOMAP_ON  = SLMkI.SYSEX_HEADER + "01 01 F7";
SLMkI.SYSEX_AUTOMAP_OFF = SLMkI.SYSEX_HEADER + "01 00 F7";


function SLMkI (output, input)
{
    AbstractControlSurface.call (this, output, input, MKI_BUTTONS_ALL);

    var i = 0;
    for (i = 36; i <= 43; i++)
        this.gridNotes.push (i);
    
    this.controller_type = Config.REMOTE_SL_MKI

    this.buttonCCStates = initArray (-1, 128);
    this.display = new Display (output);
    
    // Switch to Ableton Automap mode
    this.output.sendSysex (SLMkI.SYSEX_AUTOMAP_ON);
    this.turnOffAllLEDs ();
    
    // Disable transport mode
    this.turnOffTransport ();

    // Set LED continuous mode
    for (i = 0; i < 8; i++)
        this.output.sendCC (0x78 + i, 0);
}
SLMkI.prototype = new AbstractControlSurface ();

SLMkI.prototype.setButton = function (button, state)
{
    if (this.buttonCCStates[button] == state)
        return;
    this.output.sendCC (button, state);
    this.buttonCCStates[button] = state;
};

SLMkI.prototype.shutdown = function ()
{
    this.display.clear ();
    this.turnOffAllLEDs ();
    this.output.sendSysex (SLMkI.SYSEX_AUTOMAP_OFF);
};

SLMkI.prototype.isSelectPressed = function ()
{
    return false;
};

SLMkI.prototype.isShiftPressed = function ()
{
    return this.isTransportActive;
};

// Note: Weird to send to the DAW via SLMKII...
SLMkI.prototype.sendMidiEvent = function (status, data1, data2)
{
    this.noteInput.sendRawMidiEvent (status, data1, data2);
};

//--------------------------------------
// Handlers
//--------------------------------------

SLMkI.prototype.handleEvent = function (cc, value)
{

    var view = this.getActiveView ();
    if (view == null)
        return;
 
    var event = this.isButton (cc) ? new ButtonEvent (this.buttonStates[cc]) : null;

    switch (cc)
    {
        case MKII_BUTTON_ROW1_1:
        case MKII_BUTTON_ROW1_2:
        case MKII_BUTTON_ROW1_3:
        case MKII_BUTTON_ROW1_4:
        case MKII_BUTTON_ROW1_5:
        case MKII_BUTTON_ROW1_6:
        case MKII_BUTTON_ROW1_7:
        case MKII_BUTTON_ROW1_8:
            view.onButtonRow1 (cc - MKII_BUTTON_ROW1_1, event);
            break;

        case MKII_KNOB_ROW1_1:
        case MKII_KNOB_ROW1_2:
        case MKII_KNOB_ROW1_3:
        case MKII_KNOB_ROW1_4:
        case MKII_KNOB_ROW1_5:
        case MKII_KNOB_ROW1_6:
        case MKII_KNOB_ROW1_7:
        case MKII_KNOB_ROW1_8:
            view.onKnobRow1 (cc - MKII_KNOB_ROW1_1, value);
            break;
            
        case MKII_BUTTON_ROW2_1:
        case MKII_BUTTON_ROW2_2:
        case MKII_BUTTON_ROW2_3:
        case MKII_BUTTON_ROW2_4:
        case MKII_BUTTON_ROW2_5:
        case MKII_BUTTON_ROW2_6:
        case MKII_BUTTON_ROW2_7:
        case MKII_BUTTON_ROW2_8:
            view.onButtonRow2 (cc - MKII_BUTTON_ROW2_1, event);
            break;

        case MKII_KNOB_ROW2_1:
        case MKII_KNOB_ROW2_2:
        case MKII_KNOB_ROW2_3:
        case MKII_KNOB_ROW2_4:
        case MKII_KNOB_ROW2_5:
        case MKII_KNOB_ROW2_6:
        case MKII_KNOB_ROW2_7:
        case MKII_KNOB_ROW2_8:
            view.onKnobRow2 (cc - MKII_KNOB_ROW2_1, value);
            break;
            
        case MKII_SLIDER1:
        case MKII_SLIDER2:
        case MKII_SLIDER3:
        case MKII_SLIDER4:
        case MKII_SLIDER5:
        case MKII_SLIDER6:
        case MKII_SLIDER7:
        case MKII_SLIDER8:
            view.onSlider (cc - MKII_SLIDER1, value);
            break;

        case MKII_BUTTON_ROW3_1:
        case MKII_BUTTON_ROW3_2:
        case MKII_BUTTON_ROW3_3:
        case MKII_BUTTON_ROW3_4:
        case MKII_BUTTON_ROW3_5:
        case MKII_BUTTON_ROW3_6:
        case MKII_BUTTON_ROW3_7:
        case MKII_BUTTON_ROW3_8:
            view.onButtonRow3 (cc - MKII_BUTTON_ROW3_1, event);
            break;

        case MKII_BUTTON_ROW4_1:
        case MKII_BUTTON_ROW4_2:
        case MKII_BUTTON_ROW4_3:
        case MKII_BUTTON_ROW4_4:
        case MKII_BUTTON_ROW4_5:
        case MKII_BUTTON_ROW4_6:
        case MKII_BUTTON_ROW4_7:
        case MKII_BUTTON_ROW4_8:
            view.onButtonRow4 (cc - MKII_BUTTON_ROW4_1, event);
            break;

        //////////////////////////
        // Row selections
        //////////////////////////
    
        // 1st button row
        case MKII_BUTTON_ROWSEL1:
            if (value > 0)
                view.onButtonRow1Select ();
            break;
            
        // 1st knob row
        case MKII_BUTTON_ROWSEL2:
            if (value > 0)
                view.onKnobRow1Select ();
            break;
            
        // 2nd button row
        case MKII_BUTTON_ROWSEL3:
            if (value > 0)
                view.onButtonRow2Select ();
            break;
            
        // 2nd knob row
        case MKII_BUTTON_ROWSEL4:
            if (value > 0)
                view.onKnobRow2Select ();
            break;
            
        // Drum pad row
        case MKII_BUTTON_ROWSEL5:
            if (value > 0)
                view.onDrumPadRowSelect ( value );
            break;
            
        // Slider row
        case MKII_BUTTON_ROWSEL6:
            if (value > 0)
                view.onSliderRowSelect ();
            break;
            
        // 3rd button row
        case MKII_BUTTON_ROWSEL7:
            if (value > 0)
                view.onButtonRow3Select ();
            break;
            
        // 4th button row
        case MKII_BUTTON_ROWSEL8:
            if (value > 0)
                view.onButtonRow4Select ();
            break;
            
        case MKII_BUTTON_P1_UP:
            view.onButtonP1 (true /* Up */, event);
            break;
            
        case MKII_BUTTON_P1_DOWN:
            view.onButtonP1 (false /* Down */, event);
            break;
            
        case MKII_BUTTON_P2_UP:
            view.onButtonP2 (true /* Up */, event);
            break;
            
        case MKII_BUTTON_P2_DOWN:
            view.onButtonP2 (false /* Down */, event);
            break;
            
        //////////////////////////
        // Tap Tempo
        //////////////////////////

        case MKI_BUTTON_TAP_TEMPO:
            last_cc94_value = value;
            break;

        case MKI_BUTTON_TAP_TEMPO_VALUE:
            iter = last_cc94_value;
            tempo = 0
            while ( iter > 0 ) {
                tempo += 128;
                iter--;
            }
            tempo += value;
            view.onTempoMKI( tempo );
            break;

        case ENH_DPAD_1:
        case ENH_DPAD_2:
        case ENH_DPAD_3:
        case ENH_DPAD_4:
        case ENH_DPAD_5:
        case ENH_DPAD_6:
        case ENH_DPAD_7:
        case ENH_DPAD_8:
            view.onDrumPad (cc - ENH_DPAD_1, event);
            break;

        //////////////////////////
        // Transport
        //////////////////////////

        case MKII_BUTTON_REWIND:
            view.onRewind (event);
            break;

        case MKII_BUTTON_FORWARD:
            view.onForward (event);
            break;

        case MKII_BUTTON_PLAY:
            view.onPlay (event);
            break;

        case MKII_BUTTON_STOP:
            view.onStop (event);
            break;
            
        case MKII_BUTTON_RECORD:
            view.onRecord (event);
            break;
            
        case MKII_BUTTON_LOOP:
            view.onLoop (event);
            break;
            
        //////////////////////////
        // On-/Offline
        //////////////////////////
        
        case 0x6B:
            // Not used
            break;

        //////////////////////////
        // Touchpad
        //////////////////////////
        
        case MKII_TOUCHPAD_X:
            view.onTouchpadX (value);
            break;

        case MKII_TOUCHPAD_Y:
            view.onTouchpadY (value);
            break;
            
        default:
            println ("Unused Midi CC: " + cc);
            break;
    }

};

SLMkI.prototype.turnOffAllLEDs = function ()
{
    this.output.sendCC (78, 127);
    for (var i = 0; i < 128; i++)
        this.buttonCCStates[i] = -1;
};

SLMkI.prototype.turnOffTransport = function ()
{
    this.isTransportActive = false;
    this.output.sendCC (MKII_BUTTON_TRANSPORT, 0);
};