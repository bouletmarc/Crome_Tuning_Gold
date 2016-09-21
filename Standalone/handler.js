/*********************************************************************
** Rom Loaded Handler
** Auth: John Cui
**
** Desc: This file contains handlers for different rom types
**       when a rom is loaded
**
** NOTE: With Crome.beta.0.7.x or later there is a new function
**       addRomHandler() which will allow handlers to be added
**       from anywhere in the script, not just in the _on_rom_loaded_()
**
** Usage:
** function addRomHandler (ecuType, strAuthor, strHandlerCall)
**
** ecuType        = indicates which ecuType will be handled
**                  valid values are 0-5 or any of the defined
**                  for ecuType constants in the autoload.js file
** strAuthor      = name of the author of the handler script
** strHandlerCall = string representation of function to be called
**                  to handle the loaded rom
**
**/

/**********************************************************************
** _on_rom_loaded_
**
** Desc: This function is run when a rom has been loaded into the editor.
**       This allows for customization by adding specific rom checks
**       and applying the right configuration for each rom.  When a rom
**       is loaded, CROME will try to analyze it and assign a base rom.
**       These values are either rtP28, rtP30, rtP72, rtPR3.  Thus when
**       _on_rom_loaded_ is called, all default information of the base
**       rom are already loaded (ie. table addresses, table sizes, etc.).
**       If the rom has been customized such as Andy's P30 with launch
**       control, then a simple check in the rom for signs of Andy's code
**       in a P30 base rom will allow you to add the proper features
**       to be supported by CROME.
**
**/
function _on_rom_loaded_ () {
  // Check if the rom loaded is P72 based
  if (rom.base == rtP72) {
  	if (rom.byteAt(0x7850) == 0x8B) _loadUberRom (1);
  // Check if thr rom loaded is P30 based
  } else if (rom.base == rtP30) {    
	if (rom.wordAt(0x78B0) == 0xB4B5) _p30_andy ();
  // Check if the rom loaded is P28 based
  } else if (rom.base == rtP28) {
    if (rom.wordAt(0x7E60) == 0xCCF5) _p28_ftl ();
  }
} // */

///////////////////////////////////////////////////////////////////////

/**********************************************************************
** The following scripts are just for backwards compatibility.
**/

/*********************************************************************
** UBER BOOST SCRIPT
**
** Desc: This is used to load the corrected addresses for the 
**       boosted Uberchips.
**/
function _loadUberRom (boostType) {
	if (boostType == null) boostType = 0;
	rom.base = rtCustom;
	rom.title = 'Uberchip';
	rom.addressOf('NFO_LOW_TABLE') = 0x140F; // Lo Byte = Columns & Hi Byte = Rows
	rom.addressOf('NFO_HIGH_TABLE') = 0x0F0F; // Lo Byte = Columns & Hi Byte = Rows
	rom.addressOf('LOW_MAP_SCALAR') = 0x7C4A; 
	rom.addressOf('HIGH_MAP_SCALAR') = 0x7C4A;
	rom.addressOf('LOW_REV_SCALAR') = 0x7C68;
	rom.addressOf('HIGH_REV_SCALAR') = 0x7C7C;
	rom.addressOf('LOW_FUEL') = 0x6770;
	rom.addressOf('HIGH_FUEL') = 0x71F0;
	rom.addressOf('LOW_IGNITION') = 0x6B90;
	rom.addressOf('HIGH_IGNITION') = 0x7060;
	rom.addressOf('LAUNCH_CUT') = 0x702C;
	rom.addressOf('lAUNCH_RES') = 0x7027;
	rom.hasLaunchControl = 1;
	rom.hasBoost = 0;
	rom.hasBoost = boostType;
	refresh();
} // _loadUberRom */
///////////////////////////////////////////////////////////////////////
// The famous P28FTL
function _p28_ftl () {
  rom.title = 'P28 FTL';
  rom.addressOf('REV_CUT1') = 0x7E79;
  rom.addressOf('REV_RES1') = 0x7E74;
  rom.addressOf('REV_CUT2') = 0x7E79;
  rom.addressOf('REV_RES2') = 0x7E74;
  rom.addressOf('LAUNCH_CUT') = 0x7E6C;
  rom.addressOf('LAUNCH_RES') = 0x7E67;
  rom.hasLaunchControl = 1;
  refresh();
} // */
// Andy's excelently coded P30 w/ launch
function _p30_andy () {
  rom.title = 'Andy FTLP30';
  rom.addressOf('LAUNCH_CUT') = 0x78BC;
  rom.addressOf('LAUNCH_RES') = 0x78B8;
  rom.hasLaunchControl = 1;
  refresh ();
} // */
///////////////////////////////////////////////////////////////////////