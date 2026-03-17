dsk.on('prePacket:fx_tpl', (packet) => {
	const blacklist = ['monitor', 'document', 'Object.keys', 'fetch'];
	const anticheat = blacklist.find((e) => packet.code.includes(e));

	if (anticheat) {
		dsk.localMsg(`Ignored [FX_TPL][${anticheat}], please relog immediately to avoid a 1h temp ban`, '#f00');
		packet.type = '';
	}
});
