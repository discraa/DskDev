/* Made by discraa */

/**
 * "Ginfo" stands for General Information (crazy ik)
 **/

window.ginfo = {};
ginfo.enabled = true;
ginfo.directions = ['North', 'East', 'South', 'West'];

/* Configs */
ginfo.showTime = true;
ginfo.showSessionTime = true;
ginfo.sessionStartTime = 0;
ginfo.sessionStarted = false;

ginfo.label = jv.text('Ginfo label', {
	font: '10px Verdana',
	fill: '0xFFFFFF',
	stroke: jv.color_medium,
	strokeThickness: 4,
	lineJoin: 'round',
	align: 'left',
});
ui_container.addChild(ginfo.label);

ginfo.getData = () => {
	return {
		x: myself.x,
		y: myself.y,
		location: jv.map_title.text?.replaceAll(' ', ''),
		direction: ginfo.directions[myself.dir],
	};
};

ginfo.formatTime = (ms) => {
	let totalSeconds = Math.floor(ms / 1000);
	let h = Math.floor(totalSeconds / 3600);
	let m = Math.floor((totalSeconds % 3600) / 60);
	let s = totalSeconds % 60;

	if (h > 0) {
		return `${String(h).padStart(2, '0')}:${String(m).padStart(
			2,
			'0'
		)}:${String(s).padStart(2, '0')}`;
	} else {
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}
};

ginfo.update = () => {
	if (!myself) {
		ginfo.sessionStarted = false;
		ginfo.sessionStartTime = 0;
		requestAnimationFrame(ginfo.update);
		return;
	}

	if (!ginfo.sessionStarted) {
		ginfo.sessionStarted = true;
		ginfo.sessionStartTime = Date.now();
	}

	const { x, y, location, direction } = ginfo.getData();
	let text = `@${location}(${x}, ${y})[${direction}]`;

	if (ginfo.showTime) {
		text += ` [${new Date().toLocaleTimeString()}]`;
	}

	if (ginfo.showSessionTime) {
		text += ` [${ginfo.formatTime(Date.now() - ginfo.sessionStartTime)}]`;
	}

	ginfo.label.text = text;

	requestAnimationFrame(ginfo.update);
};

requestAnimationFrame(ginfo.update);
