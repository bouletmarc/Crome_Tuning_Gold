/*********************************************************************
** Uberdata Loader File
** Auth: John Cui
**
** Desc: This is a loader for files created with Uberdata in order to be
**       imported into Crome
**
**
**/


/*********************************************************************
** Explanation Of Event Hooks
**
** The event hooks are used to add custom table calculations.  It is
** created mainly to add better support to non-stock OBD0 ROMs, P13
** ROMs without the need to hardcode and recompile Crome.  The example
** below shows how Uberdata 1.7+ ROMs with 16bit fuel tables can be loaded
** into Crome.
**
** To add an event hook, simply assign the name of the function
** that catches the event.
**
**/

/*********************************************************************
** Utility Functions
**
**/

// Get MAP Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar 
var __UD_MAP_TYPE__ = 0;
function __UD17GetMapScalar(m,i) {
  // Get MAP Offset
  var MAPOff = rom.byteAt(0x4DCC);
  var MAPMin = -59,
      MAPMax = 1782;
  switch (__UD_MAP_TYPE__) {
    case 0: // Stock
      MAPMin = -59;
      MAPMax = 1782;
    break;
    case 1: // 2 Bar
      MAPMin = 8;
      MAPMax = 2041;
    break;
    case 2: // 2.5 Bar
      MAPMin = 70;
      MAPMax = 2590;
    break;
    case 3: // 3 Bar
      MAPMin = -49;
      MAPMax = 2975;
    break;
    case 4: // 3.5 Bar
      MAPMin = 0;
      MAPMax = 3500;
    break;
  }
  if (i >= 0x0E) return MAPMax;
  else return ((rom.byteAt(rom.addressOf('LOW_MAP_SCALAR') + i)+MAPOff) / 255) * (MAPMax - MAPMin) + MAPMin;
}

// Set MAP Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar
// v = value assigned
function __UD17SetMapScalar(m,i,v) {
  // Get MAP Offset
  var MAPOff = rom.byteAt(0x4DCC);
  var MAPMin = -59,
      MAPMax = 1782;
  switch (__UD_MAP_TYPE__) {
    case 0: // Stock
      MAPMin = -59;
      MAPMax = 1782;
    break;
    case 1: // 2 Bar
      MAPMin = 8;
      MAPMax = 2041;
    break;
    case 2: // 2.5 Bar
      MAPMin = 70;
      MAPMax = 2590;
    break;
    case 3: // 3 Bar
      MAPMin = -49;
      MAPMax = 2975;
    break;
    case 4: // 3.5 Bar
      MAPMin = 0;
      MAPMax = 3500;
    break;
  }
  if (i >= 0x0E) rom.byteAt(rom.addressOf('LOW_MAP_SCALAR') + 0x0E) = 0x00;
  else {
    if (v < MAPMin) v = MAPMin;
    else if (v > MAPMax) v = MAPMax;
    v = (v - MAPMin) / (MAPMax - MAPMin) * 255;
    v = v - MAPOff;
    if (v < 0x00) v = 0x00;
    if (v > 0xFF) v = 0xFF;
    rom.byteAt(rom.addressOf('LOW_MAP_SCALAR') + i) = Math.round(v);
  }
}

// Get Rev Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// I = 0 based index of scalar 
function __UD17GetRevScalar(m,i) {
  // Do Nothing
}

// Set Rev Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar
// v = value assigned
function __UD17SetRevScalar(m,i,v) {
  // Do Nothing
}

// Get Table Value
// m = map type (0 => low fuel, 1 => high fuel, 2 => low ignition, 3 => high ignition)
// c = 0 based index of column
// r = 0 based index of row
// 
function __UD17GetTableValue(m,c,r) {
  switch (m) {
    case 0:
      return rom.wordAt(rom.addressOf('LOW_FUEL') + (r * 0x0F * 2) + (c * 2)) / 4;  
    break;
    case 1:
      return rom.wordAt(rom.addressOf('HIGH_FUEL') + (r * 0x0F * 2) + (c * 2)) / 4;
    break;
    case 2:
      return (rom.byteAt(rom.addressOf('LOW_IGNITION') + (r * 0x0F) + c) - 24) / 4;
    break;
    case 3:
      return (rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * 0x0F) + c) - 24) / 4;
    break;
  }
}

