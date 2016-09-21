/*******************************************************************************
** ITB Tools & Rev Tools
**
** auth: John Cui
** desc: These are the core ITB and REV enhancement code
**/

/*******************************************************************************
** DECLARATIONS
**
**/

var crome = window.external;
var rom = crome.rom;

/*******************************************************************************
** UTILITY FUNCTIONS
**
**/

function _rom_write(startAt, v, count) {
	for (c = 0; c < count; c++) {
		rom.byteAt(startAt + c) = v[c];
	}
} // */
function _rom_fill (fromAdr, toAdr, byteFill) {
	if (byteFill == null) byteFill = 0x00;
	for (i = fromAdr; i <= toAdr; i++) {
		rom.byteAt(i) = byteFill;
	}
} // */

/*******************************************************************************
**/

function addITBTToROM() {
  switch (rom.base) {
    case 0: // P28
	  alert("This plugin does not support this ROM.");
    break;
    case 1: // P30
      addITBToolsJrToP30();
      if (!hasFuelTools()) addFuelToolsToP30();
      crome.refresh();
    break;
    case 2: // P72
      alert("This plugin does not support this ROM.");
  }
}

function addRevToolsToROM() {
  switch (rom.base) {
    case 0: // P28
    	break;
    case 1: // P30
		  addRevToolsToP30();
      crome.refresh();
    break;
    	case 2: // P72
  }
}

function hasRevTools() {
  return (rom.wordAt(0x09F4) == 0x7904);
}

