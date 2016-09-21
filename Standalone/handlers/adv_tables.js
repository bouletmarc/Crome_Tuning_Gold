/*******************************************************************************
** Advance Table Script v2.0 for Crome 1.1.8R2+
**
** Changelog V1.3:
** -Fixed individual cylinder trim editing P28 / P30 / P72 (DB)
** -Proper labelling for ECT trims WARNING FURTHER TESTING NEEDED P30 / P72(CB / DB)
** -Added ECT Idle trim adjustment P30 unused in P72 (CB / DB)
** -Added Cranking Fuel Adjustment P30/P72 (CB)
** -Added Post Fuel Adjustment P30/P72 (CB)
** -Preliminary ECT Ign Adjustment WARNING UNTESTED P30 (CB)
** -Preliminary IAT Ign Adjustment WARNING UNTESTED P30 / P72 (CB / DB)
**
** Auth: John Cui
**       Damian Badalamenti
**	 Dave B.
**	 Calvin B.
**
** Desc: This script shows how to make use of the new Advance Tables Tool in
**       Crome.  Go to 'Tools->Advance Tables' in the Crome main menu to view
**       script in action.
**
**       The Advance Tables Tool utilizes a new object in the Crome Scripting
**       API.  Here is the breakdown of the new object and it's uses.
**

 window.customTable [
  name       := name displayed in the browser 
  height     := number of rows (fixed rows not included)
  width      := number of cols (fixed cols not included)
  address    := address of the tables
  fixedCols  := number of fixed columns -- row headings
  fixedRows  := number of fixed rows -- column headings
  fixedEditable := state of which fixed cells are editable. Make sure that this
             is handled by the OnSetValue event
             0 = none
             1 = columns only
             2 = rows only
             3 = both columns and rows
             
  OnLoad     := name of the function that loads when the plugin is selected
  OnGetValue := name of the function that handles how the table values are 
                displayed.  The format goes as my_function(col,row) where
                col and row are zero based index which includes the fixed
                cells (headers)
  OnSetValue := name of the function that handles how the table values are
                edited.  The format goes as my_function(col,row,value) where
                col and row are zero based index and value is the new value
                being entered
  description := something about the plugin. Displayed on the space between the
                table and the graph
  graphMinX,graphMaxX := minimum and maximum x-axis values for the graph
  graphMinY,graphMaxY := minimum and maximum y-axis values for the graph
  graphLabelX := label of the bottom of the graph (optional)
  graphLabelY := label of the left side of the graph (optional)
  
 ] // end
  
  This is not the final list but it should be suitable what is needed as of now.

**/

  var ShowFahr = 1;
  nam = 'crome.ini';
  initxt = files.getfile(nam);
  if (initxt.indexOf("ShowFahrenheit=0")!=-1) {
         ShowFahr = 0;
         Temp = 'Temp (°C)'; }
  else 
         Temp = 'Temp (°F)';

// This function is called whenever this specific plugin is selected in
// the Advance Tables window.  It loads the defalt parameters to properly
// display this plugin.  The plugin will be loaded if the function returns true
function __IATLoadCustomTable() {
  // makes life easier
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust fuel compensation for a given Intake Air Temperature. ' +
    '1.00 means no correction.  Above means more fuel. Below means less fuel. ' +
    'Warning: This is an advanced feature and should only be changed by someone ' +
    'with full knowledge of its functionality.';
  // Min and max values can only be integers
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 2;
 // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'Multiplier';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x6172;
      return true; 
    case rtP30:
      ct.address = 0x607a;
      return true;
    case rtP72:
      ct.height = 3;
      ct.address = 0x5516;
      ct.width = 9;
      return true;
  }
  return false;
}

function __IATGetCustomValue(c,r) {
  var lbase = window.customTable.address,
      mbase = lbase + (window.customTable.width * 3),
      hbase = mbase + (window.customTable.width * 3);
  // If row = 0 ... we're on the column headers
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(lbase + ((c-1) * 3))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  // If row = 1, c == 0
  } else if (c == 0) {
    if (r == 1) {
      if (window.customTable.height > 1) return 'Low Load';
      else return 'Multiplier';
    } else if (r == 2) return 'Med Load';
    else return 'High Load';
  // If we're on the table itself
  } else {
    if (r == 1) return (rom.wordAt(lbase + ((c-1)*3) + 1) / 0x8000).toFixed(2);
    else if (r == 2) return (rom.wordAt(mbase + ((c-1)*3) + 1) / 0x8000).toFixed(2);
    else return (rom.wordAt(hbase + ((c-1)*3) + 1) / 0x8000).toFixed(2);
  }
}

