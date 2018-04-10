// Config file for running Rollup in "normal" mode (non-watch)

import rollupGitVersion from 'rollup-plugin-git-version'
import json from 'rollup-plugin-json'
import gitRev from 'git-rev-sync'

let version = require('../package.json').version;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
	release = true;
} else {
	release = false;
	const branch = gitRev.branch();
	const rev = gitRev.short();
	version += '+' + branch + '.' + rev;
}

const banner = `/* @preserve
 * leaflet-draggable-tooltip ${version}, a leaflet draggable tooltip plugin. http://leafletjs.com
 * (c) 2017 Anton Borisov
 */
`;

export default {
	input: 'src/Leaflet.Draggable.Tooltip.js',
	output: {
		file: 'dist/leaflet-draggable-tooltip-src.js',
		format: 'umd',
		name: 'L',
		banner: banner,
		sourcemap: true
	},
	legacy: true, // Needed to create files loadable by IE8
	plugins: [
		release ? json() : rollupGitVersion()
	]
};
