// Core script to add-in certain features like commands and auto
// load scripts that are in discraa's github.

window.dsk = {};
dsk.loadingScripts = false;
dsk.scriptsLoaded = false;
dsk.commands = new Map(); // Btw i removed `Map` from ml.mim.js

dsk.setCmd = (prefix, callback) => {
  dsk.commands.set(prefix, callback);
};
dsk.deleteCmd = prefix => {
  dsk.commands.delete(prefix);
};

dsk.loadScript = src => {
  return new Promise((res, rej) => {
    const script = document.createElement('script');
    script.onload = res;
    script.onerror = rej;
    document.body.appendChild(script);
  });
};

dsk.loadScripts = async urls => {
  for (let i = 0; i < urls.length; i++) {
    const error = await dsk.loadScript(urls[i]);
    if (error) append(error.stack);
  }

  dsk.loadingScripts = false;
  dsk.scriptsLoaded = true;
  append(`Loaded: ${urls.length} scripts`);
};

// Init shit, i think
dsk.init = () => {
  dsk.setCmd('/cmds', () => {
    append('Commands:');
    Array.from(dsk.commands.keys()).forEach(prefix => {
      append(prefix);
    });
  });

  dsk.setCmd('/load', async () => {
    if (dsk.scriptsLoaded) {
      append('Restart client to load scripts again');
      return;
    }

    if (dsk.loadingScripts) return;
    dsk.loadingScripts = true;
    append('Loading scripts ...');

    fetch('https://raw.githack.com/discraa/DskDev/main/scriptList.json')
      .then(response => response.text())
      .then(async data => {
        await dsk.loadScripts(JSON.parse(data));
        append('DskDev loaded, type /cmds for commands');
      })
      .catch(error => console.error('Error loading file:', error));
  });
};

// Ensure load when in-game bc i'm lazy asf
// (if we are in-game, lots of shit from client loaded already,
// so we don't have to use our brains)
dsk.loadInterval = setInterval(() => {
  if (game_state === GAME_PLAYING) {
    clearInterval(dsk.loadInterval);

    dsk.init();
  }
}, 5);