function __IATSetCustomValue(c,r,v) {
  var lbase = window.customTable.address,
      mbase = lbase + (window.customTable.width * 3),
      hbase = mbase + (window.customTable.width * 3);
  if (r == 1) rom.wordAt(lbase + ((c-1)*3) + 1) = (0x8000 * v).toFixed(0);
  else if (r == 2) rom.wordAt(mbase + ((c-1)*3) + 1) = (0x8000 * v).toFixed(0);
  else rom.wordAt(hbase + ((c-1)*3) + 1) = (0x8000 * v).toFixed(0);
}

// This is the function called to add an Advance Table plugin. The format goes as
//
// addCustomTable( sTABLE_NAME,              // table name
//                 nWIDTH,                   // table width
//                 nHEIGHT,                  // table height
//                 nADDRESS,                 // table address
//                 [sONLOAD_HANDLER],        // OnLoad handler (optional)
//                 [sONGETVALUE_HANDLER],    // OnGetValue handler (optional)
//                 [sONSETVALUE_HANDLER],    // OnSetValue handler (optional)
//                 [sONUNLOAD_HANDLER],      // OnUnload handler (optional)
//                 [sDESC] )                 // table description
//
//
//
addCustomTable('IAT Fuel Compensation', 0,0,0,'__IATLoadCustomTable','__IATGetCustomValue','__IATSetCustomValue');

// ECT Correction //////////////////////////////////////////////////////////////
var _ECT_DIV_VALUE_
function __ECTLoadCustomTable() {
  ct = window.customTable;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust fuel compensation for a given Engine Coolant Temperature. ' +
    '1.00 means no correction.  Above means more fuel. Below means less fuel. ' +
    'Warning: This is an advanced feature and should only be changed by someone ' +
    'with full knowledge of its functionality.';
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 2.5;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'Multiplier';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
	ct.height = 2;
      ct.address = 0x611E;
	  _ECT_DIV_VALUE_ = 0x40;
      return true;
 
    case rtP30:
	ct.height = 5;  
	_ECT_DIV_VALUE_ = 0x40;
	return true;

    case rtP72:
	ct.height = 5;
      ct.width = 9;
	  _ECT_DIV_VALUE_ = 0x80;
      return true;
  }
  return false;
}

