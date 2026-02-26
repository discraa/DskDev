dsk.ginfo = new EventEmitter3();
dsk.ginfo.directions = ['North', 'East', 'South', 'West'];

/* Configs */
dsk.ginfo.showTime = true;
dsk.ginfo.showSessionTime = true;
dsk.ginfo.sessionStartTime = Date.now();

dsk.ginfo.label = jv.text('Ginfo label', {
  font: '10px Verdana',
  fill: '0xFFFFFF',
  stroke: jv.color_medium,
  strokeThickness: 4,
  lineJoin: 'round',
  align: 'left',
});
ui_container.addChild(dsk.ginfo.label);

dsk.ginfo.getData = () => {
  return {
    x: myself.x,
    y: myself.y,
    location: jv.map_title.text,
    direction: dsk.ginfo.directions[myself.dir],
  };
};

dsk.setCmd('/ginfo', () => {
  const visible = !dsk.ginfo.label.visible;
  dsk.ginfo.label.visible = visible;

  const state = visible ? 'enabled' : 'disabled';
  const color = visible ? '#5f5' : '#f55';
  dsk.localMsg(`Ginfo: ${state}`, color);
});

/* Dsk Events */
dsk
  .on('postPacket:accepted', () => {
    dsk.ginfo.sessionStartTime = Date.now();
  })
  .on('connection:closed', () => {
    dsk.ginfo.sessionStartTime = 0;
  })
  .on('postLoop', () => {
    if (!myself) return;

    const { x, y, location, direction } = dsk.ginfo.getData();
    let text = '';
    text = `@${location.replaceAll(' ', '')}(${x}, ${y})[${direction}]`;

    if (dsk.ginfo.showTime) {
      text += ` [${dsk.timestamp()}]`;
    }
    if (dsk.ginfo.showSessionTime) {
      text += ` [${dsk.formatTime(Date.now() - dsk.ginfo.sessionStartTime)}]`;
    }

    dsk.ginfo.label.text = text;
  });
