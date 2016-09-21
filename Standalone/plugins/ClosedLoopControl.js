/*********************************************************************
** TEST CLOSED LOOP CONTROL
** Auth: Damian Badalamenti
**
** Desc: An Advanced Tables handler that allows the to user to
**			edit the the RPMvsTPS threshold curve used to determine
**			when the ecu will switch out of and into closed loop..
**
**
********************************************************************/
// This function is called whenever this specific plugin is selected in
// the Advance Tables window.  It loads the defalt parameters to properly
// display this plugin.  The plugin will be loaded if the function returns true
//
// Cosed Loop Control
function __RPMvsTPSLoadCustomTable() {
  // makes life easier
  ct = window.customTable;
  ct.height = 2;
  ct.width = 6;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 1;
  ct.description = 'Edit the "Closed Loop CUT" threshold curve to determine when the ecu will switch into open loop. \n' +
	'Edit the "Closed Loop RES" threshold curve to determine when the ecu will switch back into closed loop. \n' +
	'Warning: This is an advanced feature and should only be changed by someone ' +
    'with full knowledge of its functionality.';
  // Min and max values can only be integers
  ct.graphMinX = 0;
  ct.graphMaxX = 8000;
  ct.graphMinY = 0;
  ct.graphMaxY = 100;
  // Set graph labels
  ct.graphLabelX = 'RPM';
  ct.graphLabelY = 'TPS%';
  ct.showGraph = true;
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x625f;
	  address2 = 0x626b;
      return true; 
    case rtP30:
      ct.address = 0x615e;
	  address2 = 0x6152;
      return true;
    case rtP72:
      ct.address = 0x563e;
	  address2 = 0x5632;
      return true;
  }
  return false;
}

function __RPMvsTPSGetCustomValue(c,r) {
  var base = window.customTable.address;
  	  base2 = address2;	
  // If row = 0 ... we're on the column headers
  if (r == 0) {
    if (c == 0) return 'RPM';
	else return (_byte_to_rpm(rom.byteAt(base + ((c-1) * 2))));
  // If row = 1, c == 0
  } else if ((r == 1) && (c == 0)) {
    return 'Closed-Loop CUT (TPS%)';
  // If we're on the table itself
  } else if ((r == 2) && (c == 0)) {
    return 'Closed-Loop RES (TPS%)';
  // If we're on the table itself
  } else if (r == 1) 
    return (rom.byteAt(base + ((c-1)*2) + 1) / 229.5*100).toFixed(0);
	else 
    return (rom.byteAt(base2 + ((c-1)*2) + 1) / 229.5*100).toFixed(0);
}

function __RPMvsTPSSetCustomValue(c,r,v) {
  var base = window.customTable.address;
  	  base2 = address2;
  // If editing column headers
  if (r == 0) {
    rom.byteAt(base + ((c-1) * 2)) = (_seek_rpm_byte(0x00, 0xFF, v)).toFixed(0);
	rom.byteAt(base2 + ((c-1) * 2)) = (_seek_rpm_byte(0x00, 0xFF, v)).toFixed(0);
  }
  // If editing table
  else if (r == 1)
    rom.byteAt(base + ((c-1)*2) + 1) = (v * 229.5 / 100).toFixed(0);
  else
    rom.byteAt(base2 + ((c-1)*2) + 1) = (v * 229.5 / 100).toFixed(0);
}

addCustomTable('Closed Loop Control(TPSvsRPM)',0,0,0,'__RPMvsTPSLoadCustomTable','__RPMvsTPSGetCustomValue','__RPMvsTPSSetCustomValue');

// Convert byte RPM
function _byte_to_rpm(b) {
  y = b;
  h = Math.floor(y / 64);
  l = y - (h - 1) * 64;
  a = Math.pow(2,h)
  x = Math.round((1875000 * l * a) / 240000);
  return (x);
}
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