function __ECTGetCustomValue(c,r) {

switch (rom.base) {
    case rtP28:
      return false;
 
    case rtP30: 
	switch (r)	{  // row label P30

	case 0: {	if (c == 0) return Temp;
    			else return (rom.byteToCelcius(rom.byteAt(0x6034 + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  		}  //end case 0

	case 1: {	if (c == 0) return 'Open Loop';
			else return (rom.byteAt(0x6034+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 1

	case 2: {	if (c == 0) return 'Max Bounds ??';
			else return (rom.byteAt(0x6042+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 2

	case 3: {	if (c == 0) return 'Closed Loop';
			else return (rom.byteAt(0x6050+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 3

	case 4: {	if (c == 0) return 'Auto Tranny';
			else return (rom.byteAt(0x605e+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 4

	case 5: {	if (c == 0) return '0016fh';
			else return (rom.byteAt(0x606c+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 5

		}// end switch(r) (p30)
	return true;  //catch-all P30

    case rtP72:
	switch (r)	{  // row label P72

	case 0: {	if (c == 0) return Temp;
    			else return (rom.byteToCelcius(rom.byteAt(0x54a2 + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  		}  //end case 0

	case 1: {	if (c == 0) return 'Open Loop';
			else return (rom.byteAt(0x54a2+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 1

	case 2: {	if (c == 0) return 'Max Bounds ??';
			else return (rom.byteAt(0x54b4+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 2

	case 3: {	if (c == 0) return 'Closed Loop';
			else return (rom.byteAt(0x54c6+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 3

	case 4: {	if (c == 0) return 'Auto Tranny';
			else return (rom.byteAt(0x54d8+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
		}  //end case 4

	case 5: {	if (c == 0) return '0017fh';
//			_ECT_DIV_VALUE_ = 0x40;
//			else return (rom.byteAt(0x54ea+((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
			else return (rom.byteAt(0x54ea+((c-1)*2) + 1) / 0x40).toFixed(2);
		}  //end case 5

		}// end switch(r) (p72)
      return true; //catch-all P72

  } //end switch(rom.base)

} // end __ECTGetCustomValue(c,r)

function __ECTSetCustomValue(c,r,v) { //sets values, called by class

switch (rom.base) {
    case rtP28:
      return false;
 
    case rtP30:
	switch (r)	{  // row label P30

	case 0: {	if (c == 0) return false;
    			else return false;  //this can be fixed - needs more love
  		}  //end case 0

	case 1: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6034+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 1

	case 2: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6042+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 2

	case 3: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6050+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 3

	case 4: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x605e+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 4

	case 5: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x606c+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 5

		}// end switch(r) P30
	return true;

    case rtP72:
	switch (r)	{  // row label P72

	case 0: {	if (c == 0) return false;
    			else return false;  //this can be fixed - needs more love
  		}  //end case 0

	case 1: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x54a2+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 1

	case 2: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x54b4+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 2

	case 3: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x54c6+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 3

	case 4: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x54d8+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			return true;
		}  //end case 4

	case 5: {	if (c == 0) return false;  //no changing label
//			_ECT_DIV_VALUE_ = 0x40;
//			else rom.byteAt(0x54ea+((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
			else rom.byteAt(0x54ea+((c-1)*2)+1) = (0x40 * v).toFixed(0);
			return true;
		}  //end case 5

		}// end switch(r) P72
      return true;
  }//end switch(rom.base)

}  // end __ECTSetCustomValue(c,r,v)

addCustomTable('ECT Fuel Compensation',0,0,0,'__ECTLoadCustomTable','__ECTGetCustomValue','__ECTSetCustomValue');


// Idle ECT Correction
function __ECTIdleLoadCustomTable() {
  // makes life easier
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 1;
  ct.description = 'Adjust fuel compensation for a given Engine Coolant Temperature. WHILE IDLING' +
    '1.00 means no correction.  Above means more fuel. Below means less fuel. ' +
    'Warning: This is an advanced feature and should only be changed by someone ' +
    'with full knowledge of its functionality.  This feature does not appear to be used much on P72, but is important on P30.';
  // Min and max values can only be integers
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 2;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'Multiplier';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
//      ct.address = 0x612c;
      return false; 
    case rtP30:
      ct.address = 0x653a;
      _ECT_DIV_VALUE_ = 0x40;
      return true;
    case rtP72:
      ct.address = 0x59b4;
      ct.width = 9;
      _ECT_DIV_VALUE_ = 0x80;
      return true;
  }
  return false;
}

function __ECTIdleGetCustomValue(c,r) {
  var base = window.customTable.address;
  // If row = 0 ... we're on the column headers
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  // If row = 1, c == 0
  } else if ((r == 1) && (c == 0)) {
    return 'Multiplier';
  // If we're on the table itself
  } else {
    return (rom.byteAt(base + ((c-1)*2) + 1) / _ECT_DIV_VALUE_).toFixed(2);
  }
}

function __ECTIdleSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  // If editing column headers
  if (r == 0)
    rom.byteAt(base + ((c-1) * 3)) = rom.celciusToByte((v-32*ShowFahr)/(1+0.8*ShowFahr));
  // If editing table
  else
    rom.byteAt(base + ((c-1)*2)+1) = (_ECT_DIV_VALUE_ * v).toFixed(0);
}

addCustomTable('ECT Fuel Idle Compensation',0,0,0,'__ECTIdleLoadCustomTable','__ECTIdleGetCustomValue','__ECTIdleSetCustomValue');

// Post Fuel Correction ///////////////////////////////////////////////////////
function __CSCLoadCustomTable () {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust the amount/length of postfuel. Higher number means more fuel' +
  		 'longer post fuel. Small number means less fuel/short postfuel.'
  		 'Use with caution.';
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 50;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'PostFuel Value';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x619f;
      ct.width = 8;
      return true; 
    case rtP30:
      ct.address = 0x60a7;
      return true;
    case rtP72:
      ct.address = 0x557F;
      ct.width = 9;
      return true;
  }
  return false;
}

function __CSCGetCustomValue (c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 3))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  } else if ((c == 0) && (r == 1))
    return 'PostFuel Val';
  else
    return (rom.wordAt(base + ((c-1)*3) + 1) / 0x400).toFixed(2);
}

function __CSCSetCustomValue (c,r,v) {
  var base = window.customTable.address;
  rom.wordAt(base + ((c-1)*3) + 1) = (0x400 * v).toFixed(0);
}

addCustomTable('Post Fuel Compensation', 0,0,0,'__CSCLoadCustomTable','__CSCGetCustomValue','__CSCSetCustomValue');

// Crank Duration Correction ///////////////////////////////////////////////////////
function __CRCLoadCustomTable () {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 8;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Ajust injector duration during crank';
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 100;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'Inj(ms)';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x619f;
      return true; 
    case rtP30:
      ct.address = 0x62FF;
      return true;
    case rtP72:
      ct.address = 0x557F;
      return true;  //untested
  }
  return false;
}

function __CRCGetCustomValue (c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 3))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  } else if ((c == 0) && (r == 1))
    return 'Inj(ms)';
  else
    return ((rom.wordAt(base + ((c-1)*3) + 1) * 3.2)/1000).toFixed(2);
}

function __CRCSetCustomValue (c,r,v) {
  var base = window.customTable.address;
  rom.wordAt(base + ((c-1)*3) + 1) = ((1000 * v)/3.2).toFixed(0);
}

addCustomTable('Crank Fuel Compensation', 0,0,0,'__CRCLoadCustomTable','__CRCGetCustomValue','__CRCSetCustomValue');

// Idle Speed vs ECT ///////////////////////////////////////////////////////////
function __IdleLoadCustomTable() {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Warning: This is an advanced feature and should only be ' +
    'changed by someone with full knowledge of its functionality.';
  ct.graphMinX = 0;
  ct.graphMaxX = 220
  ct.graphMinY = 0;
  ct.graphMaxY = 1700;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'RPM';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
    
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x68cb;
      return true; 
    case rtP30:
      ct.address = 0x66e5;
      return true;
    case rtP72:
      ct.address = 0x5ba7;
      return true;
  }
  return false;
}

function __IdleGetCustomValue(c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 3))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  } else if ((r == 1) && (c == 0)) {
    return 'RPM';
  } else {
    var r = (0x1C9C38 / rom.wordAt(base + ((c-1)*3) + 1)).toFixed(0);
    if (r > window.customTable.graphMaxY)
      window.customTable.graphMaxY = r + 500;
    return r;
  }
}

function __IdleSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  if (v > window.customTable.graphMaxY)
    window.customTable.graphMaxY = v + 500;
  if (r == 0)
    rom.byteAt(base + ((c-1) * 3)) = rom.celciusToByte((v-32*ShowFahr)/(1+0.8*ShowFahr));
  else
    rom.wordAt(base + ((c-1)*3) + 1) = (0x1C9C38 / v).toFixed(0);
}

addCustomTable('Idle Speed vs ECT',0,0,0,'__IdleLoadCustomTable','__IdleGetCustomValue','__IdleSetCustomValue');
function __IdleMoveLoadCustomTable() {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Warning: This is an advanced feature and should only be ' +
    'changed by someone with full knowledge of its functionality.';
  ct.graphMinX = 0;
  ct.graphMaxX = 220
  ct.graphMinY = 0;
  ct.graphMaxY = 1700;
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'RPM';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };

  
  switch (rom.base) {
   case rtP28:
     ct.address = 0x68e0;
     return true; 
    case rtP30:
      ct.address = 0x66FA;
      return true;
   case rtP72:
     ct.address = 0x5bbc;
     return true;
  }
    	alert("This plugin only has support for P30 ROMs right now.");
  return false;
}

function __IdleMoveGetCustomValue(c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 3))) * (1+ 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  } else if ((r == 1) && (c == 0)) {
    return 'RPM';
  } else {
    var r = (0x1C9C38 / rom.wordAt(base + ((c-1)*3) + 1)).toFixed(0);
    if (r > window.customTable.graphMaxY)
      window.customTable.graphMaxY = r + 500;
    return r;
  }
}

function __IdleMoveSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  if (v > window.customTable.graphMaxY)
    window.customTable.graphMaxY = v + 500;
  if (r == 0)
    rom.byteAt(base + ((c-1) * 3)) = rom.celciusToByte((v-32*ShowFahr)/(1+0.8*ShowFahr));
  else
    rom.wordAt(base + ((c-1)*3) + 1) = (0x1C9C38 / v).toFixed(0);
}

addCustomTable('Idle Speed(moving) vs ECT',0,0,0,'__IdleMoveLoadCustomTable','__IdleMoveGetCustomValue','__IdleMoveSetCustomValue');

// Individual Cylinder Trim ////////////////////////////////////////////////////
function __ICTLoadCustomTable() {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 4;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust individual cylinder fuel trim.  Allows changing fuel on a ' +
    'per-cylinder basis.  ' +
    'Ideally, 4 EGTs would be used in conjunction with this feature.  Larger numbers mean more fuel.  ' +
    'THIS IS INCREDIBLY DANGEROUS TO USE BLIND!  USE AT OWN RISK!  YOU HAVE BEEN WARNED!!!' +
    '  YOU CAN BLOW YOUR MOTOR VERY QUICKLY WITH INCORRECT VALUES HERE!  STOCK IS 1.000 FOR ALL CYLINDERS';
  ct.showGraph = false;
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x62C7;
      return true; 
    case rtP30:
      ct.address = 0x61BA;
      return true;
    case rtP72:
      ct.address = 0x569A;
      return true;
  }
  return false;
}

function __ICTGetCustomValue(c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    switch (c) {
      case 0: return 'Cylinder#';
      case 1: return 1;
      case 2: return 3;
      case 3: return 4;
      case 4: return 2;
    }
  } else if ((r == 1) && (c == 0)) {
    return 'Multiplier';
  } else {
    return (_byte_to_multi(rom.byteAt(base + c - 1)));
  }
}

function __ICTSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  rom.byteAt(base + c - 1) = _multi_to_byte(v);
}

//**********************************************************
// Conversion formulas for Individual cylinder trim!!
// these work where 00 is full rich and ff is full lean
// due to a SWAP before the MUL
//**********************************************************
// Convert multi
function _byte_to_multi(b) {
  return (2 - (b / 0x80)).toFixed(3);
}

function _multi_to_byte(r) {
  if (r == 1.00) return (0x80);
  else if (r < 0.00) return (0xff);
  else if (r > 1.99) return (0x00);
  else return ((2 - r) * 0x80);
}

addCustomTable('Individual Cylinder Trim',0,0,0,'__ICTLoadCustomTable','__ICTGetCustomValue','__ICTSetCustomValue');

// START RPM8 FUNCTIONS ////////////////////////////////////////////////////////
function _byte_to_rpm (b) { 
  return Math.round(Math.pow(2, Math.floor(b / 64)) * ((b % 64) * (500 / 64) + 500)); 
} 
function _seek_rpm_byte(lo, hi, rpm) { 
  var mid = 0; 
  if ((hi - lo) < 2) return hi; 
  else if (rpm < 500) return 0; 
  else { 
    mid = lo + Math.floor((hi - lo) / 2); 
    if (rpm > _byte_to_rpm(mid)) 
      return _seek_rpm_byte(mid, hi, rpm); 
    else 
      return _seek_rpm_byte(lo, mid, rpm); 
  } 
}
function _rpm_to_byte(rpm) {
  return _seek_rpm_byte(0x00, 0xFF, rpm);
}
// END RPM8 FUNCTIONS

// START MAP FUNCTIONS /////////////////////////////////////////////////////////
function _byte_to_mbar(b) {
  if (rom.hasBoost) return rom.byteToMillibar(b);
  else return ((((b / 2) + 0x18) * 7.221) - 59).toFixed(0);
}
function _mbar_to_byte(mbar) {
  if (rom.hasBoost) return rom.millibarToByte(mbar);
  else ((((mbar + 59) / 7.221) - 0x18) * 2).toFixed(0);
}
// END MAP FUNCTIONS

// Advance VTEC ////////////////////////////////////////////////////////////////
function __VTECLoadCustomTable() {
  ct = window.customTable;
  ct.height = 2;
  ct.width = 2;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust each individual VTEC switchover points for low and high loads. ' +
    'Warning: This is an advanced feature and should only be ' +
    'changed by someone with full knowledge of its functionality.';
  ct.showGraph = false;
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x6546;
      return true; 
    case rtP30:
      ct.address = 0x6436;
      return true;
    case rtP72:
      // P72 only has 1 VTEC table
  }
  return false;
}

function __VTECGetCustomValue(c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    switch (c) {
      case 0: return 'RPM';
      case 1: return 'Engage';
      case 2: return 'Disengage';
    }
  } else if (c == 0) {
    switch (r) {
      case 1: return 'Low Load';
      case 2: return 'High Load';
    }
  } else {
    if (r == 1) {
      if (c == 1) return _byte_to_rpm(rom.byteAt(base+3));
      else return _byte_to_rpm(rom.byteAt(base+2));
    } else {
      if (c == 1) return _byte_to_rpm(rom.byteAt(base+1));
      else return _byte_to_rpm(rom.byteAt(base));
    } 
  } 
}

function __VTECSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  if (r == 1) {
    if (c == 1) {
      if (v < __VTECGetCustomValue(2,1)) v = __VTECGetCustomValue(2,1); 
      rom.byteAt(base+3) = _rpm_to_byte(v);
    } else {
      if (v > __VTECGetCustomValue(1,1)) v = __VTECGetCustomValue(1,1);
      rom.byteAt(base+2) = _rpm_to_byte(v);
    }
  } else {
    if (c == 1) {
      if (v < __VTECGetCustomValue(2,2)) v = __VTECGetCustomValue(2,2);
      rom.byteAt(base+1) = _rpm_to_byte(v);
    } else {
      if (v > __VTECGetCustomValue(1,2)) v = __VTECGetCustomValue(1,2)
      rom.byteAt(base) = _rpm_to_byte(v);
    }
  }
}

addCustomTable('VTEC Switchover',0,0,0,'__VTECLoadCustomTable','__VTECGetCustomValue','__VTECSetCustomValue');

// VTEC Load Threshold /////////////////////////////////////////////////////////
function __VTLTLoadCustomTable() {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Adjust each RPM point to determine the threshold from low to ' +
    'high loads. If above the given load value, VTEC switches over using the high ' +
    'load VTEC crossover. Warning: This is an advanced feature and should only be ' +
    'changed by someone with full knowledge of its functionality.';
  ct.graphMinX = 500;
  ct.graphMaxX = 8000
  ct.graphMinY = 0;
  ct.graphMaxY = 1300;
  ct.graphLabelX = 'RPM';
  ct.graphLabelY = 'Load (mbar)';
  ct.showGraph = true;
   
  switch (rom.base) {
    case rtP28:
      ct.address = 0x6558;
      return true; 
    case rtP30:
      ct.address = 0x6448;
      return true;
    case rtP72:
      // P72 only has 1 VTEC table
  }
  return false;
}

function __VTLTGetCustomValue(c,r) {
  var base = window.customTable.address;
  if (r == 0) {
    if (c == 0) return 'RPM';
    else return _byte_to_rpm(rom.byteAt(base + ((c-1) * 2)));
  } else if ((c == 0) && (r == 1)) return 'Threshold (mbar)';
  else
    return _byte_to_mbar(rom.byteAt(base + ((c-1) * 2) + 1));
}

function __VTLTSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  rom.byteAt(base + ((c-1) * 2) + 1) = _mbar_to_byte(v);
}

addCustomTable('VTEC Load Threshold',0,0,0,'__VTLTLoadCustomTable','__VTLTGetCustomValue','__VTLTSetCustomValue');

// ECT Correction //////////////////////////////////////////////////////////////
var _ECT_DIV_VALUE_
function __ECTIgn2LoadCustomTable() {
  ct = window.customTable;
  ct.width = 6;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'read carefully! If iat is below b5h, ect advance get pulled down';
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 30;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'Multiplier';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
  ct.graphMinX = -15;
  ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
    case rtP28:
	ct.height = 2;
      ct.address = 0x611E;
      return false;
      
     case rtP30:
	ct.height = 5;  
	return true;

    case rtP72:
	ct.height = 5;
      ct.width = 9;
      return false;
  }
  return false;
}

function __ECTIgn2GetCustomValue(c,r) {

switch (rom.base) {
    case rtP28:
      return false;
 
    case rtP30: 
	switch (r)	{  // row label P30

	case 0: {	if (c == 0) return Temp;
    			else return (rom.byteToCelcius(rom.byteAt(0x6034 + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  		}  //end case 0

	case 1: {	if (c == 0) return 'Ect Retard 1';
			else return (rom.byteAt(0x6a63+((c-1)*2) + 1) / 4).toFixed(2);
		}  //end case 1

	case 2: {	if (c == 0) return 'Ect Retard 2';
			else return (rom.byteAt(0x6a57+((c-1)*2) + 1) / 4).toFixed(2);
		}  //end case 2

	case 3: {	if (c == 0) return 'Ect Advance 1';
			else return (rom.byteAt(0x6a45+((c-1)*2) + 1) / 4).toFixed(2);
		}  //end case 3

	case 4: {	if (c == 0) return 'Ect Advance 2';
			else return (rom.byteAt(0x6a37+((c-1)*2) + 1) / 4).toFixed(2);
		}  //end case 4

	case 5: {	if (c == 0) return 'Ect Retard if IAT<#b5h';
			else return (rom.byteAt(0x6a28+((c-1)*2) + 1) / 4).toFixed(2);
		}  //end case 5

		}// end switch(r) (p30)
	return true;  //catch-all P30

    case rtP72:
	
  } //end switch(rom.base)

} // end __ECTGetCustomValue(c,r)

function __ECTIgn2SetCustomValue(c,r,v) { //sets values, called by class

switch (rom.base) {
    case rtP28:
      return false;
 
    case rtP30:
	switch (r)	{  // row label P30

	case 0: {	if (c == 0) return false;
    			else return false;  //this can be fixed - needs more love
  		}  //end case 0

	case 1: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6034+((c-1)*2)+1) = (4 * v).toFixed(0);
			return true;
		}  //end case 1

	case 2: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6042+((c-1)*2)+1) = (4 * v).toFixed(0);
			return true;
		}  //end case 2

	case 3: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x6050+((c-1)*2)+1) = (4 * v).toFixed(0);
			return true;
		}  //end case 3

	case 4: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x605e+((c-1)*2)+1) = (4 * v).toFixed(0);
			return true;
		}  //end case 4

	case 5: {	if (c == 0) return false;  //no changing label
			else rom.byteAt(0x606c+((c-1)*2)+1) = (4 * v).toFixed(0);
			return true;
		}  //end case 5

		}// end switch(r) P30
	return true;

    case rtP72:
	
  }//end switch(rom.base)

}  // end __ECTSetCustomValue(c,r,v)
//Method doesn't work because of different temp scales.
//ECT correction must be rewritten. It's a mess. Just put retard/advance in one table!! and use vcal7
//addCustomTable('ECT Ign Compensation',0,0,0,'__ECTIgn2LoadCustomTable','__ECTIgn2GetCustomValue','__ECTIgn2SetCustomValue');

