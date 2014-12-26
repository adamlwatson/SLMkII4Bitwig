// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

AbstractDeviceFixedMode.FIXED_BANKS_NAMES = [ 'Common', 'Envelope', 'Modulate', 'Macro', 'User' ];
AbstractDeviceFixedMode.FIXED_BANKS = [ MODE_DEVICE_COMMON, MODE_DEVICE_ENVELOPE, MODE_DEVICE_MODULATE, MODE_DEVICE_MACRO, MODE_DEVICE_USER ];


function AbstractDeviceFixedMode (model, mode)
{
    AbstractDeviceMode.call (this, model);
    this.id = mode;
    this.page = -1;
    for (var i = 0; i < AbstractDeviceFixedMode.FIXED_BANKS.length; i++)
    {
        if (mode == AbstractDeviceFixedMode.FIXED_BANKS[i])
        {
            this.page = i;
            break;
        }
    }
}
AbstractDeviceFixedMode.prototype = new AbstractDeviceMode ();

AbstractDeviceFixedMode.prototype.hasPreviousPage = function ()
{
    return this.page > 0;
};

AbstractDeviceFixedMode.prototype.hasNextPage = function ()
{
    return this.page < AbstractDeviceFixedMode.FIXED_BANKS.length - 1;
};
    
AbstractDeviceFixedMode.prototype.previousPage = function ()
{
    if (!this.hasPreviousPage ())
        return;
    this.surface.setPendingMode (AbstractDeviceFixedMode.FIXED_BANKS[this.page - 1]);
    displayNotification (AbstractDeviceFixedMode.FIXED_BANKS_NAMES[this.page - 1]);
};

AbstractDeviceFixedMode.prototype.nextPage = function ()
{
    if (!this.hasNextPage ())
        return;
    this.surface.setPendingMode (AbstractDeviceFixedMode.FIXED_BANKS[this.page + 1]);
    displayNotification (AbstractDeviceFixedMode.FIXED_BANKS_NAMES[this.page + 1]);
};
