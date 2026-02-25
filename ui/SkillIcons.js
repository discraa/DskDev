(() => {
  const skillIcons = () => {
    if (typeof jv.skill_dialog === 'undefined') return;
    if (!jv.skill_dialog || !jv.skill_dialog.visible) return;

    const skillSprite = texture => {
      const sprite = new PIXI.Sprite(texture);
      sprite.x = -16;
      sprite.width = 16;
      sprite.height = 16;

      return sprite;
    };

    for (var i = 0; i < jv.skill_dialog.slot.length; i++) {
      var skill = jv.skill_dialog.slot[i];
      var skillName = skill.label.text.substring(
        0,
        skill.label.text.indexOf(':')
      );
      var skillLevel = skill.label.text.substring(
        skill.label.text.indexOf(':') + 2,
        skill.label.text.length
      );

      var sprite = undefined;
      switch (skillName) {
        case 'Archery':
          sprite = skillSprite(items[14][35]);
          break;
        case 'Assassin':
          sprite = skillSprite(items[14][43]);
          break;
        case 'Axe':
          sprite = skillSprite(items[13][39]);
          break;

        case 'Chopping':
          sprite = skillSprite(tiles[11][7]);
          break;
        case 'Clubbing':
          sprite = skillSprite(items[5][42]);
          break;
        case 'Construction':
          sprite = skillSprite(items[15][1]);
          break;
        case 'Cooking':
          sprite = skillSprite(items[15][58]);
          break;
        case 'Crafting':
          sprite = skillSprite(items[15][8]);
          break;

        case 'Dagger':
          sprite = skillSprite(items[14][38]);
          break;
        case 'Destruction':
          sprite = skillSprite(items[8][20]);
          break;
        case 'Digging':
          sprite = skillSprite(items[13][38]);
          break;

        case 'Exploration':
          sprite = skillSprite(items[2][49]);
          break;

        case 'Farming':
          sprite = skillSprite(items[2][6]);
          break;
        case 'Fishing':
          sprite = skillSprite(items[1][32]);
          break;
        case 'Foraging':
          sprite = skillSprite(items[14][50]);
          break;

        case 'Hammer':
          sprite = skillSprite(items[4][36]);
          break;
        case 'Healing':
          sprite = skillSprite(items[2][15]);
          break;
        case 'Heavy Armor':
          sprite = skillSprite(items[12][40]);
          break;
        case 'Hunting':
          sprite = skillSprite(tiles[5][17]);
          break;

        case 'Knitting':
          sprite = skillSprite(items[2][43]);
          break;

        case 'Light Armor':
          sprite = skillSprite(items[12][46]);
          break;
        case 'Logic':
          sprite = skillSprite(items[9][1]);
          break;

        case 'Medium Armor':
          sprite = skillSprite(items[2][16]);
          break;
        case 'Mining':
          sprite = skillSprite(tiles[10][38]);
          break;

        case 'Pickaxe':
          sprite = skillSprite(items[10][39]);
          break;

        case 'Questing':
          sprite = skillSprite(items[12][61]);
          break;

        case 'Repairing':
          sprite = skillSprite(items[15][44]);
          break;
        case 'Research':
          sprite = skillSprite(items[14][21]);
          break;

        case 'Shield Block':
          sprite = skillSprite(items[10][40]);
          break;
        case 'Smelting':
          sprite = skillSprite(items[1][50]);
          break;
        case 'Smithing':
          sprite = skillSprite(items[13][48]);
          break;
        case 'Spear':
          sprite = skillSprite(items[14][39]);
          break;
        case 'Sword':
          sprite = skillSprite(items[15][38]);
          break;

        case 'Whip':
          sprite = skillSprite(items[10][49]);
          break;

        case 'Tilling':
          sprite = skillSprite(items[13][42]);
          break;
        case 'Unarmed':
          sprite = skillSprite(items[12][37]);
          break;
        case 'Unarmored':
          sprite = skillSprite(items[2][41]);
          break;
      }

      if (!skill.icon && sprite) {
        skill.icon = sprite;
        skill.stars.addChild(skill.icon);
      } else if (skill.icon && sprite) {
        skill.icon.texture = sprite.texture;
      }
    }
  };

  setInterval(skillIcons, 5);
})();
