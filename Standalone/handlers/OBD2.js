/************************************************************************
**
** <CROME> OBD2 Handler
** by: John Cui
**
** This is a test CROME handler script to test future OBD2 capabilites
** of CROME. This script currently only allows viewing of OBD2 ROMs but
** does not support editing it.  What use is it?  The main reason for
** having this script is to be able to open OBD2 ROMs and be able to
** transcribe the OBD2 tables into OBD1 (which is very easy). The author
** does not provide any warranties or guarantees for using this script.
** Use this script at your own risk.
**
** Enjoy.
**
**/
function _LoadOBD2() {
  if (rom.wordAt(0x0023) == 0x3C1A) {
    rom.base                             = rtCustom;
    rom.OBDMode                          = 2;
    rom.title                            = 'OBD2A P72';
    rom.addressOf('NFO_LOW_TABLE')       = 0x140A;
    rom.addressOf('NFO_HIGH_TABLE')      = 0x0F0A;
    rom.addressOf('CHECKSUM')            = 0xBFFF;
    rom.addressOf('LOW_MAP_SCALAR')      = 0xB376;
    rom.addressOf('HIGH_MAP_SCALAR')     = 0xB394;
    rom.addressOf('LOW_REV_SCALAR')      = 0xB39E;
    rom.addressOf('HIGH_REV_SCALAR')     = 0xB3B2;
    rom.addressOf('LOW_FUEL')            = 0xB3F1;
    rom.addressOf('HIGH_FUEL')           = 0xB4C3;
    rom.addressOf('LOW_IGNITION')        = 0xB603;
    rom.addressOf('HIGH_IGNITION')       = 0xB6CB;
    refresh();
  }
  else if (rom.wordAt(0x0023) == 0xEA1C) {
    rom.base                             = rtCustom;
    rom.OBDMode                          = 2;
    rom.title                            = 'OBD2 P73';
    rom.addressOf('NFO_LOW_TABLE')       = 0x140A;
    rom.addressOf('NFO_HIGH_TABLE')      = 0x0F0A;
    rom.addressOf('CHECKSUM')            = 0xBFFF;
    rom.addressOf('LOW_MAP_SCALAR')      = 0xB3F6;
    rom.addressOf('HIGH_MAP_SCALAR')     = 0xB414;
    rom.addressOf('LOW_REV_SCALAR')      = 0xB41E;
    rom.addressOf('HIGH_REV_SCALAR')     = 0xB432;
    rom.addressOf('LOW_FUEL')            = 0xB462;
    rom.addressOf('HIGH_FUEL')           = 0xB534;
    rom.addressOf('LOW_IGNITION')        = 0xB5DE;
    rom.addressOf('HIGH_IGNITION')       = 0xB674;
    refresh();
  }
  else if (rom.wordAt(0x0023) == 0x5219) {
    rom.base                             = rtCustom;
    rom.OBDMode                          = 2;
    rom.title                            = 'MUGEN XH4';
    rom.addressOf('NFO_LOW_TABLE')       = 0x140A;
    rom.addressOf('NFO_HIGH_TABLE')      = 0x0F0A;
    rom.addressOf('CHECKSUM')            = 0xBFFF;
    rom.addressOf('LOW_MAP_SCALAR')      = 0x79C7;
    rom.addressOf('HIGH_MAP_SCALAR')     = 0x79BD;
    rom.addressOf('LOW_REV_SCALAR')      = 0x79DB;
    rom.addressOf('HIGH_REV_SCALAR')     = 0x79EF;
    rom.addressOf('LOW_FUEL')            = 0x7A21;
    rom.addressOf('HIGH_FUEL')           = 0x7AF3;
    rom.addressOf('LOW_IGNITION')        = 0x7C33;
    rom.addressOf('HIGH_IGNITION')       = 0x7CFB;
    refresh();
  }
}

addRomHandler(rtUnknown, 'John Cui', '_LoadOBD2()');