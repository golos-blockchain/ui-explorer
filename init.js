let blockchainVersion;
let $nodeAddress = document.getElementById('node-address');
let $nodeAddressInput = $nodeAddress.querySelector('.form-control[name="node-address"]');

if (localStorage && localStorage.nodeAddress) $nodeAddressInput.value = localStorage.nodeAddress;
let nodeAddress = $nodeAddressInput.value;

let loadGolosJsLib = () => {
	let golosJsLib = document.createElement('script');
	golosJsLib.src = `https://cdn.jsdelivr.net/npm/golos-classic-js@0.8.2/dist/golos.min.js`;
	golosJsLib.onload = () => {
		let appLib = document.createElement('script');
		appLib.src = 'app.js';
		(document.head || document.documentElement).appendChild(appLib);
	};
	(document.head || document.documentElement).appendChild(golosJsLib);
};

let getBlockchainVersion = (nodeAddress, callback) => {
	let socket;
	try {
		socket = new WebSocket(nodeAddress);
	}
	catch (e) {}
	if (socket) {
		socket.onopen = (event) => {
			socket.send(JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'call',
				params: ['database_api', 'get_config', [], ]
			}));
			socket.onmessage = (raw) => {
				let data = JSON.parse(raw.data);
				socket.close();
				callback(null, data.result);
			};
		};
		socket.onerror = (event) => {
			console.error('onerror', event);
			callback(event.code);
		}
	}
	else callback(true);
};