// Set Table Value
// m = map type (0 => low fuel, 1 => high fuel, 2 => low ignition, 3 => high ignition)
// c = 0 based index of column
// r = 0 based index of row
// v = value assigned
//
function __UD17SetTableValue(m,c,r,v) {
  switch (m) {
    case 0:
      rom.wordAt(rom.addressOf('LOW_FUEL') + (r * 0x0F * 2) + (c * 2)) = Math.round(v * 4);
    break;
    case 1:
      rom.wordAt(rom.addressOf('HIGH_FUEL') + (r * 0x0F * 2) + (c * 2)) = Math.round(v * 4);
    break;
    case 2:
      v = Math.round(v * 4) + 24;
      if (v > 0xFF) v = 0xFF;
      else if (v < 0x00) v = 0x00;
      rom.byteAt(rom.addressOf('LOW_IGNITION') + (r * 0x0F) + c) = v;
    break;
    case 3:
      v = Math.round(v * 4) + 24;
      if (v > 0xFF) v = 0xFF;
      else if (v < 0x00) v = 0x00;
      rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * 0x0F) + c) = v;
    break;
  }
}

// Show Custom Options
// This is triggered when the user clicks on 'Options'
// It's preferred to load an html based custom options page here
function __UD17DoShowOptions() {
  alert('ToDo: Show Custom Options Page');
  // You can use the showBrowser() function 
  // here to display a custom options page
}

// By Assigning the event hooks when a ROM is loaded, it is less
// likely that any event hooks will be called for the wrong ROM type
// ** All event hooks are first cleared when a new ROM is loaded
function __UD17EventHooks() {
  if (rom.wordAt(0x2B62) == 0x6E80) {
    rom.addressOf('NFO_LOW_TABLE')       = ((rom.byteAt(0x0A59)+2)*0x100) + (rom.byteAt(0x0AA9)+2);
    rom.addressOf('NFO_HIGH_TABLE')      = ((rom.byteAt(0x0A71)+2)*0x100) + (rom.byteAt(0x0AA9)+2);
    rom.addressOf('LOW_REV_SCALAR')      = 0x7C68;
    rom.addressOf('HIGH_REV_SCALAR')     = 0x7C7C;
    rom.addressOf('LOW_MAP_SCALAR')      = 0x7C4A;
    rom.addressOf('HIGH_MAP_SCALAR')     = 0x7C4A;    
    rom.addressOf('LOW_IGNITION')        = 0x6B90;
    rom.addressOf('HIGH_IGNITION')       = 0x7060;
    rom.addressOf('LOW_FUEL')            = 0x6770;
    rom.addressOf('HIGH_FUEL')           = 0x7D12;
    rom.addressOf('LOW_O2TARGET')        = 0x0000;
    rom.addressOf('HIGH_O2TARGET')       = 0x0000;
    rom.events.OnGetMapScalar = '__UD17GetMapScalar';
    rom.events.OnSetMapScalar = '__UD17SetMapScalar';
    //rom.events.OnGetRevScalar = '__UD17GetRevScalar';
    //rom.events.OnSetRevScalar = '__UD17SetRevScalar';
    rom.events.OnGetTableValue = '__UD17GetTableValue';
    rom.events.OnSetTableValue = '__UD17SetTableValue';
    events.OnShowOptions = '__UD17DoShowOptions';
    rom.title = 'Uberdata 1.7+';
    // Set Boost Type
    rom.hasBoost = 1;
    switch (rom.wordAt(0x7A0B)) {
      case 0x3FE0: // stock
        __UD_MAP_TYPE__ = 0;
        rom.title += ' Stock MAP'
      break;
      case 0x4000: // 2 Bar
        __UD_MAP_TYPE__ = 1;
        rom.title += ' 2Bar MAP';
      break;
      case 0x4020: // 2.5 Bar
        __UD_MAP_TYPE__ = 2;
        rom.title += ' 2.5Bar MAP';
      break;
      case 0x4040: // 3 Bar
        __UD_MAP_TYPE__ = 3;
        rom.title += ' 3Bar MAP';
      break;
      case 0x4060: // 3.5 Bar;
        __UD_MAP_TYPE__ = 4;
        rom.title += ' 3.5Bar MAP';
    }
  }
}

addRomHandler(rtP72, 'John Cui', '__UD17EventHooks()');