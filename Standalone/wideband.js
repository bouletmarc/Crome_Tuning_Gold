function __wb_PLX (b) {
  v = (b * 0.01953125);
  afr = (2 * v) + 10;
  return afr / 14.7;
}

function __wb_Zeitronix (b) {
  v = (b * 0.01953125);
  afr = (-0.3481*Math.pow(v,6)) +
        (3.4583*Math.pow(v,5)) - 
        (12.813*Math.pow(v,4)) +
        (22.269*Math.pow(v,3)) -
        (18.043*Math.pow(v,2)) +
        (7.4273*v) + 8.8711;
  return afr / 14.7;
}

addWidebandConversion('PLX Devices', '__wb_PLX');
addWidebandConversion('Zeitronix', '__wb_Zeitronix');