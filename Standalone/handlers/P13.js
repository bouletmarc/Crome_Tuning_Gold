/*********************************************************************
** TEST P13 LOADER
** Auth: Damian Badalamenti
**
** Desc: As script to open P13 roms..
**
**
********************************************************************/
//*******************************************************************
// MAP Scalar
//*******************************************************************
// Get MAP Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar 
function __P13GetMapScalar(m,i) {
  if (m == 0) {
  	  
  } else {
  
  }
}

// Set MAP Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar
// v = value assigned
function __P13SetMapScalar(m,i,v) {
  // Do Nothing
}
//*********************************************************************
//*********************************************************************
// REV SCALARS
//*********************************************************************
// Get Rev Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// I = 0 based index of scalar 
function __P13GetRevScalar(m,i) {
  i = i * 2;
  if (m == 0) {
      return (1875000/rom.wordAt(rom.addressOf('LOW_REV_SCALAR') + i));
  } else {
      return (1875000/rom.wordAt(rom.addressOf('HIGH_REV_SCALAR') + i));
  }
}

// Set Rev Scalar
// m = map mode (0 => low camp maps, 1 = > high cam maps)
// i = 0 based index of scalar
// v = value assigned
function __P13SetRevScalar(m,i,v) {
  i = i * 2;
  if (m == 0) {
      rom.wordAt(rom.addressOf('LOW_REV_SCALAR') + i) = 1875000/v;
  } else {
      rom.wordAt(rom.addressOf('HIGH_REV_SCALAR') + i) = 1875000/v;
  }
}
//*********************************************************************
//*********************************************************************
// TABLE VALUES
//*********************************************************************
// Get Table Value
// m = map type (0 => low fuel, 1 => high fuel, 2 => low ignition, 3 => high ignition)
// c = 0 based index of column
// r = 0 based index of row
// 
function __P13GetTableValue(m,c,r) {
  a = c + (r*10);
  if (m == 0) {
  	  return (rom.byteAt(rom.addressOf('LOW_FUEL') + a));
  }else if (m == 1) {
  	  return (rom.byteAt(rom.addressOf('HIGH_FUEL') + a));
  }else if (m == 2) {
  	  return ((rom.byteAt(rom.addressOf('LOW_IGNITION') + a) - 24)/4);
  }else if (m == 3) {
  	  return ((rom.byteAt(rom.addressOf('HIGH_IGNITION') + a) - 24)/4);
  }
}

// Set Table Value
// m = map type (0 => low fuel, 1 => high fuel, 2 => low ignition, 3 => high ignition)
// c = 0 based index of column
// r = 0 based index of row
// v = value assigned
//
function __P13SetTableValue(m,c,r,v) {
    a = c + (r*10);
  	if (m == 0) {
  	  rom.byteAt(rom.addressOf('LOW_FUEL') + a) = v;
  	}else if (m == 1) {
  	  rom.byteAt(rom.addressOf('HIGH_FUEL') + a) = v;
  }else if (m == 2) {
  	  rom.byteAt(rom.addressOf('LOW_IGNITION') + a) = (v * 4) + 24;
  }else if (m == 3) {
      rom.byteAt(rom.addressOf('HIGH_IGNITION') + a) = (v * 4) + 24;
  }
}
//****************************************************************************
//****************************************************************************
// Options Page!!
//****************************************************************************
// Show Custom Options
// This is triggered when the user clicks on 'Options'
// It's preferred to load an html based custom options page here
function __P13DoShowOptions() {
  showBrowser('handlers\\P13_Options\\OptionsPage.html',600,505);
}
//****************************************************************************

	
//****************************************************************************
// By Assigning the event hooks when a ROM is loaded, it is less
// likely that any event hooks will be called for the wrong ROM type
// ** All event hooks are first cleared when a new ROM is loaded
function __P13EventHooks() {
	rom.base = rtP13;
	rom.title = 'Base P13';
	rom.hasBoost = 0;
	rom.hasIAB = 1;
    rom.addressOf('NFO_LOW_TABLE')       = 0x140a;
    rom.addressOf('NFO_HIGH_TABLE')      = 0x140a;
    rom.addressOf('LOW_REV_SCALAR')      = 0x6000;
    rom.addressOf('HIGH_REV_SCALAR')     = 0x6028;
    rom.addressOf('LOW_MAP_SCALAR')      = 0x6000;
    rom.addressOf('HIGH_MAP_SCALAR')     = 0x6028;    
    rom.addressOf('LOW_IGNITION')        = 0x63f8;
    rom.addressOf('HIGH_IGNITION')       = 0x659C;
    rom.addressOf('LOW_FUEL')            = 0x60AA;
    rom.addressOf('HIGH_FUEL')           = 0x6172;
    rom.addressOf('LOW_O2TARGET')        = 0x0000;
    rom.addressOf('HIGH_O2TARGET')       = 0x0000;
    rom.addressOf('REVCUT1')			 = 0x540f;
	rom.addressOf('REVRES1')			 = 0x540B;
	rom.addressOf('REVCUT2')			 = 0x5407;
	rom.addressOf('REVRES2')			 = 0x5403;
	//rom.addressOf('LO_LOAD_VTEC_ON')	 = 0x35AE;
	//rom.addressOf('LO_LOAD_VTEC_OFF')	 = 0x35A9;
	//rom.addressOf('HI_LOAD_VTEC_ON')	 = 0x35A2;
	//rom.addressOf('HI_LOAD_VTEC_OFF')	 = 0x359D;	
	//rom.addressOf('VTEC')				 	 = 0x0000;
	//rom.addressOf('IDLE1')				 = 0x1474;
	//rom.addressOf('IDLE2')				 = 0x1487;
	//rom.addressOf('KNOCK')				 = 0x0000;
	//rom.addressOf('ELD')					 = 0x0000;
	//rom.addressOf('BARO')					 = 0x0000;
	//rom.addressOf('VTECVSS')				 = 0x0000;
	rom.addressOf('VTECCOOL')				 = 0x35CA;
	//rom.addressOf('VTECVSS')				 = 0x0000;
	rom.addressOf('DEBUGMODE')			 = 0x7ff1;
	//rom.addressOf('OXYHEAT')				 = 0x0000;
	rom.addressOf('SPEED_LIMIT')		 = 0x2EAC;
	//rom.addressOf('IAB_ON')				 = 0x1B96;
	//rom.addressOf('IAB_OFF')		 	 = 0x1B9B;
	
	//rom.events.OnGetMapScalar = '__P13GetMapScalar';
    //rom.events.OnSetMapScalar = '__P13SetMapScalar';
    rom.events.OnGetRevScalar = '__P13GetRevScalar';
    rom.events.OnSetRevScalar = '__P13SetRevScalar';
    rom.events.OnGetTableValue = '__P13GetTableValue';
    rom.events.OnSetTableValue = '__P13SetTableValue';
    events.OnShowOptions = '__P13DoShowOptions';
}

addRomHandler(rtP13, 'Damian Badalamenti', '__P13EventHooks()');