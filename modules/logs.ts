import chalk from 'chalk';
import { format } from 'date-fns';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join as path } from 'path';

export default class Log {
	prefix; level; path; extension; format;

	constructor(prefix?: string, level?: 'off' | 'simple' | 'verbose', save: boolean = false, path: string = './logs', extension: string = 'log', format: string = 'log') {
		this.prefix = prefix;
		this.level = level;
		if (save) {
			this.path = path;
			this.extension = extension;
			this.format = format;
		}
	}

	log(message: string, chlk: string = 'dim') {
		if (this.prefix) message = this.prefix + message;
		
		// todo: do something about this
		if (this.path && this.format && this.extension) {
			if (!existsSync(this.path)) mkdirSync(this.path, { recursive: true });
			writeFileSync(path(this.path, format(new Date(), this.format) + this.extension), chalk`{${chlk} ${message}}`);
		}

		console.log(chalk`{${chlk} ${message}}`);
	}

	info(message: string) { if (this.level === 'verbose') this.log(message); }

	alert(message: string) { if (this.level && this.level !== 'off') this.log(message, 'reset'); }

	warn(message: string) { if (this.level === 'verbose') this.log(message, 'yellow'); }

	err(message: string) { this.log(message, 'red') }
}