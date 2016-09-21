/*******************************************************************************
** Advanced Boost Tools
**
** auth: John Cui
**   Additional support added By Damian Badalamenti:
**				-273 rom support
**					-Fuel Tools
**					-Boost Support
**					-HiResP72II support				
**				-Boost Columns expansion capabilities
**				-Load Dependent Closed Loop Disable
**				-Easy to read Closed loop switch, and Map cut of edit.
** desc: These are the core boost enhancement code
**
** v1.8 (Damian)
** -modifies handler to use rom.ByteToMillibar and rom.MillibarToByte
**
** v1.7 (bigwig)
** -adds alternative MAP sensor options (marked "test")
**
** v1.6 (Black R)
** -Fixes bugs in P72 not fixed by Dave B.
** 
** v1.5 with p72 fuel tools fix
** -Fixes bug still in Fuel Tools 1.6 involving P72 codebase (only change is to fuel tools code involving P72)
**
** v1.5 (Dave B.)
** -Fixes bug in Fuel Tools 1.4 / 1.5 (Using FT 1.6 code now)
**
** V1.4 (Dave B.)
** -Uses Fuel Tools 1.4 Final value code 
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

function addBTPToROM(rt, orgMapWdth, newMapWdth, loMapHght, orgHiMapHght) {
  if (rt == null) rt = rom.base;
  switch (rt) {
    case 0: // P28
      //addBoostToP28();
	  alert("This plug-in does not support this ROM type.  Please use a P30 based ROM.");
    break;
    case 1: // P30
      addBoostToP30(orgMapWdth, newMapWdth, loMapHght, orgHiMapHght);
      if (!hasClosedLoopSwitch()) addLoopSwitchToP30();
	  crome.refresh();
    break;
    case 2: // P72
      addBoostToP72(orgMapWdth, newMapWdth, loMapHght, orgHiMapHght);
	  if (!hasClosedLoopSwitch()) addLoopSwitchToP72();
      crome.refresh();
  }
}

function addBoostToP30(orgMapWdth, newMapWdth, loIgnLmbTblHgt, orgHiIgnLmbTblHgt) {
  var
  	hiFuelTblHgt = orgHiIgnLmbTblHgt + 0x01,
	loFuelTblHgt = loIgnLmbTblHgt + 0x01,
	///////////////////////////////////////////////////////////////////////
    loRevTbl = new Array(loIgnLmbTblHgt),
	hiRevTbl = new Array(orgHiIgnLmbTblHgt),
	loFuelTbl = new Array(loFuelTblHgt),
    hiFuelTbl = new Array(hiFuelTblHgt),
    loIgtnTbl = new Array(loIgnLmbTblHgt),
    hiIgtnTbl = new Array(orgHiIgnLmbTblHgt),
    loLmdaTbl = new Array(loIgnLmbTblHgt),
    hiLmdaTbl = new Array(orgHiIgnLmbTblHgt),
	BstColumns = newMapWdth - 0x10;
  
  ///////////////////////////////////////////////////////////////////////
  HiRevTblCor = orgHiIgnLmbTblHgt - 0x14;
  LoRevTblCor = loIgnLmbTblHgt - 0x14;
  HiLmbTblCor = BstColumns * orgHiIgnLmbTblHgt + HiRevTblCor * 0x10;
  LoLmbTblCor = BstColumns * loIgnLmbTblHgt + LoRevTblCor * 0x10;
  HiIgnTblCor = BstColumns * orgHiIgnLmbTblHgt + HiRevTblCor * 0x10;
  LoIgnTblCor = BstColumns * loIgnLmbTblHgt + LoRevTblCor * 0x10; 
  HiFulTblCor = BstColumns * hiFuelTblHgt + HiRevTblCor * 0x10;
  LoFulTblCor = BstColumns * loFuelTblHgt + LoRevTblCor * 0x10;
  
  LoLmbTblCor = HiLmbTblCor + LoLmbTblCor;
  
  LoIgnTblCor = HiIgnTblCor + LoIgnTblCor;
  HiFulTblCor = LoIgnTblCor + HiFulTblCor;
  LoFulTblCor = HiFulTblCor + LoFulTblCor;
  HiRevTblCor = LoFulTblCor + HiRevTblCor;
  LoRevTblCor = HiRevTblCor + LoRevTblCor;
  ScalarCor = LoRevTblCor + BstColumns;
  /////////////////////////////////////////////////////////////////////
  
  rom.byteAt(0x0A14) = 0xA3;
  rom.byteAt(0x0A29) = 0xA3;
  rom.wordAt(0x0A17) = (0x70F2 - ScalarCor);
  rom.wordAt(0x0A2C) = (0x70F2 - ScalarCor);
  rom.wordAt(0x09DC) = (0x7102 - LoRevTblCor); // Lo-Cam Rpm Table
  if(!hasRevTools()) rom.wordAt(0x09F4) = (0x7116 - HiRevTblCor); // Hi-Cam Rpm Table
  if(hasRevTools()) rom.wordAt(0x7922) = (0x7116 - HiRevTblCor); // Hi-Cam Rpm Table
  rom.wordAt(0x0B4A) = (0x750A - HiIgnTblCor); // Hi Ign
  rom.wordAt(0x0B56) = (0x73CA - LoIgnTblCor); // Lo Ign
  rom.wordAt(0x0B71) = 0x0000;				   // 
  rom.wordAt(0x0B74) = (0x73CA - LoIgnTblCor); // Lo Ign 2 extra table
  rom.wordAt(0x1245) = (0x727A - HiFulTblCor); // Hi Fuel
  rom.wordAt(0x1257) = (0x712A - LoFulTblCor); // Lo Fuel
  rom.wordAt(0x1269) = 0x0000;				   //
  rom.wordAt(0x126C) = (0x712A - LoFulTblCor); // Lo Fuel 2 extra table
  rom.wordAt(0x1687) = (0x7EBF - HiLmbTblCor); // Hi Lambda
  rom.wordAt(0x169B) = (0x7D7F - LoLmbTblCor); // Lo Lambda
  rom.wordAt(0x215F) = (0x7D7F - LoLmbTblCor); // Lo Lambda extra table
  rom.byteAt(0x0A1D) = newMapWdth - 0x02;
  rom.byteAt(0x0A32) = newMapWdth - 0x02;
  rom.byteAt(0x0B3A) = newMapWdth;
  rom.byteAt(0x1235) = newMapWdth;
  rom.byteAt(0x1677) = newMapWdth;
  rom.byteAt(0x216F) = newMapWdth; // Expand width of extra Lambda
  rom.byteAt(0x2171) = 0x14;  	   // Expand hight of extra Lambda
    
  // MAP CUTOFF //////////////////////////////////////////////////////////////// 
	_rom_write(0x0829,
						 new Array(0xF5,0xA3,0xC6,0x18,0xCD,0x11,0xC6,0x00,
								       0xCF,0x04,0x77,0x00,0xCB,0x09,0xC5,0x98,
                       0x18,0xF4,0x35,0xCB,0x08,0xFF,0xFF),
						 0x17);
  
  // COPY RPM SCALARS //////////////////////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    loRevTbl[r] = rom.byteAt(rom.addressOf('LOW_REV_SCALAR') + r);
  }
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {	
    hiRevTbl[r] = rom.byteAt(rom.addressOf('HIGH_REV_SCALAR') + r);
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY LOW FUEL TABLES TO MEMORY ////////////////////////////////////////////
  for (r = 0x00; r < loFuelTblHgt; r++) {
    loFuelTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      loFuelTbl[r][c] = rom.byteAt(rom.addressOf('LOW_FUEL') + (r * orgMapWdth) + c);
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY HIGH FUEL TABLES TO MEMORY ///////////////////////////////////////////
  for (r = 0x00; r < hiFuelTblHgt; r++) {
    hiFuelTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      hiFuelTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_FUEL') + (r * orgMapWdth) + c);
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY LOW LAMBDA & IGNITION TABLES /////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    loIgtnTbl[r] = new Array(orgMapWdth);
    loLmdaTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      loIgtnTbl[r][c] = rom.byteAt(rom.addressOf('LOW_IGNITION') + (r * orgMapWdth) + c);
      loLmdaTbl[r][c] = rom.byteAt(rom.addressOf('LOW_O2TARGET') + (r * orgMapWdth) + c);
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY HIGH LAMBDA & IGNITION TABLES ////////////////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    hiIgtnTbl[r] = new Array(orgMapWdth);
    hiLmdaTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      hiIgtnTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * orgMapWdth) + c);
      hiLmdaTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_O2TARGET') + (r * orgMapWdth) + c);
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE RPM SCALARS //////////////////////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    rom.byteAt((0x7102 - LoRevTblCor) + r) = loRevTbl[r];
  }
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    rom.byteAt((0x7116 - HiRevTblCor) + r) = hiRevTbl[r];
  }
  //////////////////////////////////////////////////////////////////////////////
    
  // MOVE & EXPAND LOW FUEL TABLES /////////////////////////////////////////////
  for (r = 0x00; r < loFuelTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x712A - LoFulTblCor) + (r * newMapWdth) + c) = loFuelTbl[r][c];
      } else {
        rom.byteAt((0x712A - LoFulTblCor) + (r * newMapWdth) + c) = loFuelTbl[r][orgMapWdth - 0x01];
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND HIGH FUEL TABLES /////////////////////////////////////////////
  for (r = 0x00; r < hiFuelTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x727A - HiFulTblCor) + (r * newMapWdth) + c) = hiFuelTbl[r][c];
      } else {
        rom.byteAt((0x727A - HiFulTblCor) + (r * newMapWdth) + c) = hiFuelTbl[r][orgMapWdth - 0x01];
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND LOW IGNITION & LAMBDA TABLES ////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x73CA - LoIgnTblCor) + (r * newMapWdth) + c) = loIgtnTbl[r][c];
        rom.byteAt((0x7D7F - LoLmbTblCor) + (r * newMapWdth) + c) = loLmdaTbl[r][c];
      } else {
        rom.byteAt((0x73CA - LoIgnTblCor) + (r * newMapWdth) + c) = loIgtnTbl[r][orgMapWdth - 0x01];
        rom.byteAt((0x7D7F - LoLmbTblCor) + (r * newMapWdth) + c) = 0x9F;
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND HIGH IGNITION & LAMBDA TABLES ///////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x750A - HiIgnTblCor) + (r * newMapWdth) + c) = hiIgtnTbl[r][c];
        rom.byteAt((0x7EBF - HiLmbTblCor) + (r * newMapWdth) + c) = hiLmdaTbl[r][c];
      } else {
        rom.byteAt((0x750A - HiIgnTblCor) + (r * newMapWdth) + c) = hiIgtnTbl[r][orgMapWdth - 0x01];
        rom.byteAt((0x7EBF - HiLmbTblCor) + (r * newMapWdth) + c) = 0x9F;
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////
}

function addBoostToP72(orgMapWdth, newMapWdth, loIgnLmbTblHgt, orgHiIgnLmbTblHgt) {
  var
    hiFuelTblHgt = orgHiIgnLmbTblHgt + 0x01,
	loFuelTblHgt = loIgnLmbTblHgt + 0x01,
	///////////////////////////////////////////////////////////////////////
    loFuelTbl = new Array(loFuelTblHgt),
    hiFuelTbl = new Array(hiFuelTblHgt),
    loIgtnTbl = new Array(loIgnLmbTblHgt),
    hiIgtnTbl = new Array(orgHiIgnLmbTblHgt),
    loLmdaTbl = new Array(loIgnLmbTblHgt),
	hiLmdaTbl = new Array(orgHiIgnLmbTblHgt),
	loRevTbl = new Array(loIgnLmbTblHgt),
	hiRevTbl = new Array(orgHiIgnLmbTblHgt),
	BstColumns = newMapWdth - 0x10;
   	///////////////////////////////////////////////////////////////////////
    HiRevTblCor = orgHiIgnLmbTblHgt - 0x0F;
  	LoRevTblCor = loIgnLmbTblHgt - 0x14;
	HiLmbTblCor = BstColumns * orgHiIgnLmbTblHgt + HiRevTblCor * 0x10;
  	LoLmbTblCor = BstColumns * loIgnLmbTblHgt + LoRevTblCor * 0x10;
  	HiIgnTblCor = BstColumns * orgHiIgnLmbTblHgt + HiRevTblCor * 0x10;
  	LoIgnTblCor = BstColumns * loIgnLmbTblHgt + LoRevTblCor * 0x10; 
  	HiFulTblCor = BstColumns * hiFuelTblHgt + HiRevTblCor * 0x10;
  	LoFulTblCor = BstColumns * loFuelTblHgt + LoRevTblCor * 0x10;
	
	
  
  	///////////////////////////////////////////////////////////////////////
    HiLmbTblCor = HiLmbTblCor;	
	LoLmbTblCor = HiLmbTblCor + LoLmbTblCor;
  	HiIgnTblCor = LoLmbTblCor + HiIgnTblCor;
  	LoIgnTblCor = HiIgnTblCor + LoIgnTblCor;
  	HiFulTblCor = LoIgnTblCor + HiFulTblCor;
  	LoFulTblCor = HiFulTblCor + LoFulTblCor;
  	HiRevTblCor = LoFulTblCor + HiRevTblCor;
  	LoRevTblCor = HiRevTblCor + LoRevTblCor;
  	ScalarCor = LoRevTblCor + BstColumns;
  	
	/////////////////////////////////////////////////////////////////////
  	
    rom.byteAt(0x0AA0) = 0xBB;
    rom.byteAt(0x0AB5) = 0xBB;
	rom.byteAt(0x0ACA) = 0xBB;
    rom.wordAt(0x0A50) = (0x792C - LoRevTblCor); // Lo-Cam Rpm Table
    rom.wordAt(0x0A68) = (0x7940 - HiRevTblCor); // Hi-Cam Rpm Table
    rom.wordAt(0x0A80) = (0x7940 - HiRevTblCor); // Original Target O2 rpm Table
    rom.wordAt(0x0AA3) = (0x791C - ScalarCor); // Map Table
    rom.wordAt(0x0AB8) = (0x791C - ScalarCor); // Map Table
    rom.wordAt(0x0ACD) = (0x791C - ScalarCor); // Map Table for original Target o2
    rom.wordAt(0x128B) = (0x794F - LoFulTblCor); // Lo Fuel
    rom.wordAt(0x1277) = (0x7A9F - HiFulTblCor); // Hi Fuel
    rom.wordAt(0x64DC) = (0x7B9F - LoIgnTblCor); // Lo Ign 2 xtra table
    rom.wordAt(0x64DF) = (0x7B9F - LoIgnTblCor); // Lo Ign
    rom.wordAt(0x64E6) = (0x7CDF - HiIgnTblCor); // Hi Ign 2 xtra table
    rom.wordAt(0x64E9) = (0x7CDF - HiIgnTblCor); // Hi Ign
	rom.byteAt(0x0AA9) = newMapWdth - 0x02;
    rom.byteAt(0x0ABE) = newMapWdth - 0x02;
    rom.byteAt(0x0AD3) = newMapWdth - 0x02;
    rom.byteAt(0x0B86) = newMapWdth;
	rom.byteAt(0x1267) = newMapWdth;
    ////////////////////////////////////////////////////////////////////////////
	    	
	// MAP CUTOFF ////////////////////////////////////////////////////////////// 
	_rom_write(0x0841,
						 new Array(0xF5,0xBB,0xC6,0x18,0xCD,0x11,0xC6,0x00,
								        0xCF,0x04,0x77,0x00,0xCB,0x09,0xC5,0xB0,
                       					0x18,0xF4,0x35,0xCB,0x08,0xFF,0xFF),
						 				0x17);
	
    // TARGET O2 VTEC TABLE SWITCH ///////////////////////////////////////////////
    _rom_write(0x16DA,
						new Array(0x98,0x0A,0x99,0x0F,0xC4,0xDF,0x4A,0xB4,
									   0xE2,0x79,0xC4,0xE8,0x4B,0xB4,0xEC,0x4B,
									   0x60,0x0F,0x7F,0xDD,0x1C,0x03,0xED,0x20,
									   0x0E,0xE9,0x27,0x0B,0x99,0x14,0xC4,0xE7,
									   0x4B,0xB4,0xEA,0x4B,0x60,0xCF,0x7D),
									   0x27);
  rom.byteAt(0x169B) = 0x3C;
  rom.byteAt(0x16DB) = newMapWdth;
  rom.byteAt(0x16DD) = orgHiIgnLmbTblHgt;
  rom.wordAt(0x16EB) = (0x7F0F - HiLmbTblCor); // Hi o2 Target
  rom.byteAt(0x16F7) = loIgnLmbTblHgt;
  rom.wordAt(0x16FF) = (0x7DCF - LoLmbTblCor); // Lo o2 Target	 					 
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY RPM SCALARS //////////////////////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    loRevTbl[r] = rom.byteAt(rom.addressOf('LOW_REV_SCALAR') + r);
  }
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    hiRevTbl[r] = rom.byteAt(rom.addressOf('HIGH_REV_SCALAR') + r);
  }
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY LOW FUEL TABLES TO MEMORY ////////////////////////////////////////////
  for (r = 0x00; r < loFuelTblHgt; r++) {
    loFuelTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      loFuelTbl[r][c] = rom.byteAt(rom.addressOf('LOW_FUEL') + (r * orgMapWdth) + c);
    } // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // COPY HIGH FUEL TABLES TO MEMORY ///////////////////////////////////////////
  for (r = 0x00; r < hiFuelTblHgt; r++) {
    hiFuelTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      hiFuelTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_FUEL') + (r * orgMapWdth) + c);
    } // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // COPY LOW IGNITION TABLES /////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    loIgtnTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      loIgtnTbl[r][c] = rom.byteAt(rom.addressOf('LOW_IGNITION') + (r * orgMapWdth) + c);
    }  // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // COPY HIGH IGNITION TABLES ////////////////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    hiIgtnTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      hiIgtnTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_IGNITION') + (r * orgMapWdth) + c);
    }  // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY AND EXTRAPULATE LOW LAMBDA TABLES ////////////////////////////////////
    for (r = 0x00; r < loIgnLmbTblHgt; r++) {
      rev = rom.byteAt(rom.addressOf('LOW_REV_SCALAR') + r);
	  if (rev >= 0x00 && rev <= 0xC8) r2 = 0x00;
	  if (rev > 0xC8 && rev <= 0xE0) r2 = 0x07;
	  if (rev > 0xE0 && rev <= 0xF0) r2 = 0x0A;
	  if (rev == 0x00 && r == 0x13) r2 = 0x0A;
	  if (orgMapWdth >= 0x10 || orgHiIgnLmbTblHgt == 0x14) r2 = r;
      loLmdaTbl[r] = new Array(orgMapWdth);
      for (c = 0x00; c < orgMapWdth; c++) {
	    loLmdaTbl[r][c] = rom.byteAt(rom.addressOf('LOW_O2TARGET') + (r2 * orgMapWdth) + c); 
	  }  // end for
    } // end for
  //////////////////////////////////////////////////////////////////////////////
  
  // COPY AND EXTRAPULATE HIGH LAMBDA TABLES ///////////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    rev = rom.byteAt(rom.addressOf('HIGH_REV_SCALAR') + r);
	if (rev >= 0x00 && rev <= 0x80) r2 = 0x00;
	if (rev > 0x80 && rev <= 0xAB) r2 = 0x07;
	if (rev > 0xAB && rev <= 0xC7) r2 = 0x0A; 
	if (rev > 0xC7 && rev <= 0xF2) r2 = 0x0C; 
	if (rev == 0x00 && r == orgHiIgnLmbTblHgt - 0x01) r2 = 0x0C;
	if (orgMapWdth >= 0x10 || orgHiIgnLmbTblHgt == 0x14) r2 = r;
    hiLmdaTbl[r] = new Array(orgMapWdth);
    for (c = 0x00; c < orgMapWdth; c++) {
      hiLmdaTbl[r][c] = rom.byteAt(rom.addressOf('HIGH_O2TARGET') + (r2 * orgMapWdth) + c);
    }  // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE RPM SCALARS ////////////////////////////////////////////////////////// 
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    rom.byteAt((0x792C - HiRevTblCor) + r) = loRevTbl[r]; //Lo
	if (r < orgHiIgnLmbTblHgt){
		rom.byteAt((0x7940 - HiRevTblCor) + r) = hiRevTbl[r]; //Hi
  	}
  } //end for
  //////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND LOW FUEL TABLES /////////////////////////////////////////////
  for (r = 0x00; r < loFuelTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x794F - LoFulTblCor) + (r * newMapWdth) + c) = loFuelTbl[r][c];
      } else {
        rom.byteAt((0x794F - LoFulTblCor) + (r * newMapWdth) + c) = loFuelTbl[r][orgMapWdth - 0x01];
      }  // end if
    } // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // MOVE & EXPAND HIGH FUEL TABLES ////////////////////////////////////////////
  for (r = 0x00; r < hiFuelTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x7A9F - HiFulTblCor) + (r * newMapWdth) + c) = hiFuelTbl[r][c];
      } else {
        rom.byteAt((0x7A9F - HiFulTblCor) + (r * newMapWdth) + c) = hiFuelTbl[r][orgMapWdth - 0x01];
      }  // end if
    } // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // MOVE & EXPAND LOW IGNITION ////////////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x7B9F - LoIgnTblCor) + (r * newMapWdth) + c) = loIgtnTbl[r][c];
      } else {
        rom.byteAt((0x7B9F - LoIgnTblCor) + (r * newMapWdth) + c) = loIgtnTbl[r][orgMapWdth - 0x01];
      } // end if
    } // end for
  } // end for
  //////////////////////////////////////////////////////////////////////////////

  // MOVE & EXPAND HIGH IGNITION ///////////////////////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x7CDF - HiIgnTblCor) + (r * newMapWdth) + c) = hiIgtnTbl[r][c];
      } else {
        rom.byteAt((0x7CDF - HiIgnTblCor) + (r * newMapWdth) + c) = hiIgtnTbl[r][orgMapWdth - 0x01];
      } // end if
    } // end for
  } // end for
  ///////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND LOW LAMBDA ///////////////////////////////////////////////////
  for (r = 0x00; r < loIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x7DCF - LoLmbTblCor) + (r * newMapWdth) + c) = loLmdaTbl[r][c];
      } else {
        rom.byteAt((0x7DCF - LoLmbTblCor) + (r * newMapWdth) + c) = 0x9F;
      } // end if
    } // end for
  } // end for
  ///////////////////////////////////////////////////////////////////////////////
  
  // MOVE & EXPAND HIGH LAMBDA //////////////////////////////////////////////////
  for (r = 0x00; r < orgHiIgnLmbTblHgt; r++) {
    for (c = 0x00; c < newMapWdth; c++) {
      if (c < orgMapWdth) {
        rom.byteAt((0x7F0F - HiLmbTblCor) + (r * newMapWdth) + c) = hiLmdaTbl[r][c];
      } else { 
        rom.byteAt((0x7F0F - HiLmbTblCor) + (r * newMapWdth) + c) = 0x9F;
      } // end if
    } // end for
  } // end for

}


// Fuel tools code adapted from fueltools.cpf v1.4 (Final Value Fuel Tools)

// Plugin Handler for FV Fuel Tools ////////////////////////////////////////////
function __fuelToolsHandler() {
  if (!__hasFVFuelTools()) return;
  switch (rom.base) {
    case 1:  //P30
      rom.addressOf('MTX1') = 0x78BB;  // FINAL multiplier Fuel
      rom.addressOf('MTX2') = 0x78CD;  // O2 Fuel
      rom.addressOf('MTX3') = 0x78E1;  // Cranking Fuel
      rom.addressOf('MTX4') = 0x78F4;  // Throttle Tip-in
      rom.addressOf('MTX5') = 0x0000;
      rom.addressOf('MTX6') = 0x0000;
      rom.hasFinalMultiplier = 1;
      break;
    case 2: //P72
      // Fuel Multipliers
      rom.addressOf('MTX1') = 0x676E;  // Main Fuel
      rom.addressOf('MTX2') = 0x6780;  // O2 Fuel
      rom.addressOf('MTX3') = 0x6794;  // CrankIgn Fuel
      rom.addressOf('MTX4') = 0x67A7;  // Throttle Tip-in
      rom.addressOf('MTX5') = 0x0000;
      rom.addressOf('MTX6') = 0x0000;
      rom.hasFinalMultiplier = 1;
      break;
  }
}
// Plugin Check for FV fuel tools ////////////////////////////////////////////////
function __hasFVFuelTools() {
   rt = rom.base;
   switch (rt) {
    case 1: // P30
		return ((rom.wordAt(0x05d1) == 0x78B9) &&
			(rom.wordAt(0x1BA5) == 0x78C9) &&
			(rom.wordAt(0x140F) == 0x78DF) &&
			(rom.wordAt(0x1EEF) == 0x78F2) &&
			(!rom.hasFuelMultiplier));
    case 2: // P72
		return ((rom.wordAt(0x05ca) == 0x676C) &&
			(rom.wordAt(0x1C69) == 0x677C) &&
			(rom.wordAt(0x14AD) == 0x6792) &&
			(rom.wordAt(0x20FD) == 0x67A5) &&
			(!rom.hasFuelMultiplier));
   }
}

// FV Fuel Tools P30 Specific Code ///////////////////////////////////////////////
function __addFVFuelToolsToP30() {
  // Add Fuel Controllers
  //// Word Scaler
  _rom_write(0x78AE,
             new Array(0x90,0x35,0x33,0x35,0x33,0xCD,0x03,0x67,
                       0xFF,0xFF,0x01),
             0x0B);
  //// Main Fuel Control
  rom.byteAt(0x05d0) = 0x03;
  rom.wordAt(0x05d1) = 0x78B9;
  rom.byteAt(0x05d3) = 0x00;
  _rom_write(0x78B9,
             new Array(0x44,0x98,0x00,0x80,0x31,0xEF,0x86,0x00,
                       0x00,0xD4,0xC6,0xF4,0x34,0x03,0xD4,0x05),
             0x10);
  //// Undo old style Main Fuel Control with stock code
  rom.byteAt(0x1276) = 0xD4;
  rom.byteAt(0x1277) = 0x38;
  rom.byteAt(0x1278) = 0xF4;
  rom.byteAt(0x1279) = 0x70;


  //// O2 Fuel Control
  rom.byteAt(0x1BA4) = 0x03;
  rom.wordAt(0x1BA5) = 0x78C9;
  rom.wordAt(0x1BA7) = 0xFFFF;
  _rom_write(0x78C9,
             new Array(0x45,0x4B,0x44,0x98,0x00,0x80,0x31,0xDD,
                       0x86,0x00,0x00,0x47,0x49,0xEA,0x25,0x03,
                       0x03,0xF5,0x1B,0x03,0xFF,0x1B),
             0x16);
  //// Post-start Fuel Control
  rom.byteAt(0x140E) = 0x03;
  rom.wordAt(0x140F) = 0x78DF;
  _rom_fill(0x1411, 0x1417, 0xFF);
  _rom_write(0x78DF,
             new Array(0x44,0x98,0x00,0x80,0x31,0xC9,0x86,0x00,
                       0x00,0x87,0x3C,0xCD,0x03,0x67,0xFF,0xFF,
                       0x03,0x81,0x76),
             0x13);
  //// Throttle Tip-in Fuel Control
  rom.byteAt(0x1EEE) = 0x03;
  rom.wordAt(0x1EEF) = 0x78F2;
  _rom_write(0x78F2,
             new Array(0x44,0x98,0x00,0x80,0x31,0xB6,0x86,0x00,
                       0x00,0xDB,0x23,0x03,0x03,0xF1,0x1E,0x03,
                       0xFD,0x1E),
             0x12);
  // Call Handler Manually
      rom.addressOf('MTX1') = 0x78BB;  // FINAL multiplier Fuel
      rom.addressOf('MTX2') = 0x78CD;  // O2 Fuel
      rom.addressOf('MTX3') = 0x78E1;  // Cranking Fuel
      rom.addressOf('MTX4') = 0x78F4;  // Throttle Tip-in
      rom.addressOf('MTX5') = 0x0000;
      rom.addressOf('MTX6') = 0x0000;
      rom.hasFinalMultiplier = 1;

  // Call Handler
  __fuelToolsHandler()
}

// FV Fuel Tools P72 Specific Code //////////////////////////////////////////////
function __addFVFuelToolsToP72() {
  // Add fuel controllers
  //// Word Scalar
  _rom_write(0x6761,
             new Array(0x90,0x35,0x33,0x35,0x33,0xCD,0x03,0x67,
                       0xFF,0xFF,0x01),
             0x0B);

  //// Final Value Fuel Control
    rom.byteAt(0x05C9) = 0x03;
    rom.wordAt(0x05CA) = 0x676C;
    rom.byteAt(0x05CC) = 0x00;
    _rom_write(0x676C,
               new Array(0x44,0x98,0x00,0x80,0x31,0xEF,0x86,0x00,
                         0x00,0xD4,0x9E,0xF4,0x3C,0x03,0xCD,0x05),
               0x10);
  //// Un-do Main Fuel Control version 1 to stock code
  //  rom.byteAt(0x129D) = 0x03;
  //  rom.wordAt(0x129E) = 0x676C;
  //  rom.byteAt(0x12A0) = 0xFF;
  rom.byteAt(0x129D) = 0xD4;
  rom.byteAt(0x129E) = 0x40;
  rom.byteAt(0x129F) = 0xF4;
  rom.byteAt(0x12A0) = 0x80;


  //// O2 Fuel Control
  rom.byteAt(0x1C68) = 0x03;
  rom.wordAt(0x1C69) = 0x677C;
  rom.wordAt(0x1C6B) = 0xFFFF;
  _rom_write(0x677C,
             new Array(0x45,0x4B,0x44,0x98,0x00,0x80,0x31,0xDD,
                       0x86,0x00,0x00,0x47,0x49,0xEA,0x2D,0x03,
                       0x03,0xB2,0x1C,0x03,0xBC,0x1C),
             0x16);
  //// Crank Fuel Control
  rom.byteAt(0x14AC) = 0x03;
  rom.wordAt(0x14AD) = 0x6792;
  rom.wordAt(0x14AF) = 0xFFFF;
  _rom_write(0x6792,
             new Array(0x44,0x98,0x00,0x80,0x31,0xC9,0x86,0x00,
                       0x00,0x87,0x44,0xCD,0x03,0x67,0xFF,0xFF,
                       0x03,0xB3,0x14),
             0x13);
  //// Throttle Tip-in Fuel Control
  rom.byteAt(0x20FC) = 0x03;
  rom.wordAt(0x20FD) = 0x67A5;
  _rom_write(0x67A5,
             new Array(0x44,0x98,0x00,0x80,0x31,0xB6,0x86,0x00,
                       0x00,0xDB,0x2B,0x03,0x03,0xFF,0x20,0x03,
                       0x0B,0x21),
             0x12);
  // Call Handler
  __fuelToolsHandler();
}



// CL Switch Plugin Check //////////////////////////////////////////////////////
function hasClosedLoopSwitch() {
	rt = rom.base;
	switch (rt) {
    case 1: // P30
		return ((rom.wordAt(0x15A9) == 0xA3C5) &&
				(rom.wordAt(0x6D33) == 0x6152) &&
				(rom.wordAt(0x6D39) == 0x615E));      
    case 2: // P72
		return ((rom.wordAt(0x1651) == 0xBBC5) &&
				(rom.wordAt(0x165F) == 0x5632) &&
				(rom.wordAt(0x1665) == 0x563E));
	}				
}

function addLoopSwitchToP30() {
  //////////////////////////////////////////////////////////////////////////////
  // P30 LOAD DEPENDENT CLOSED/OPEN LOOP SWITCH
  //////////////////////////////////////////////////////////////////////////////
  var 
  	orgCode = new Array(0x10);
  
  // COPY ORG. CODE ///////////////////////////////////////////////////////////
  for (r = 0x00; r < 0x10; r++) {
    orgCode[r] = rom.byteAt(0x15AB + r);
  }
  // FILL IN NEW CODE /////////////////////////////////////////////////////////
  _rom_write(0x15A9,
             new Array(0xC5,0xA3,0xC0,0x40,0xCF,0x05,0xC4,
			 			0x27,0x1E,0xCB,0x07,0xF4,0x2D,0x03,
						0x32,0x6D,0xFF,0xFF),
             0x12);
  // MOVE ORG. CODE ////////////////////////////////////////////////////////////
  for (r = 0x00; r < 0x10; r++) {
    rom.byteAt(0x6D32 + r) = orgCode[r];	
  }
  
  // SET THE RETURN JUMP ///////////////////////////////////////////////////////
  rom.byteAt(0x6D42) = 0x03;
  rom.wordAt(0x6D43) = 0x15BB;
  
}

function addLoopSwitchToP72() {
  //////////////////////////////////////////////////////////////////////////////
  // P72 LOAD DEPENDENT CLOSED/OPEN LOOP SWITCH
  //////////////////////////////////////////////////////////////////////////////
  var 
  	orgCode = new Array(0x4C);
  
  // COPY ORG. CODE ///////////////////////////////////////////////////////////
  for (r = 0x00; r < 0x4C; r++) {
    orgCode[r] = rom.byteAt(0x1651 + r);
  }
  // FILL IN NEW CODE /////////////////////////////////////////////////////////
  _rom_write(0x1651,
             new Array(0xC5,0xBB,0xC0,0x40,0xCF,0x05,0xC4,
			 			0x2F,0x1E,0xCB,0x14),
             0x0B);
  // MOVE ORG. CODE ////////////////////////////////////////////////////////////
  for (r = 0x00; r < 0x4C; r++) {
    rom.byteAt(0x165C + r) = orgCode[r];	
  }
  
  // RE-SIZE JUMPS /////////////////////////////////////////////////////////////
  rom.byteAt(0x16A8) = 0x31;
  rom.wordAt(0x63EA) = 0x1675;
  
}

// Rev Tools Plugin Check /////////////////////////////////////////////////////
function hasRevTools() {
  switch (rom.base) {
    case 0:
      break;
    case 1:
      return (rom.wordAt(0x09F4) == 0x7904);
    case 2:
      break;
  }
}

function setNewBoostType(rt, bt, mn, mx, newMapWdth, loMapHgt, hiMapHgt) {
  if (rt == null) rt = rom.base;
  hiFulHgt = hiMapHgt + 0x01;
  loFulHgt = loMapHgt + 0x01;
  BstColumns = newMapWdth - 0x10;
  switch (rt) {
    case 0: // P28
    break;
    case 1: // P30
	  HiRevTblCor = hiMapHgt - 0x14;
	  LoRevTblCor = loMapHgt - 0x14;
	  Shift = BstColumns + (BstColumns * hiMapHgt) + (BstColumns * loMapHgt) + (BstColumns * hiFulHgt) + (BstColumns * loFulHgt) + 2*(HiRevTblCor * 0x10) + 2*(LoRevTblCor * 0x10) + HiRevTblCor + LoRevTblCor;
	  rom.byteAt(0x70ED - Shift) = bt;    // save boost type indicator
      rom.wordAt(0x70EE - Shift) = (mn + 0x8000);    // save min map info 
      rom.wordAt(0x70F0 - Shift) = (mx + 0x8000);    // save max map info
    break;
    case 2: // P72
	  HiRevTblCor = hiMapHgt - 0x0F;
	  LoRevTblCor = loMapHgt - 0x14;
	  Shift = BstColumns + 2*(BstColumns * hiMapHgt) + 2*(BstColumns * loMapHgt) + (BstColumns * hiFulHgt) + (BstColumns * loFulHgt) + 3*(HiRevTblCor * 0x10) + 3*(LoRevTblCor * 0x10) + HiRevTblCor + LoRevTblCor;
	  rom.byteAt(0x7917 - Shift) = bt;    // save boost type indicator
      rom.wordAt(0x7918 - Shift) = (mn + 0x8000);    // save min map info
      rom.wordAt(0x791A - Shift) = (mx + 0x8000);    // save max map info
  }
}