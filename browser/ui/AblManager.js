/* Made by discraa */

window.ablManager = jv.Dialog.create(300, 240);

/* just so that i don't have to type that much */
const am = ablManager;

/* Handle command lmao */
(() => {
  var oldJvCommand = jv.command;
  jv.command = function (string) {
    if ('/abl' === string.trim()) {
      ablManager.visible = !ablManager.visible;
      return;
    }

    oldJvCommand(string);
  };
})();

am.spr2pos = spr => new PIXI.Point(spr % 16, Math.floor(spr / 16));
am.textureById = (id = 0) => {
  let texture = null;

  if (id === 0) {
    texture = items[0][0];
  } else if (id < 0) {
    const pos = am.spr2pos(Math.abs(id));
    texture = tiles[pos.x][pos.y];
  } else {
    const pos = am.spr2pos(id);
    texture = items[pos.x][pos.y];
  }

  return texture;
};

am.header = jv.text('Abilities', {
  font: '18px Verdana',
  fill: 0xffffff,
  lineJoin: 'round',
  stroke: 0x555555,
  strokeThickness: 2,
});
am.addChild(am.header);
jv.center(am.header);
jv.top(am.header, 4);

am.close = jv.Button.create(0, 0, 24, 'X', am, 24);
jv.top(am.close, 4);
jv.right(am.close, 4);
am.close.on_click = () => (am.visible = 0);

am.slots = [];
am.marginLeft = 10;
am.marginTop = 100;
am.offsetX = 64;
am.drag = null;

am.alive = () => {
  if (!am.visible) am.endDrag();
};
setInterval(() => am.alive(), 5);

am.dragMove = e => {
  if (am.drag && !!e) {
    am.drag.x = e.data.getLocalPosition(am).x - 32;
    am.drag.y = e.data.getLocalPosition(am).y - 32;
  }
};

am.endDrag = () => {
  if (!am.drag) return;

  am.drag.off('touchmove', am.dragMove);
  am.drag.off('touchend', am.dragEnd);
  am.drag.off('touchendoutside', am.dragEnd);

  am.drag.x = am.drag.staticX;
  am.drag.y = am.drag.staticY;
  am.drag.scale.set(1);
  am.drag.z = 50;

  am.drag = null;
};

am.dragEnd = e => {
  const tX = e.data.getLocalPosition(am).x - am.marginLeft;
  const tY = e.data.getLocalPosition(am).y - am.marginTop;

  const slot = am.slots.find(e => {
    const eX = e.x - am.marginLeft;
    const eY = e.y - am.marginTop;

    const yeah =
      e !== am.drag &&
      tX > eX &&
      tX < eX + e.width &&
      tY > eY &&
      tY < eY + e.height;

    return yeah;
  });

  if (slot) {
    const payload = `/swap ${am.drag.index} ${slot.index}`;
    send({ type: 'chat', data: payload });
  }

  am.endDrag();
};

am.setDrag = w => {
  am.drag = w;

  am.drag.on('touchmove', am.dragMove);
  am.drag.on('touchend', am.dragEnd);
  am.drag.on('touchendoutside', am.dragEnd);

  am.drag.scale.set(2);
  am.drag.z = 100;
  am.children.sort(zCompare);
};

am.clearSlots = () => {
  am.slots.forEach(e => (e.texture = am.textureById(791)));
};

am.drawInv = function () {
  for (let i = 1; i < 7; i++) {
    const slot = new PIXI.Sprite(am.textureById(791));

    slot.index = 7 - i;
    slot.z = 50;
    slot.staticX = am.marginLeft + i * 38;
    slot.staticY = am.marginTop;
    slot.x = slot.staticX;
    slot.y = slot.staticY;

    slot.interactive = 1;
    slot.on('touchstart', e => {
      am.setDrag(slot);
      am.dragMove();
    });

    slot.title = jv.text(slot.index, {
      font: '14px Verdana',
      fill: 0xffffff,
    });
    slot.addChild(slot.title);
    slot.title.x += 10;
    slot.title.y -= 16;

    am.slots.push(slot);
    am.addChild(slot);
  }
};
am.drawInv();

am.updateInv = () => {
  am.clearSlots();
  const arr = [...am.slots].reverse();

  for (let i = 0; i < jv.abl.length; i++) {
    const abl = jv.abl[i];

    if (abl) {
      arr[i].texture = am.textureById(abl.spr);
    }
  }
};
am.updateInv();
setInterval(() => am.updateInv(), 5);
