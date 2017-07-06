import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: './es2015/index.js',
	dest: './index.js',
	format: 'cjs',
	external: [
		'fs',
		'path',
		'mailparser',
		'shortid',
		'smtp-server',
	],
	plugins: [
			nodeResolve(
				{
					jsnext: true,
					main: true,
				}
			),
	],
};
