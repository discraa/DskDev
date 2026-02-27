/* Made by discraa */

window.invManager = jv.Dialog.create(560, 240);
const im = invManager;

im.spr2pos = spr => new PIXI.Point(spr % 16, Math.floor(spr / 16));
im.textureById = (id = 0) => {
  let texture = null;

  if (id === 0) {
    texture = items[0][0];
  } else if (id < 0) {
    const pos = im.spr2pos(Math.abs(id));
    texture = tiles[pos.x][pos.y];
  } else {
    const pos = im.spr2pos(id);
    texture = items[pos.x][pos.y];
  }

  return texture;
};

/* Handle command lmao */
(() => {
  var oldJvCommand = jv.command;
  jv.command = function (string) {
    if ('/inv' === string.trim()) {
      invManager.visible = !invManager.visible;
      return;
    }

    oldJvCommand(string);
  };
})();

im.heading = jv.text('Inventory Manager', {
  font: '18px Verdana',
  fill: 0xffffff,
  lineJoin: 'round',
  stroke: 0x555555,
  strokeThickness: 2,
});
im.addChild(im.heading);
jv.center(im.heading);
jv.top(im.heading, 4);

im.move = jv.Button.create(0, 0, 24, '@', im, 24);
jv.top(im.move, 4);
jv.right(im.move, 28);

im.close = jv.Button.create(0, 0, 24, 'X', im, 24);
jv.top(im.close, 4);
jv.right(im.close, 4);
im.close.on_click = () => (im.visible = 0);

im.update = () => {
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
setInterval(() => im.update(), 5);

im.drag = null;
im.slots = [];
im.marginLeft = 10;
im.marginTop = 50;
im.offsetX = 112;

im.dragMove = e => {
  if (im.drag) {
    if (!im.visible) im.endDrag();
    else if (!!e) {
      im.drag.x = e.data.getLocalPosition(im).x - 32;
      im.drag.y = e.data.getLocalPosition(im).y - 32;
    }
  }
};

im.endDrag = () => {
  im.drag.off('touchmove', im.dragMove);
  im.drag.off('touchend', im.dragEnd);
  im.drag.off('touchendoutside', im.dragEnd);

  const page = Math.floor(im.drag.slot / 15);
  im.drag.x = im.marginLeft + im.offsetX * page + (im.drag.slot % 3) * 32;
  im.drag.y = im.marginTop + Math.floor((im.drag.slot % 15) / 3) * 32;
  im.drag.scale.set(1);
  im.drag.z = 50;
};

im.dragEnd = e => {
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

im.setDrag = w => {
  im.drag = w;
  im.drag.on('touchmove', im.dragMove);
  im.drag.on('touchend', im.dragEnd);
  im.drag.on('touchendoutside', im.dragEnd);

  im.drag.scale.set(2);
  im.drag.z = 100;
  im.children.sort(zCompare);
};

im.initSlots = function () {
  for (let i = 0; i < 75; i++) {
    const page = Math.floor(i / 15);
    const item = item_data[i];
    let sprite = null;

    if (item && item.spr !== undefined) {
      sprite = new PIXI.Sprite(im.textureById(item.spr));
    } else {
      sprite = new PIXI.Sprite(im.textureById(791));
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
      im.setDrag(this);
      im.dragMove();
    });

    this.addChild(sprite);
  }
};
im.initSlots();

im.updateSlots = () => {
  for (let i = 0; i < 75; i++) {
    const item = item_data[i];

    if (item && item.spr !== undefined) {
      im.slots[i].texture = im.textureById(item.spr);
    } else {
      im.slots[i].texture = im.textureById(791);
    }
  }
};
setInterval(() => im.updateSlots(), 5);
