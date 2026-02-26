jv.fps.visible = true;
jv.ping.visible = true;

dsk.on('postLoop', () => {
  if (game_state === GAME_PLAYING && myself) {
    if (jv.upgrade_add) {
      jv.upgrade_add.x = 434;
      jv.upgrade_add.y = 51;
    }
    if (jv.upgrade_counter) {
      jv.upgrade_counter.x = 385;
      jv.upgrade_counter.y = 30;
    }
    if (jv.upgrade_sprite) {
      jv.upgrade_sprite.x = 439;
      jv.upgrade_sprite.y = 22;
    }
    if (jv.fps) {
      jv.fps.x = 384;
      jv.fps.y = 10;
    }
    if (jv.ping) {
      jv.ping.x = 384;
      jv.ping.y = 22;
    }
    if (hunger_status) {
      hunger_status.x = 224;
      hunger_status.y = 30;
    }
    if (exp_status) {
      exp_status.x = 304;
      exp_status.y = 14;
    }
    if (skill_status) {
      skill_status.x = 304;
      skill_status.y = 30;
    }
  }
});
