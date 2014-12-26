// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function DeviceMacroMode (model)
{
    AbstractDeviceFixedMode.call (this, model, MODE_DEVICE_MACRO);
}
DeviceMacroMode.prototype = new AbstractDeviceFixedMode ();

DeviceMacroMode.prototype.getParameterValues = function (index)
{
    return this.model.getCursorDevice ().getMacroParam (index);
};

DeviceMacroMode.prototype.getParameter = function (index)
{
    return this.model.getCursorDevice ().getMacro (index).getAmount ();
};
