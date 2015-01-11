// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function ViewSelectMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
ViewSelectMode.prototype = new AbstractMode ();

ViewSelectMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    for (var i = 0; i < 2; i++)
    {
        d.clear (0 + i).setBlock (0 + i, 0, 'Select mode:').done (0 + i)
         .clear (2 + i)
         .setCell (2 + i, 0, (this.surface.isActiveView (VIEW_CONTROL) ? Display.RIGHT_ARROW : ' ') + 'Control')
         .setCell (2 + i, 1, ' ' + (this.surface.isActiveView (VIEW_PLAY) ? Display.RIGHT_ARROW : ' ') + 'Play')
         .done (2 + i);
    }
};