// ECT vs IGN Correction
function __ECTignLoadCustomTable() {
  // makes life easier
  ct = window.customTable;
  ct.height = 1;
  ct.width = 6;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 1;
  ct.description = 'Read carefully. Switch between the 2 advance/retard tables is @ ect=#23h'+
  			' I think their is an interpolation between these 2 tables based on mapsensor'+
  			' And if IAT is to cold it pulls the advance and basiclly adds retard again.'+
  			' Regards, CJ'+
  			' FYI: THis SuCkS realtime i will rewrite it.';
  // Min and max values can only be integers
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 35;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'ignition';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
    ct.graphMinX = -15;
    ct.graphMaxX = 105;
  };
  
      	ct.address = 0x6a63;
	return true;
}

function __ECTignLoadCustomTable1() {
  __ECTignLoadCustomTable();
    customTable.address = 0x6a57;
    return true;
}
function __ECTignLoadCustomTable2() {
  __ECTignLoadCustomTable();
  customTable.address = 0x6a45;
  return true;
}
function __ECTignLoadCustomTable3() {
  __ECTignLoadCustomTable();
    customTable.address = 0x6a37;
    return true;
}
function __ECTignLoadCustomTable4() {
  __ECTignLoadCustomTable();
    customTable.address = 0x6a28;
    return true;
}

