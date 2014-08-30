// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MkIIMidiInput ()
{
    MidiInput.call (this);
}

MkIIMidiInput.prototype = new MidiInput ();

MkIIMidiInput.prototype.createNoteInput = function ()
{
    var noteInput = this.port.createNoteInput ("Novation SL MkII (Automap)");
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};
