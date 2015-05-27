// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MkIIMidiInputKeys ()
{
    MidiInput.call (this);
}

MkIIMidiInputKeys.prototype = new MidiInput ();

MkIIMidiInputKeys.prototype.init = function ()
{
    this.port = host.getMidiInPort (1);
};

MkIIMidiInputKeys.prototype.createNoteInput = function ()
{
    var noteInput = this.port.createNoteInput ("Novation SL MkII", 
                                               "80????", 
                                               "90????", 
                                               "B0????",  // CCs
                                               "D0????",  // Channel Aftertouch
                                               "E0????"   // Pitchbend
                                               );
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};
