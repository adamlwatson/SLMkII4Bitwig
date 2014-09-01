// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

FixedMode.CLIP_LENGTHS = [ '1 Beat', '2 Beats', '1 Bar', '2 Bars', '4 Bars', '8 Bars', '16 Bars', '32 Bars' ];

function FixedMode (model)
{
    AbstractMode.call (this, model);
}
FixedMode.prototype = new AbstractMode ();

FixedMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    d.clearRow (0).setBlock (0, 0, 'New Clip Length:').done (0);
    var tb = this.model.getCurrentTrackBank ();
    for (var i = 0; i < 8; i++)
        d.setCell (2, i, (tb.getNewClipLength () == i ? Display.RIGHT_ARROW : ' ') + FixedMode.CLIP_LENGTHS[i]);
    d.done (2);
};
