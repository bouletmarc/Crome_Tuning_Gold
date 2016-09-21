/**********************************************************************
** Custom TPS Plugin based on ITB code TPS rescale.
** Auth: Ryan Evertsz (ryanevertsz)@pgmfi.org
**     
** Version : 0.1 beta only p30 support
**/


//******************************************************
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



addPlugin('Ryan Evertsz','Calibrate non honda TPS', 'TPSchange(null, 1)','',2);

function TPSchange (romType) {
showBrowser('#SCRIPT_DIR#TPS\\gui.html', 460, 231)
	if (romType == null) romType = rom.base;
	switch (romType) {	
		case rtP72:
			alert('No support yet for P72 rom');
		break;
		
		case rtP28:
			alert('No support yet for P28 rom');	
		break;

		case rtP30:
			var min, max;
			min = (getTPScalerVolts()[0]).toFixed(2);
			max = (getTPScalerVolts()[1]).toFixed(2);
			
			
				rom.gup();	
				//TPS ReScale code
				rom.byteAt(0x088F) = 0x03; //JUMP
  				rom.wordAt(0x0890) = 0x6D34;// to label_6D34
  				rom.byteAt(0x4473) = 0xB9; // Change TPS ADCR7 reff to reff rescaled value in RAM 
  				rom.byteAt(0x4813) = 0xB9; // Change TPS ADCR7 reff to reff rescaled value in RAM

				//TPS rescale routine @ ox6D34
				_rom_write(0x6D34,new Array(0xF5,0x6F,0x60,0xF8,0x6F,0x12,0x44,0x15,0x89,0x03,0x92,0x08),0x0C);

				//TPS rescale table
				if (rom.byteAt(0x4473)!=0xB9) _rom_write(0x6FF8, new Array(0xE7,0xE7,0x18,0x18), 0x04);

				rom.gup();
		break;
	
	}

}