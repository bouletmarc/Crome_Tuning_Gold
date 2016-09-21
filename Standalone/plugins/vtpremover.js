/*******************************************************************************
** VTP/VTS Remover
** auth: John Cui
** desc: Apply plugin and ground VTP signal wire on ECU.
**
**/


function __VTP_VTS_REMOVE() {
  if (rom.base = rtP30) {
    rom.gup();
    rom.wordAt(0x3d06) = 0x1CCB;
    rom.wordAt(0x3d27) = 0x16CB; 
    rom.byteAt(0x11B6) = 0x00;
    rom.gup();
    alert("VTP and VTS Removed! You must now ground the VTP signal wire.");
    reload();
  }
}
addPlugin('John Cui', 'VTP+VTS Remover', '__VTP_VTS_REMOVE()', '', 1);