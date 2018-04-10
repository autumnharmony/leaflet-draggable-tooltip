
import {version} from '../package.json';
export {version};


// layer
export * from './layer/';

// misc

var oldL = window.L;
export function noConflict() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;