dsk.invManager = jv.Dialog.create(560, 240);

dsk.setCmd('/inv', () => {
  const visible = !dsk.invManager.visible;
  dsk.invManager.visible = visible;
  
  const state = visible ? 'enabled' : 'disabled';
  const color = visible ? '#5f5' : 'f55';
  dsk.localMsg(`InvManager: ${state}`, color);
});

dsk.invManager.heading = jv.text('Inventory Manager', {
  font: '18px Verdana',
  fill: 0xffffff,
  lineJoin: 'round',
  stroke: 0x555555,
  strokeThickness: 2,
});
dsk.invManager.addChild(dsk.invManager.heading);
jv.center(dsk.invManager.heading);
jv.top(dsk.invManager.heading, 4);

dsk.invManager.move = jv.Button.create(
  0,
  0,
  24,
  '@',
  dsk.invManager,
  24,
);
jv.top(dsk.invManager.move, 4);
jv.right(dsk.invManager.move, 28);

dsk.invManager.close = jv.Button.create(
  0,
  0,
  24,
  'X',
  dsk.invManager,
  24,
);
jv.top(dsk.invManager.close, 4);
jv.right(dsk.invManager.close, 4);
dsk.invManager.close.on_click = () => {
  dsk.invManager.visible = 0;
};

dsk.invManager.update = () => {
  const im = dsk.invManager;

  if (im.move.is_pressed) {
    im.x = touchx + 34 - im.w;
    im.y = touchy - 4 - 12;
  } else {
    if (im.x < 0) im.x = 0;
    if (im.y < 0) im.y = 0;
    if (im.x > jv.game_width) im.x = jv.game_width;
    if (im.y > jv.game_height) im.y = jv.game_height;
  }
};
dsk.on('postLoop', dsk.invManager.update);

dsk.invManager.drag = null;
dsk.invManager.slots = [];
dsk.invManager.marginLeft = 10;
dsk.invManager.marginTop = 50;
dsk.invManager.offsetX = 112;

dsk.invManager.dragMove = e => {
  const im = dsk.invManager;

  if (im.drag) {
    if (!im.visible) im.endDrag();
    else if (!!e) {
      im.drag.x = e.data.getLocalPosition(im).x - 32;
      im.drag.y = e.data.getLocalPosition(im).y - 32;
    }
  }
};

dsk.invManager.endDrag = () => {
  const im = dsk.invManager;

  im.drag.off('touchmove', im.dragMove);
  im.drag.off('touchend', im.dragEnd);
  im.drag.off('touchendoutside', im.dragEnd);

  const page = Math.floor(im.drag.slot / 15);
  im.drag.x = im.marginLeft + im.offsetX * page + (im.drag.slot % 3) * 32;
  im.drag.y = im.marginTop + Math.floor((im.drag.slot % 15) / 3) * 32;
  im.drag.scale.set(1);
  im.drag.z = 50;
};

dsk.invManager.dragEnd = e => {
  const im = dsk.invManager;

  const tX = e.data.getLocalPosition(im).x - im.marginLeft;
  const tY = e.data.getLocalPosition(im).y - im.marginTop;

  const slot = im.slots.find(e => {
    const eX = e.x - im.marginLeft;
    const eY = e.y - im.marginTop;

    const yeah =
      e !== im.drag &&
      tX > eX &&
      tX < eX + e.width &&
      tY > eY &&
      tY < eY + e.height;

    return yeah;
  });

  if (slot) {
    send({ type: 'sw', slot: im.drag.slot, swap: slot.slot });
  }

  im.endDrag();
};

dsk.invManager.setDrag = w => {
  const im = dsk.invManager;

  im.drag = w;
  im.drag.on('touchmove', im.dragMove);
  im.drag.on('touchend', im.dragEnd);
  im.drag.on('touchendoutside', im.dragEnd);

  im.drag.scale.set(2);
  im.drag.z = 100;
  im.children.sort(zCompare);
};

dsk.invManager.initSlots = function () {
  for (let i = 0; i < 75; i++) {
    const page = Math.floor(i / 15);
    const item = item_data[i];
    let sprite = null;

    if (item && item.spr !== undefined) {
      sprite = new PIXI.Sprite(dsk.textureById(item.spr));
    } else {
      sprite = new PIXI.Sprite(dsk.textureById(791));
    }

    sprite.slot = i;
    sprite.z = 50;
    this.slots.push(sprite);

    sprite.x = this.offsetX * page + (i % 3) * 32;
    sprite.y = Math.floor((i % 15) / 3) * 32;

    sprite.x += this.marginLeft;
    sprite.y += this.marginTop;

    sprite.interactive = 1;
    sprite.on('touchstart', function (e) {
      dsk.invManager.setDrag(this);
      dsk.invManager.dragMove();
    });

    this.addChild(sprite);
  }
};
dsk.invManager.initSlots();

dsk.invManager.updateSlots = () => {
  const im = dsk.invManager;

  for (let i = 0; i < 75; i++) {
    const item = item_data[i];

    if (item && item.spr !== undefined) {
      im.slots[i].texture = dsk.textureById(item.spr);
    } else {
      im.slots[i].texture = dsk.textureById(791);
    }
  }
};
dsk.on('postPacket:inv', dsk.invManager.updateSlots);
