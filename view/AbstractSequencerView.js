// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function AbstractSequencerView (model, rows, cols)
{
    if (!model) // Called on first prototype creation
        return;
    
    AbstractView.call (this, model);

    this.resolutions = [ 1, 2/3, 1/2, 1/3, 1/4, 1/6, 1/8, 1/12 ];
    this.resolutionNames = [ '1/4', '1/4t', '1/8', '1/8t', '1/16', '1/16t', '1/32', '1/32t' ];
    this.selectedIndex = 4;
    this.scales = model.getScales ();

    this.offsetX = 0;
    this.offsetY = 0;

    this.clip = this.model.createCursorClip (cols, rows);
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
}
AbstractSequencerView.prototype = new AbstractView ();

AbstractSequencerView.prototype.changeScrollPosition = function (value)
{
    var isInc = value >= 65;
    if (isInc)
    {
        this.offsetX = this.offsetX + this.clip.getStepSize ();
        this.clip.scrollStepsPageForward ();
    }
    else
    {
        var newOffset = this.offsetX - this.clip.getStepSize ();
        if (newOffset < 0)
            this.offsetX = 0;
        else
        {
            this.offsetX = newOffset;
            this.clip.scrollStepsPageBackwards ();
        }
    }
};

AbstractSequencerView.prototype.changeResolution = function (value)
{
    var isInc = value >= 65;
    this.selectedIndex = Math.max (0, (Math.min (this.resolutions.length - 1, isInc ? (this.selectedIndex + 1) : (this.selectedIndex - 1))));
    this.clip.setStepLength (this.resolutions[this.selectedIndex]);
};

AbstractSequencerView.prototype.isInXRange = function (x)
{
    return x >= this.offsetX && x < this.offsetX + this.clip.getStepSize ();
};
