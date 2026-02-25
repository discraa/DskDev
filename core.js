// Core script to add-in certain features like commands and auto
// load scripts that are in discraa's github.

window.dsk = new EventEmitter3();
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
    script.onload = () => res();
    script.onerror = err => rej(err);
    script.src = src;
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

// Default commands
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
    .then(async data => dsk.loadScripts(JSON.parse(data)))
    .catch(error => console.error('Error loading file:', error));
});

// Init shit, i think
dsk.init = () => {
  // nothing yet
};

dsk.once('postPacket:accepted', () => {
  append('DskDev loaded, type /cmds for commands');
});
