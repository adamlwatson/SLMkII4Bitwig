// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

// The base class for all device editing modes
function AbstractDeviceMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
}
AbstractDeviceMode.prototype = new AbstractMode ();

// Abstract functions
AbstractDeviceMode.prototype.hasPreviousPage = function () { return false; };
AbstractDeviceMode.prototype.hasNextPage = function () { return false; };
AbstractDeviceMode.prototype.previousPage = function () {};
AbstractDeviceMode.prototype.nextPage = function () {};
AbstractDeviceMode.prototype.getParameterValues = function (index) {};
AbstractDeviceMode.prototype.getParameter = function (index) {};

AbstractDeviceMode.prototype.updateDisplay = function () 
{
    var d = this.surface.getDisplay ();
    d.clearRow (2);
    
    if (this.model.hasSelectedDevice ())
    {
        d.clearRow (0);
        for (var i = 0; i < 8; i++)
        {
            var p = this.getParameterValues (i);
            if (p.name.length > 0)
            {
                d.setCell (0, i, p.name, Display.FORMAT_RAW)
                 .setCell (2, i, p.valueStr, Display.FORMAT_RAW);
            }
        }
        d.done (0);
    }
    else
        d.setRow (0, '                       Please select a device...                       ');
    d.done (2);
};

AbstractDeviceMode.prototype.onValueKnob = function (index, value)
{
    var v = this.surface.changeValue (value, this.getParameterValues (index).value);
    this.getParameter (index).set (v, Config.maxParameterValue);
};

AbstractDeviceMode.prototype.setLEDs = function ()
{
    var hasDevice = this.model.hasSelectedDevice ();
    for (var i = 0; i < 8; i++)
    {
        var value = hasDevice ? this.getParameterValues (i).value : 0;
        if (this.id == MODE_DEVICE_MODULATE)
            value = value ? 127 : 0;
        else
            value = Math.min (Math.round ((value * 11) / 127), 11);
        this.surface.output.sendCC (0x70 + i, value);
    }
};
