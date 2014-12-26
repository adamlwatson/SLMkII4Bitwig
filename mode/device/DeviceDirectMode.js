// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceDirectMode (model)
{
    AbstractMode.call (this, model);
    this.id = MODE_DEVICE_DIRECT;

    this.emptyParameter = { name: '', valueStr: '', value: '' };
    this.currentPage = 0;
}
DeviceDirectMode.prototype = new AbstractDeviceMode ();

DeviceDirectMode.prototype.hasPreviousPage = function ()
{
    return this.model.getCursorDevice ().getDirectParameters ().length > 0 && this.currentPage > 0;
};

DeviceDirectMode.prototype.hasNextPage = function ()
{
    var params = this.model.getCursorDevice ().getDirectParameters ();
    return params.length > 0 && this.currentPage < Math.floor (params.length / 8) + (params.length % 8 > 0 ? 1 : 0) - 1;
};

DeviceDirectMode.prototype.previousPage = function ()
{
    var cd = this.model.getCursorDevice ();
    var params = cd.getDirectParameters ();
    if (params.length != 0)
        this.currentPage = Math.max (this.currentPage - 1, 0);
};

DeviceDirectMode.prototype.nextPage = function ()
{
    var cd = this.model.getCursorDevice ();
    var params = cd.getDirectParameters ();
    if (params.length != 0)
        this.currentPage = Math.min (this.currentPage + 1, Math.floor (params.length / 8) + (params.length % 8 > 0 ? 1 : 0) - 1);
};

DeviceDirectMode.prototype.getParameterValues = function (index)
{
    var params = this.model.getCursorDevice ().getDirectParameters ();
    var pageOffset = this.currentPage * 8;
    if (pageOffset >= params.length)
    {
        pageOffset = 0;
        this.currentPage = 0;
    }
    return pageOffset + index >= params.length ? this.emptyParameter : params[pageOffset + index];
};

DeviceDirectMode.prototype.onValueKnob = function (index, value)
{
    var cd = this.model.getCursorDevice ();
    var params = cd.getDirectParameters ();
    var pos = this.currentPage * 8 + index;
    if (pos < params.length)
        cd.changeDirectParameter (pos, value, this.surface.getFractionValue ());
};
