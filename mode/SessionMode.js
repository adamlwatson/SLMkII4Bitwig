// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function SessionMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
SessionMode.prototype = new AbstractMode ();

SessionMode.prototype.updateDisplay = function ()
{
    var d = this.surface.getDisplay ();
    var sceneBank = this.model.getSceneBank ();
    for (var i = 0; i < 8; i++)
    {
        var scene = sceneBank.getScene (i);
        d.setCell (2, i, scene.name == '' ? ('Scene ' + (i + 1)) : scene.name, Display.FORMAT_RAW);
    }
    d.clearRow (0).done (0).done (2);
};
