/*********************************************************************
** AUTOLOAD FILE
** Auth: John Cui
**
** Desc: The javascript within this file are automatically loaded
**       by CROME at startup
**
** NOTE: Any function that starts with an underscore _my_function ()
**       Will not be loaded in the Commands list of CROME
**       It is like hiding the functions.
**/

/*********************************************************************
** CONSTANTS
**
** Desc: These variables define the different rom types and their 
**       integer values used by Crome
**/

/* Rom Types */
// IDENTIFIER      VALUE      
// ========================
   rtP28           = 0;
   rtP30           = 1;
   rtP72           = 2;
   rtPR3           = 3;
   rtP13           = 4;
   rtPW0j          = 5;
   rtPW0e          = 6;
   rtPM6           = 7;
   rtPR4           = 8;
   rtCustom        = 9;
   rtUnknown       = 10;
   
/* Rom OBD Modes */
// IDENTIFIER      VALUE
// ========================
   omOBD0          = 0;
   omOBD1          = 1;
   omOBD2          = 2;
   omUnknown       = 3;

/* Plugin Categories */
// IDENTIFIER      VALUE      
// ========================
   pcNone          = 0;
   pcEnhancements  = 1;
   pcUtilities     = 2;
   pcControl       = 3;
   pcMisc          = 4;
////////////////////////////////////////////////////////////////////////

/**********************************************************************
** Rom Load Handler
**
** Desc: Load the _on_rom_loaded_() handler from an external file
**       This was done to clean up the autoload.js file
**
**/

include ('handler.js');

////////////////////////////////////////////////////////////////////////


/*******************************************************************
** UTILITY FUNCTIONS
**
** Desc: These function are just some useful utilities to
**       manipulate the rom data
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
/* Convert byte value to VTEC type RPM */
function _byte_to_rpm(b) {
  return Math.round((b - 128) * 1875000 / 30000);
} // */
function _rpm_to_byte(r) {
  return Math.round(r * 30000 / 1875000 + 128);
} // */
/* Convert word value to RPM */
function _word_to_rpm(w) {
  return Math.round(1875000 / w);
} // */
function _rpm_to_word(r) {
  return Math.round(1875000 / r);
} // */
/* Check if a variable is a valid number */
function isNumeric(n) {
  return (!isNaN(n) && (n != ''));
} // */
/* Convert a hexidecimal string to decimal value */
function HexToDec (h) {
  return eval('0x' + h);
} // */
////////////////////////////////////////////////////////////////////////
