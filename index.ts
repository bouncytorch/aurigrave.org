import express, { NextFunction, Request, Response } from 'express';
import https from 'https';
import chalk from 'chalk';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

process.on('uncaughtException', (err) => {
	if (process.argv.indexOf('-e')) return console.log(err.stack);
	console.log(chalk`{red [exception] ${err}}`);
})

import config from './modules/config';

declare module 'express-serve-static-core' { interface Response {
	tmplt: (name: string, vars?: object, head?: { meta?: { type?: string, description?: string, image?: string, path?: string}, assets?: string, styles?: string[], scripts?: string[] }) => void
	senderr: (code: number, message: string) => void
}}

const app = express();

app
	.use(config.static.url, express.static(config.static.path, { extensions: ['html', 'htm']}))

	.use((req, res, next) => { 
		res.tmplt = (name, vars, head) => res.render('template', {
			head: { 
				meta: { type: 'website', title: 'bouncytorch', description: 'bouncytorch - Electronic, Orchestral and World music, immature film, audio and sound design studies, web and game development discussions and updates.', image: '/assets/images/seo/default.webp', path: req.url },
				assets: config.static.url,
				styles: [],
				scripts: ['https://kit.fontawesome.com/de3d0d4b48.js', 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js'],
				...head
			},
			content: name,
			variables: vars,
		}); 
		res.senderr = (code, message) => res.status(code).json({ code: code, message: message });
		next(); 
	});

// the following is some shit i made so every api endpoint submodule is dynamically imported. for future code explorers, would appreciate feedback on this
// also yeah TODO: type "default"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const endpoints = Object.assign({}, ...fs.readdirSync(path.join(__dirname, '/modules/endpoints'), { withFileTypes: true }).map(({ name }) => (require(`./modules/endpoints/${name.replace('.ts', '')}`) as { default: unknown }).default));
Object.entries(endpoints).forEach(([path, methods]) => 
	Object.entries(methods as { [key: string]: (req: Request, res: Response, next: NextFunction) => unknown }).forEach(([name, func]) => 
		app[name as ('get' | 'post' | 'delete' | 'put' | 'use')](path, func)));

if (config.templater.enabled) {
	app.set('view engine', 'ejs')
		.set('views', config.templater.views);
	
	fs.readdirSync(config.templater.views, { recursive: true }).forEach((name) => {
		if (name === path.relative(config.templater.views, config.templater.wrapper)) return;
		
	});
}

app.listen(config.port);

if (config.https.enabled) https.createServer({
	key: config.https.paths.key,
	ca: config.https.paths.ca,
	cert: config.https.paths.cert
}, app);