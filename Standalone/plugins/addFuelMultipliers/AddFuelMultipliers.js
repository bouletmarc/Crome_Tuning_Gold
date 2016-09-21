/**************************************************************
** Add Fuel Multipliers..
** Ver. 1.2
** auth: Damian Badalamenti
** desc:
**/

function _rom_write(startAt, v, count) {
	for (c = 0; c < count; c++) {
	   window.external.rom.byteAt(startAt + c) = v[c];
	}
}

function _rom_fill (fromAdr, toAdr, byteFill) {
	if (byteFill == null) byteFill = 0x00;
	for (i = fromAdr; i <= toAdr; i++) {
		window.external.rom.byteAt(i) = byteFill;
	}
}


function addTpsColdMain(rt){
  if (rt == null) rt = window.external.rom.base;
  switch (rt) {
    case 0: // P28
      addFuelModsToP28();
    break;
    case 1: // P30
      addFuelModsToP30();
    break;
    case 2: // P72
      addFuelModsToP72();
   }
}
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function addFuelModsTo28(){
            alert("Can someone write this portion of the script?\nI\'m too lazy to do it.");
            return;
}
///Add Fuel Enrichement Support To a P30////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


///Add Fuel Enrichement Support To a P72////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function addFuelModsToP72(){
			
			window.external.rom.wordAt(0x4987) = 0x714C; //Pointer--> Blank Table
    		window.external.rom.wordAt(0x297B) = 0x714C; //Pointer--> Blank Table
    		window.external.rom.wordAt(0x4F3B) = 0x714C; //Pointer--> Blank Table
    		window.external.rom.wordAt(0x399F) = 0x714C; //Pointer--> Blank Table
            
			//MainFuel
			window.external.rom.byteAt(0x129D) = 0x03;
            window.external.rom.wordAt(0x129E) = 0x70C0;
			window.external.rom.byteAt(0x12A0) = 0xFF;
			
            s = new Array(0xE5,0x06,0x44,0x8A,0x90,0x9C,0x40,0x71,0x90,0x35,0x33,0x35,
						0x33,0xD4,0x40,0xF4,0x80,0x03,0xA1,0x12);
			_rom_write(0x70C0, s, 0x14);
           
						
			//O2Correction
			window.external.rom.byteAt(0x1C64) = 0x03;
            window.external.rom.wordAt(0x1C65) = 0x70D4;
			window.external.rom.byteAt(0x1C67) = 0xFF;
            s = new Array(0x92,0x81,0x92,0xA8,0x45,0x4B,0x44,0x8A,0x90,0x9C,0x42,0x71,
						0x90,0x35,0x33,0x35,0x33,0x47,0x49,0x03,0x68,0x1C);
			_rom_write(0x70D4, s, 0x16);
			
			//CrankFuel
            window.external.rom.byteAt(0x14AC) = 0x03;
			window.external.rom.wordAt(0x14AD) = 0x70EC;
            _rom_fill (0x14AF, 0x14B0, 0xFF);
            s = new Array(0xE5,0x06,0x44,0x8A,0x90,0x9C,0x44,0x71,0x90,0x35,0x33,0x35,
						0x33,0x87,0x44,0xCD,0x03,0x67,0xFF,0xFF,0x03,0xB3,0x14);
			_rom_write(0x70EC, s, 0x17);
			
			//TpsFuel
			window.external.rom.byteAt(0x1468) = 0x03;
			window.external.rom.wordAt(0x1469) = 0x7103;
			_rom_fill (0x14AF, 0x14B2, 0xFF);
            s = new Array(0xE5,0x06,0x44,0x8A,0x90,0x9C,0x46,0x71,0x90,0x35,0x33,0x35,
						0x33,0xD4,0x42,0xED,0x1F,0x03,0x03,0xBD,0x15,0x03,0x70,0x14);
			_rom_write(0x7103, s, 0x18);
									
			//PostFuel
            window.external.rom.byteAt(0x157F) = 0x03;
			window.external.rom.wordAt(0x1580) = 0x711B;
            s = new Array(0x35,0x44,0x8A,0x90,0x9C,0x48,0x71,0x90,0x35,0x33,0x35,0x33,
						0xD4,0x70,0x03,0x82,0x15);
			_rom_write(0x711B, s, 0x11);
			
			//EctFuel
            window.external.rom.byteAt(0x1DDA) = 0x03;
			window.external.rom.wordAt(0x1DDB) = 0x712C;
            window.external.rom.byteAt(0x1DDD) = 0xFF;
            s = new Array(0x20,0x8A,0x90,0x9D,0x4A,0x71,0xA2,0x34,0xE5,0x06,0x33,0xF5,
						0x07,0xD4,0x63,0xF4,0x32,0x03,0xDE,0x1D);
			_rom_write(0x712C, s, 0x14);
			
			//Multiplier Table
			window.external.rom.wordAt(0x7140) = 0x8000; //main
			window.external.rom.wordAt(0x7142) = 0x8000; //o2
			window.external.rom.wordAt(0x7144) = 0x8000; //crank
			window.external.rom.wordAt(0x7146) = 0x8000; //tps
			window.external.rom.wordAt(0x7148) = 0x8000; //post
			window.external.rom.wordAt(0x714A) = 0x0080; //ect
			alert('Final-Crank-Tps multiplier support has been added the P72 ROM.');
			window.external.refresh();
			return;
}
////////////////////////////////////////////////////////////////////////////////////////
/**************************************************************************************/



