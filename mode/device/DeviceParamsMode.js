// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceParamsMode (model)
{
    AbstractDeviceMode.call (this, model);
}
DeviceParamsMode.prototype = new AbstractDeviceMode ();

DeviceParamsMode.prototype.hasPreviousPage = function ()
{
    return this.model.getCursorDevice ().hasPreviousParameterPage ();
};

DeviceParamsMode.prototype.hasNextPage = function ()
{
    return this.model.getCursorDevice ().hasNextParameterPage ();
};

DeviceParamsMode.prototype.previousPage = function ()
{
    this.model.getCursorDevice ().previousParameterPage ();
};

DeviceParamsMode.prototype.nextPage = function ()
{
    this.model.getCursorDevice ().nextParameterPage ();
};

DeviceParamsMode.prototype.getParameterValues = function (index)
{
    return this.model.getCursorDevice ().getFXParam (index);
};

DeviceParamsMode.prototype.getParameter = function (index)
{
    return this.model.getCursorDevice ().getParameter (index);
};
