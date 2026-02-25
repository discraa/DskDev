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

dsk.appendWithColor = (msg, color) => {
  color = color ?? '#0ff';
  append(`<span color:${chroma(color).hex()}>${msg}</span>`);
};
dsk.localMsg = dsk.appendWithColor;

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
  dsk.localMsg(`Loaded: ${urls.length} scripts`, 'lime');
};

// Default commands
dsk.setCmd('/cmds', () => {
  dsk.localMsg('Commands:', '#888');
  Array.from(dsk.commands.keys())
    .filter(e => e !== '/cmds')
    .forEach(prefix => {
      dsk.localMsg(prefix, '#bbb');
    });
});

dsk.setCmd('/load', async () => {
  if (dsk.scriptsLoaded) {
    dsk.localMsg('Restart client to load scripts again', 'orange');
    return;
  }

  if (dsk.loadingScripts) return;
  dsk.loadingScripts = true;
  dsk.localMsg('Loading scripts ...', '#050');

  fetch('https://raw.githack.com/discraa/DskDev/main/scriptList.json')
    .then(response => response.text())
    .then(async data => dsk.loadScripts(JSON.parse(data)))
    .catch(error => dsk.localMsg(`Eror loading file: ${error.stack}`, 'red'));
});

dsk.setCmd('eval', context => {
  eval(context);
});

// Init ui things, called by end of `ml.min.js -> init_ui`
dsk.initGui = () => {
  dsk.execBtn = jv.Button.create(
    jv.game_width - 31 - 30,
    388.2,
    26,
    'R',
    jv.stage,
    26,
  );
  dsk.execBtn.on_click = () => {
    const code = prompt('Execute Javascript');
    if (code.trim() !== '') {
      const result = eval(code);
      if (result && result !== '') alert(result);
    }
  };
};

// Init shit, i think
dsk.init = () => {
  // nothing yet
};

dsk.once('postPacket:accepted', () => {
  dsk.localMsg('DskDev loaded, type /cmds for commands', 'pink');
});
