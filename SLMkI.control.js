// Written by Jürgen Moßgraber - mossgrabers.de
// (c) 2014
// Licensed under LGPLv3 - http://www.gnu.org/licenses/lgpl-3.0.txt

loadAPI (1);

load ("Config.js");
load ("framework/ClassLoader.js");
load ("mki/ClassLoader.js");
load ("view/ClassLoader.js");
load ("mode/ClassLoader.js");
load ("Controller.js");

// This is the only global variable, do not use it.
var controller = null;

host.defineController ("Novation", "SLMkI", "2.02", "a9041f50-0407-11e5-b939-0800200c9a66", "Jürgen Moßgraber");
host.defineMidiPorts (2, 1);

host.platformIsWindows () && host.addDeviceNameBasedDiscoveryPair (["ReMOTE SL Port 2", "ReMOTE SL Port 1"], ["ReMOTE SL Port 2"]);
host.platformIsMac () && host.addDeviceNameBasedDiscoveryPair (["ReMOTE SL Port 2", "ReMOTE SL Port 1"], ["ReMOTE SL Port 2"]);
host.platformIsLinux () && host.addDeviceNameBasedDiscoveryPair (["ReMOTE SL Port 2", "ReMOTE SL Port 1"], ["ReMOTE SL Port 2"]);

function init ()
{
    controller = new Controller ( Config.REMOTE_SL_MKI );
    println ("Initialized " + Config.REMOTE_SL_MKI + ".");
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
