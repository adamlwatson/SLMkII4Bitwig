// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

MasterMode.PARAM_NAMES = 'Volume   Pan                                                     Master ';

function MasterMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
MasterMode.prototype = new AbstractMode ();

MasterMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var master = this.model.getMasterTrack ();
    
    d.setRow (0, MasterMode.PARAM_NAMES)
     .clearRow (2)
     .setCell (2, 0, master.getVolumeString (), Display.FORMAT_RAW)
     .setCell (2, 1, master.getPanString (), Display.FORMAT_RAW)
     .done (2);
};