function __ECTignGetCustomValue(c,r) {
  var base = window.customTable.address;
  // If row = 0 ... we're on the column headers
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  // If row = 1, c == 0
  } else if ((r == 1) && (c == 0)) {
    return 'Ign Retard';
  // If we're on the table itself
  } else {
    return (rom.byteAt(base + ((c-1)*2) + 1)/4).toFixed(2);
  }
}

function __ECTignSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  // If editing column headers
  if (r == 0)
    rom.byteAt(base + ((c-1) * 2)) = rom.celciusToByte((v-32)/1.8);
  // If editing table
  else
    rom.byteAt(base + ((c-1)*2) + 1) = (v*4).toFixed(0);
}

addCustomTable('ECT ign Correction retard 1',0,0,0,'__ECTignLoadCustomTable','__ECTignGetCustomValue','__ECTignSetCustomValue');
addCustomTable('ECT ign Correction retard 2',0,0,0,'__ECTignLoadCustomTable1','__ECTignGetCustomValue','__ECTignSetCustomValue');
addCustomTable('ECT ign Correction advance 1',0,0,0,'__ECTignLoadCustomTable2','__ECTignGetCustomValue','__ECTignSetCustomValue');
addCustomTable('ECT ign Correction advance 2',0,0,0,'__ECTignLoadCustomTable3','__ECTignGetCustomValue','__ECTignSetCustomValue');
addCustomTable('ECT ign Correction retard if IAT<#b5h',0,0,0,'__ECTignLoadCustomTable4','__ECTignGetCustomValue','__ECTignSetCustomValue');

