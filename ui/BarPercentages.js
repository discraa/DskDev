dsk.on('postLoop', () => {
  if (game_state === GAME_PLAYING && myself) {
    if (hp_status) {
      hp_status.title.text = `Hp(${hp_status.val.toFixed(2)})`;
    }
    if (hunger_status) {
      hunger_status.title.text = `Food(${hunger_status.val.toFixed(1)})`;
    }
    if (exp_status) {
      exp_status.title.text = `Exp(${exp_status.val.toFixed(4)})`;
      exp_status.title.alpha = 1;
    }
    if (skill_status) {
      const text = skill_status.title.text;
      const curatedText = text.includes('(')
        ? text.substring(0, text.indexOf('('))
        : text;
      const value = skill_status.val.toFixed(3);
      skill_status.title.text = `${curatedText
        .substring(0, 6)
        .trimEnd()}(${value})`;
    }
  }
});
