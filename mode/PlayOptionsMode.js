// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function PlayOptionsMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
PlayOptionsMode.prototype = new AbstractMode ();

PlayOptionsMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clearRow (2)
     .setCell (2, 0, 'Oct Down', Display.FORMAT_RAW)
     .setCell (2, 1, ' Oct Up', Display.FORMAT_RAW)
     .setCell (2, 2, 'Res Down', Display.FORMAT_RAW)
     .setCell (2, 3, ' Res Up', Display.FORMAT_RAW)
     .setCell (2, 4, '  Left', Display.FORMAT_RAW)
     .setCell (2, 5, '  Right', Display.FORMAT_RAW)
     .setCell (2, 7, 'Play/Seq', Display.FORMAT_RAW)
     .clearRow (0).done (0).done (2);
};