function __IATignLoadCustomTable() {
  // makes life easier
  ct = window.customTable;
  ct.height = 1;
  ct.width = 5;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 1;
  ct.description = 'This is the IAT ign correction. This table retards the ign only. What you see is retard'+
  			'These correction are only active under certain conditions.'
  			'Regards CJ';
  // Min and max values can only be integers
  ct.graphMinX = 0;
  ct.graphMaxX = 220;
  ct.graphMinY = 0;
  ct.graphMaxY = 30;
  // Set graph labels
  ct.graphLabelX = Temp;
  ct.graphLabelY = 'ignition';
  ct.showGraph = true;
  if (ShowFahr == 0)  {
    ct.graphMinX = -15;
    ct.graphMaxX = 105;
  };
  
  switch (rom.base) {
  
  case rtP28:
      	return false;
  
  case rtP30:
  	ct.address = 0x6A6F
	return true;
  
  case rtP72:
	ct.address = 0x5F51
  	return true;  //untested
  	}
}

function __IATignGetCustomValue(c,r) {
  var base = window.customTable.address;
  // If row = 0 ... we're on the column headers
  if (r == 0) {
    if (c == 0) return Temp;
    else return (rom.byteToCelcius(rom.byteAt(base + ((c-1) * 2))) * (1 + 0.8*ShowFahr) + 32*ShowFahr).toFixed(1);
  // If row = 1, c == 0
  } else if ((r == 1) && (c == 0)) {
    return 'Ign Retard';
  // If we're on the table itself
  } else {
    return (rom.byteAt(base + ((c-1)*2) + 1)/4).toFixed(2);
  }
}

function __IATignSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  // If editing column headers
  if (r == 0)
    rom.byteAt(base + ((c-1) * 2)) = rom.celciusToByte((v-32)/1.8);
  // If editing table
  else
    rom.byteAt(base + ((c-1)*2) + 1) = (v*4).toFixed(0);
}

addCustomTable('IAT ign correction',0,0,0,'__IATignLoadCustomTable','__IATignGetCustomValue','__IATignSetCustomValue');
