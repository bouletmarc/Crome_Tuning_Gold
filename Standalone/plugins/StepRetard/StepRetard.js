/*******************************************************************************
** Step Retard
**
** auth: Damian Badalamenti
** desc: Add step retard to a boost ignition maps.
**/

/*******************************************************************************
** DECLARATIONS
**
**/

var crome = window.external;
var rom = crome.rom;

/*******************************************************************************
**
**
**/
function stepRetard(a,b,c,d,e,p1,p2,p3,p4,p5,p6,p7,p8,p9,p10) {
    retardBoostIgnition(a, p1, p2);
    retardBoostIgnition(b, p3, p4);
    retardBoostIgnition(c, p5, p6);
    retardBoostIgnition(d, p7, p8);
    retardBoostIgnition(e, p9, p10);
}
function retardBoostIgnition(DegreesPerPound, Bpsi, Epsi) {
    if (rom.hasBoost > 0){
        cwt = rom.working_table;
        rom.working_table = 2;
        for (c = 10; c < getMapWidth(); c++) {
	  if ((mBarToPsi(rom.mapScalar(0,c)) > Bpsi) && (mBarToPsi(rom.mapScalar(0,c)) <= Epsi)){
            for (r = 0; r < getLoMapHeight(); r++) {
              rom.tableValue(c, r) = rom.tableValue(9, r) - (mBarToPsi(rom.mapScalar(0, c)) * DegreesPerPound);
              crome.refresh ();
            }
          }
	}
	rom.working_table = 3;
	  for (c = 10; c < getMapWidth(); c++) {
	    if ((mBarToPsi(rom.mapScalar(0,c)) > Bpsi) && (mBarToPsi(rom.mapScalar(0,c)) <= Epsi)){
              for (r = 0; r < getHiMapHeight(); r++) {
                rom.tableValue(c, r) = rom.tableValue(9, r) - (mBarToPsi(rom.mapScalar(0, c)) * DegreesPerPound);
                crome.refresh ();
              }
            }
	  }
	  rom.working_table = cwt;
    }
    crome.refresh ();
    return;
}
/**************************************************************
** getMapWidth
**/
function getMapWidth() {
  return rom.addressOf('NFO_LOW_TABLE') % 0x0100;
}

/**************************************************************
** getHiMapHeight
**/
function getHiMapHeight() {
  return Math.round(rom.addressOf('NFO_HIGH_TABLE') / 0x0100);
}

/**************************************************************
** getLoMapHeight
**/
function getLoMapHeight() {
  return Math.round(rom.addressOf('NFO_LOW_TABLE') / 0x0100);
}
//*********************************************************************
// Formula to convert mbar values to psi
function mBarToPsi (Value) {
	return ((Value - 1000) / 1000 * 14.5);
}
