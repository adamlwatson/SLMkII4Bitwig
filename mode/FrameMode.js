// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

function FrameMode (model)
{
    AbstractMode.call (this, model);
    this.isTemporary = false;
    this.bottomItems = [];
}
FrameMode.prototype = new AbstractMode ();

FrameMode.prototype.attachTo = function (surface)
{
    AbstractMode.prototype.attachTo.call (this, surface);

    this.addFirstRowCommand ('Arrange ', doObject (this, function () { this.model.getApplication ().setPanelLayout ('ARRANGE'); }));
    this.addFirstRowCommand ('  Mix   ', doObject (this, function () { this.model.getApplication ().setPanelLayout ('MIX'); }));
    this.addFirstRowCommand ('  Edit  ', doObject (this, function () { this.model.getApplication ().setPanelLayout ('EDIT'); }));
    this.addFirstRowCommand ('NoteEdit', doObject (this, function () { this.model.getApplication ().toggleNoteEditor (); }));
    this.addFirstRowCommand ('Automate', doObject (this, function () { this.model.getApplication ().toggleAutomationEditor (); }));
    this.addFirstRowCommand (' Device ', doObject (this, function () { this.model.getApplication ().toggleDevices (); }));
    this.addFirstRowCommand ('  Mixer ', doObject (this, function () { this.model.getApplication ().toggleMixer (); }));
    this.addFirstRowCommand ('   Full ', doObject (this, function () { this.model.getApplication ().toggleFullScreen (); }));
};

FrameMode.prototype.executeCommand = function (index) 
{
    this.bottomItems[index].execute ();
};

FrameMode.prototype.updateDisplay = function () 
{
    var d = this.surface.getDisplay ();

    d.clear ().setBlock (0, 0, "Layouts:").setCell (0, 3, "Panels:");
    
    for (var i = 0; i < this.bottomItems.length; i++)
        d.setCell (2, i, this.bottomItems[i].getLabel ());
    d.done (0).done (2);
};

FrameMode.prototype.addFirstRowCommand = function (label, command)
{
    this.bottomItems.push (new FrameToggleCommand (label, command));
};

function FrameToggleCommand (label, command)
{
    this.label = label;
    this.command = command;
}

FrameToggleCommand.prototype.getLabel = function ()
{
    return this.label;
};

FrameToggleCommand.prototype.execute = function ()
{
    this.command.call (this);
};
