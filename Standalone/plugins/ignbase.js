function __IgnBaseLoadCustomTable() {
  ct = window.customTable;
  ct.height = 1;
  ct.width = 7;
  ct.fixedCols = 1;
  ct.fixedRows = 1;
  ct.fixedEditable = 0;
  ct.description = 'Base ignition timing added ALL THE TIME on top of the timing tables';
  ct.graphMinX = 0;
  ct.graphMaxX = 9000;
  ct.graphMinY = 0;
  ct.graphMaxY = 15;
  // Set Graph Labels
  ct.graphLabelX = 'RPM';
  ct.graphLabelY = 'Ignition Advance'
  ct.showGraph = true;
  
  switch (rom.base) {
    case rtP28:
      ct.address = 0x6c9e;
      return true;
    case rtP30:
      ct.address = 0x6a1a;
      return true;
    case rtP72:
      ct.address = 0x5ee9;
      return true;
  }
  return false;
}

function __IgnBaseGetCustomValue(c, r) {
  var b = window.customTable.address;
  
  if (r == 0) {
    if (c == 0) return 'RPM';
    else return (rom.byteAt(b+14-(c*2))*35.2).toFixed(0);
  } else {
    if (c == 0) return 'Ign. Adv.';
    else return (rom.byteAt(b+15-(c*2))/4).toFixed(2);
  }
}

function __IgnBaseSetCustomValue(c,r,v) {
  var b = window.customTable.address;
  
  rom.byteAt(b+15-(c*2)) = (v * 4).toFixed(0);
}

addCustomTable('Base Ignition Table',
0,0,0, '__IgnBaseLoadCustomTable', '__IgnBaseGetCustomValue', '__IgnBaseSetCustomValue');