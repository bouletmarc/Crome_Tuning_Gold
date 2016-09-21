//##########################################
// CREATED BY: Nathan J. Riley (nate@natesbox.com)
// CREATED: 10/01/06
// LAST UPDATE: 10/04/06 by Dave B. (blundar)
// Fixes script for P72/non-P30
//##########################################

function __IBOSetTableData(n) {
  rom.gup();
  switch (n) {
    case 0: // Stock Injectors
      _rom_write(ct.address,
                 new Array(0xFF,0x64,0x00,0xA7,0x67,0x00,0x93,0x94,
                           0x00,0x7E,0xC3,0x00,0x69,0x54,0x01,0x54,
                           0x80,0x02,0x00,0x80,0x02),
                 0x15);
      break;
    case 1: // RC 440 Injectors
      _rom_write(ct.address,
                 new Array(0xFF,0x8A,0x00,0xA7,0xA6,0x00,0x93,0xC5,
                           0x00,0x7E,0xE7,0x00,0x69,0x1C,0x01,0x54,
                           0x8D,0x01,0x00,0x1D,0x03),
                 0x15);
      break;
    case 2: // RC 750cc 12ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x7D,0x00,0x95,0xC5,0x00,0x82,0xEE,
                           0x00,0x6E,0x20,0x01,0x5B,0x5E,0x01,0x35,
                           0x13,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 3: // RC 1600cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0xDB,0x00,0x95,0x20,0x01,0x82,0x48,
                           0x01,0x6E,0x80,0x01,0x5B,0xC8,0x01,0x35,
                           0xD2,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 4: // RC 1200cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x9D,0x01,0x95,0xFA,0x01,0x82,0x2F,
                           0x02,0x6E,0x71,0x02,0x5B,0xC8,0x02,0x35,
                           0x1D,0x03,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 5: // RC 1000cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x70,0x00,0x95,0xAF,0x00,0x82,0xD1,
                           0x00,0x6E,0xFA,0x00,0x5B,0x29,0x01,0x35,
                           0xBC,0x01,0x0E,0xE1,0x02),
                 0x15);
      break;
    case 6: // RC 900cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x03,0x01,0x95,0x4B,0x01,0x82,0x6A,
                           0x01,0x6E,0x99,0x01,0x5B,0xCF,0x01,0x35,
                           0x65,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 7: // RC 750cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x03,0x00,0x95,0x38,0x00,0x82,0x64,
                           0x00,0x6E,0x96,0x00,0x5B,0xCE,0x00,0x35,
                           0x71,0x01,0x0E,0xD5,0x02),
                 0x15);
      break;
    case 8: // RC 720cc 3ohm Injectors
      _rom_write(ct.address,
                 new Array(0xBB,0x03,0x01,0x95,0x4B,0x01,0x82,0x6A,
                           0x01,0x6E,0x99,0x01,0x5B,0xCF,0x01,0x35,
                           0x65,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 9: // Honda Prelude (92-96 VTEC) 330cc (31lb) 2ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x42,0x00,0x95,0x54,0x00,0x82,0x6D,
                           0x00,0x6E,0x8D,0x00,0x5B,0xAF,0x00,0x35,
                           0x1C,0x01,0x0E,0xCF,0x01),
                 0x15);
      break;
    case 10: // Honda Prelude (97-02) 290cc (28lb) 12ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x8A,0x00,0x95,0xC5,0x00,0x82,0xE7,
                           0x00,0x6E,0x0A,0x01,0x5B,0x3F,0x01,0x35,
                           0xD2,0x01,0x0E,0x14,0x03),
                 0x15);
      break;
    case 11: // Mitsubishi DSM (90-94 Turbo) 450cc (43lb) 3ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x5E,0x00,0x95,0xA6,0x00,0x82,0xD1,
                           0x00,0x6E,0x00,0x01,0x5B,0x29,0x01,0x35,
                           0x90,0x01,0x0E,0x6B,0x02),
                 0x15);
      break;
    case 12: // Mitsubishi DSM (95-99 Turbo) 450cc (43lb) 3ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x3B,0x00,0x95,0x8D,0x00,0x82,0xAC,
                           0x00,0x6E,0xD1,0x00,0x5B,0xFD,0x00,0x35,
                           0x7D,0x01,0x0E,0x1A,0x02),
                 0x15);
      break;
    case 13: // MSD 750cc (71lb) 2ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x99,0x00,0x95,0xD8,0x00,0x82,0xFD,
                           0x00,0x6E,0x2F,0x01,0x5B,0x6E,0x01,0x35,
                           0x1A,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 14: // Precision Turbo 525cc (50lb) 12ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x77,0x00,0x95,0xA9,0x00,0x82,0xCE,
                           0x00,0x6E,0x07,0x01,0x5B,0x48,0x01,0x35,
                           0x20,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 15: // Precision Turbo 680cc (65lb) 2ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x16,0x01,0x95,0x48,0x01,0x82,0x61,
                           0x01,0x6E,0x7D,0x01,0x5B,0xA9,0x01,0x35,
                           0x3F,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 16: // Precision Turbo 1000cc (95lb) 2ohm
      _rom_write(ct.address,
                 new Array(0xBB,0xA6,0x00,0x95,0xDB,0x00,0x82,0xFD,
                           0x00,0x6E,0x2C,0x01,0x5B,0x67,0x01,0x35,
                           0x10,0x02,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 17: // RC Engineering 240cc (23lb) 16ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x53,0x00,0x95,0xC2,0x00,0x82,0xF1,
                           0x00,0x6E,0x2F,0x01,0x5B,0x58,0x01,0x35,
                           0xF7,0x01,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 18: // RC Engineering 310cc (30lb) 16ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x4E,0x00,0x95,0x86,0x00,0x82,0xAC,
                           0x00,0x6E,0xE1,0x00,0x5B,0x16,0x01,0x35,
                           0xCB,0x01,0x0E,0xFB,0x02),
                 0x15);
      break;
    case 19: // RC Engineering 370cc (35lb) 16ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x0D,0x00,0x95,0x26,0x00,0x82,0x6D,
                           0x00,0x6E,0x93,0x00,0x5B,0xC8,0x00,0x35,
                           0x6A,0x01,0x0E,0x87,0x02),
                 0x15);
      break;
    case 20: // RC Engineering 440cc (42lb) 13ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x8A,0x00,0x95,0xC5,0x00,0x82,0xE7,
                           0x00,0x6E,0x1C,0x01,0x5B,0x52,0x01,0x35,
                           0xDE,0x01,0x0E,0xE1,0x02),
                 0x15);
      break;
    case 21: // RC Engineering 440cc (42lb) 16ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x03,0x00,0x95,0x2C,0x00,0x82,0x5B,
                           0x00,0x6E,0x83,0x00,0x5B,0xAF,0x00,0x35,
                           0x39,0x01,0x0E,0x33,0x02),
                 0x15);
      break;
    case 22: // RC Engineering 550cc (52lb) 3ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x5E,0x00,0x95,0x9F,0x00,0x82,0xB8,
                           0x00,0x6E,0xD5,0x00,0x5B,0xFD,0x00,0x35,
                           0x61,0x01,0x0E,0x4F,0x02),
                 0x15);
      break;
    case 23: // RC Engineering 550cc (52lb) 13ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x6D,0x00,0x95,0xAC,0x00,0x82,0xD1,
                           0x00,0x6E,0xF4,0x00,0x5B,0x13,0x01,0x35,
                           0x96,0x01,0x0E,0xA9,0x02),
                 0x15);
      break;
    case 24: // MSD 525cc (50lb) 2ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x6A,0x00,0x95,0x99,0x00,0x82,0xBF,
                           0x00,0x6E,0xEA,0x00,0x5B,0x26,0x01,0x35,
                           0xE8,0x01,0x0E,0x1D,0x03),
                 0x15);
      break;
    case 25: // RC Engineering 650cc (62lb) 12ohm
      _rom_write(ct.address,
                 new Array(0xBB,0x45,0x00,0x95,0x80,0x00,0x82,0xA9,
                           0x00,0x6E,0xD8,0x00,0x5B,0x0D,0x01,0x35,
                           0xB2,0x01,0x0E,0x1D,0x03),
                 0x15);
      break;
  }
  rom.gup();
}