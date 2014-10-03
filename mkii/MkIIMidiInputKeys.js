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
    var noteInput = this.port.createNoteInput ("Novation SL MkII", "80????", "90????", "E0????" /* Pitchbend */, "B0????" /* Sustainpedal */);
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};
