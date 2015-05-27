// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function MkIMidiInput ()
{
    MidiInput.call (this);
}

MkIMidiInput.prototype = new MidiInput ();

MkIMidiInput.prototype.createNoteInput = function ()
{
    var noteInput = this.port.createNoteInput ("Novation SL MkI (Automap)");
    noteInput.setShouldConsumeEvents (false);
    return noteInput;
};