function addRevToolsToP30() {
  // Copy Current RPM Scale
  var scalarAddr = rom.addressOf('HIGH_REV_SCALAR');
      revScalar = new Array();
  for (i = 0; i < 20; i++) {
    if (i < 14) revScalar[i] = rom.revScalar(1, i+5);
    else revScalar[i] = revScalar[i-1] + 500;
  }
  // Add Extended RPM
  rom.byteAt(0x09F3) = 0x03;
  rom.wordAt(0x09F4) = 0x7904;
  _rom_fill(0x09F6, 0x0A00, 0xFF);

  _rom_write(0x7904,
             new Array(0xF9,0xEC,0x17,0x18,0xB5,0xAC,0x4A,0x44,
                       0x98,0x00,0xAA,0x90,0x37,0x53,0x79,0x43,
                       0xCE,0x08,0x53,0x78,0xCE,0x06,0x77,0x01,
                       0xCB,0x02,0x77,0xFF,0x8A,0x60,0x1E,0x70,
                       0xC3,0x59,0x4B,0x9E,0x12,0x03,0xA1,0x76),
             0x28);
  rom.wordat(0x7922) = scalarAddr;

  var cc = rom.addressOf('NFO_HIGH_TABLE') % 0x0100;

  // Move Tables
  for (r = 0; r < 0x13; r++) {
    if (r < 0x0F) {
      for (c = 0; c < cc; c++) {
        rom.byteAt(rom.addressOf('HIGH_FUEL') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_FUEL') + ((r + 5) * cc) + c);
        rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_IGNITION') + ((r + 5) * cc) + c);
        rom.byteAt(rom.addressOf('HIGH_O2TARGET') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_O2TARGET') + ((r + 5) * cc) + c);
      }
    } else {
      for (c = 0; c < cc; c++) {
        rom.byteAt(rom.addressOf('HIGH_FUEL') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_FUEL') + (0x13 * cc) + c);
        rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_IGNITION') + (0x13 * cc) + c);
        rom.byteAt(rom.addressOf('HIGH_O2TARGET') + (r * cc) + c) = rom.byteAt(rom.addressOf('HIGH_O2TARGET') + (0x13 * cc) + c);
      }
    }
  }
	// Apply Handler
  rom.addressOf('NFO_HIGH_RPM_DIV') = rom.wordAt(0x790D);
  // Rescale Rev Scalars
  for (i = 0; i < 20; i++)
    rom.revScalar(1,i) = revScalar[i];	
}

function hasITBTools() {
  return ((rom.wordAt(0x084D) == 0x0000) &&
					 (rom.wordAt(0x1277) == 0x78B9) &&
					 (rom.wordAt(0x1BA5) == 0x78C9) &&
					 (rom.wordAt(0x140F) == 0x78DF) &&
					 (rom.wordAt(0x1EEF) == 0x78F2));	
}

function addITBToolsJrToP30() {

  //Use Rev tools automatically
  addRevToolsToP30()

  // ITB MAP<->TPS Indexing
  _rom_write(0x0826,
	new Array(0xC5,0x98,0x08,0x60,0x1B,0x6B,0xEA,0x12,
		0x15,0xF5,0xB9,0xC6,0x2C,0xCD,0x0F,0xF5,
		0xA3,0xC6,0x88,0xCD,0x09,0xC6,0x18,0xC8,
		0x02,0x77,0x00,0xDC,0x12,0x0B,0xF5,0xB9,
		0x12,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
		0x00), 0x29); //Code to use TPS indexing, check TPS threshold, check MAP threshold

  // ITB MAP<->TPS Linear Conversion Table
  _rom_write(0x6B1B, new Array(0xE7,0xFF,0x2C,0x88), 0x04); //Addr changed to 6B1B by Dave, table by John Cui

  // ITB TPS ReScale
  rom.byteAt(0x088F) = 0x03; //jump to
  rom.wordAt(0x0890) = 0x6D34; //6D34h
  rom.byteAt(0x4473) = 0xB9; //use TPS rescaled instead of RAW ADC value
  rom.byteAt(0x4813) = 0xB9; //use TPS rescaled instead of RAW ADC value
  _rom_write(0x6D34,new Array(0xF5,0x6F,0x60,0x40,0x6D,0x12,0x44,0x15,0x89,0x03,0x92,0x08),0x0C); //Code
  _rom_write(0x6D40, new Array(0xE7,0xE7,0x18,0x18), 0x04);    // ITB TPS ReScale Table


  // New Column Scalars
  _rom_write(0x7000,
             new Array(0x18,0x39,0x50,0x70,0x88,0x95,0xA9,0xBD,0xD7,0x00),
             0x0A);

  //IACV Bypass
  rom.wordAt(0x3C52) = 0x1CCB;  //IACV error bypass SJMP - Checkbox perhaps?
  _rom_fill(0x3C54, 0x3C6F, 0xFF);  //Fill with blanks - IACV bypass
}

// Plugin Check ////////////////////////////////////////////////////////////////
function hasFuelTools() {
	return ((rom.wordAt(0x1277) == 0x78B9) &&
					(rom.wordAt(0x1BA5) == 0x78C9) &&
					(rom.wordAt(0x140F) == 0x78DF) &&
					(rom.wordAt(0x1EEF) == 0x78F2) &&
					(!rom.hasFuelMultiplier));
}

function addFuelToolsToP30() {
  //////////////////////////////////////////////////////////////////////////////
  // FUEL CONTROLER
  //////////////////////////////////////////////////////////////////////////////
  
  // WORD SCALAR ///////////////////////////////////////////////////////////////
  _rom_write(0x78AE,
             new Array(0x90,0x35,0x33,0x35,0x33,0xCD,0x03,0x67,
                       0xFF,0xFF,0x01),
             0x0B);
  // MAIN FUEL CTRL ///////////////////////////////////////////////////////////
  rom.byteAt(0x1276) = 0x03;
  rom.wordAt(0x1277) = 0x78B9;
  rom.byteAt(0x1279) = 0xFF;
  _rom_write(0x78B9,
             new Array(0x44,0x98,0x00,0x80,0x31,0xEF,0x86,0x00,
                       0x00,0xD4,0x38,0xF4,0x70,0x03,0x7A,0x12),
             0x10);
  //////////////////////////////////////////////////////////////////////////////
  
  // O2 CORRECTION CTL /////////////////////////////////////////////////////////
  rom.byteAt(0x1BA4) = 0x03;
  rom.wordAt(0x1BA5) = 0x78C9;
  rom.wordAt(0x1BA7) = 0xFFFF;
  _rom_write(0x78C9,
             new Array(0x45,0x4B,0x44,0x98,0x00,0x80,0x31,0xDD,
                       0x86,0x00,0x00,0x47,0x49,0xEA,0x25,0x03,
                       0x03,0xF5,0x1B,0x03,0xFF,0x1B),
             0x16);
  //////////////////////////////////////////////////////////////////////////////
  
  // CRANK FUEL CTL ////////////////////////////////////////////////////////////
  rom.byteAt(0x140E) = 0x03;
  rom.wordAt(0x140F) = 0x78DF;
  _rom_fill(0x1411, 0x1417, 0xFF);
  _rom_write(0x78DF,
             new Array(0x44,0x98,0x00,0x80,0x31,0xC9,0x86,0x00,
                       0x00,0x87,0x3C,0xCD,0x03,0x67,0xFF,0xFF,
                       0x03,0x81,0x76),
             0x13);
  //////////////////////////////////////////////////////////////////////////////
  
  // TIP-IN FUEL CTL ///////////////////////////////////////////////////////////
  rom.byteAt(0x1EEE) = 0x03;
  rom.wordAt(0x1EEF) = 0x78F2;
  _rom_write(0x78F2,
             new Array(0x44,0x98,0x00,0x80,0x31,0xB6,0x86,0x00,
                       0x00,0xDB,0x23,0x03,0x03,0xF1,0x1E,0x03,
                       0xFD,0x1E),
             0x12);
}

function getTPScalerVolts() {
  return new Array((rom.byteAt(0x6FFA)*5/255),(rom.byteAt(0x6FF8)*5/255));
}

function setTPScalerVolts(n,x) {
  rom.byteAt(0x6FFA) = Math.round(n * 255 / 5);
  rom.byteAt(0x6FF8) = Math.round(x * 255 / 5);
}

function isStockTPS() {
	return (rom.wordAt(0x6FFA) == 0x1818) && (rom.wordAt(0x6FF8) == 0xE7E7);
}