const {app, BrowserWindow} = require('electron');

// Must allocate `mainWindow` **outside** the 'ready' handler; otherwise, when the browser runs this script,
// `mainWindow` will be eligible for garbage collection **immediately**. Because different implementations of the
// garbage collector will have different behavior, failing to allocate the variable outside the function will sometimes
// work and sometimes not.
mainWindow = null;

app.on('ready', () => {
	console.log('Hello from Electron.');
	mainWindow = new BrowserWindow();
});
