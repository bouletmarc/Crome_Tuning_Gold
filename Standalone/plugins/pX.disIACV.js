/******************************************
** disIACV
** Athu: Chris Harris (with help from Damian Badalamenti)
** Desc: Disable/Enable the IACV
**     	 in the p30/p28/p72 rom's
**
** Hist: 9Apr2006- XENOCRON -    - Written 
** 	 
*/	

addPlugin('XENOCRON', 'Enable/Disable IACV', 'disIACV()','',4);

function disIACV() {
	romType = rom.base;
	
	switch(romType) {
		case rtP28:
			alert('Support for this rom has not been added yet!!');
			break;
		
		case rtP72:
			alert('Support for this rom has not been added yet.');
			break;
			
		case rtP30:
			if((rom.byteAt(0x3C6F) == 0x00)) {
				
				n = confirm('IACV is currently DISABLED.  Do you want to ENABLE the IACV?');
				
				if(n) {
				rom.byteAt(0x3C6F) = 0x01;
							
				alert('IACV has been ENABLED.');
				}
			}
			else {
				y = confirm('IACV is currently ENABLED.  Do you want to DISABLE the IACV?');
				
				if(y) {
				rom.byteAt(0x3C6F) = 0x00;
				
				alert('IACV has been DISABLED.');
				}
			}
			break;
		}
}
