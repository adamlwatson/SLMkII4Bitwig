// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function TrackMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
TrackMode.prototype = new AbstractMode ();

TrackMode.prototype.updateDisplay = function ()
{
    var currentTrackBank = this.model.getCurrentTrackBank ();
    var t = currentTrackBank.getSelectedTrack ();
    var fxTrackBank = this.model.getEffectTrackBank ();
    var d = this.surface.getDisplay ();
    var isFX = currentTrackBank === fxTrackBank;
    
    if (t == null)
    {
        d.setRow (0, "                        Please select a track...                       ")
         .clearRow (2).done (2);
    }
    else
    {
        d.setCell (0, 0, "Volume", Display.FORMAT_RAW)
         .setCell (2, 0, t.volumeStr, Display.FORMAT_RAW)
         .setCell (0, 1, "Pan", Display.FORMAT_RAW)
         .setCell (2, 1, t.panStr, Display.FORMAT_RAW)
         .setCell (0, 2, "Crossfdr", Display.FORMAT_RAW)
         .setCell (2, 2, t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '       B' : '   <> '), Display.FORMAT_RAW);

        for (var i = 0; i < 5; i++)
        {
            var fxTrack = fxTrackBank.getTrack (i);
            var isEmpty = isFX || !fxTrack.exists;
            d.setCell (0, 3 + i, isEmpty ? "" : fxTrack.name, Display.FORMAT_RAW)
             .setCell (2, 3 + i, t.sends[i] ? t.sends[i].volumeStr : "", Display.FORMAT_RAW);
        }
        
        if (isFX)
            d.setCell (0, 7, t.name, Display.FORMAT_RAW);
        d.done (0).done (2);
    }
};
