// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function VolumeMode (model)
{
    AbstractMode.call (this, model);
}
VolumeMode.prototype = new AbstractMode ();

VolumeMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();

    var tb = this.model.getCurrentTrackBank ();
    var selTrack = tb.getSelectedTrack ();
    var selIndex = selTrack == null ? -1 : selTrack.index;

    for (var i = 0; i < 8; i++)
    {
        var t = tb.getTrack (i);
        var isSel = i == selIndex;
        var n = optimizeName (t.name, isSel ? 7 : 8);
        d.setCell (1, i, isSel ? Display.RIGHT_ARROW + n : n, Display.FORMAT_RAW)
         .setCell (3, i, t.volumeStr, Display.FORMAT_RAW);
    }
    d.done (1).done (3);
};
