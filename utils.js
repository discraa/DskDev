dsk.rand = () => Math.random();
dsk.rand01 = () => Math.round(dsk.rand());
dsk.wait = e => new Promise(res => setTimeout(res, e));
dsk.randFromArr = e => e[Math.floor(dsk.rand() * e.length)];
dsk.removeFromArr = (e, arr) => {
  const idx = arr.indexOf(e);
  if (idx !== -1) arr.splice(idx, 1);
};

dsk.timestamp = () => new Date().toLocaleTimeString();
dsk.datestamp = () => new Date().toLocaleDateString();
dsk.formatTime = ms => {
  let totalSeconds = Math.floor(ms / 1000);
  let h = Math.floor(totalSeconds / 3600);
  let m = Math.floor((totalSeconds % 3600) / 60);
  let s = totalSeconds % 60;

  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0',
    )}:${String(s).padStart(2, '0')}`;
  } else {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
};

dsk.quit = () => send({ type: 'chat', data: '/quit' });
dsk.fquit = () => parse({ type: 'quit', text: 'bubye' });

dsk.appendWithColor = (msg, color) => {
  color = color ?? '#0ff';
  append(`<span color:${chroma(color).hex()}>${msg}</span>`);
};
dsk.localMsg = dsk.appendWithColor;

dsk.copyToClipboard = data => {
  const tempItem = document.createElement('input');
  tempItem.setAttribute('type', 'text');
  tempItem.setAttribute('display', 'none');
  let content = data;
  if (data instanceof HTMLElement) {
    content = data.innerHTML;
  }
  tempItem.setAttribute('value', content);
  document.body.appendChild(tempItem);
  tempItem.select();
  document.execCommand('Copy');
  tempItem.parentElement.removeChild(tempItem);
};
dsk.copy = text => dsk.copyToClipboard(text);

dsk.stripHTMLTags = str => str.replace(/<[^>]*>/g, '');
dsk.removeSpecialChars = str => str.replace(/[^a-zA-Z ]/g, '');

dsk.spr2pos = spr => new PIXI.Point(spr % 16, Math.floor(spr / 16));
dsk.pos2spr = (x, y) => x + y * 16;

dsk.colorToInt = color => {
  const gl = chroma(color).gl();
  const r = Math.round(gl[0] * 255);
  const g = Math.round(gl[1] * 255);
  const b = Math.round(gl[2] * 255);

  return (r << 16) | (g << 8) | b;
};

dsk.hsvToInt = (h, s, v) => {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      ((r = v), (g = t), (b = p));
      break;
    case 1:
      ((r = q), (g = v), (b = p));
      break;
    case 2:
      ((r = p), (g = v), (b = t));
      break;
    case 3:
      ((r = p), (g = q), (b = v));
      break;
    case 4:
      ((r = t), (g = p), (b = v));
      break;
    case 5:
      ((r = v), (g = p), (b = q));
      break;
  }

  // Convert 0-1 range to 0-255 and pack into an integer (RGB)
  return (
    (Math.round(r * 255) << 16) +
    (Math.round(g * 255) << 8) +
    Math.round(b * 255)
  );
};

dsk.bgr = color => {
  const rgb = dsk.colorToInt(color);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  return (b << 16) | (g << 8) | r;
};
dsk.randColorInt = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return (r << 16) | (g << 8) | b;
};

dsk.startAction = () => {
  send({ type: 'A' });
};
dsk.stopAction = () => {
  send({ type: 'a' });
};
dsk.action = () => {
  dsk.startAction();
  dsk.stopAction();
};

dsk.textureById = (id = 0) => {
  let texture = null;

  if (id === 0) {
    texture = items[0][0];
  } else if (id < 0) {
    const pos = dsk.spr2pos(Math.abs(id));
    texture = tiles[pos.x][pos.y];
  } else {
    const pos = dsk.spr2pos(id);
    texture = items[pos.x][pos.y];
  }

  return texture;
};
