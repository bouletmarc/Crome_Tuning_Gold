/**********************************************************************
** ACcutoff Plugin based on JOEL'S (streets97f) ROM code.
** Auth: Ryan Evertsz (ryanevertsz)
** Modified 07/07/05 by JOEL (streets97f)
** Ver. 1.0
**     
**/

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

//var crome = window.external;
//var rom = crome.rom;


addPlugin('Ryan Evertsz','Air Conditioning Cutoff (p30) Modified', '__ACcutoffStart()','',3);

function __ACcutoffStart() {
 if (rom.base !=  rtP30 && rom.base != rtP72) {
    alert('This plugin only has support for P30 and P72 ROMs right now.');
    return;
	}
    showBrowser('#SCRIPT_DIR#ACcutoff\\gui.html', 460, 230);
refresh ();
}



