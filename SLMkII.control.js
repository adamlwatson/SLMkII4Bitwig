// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);

load ("Config.js");
load ("framework/ClassLoader.js");
load ("mkii/ClassLoader.js");
load ("view/ClassLoader.js");
load ("mode/ClassLoader.js");
load ("Controller.js");

// This is the only global variable, do not use it.
var controller = null;

host.defineController ("Novation", "SLMkII", "1.0", "D1CEE920-1E51-11E4-8C21-0800200C9A66");
host.defineMidiPorts (2, 1);

host.platformIsWindows () && host.addDeviceNameBasedDiscoveryPair (["MIDIIN2 (SL MkII)", "SL MkII"], ["MIDIOUT2 (SL MkII)"]);
host.platformIsMac () && host.addDeviceNameBasedDiscoveryPair (["MIDIIN2 (SL MkII)", "SL MkII"], ["MIDIOUT2 (SL MkII)"]);
host.platformIsLinux () && host.addDeviceNameBasedDiscoveryPair (["SL MkII MIDI 2", "SL MkII MIDI 1"], ["SL MkII MIDI 2"]);

function init ()
{
    controller = new Controller ();
    println ("Initialized.");
}

function exit ()
{
    if (controller)
        controller.shutdown ();
}

function flush ()
{
    if (controller)
        controller.flush ();
}
