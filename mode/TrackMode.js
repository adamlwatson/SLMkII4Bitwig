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
    var d = this.surface.getDisplay ();
    
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
         .setCell (2, 1, t.panStr, Display.FORMAT_RAW);
         
        var sendStart = 2;
        var sendCount = 5;
        if (Config.displayCrossfader)
        {
            sendStart = 3;
            sendCount = 6;
            d.setCell (0, 2, "Crossfdr", Display.FORMAT_RAW)
             .setCell (2, 2, t.crossfadeMode == 'A' ? 'A' : (t.crossfadeMode == 'B' ? '       B' : '   <> '), Display.FORMAT_RAW);
        }

        var fxTrackBank = this.model.getEffectTrackBank ();
        if (fxTrackBank != null)
        {
            var isFX = currentTrackBank === fxTrackBank;
            for (var i = 0; i < sendCount; i++)
            {
                var fxTrack = fxTrackBank.getTrack (i);
                var isEmpty = isFX || !fxTrack.exists;
                var pos = sendStart + i;
                d.setCell (0, pos, isEmpty ? "" : fxTrack.name, Display.FORMAT_RAW)
                 .setCell (2, pos, isEmpty ? "" : t.sends[i].volumeStr, Display.FORMAT_RAW);
            }
        
            if (isFX)
                d.setCell (0, 7, t.name, Display.FORMAT_RAW);
        }
        else
        {
            for (var i = 0; i < sendCount; i++)
            {
                var pos = sendStart + i;
                d.setCell (0, pos, t.sends[i].name, Display.FORMAT_RAW)
                 .setCell (2, pos, t.sends[i].volumeStr, Display.FORMAT_RAW)
            }
        }
        d.done (0).done (2);
    }
};
