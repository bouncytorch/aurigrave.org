// TODO: this module requires extensive testing

import fs from 'fs';
import yaml from 'yaml';

import { Config } from './types';
import Log from './logs';

let config: Config;
const $ = process.env,
	log = new Log('[config] ', 'simple'),
	// why? because yml is fucking awesome
	config_default = `# NOTE: If a submodule in this config has a toggle (an on/off switch, is either "enable" or "level" in the case of logs), 
# if you disable it you can shave off the rest of submodule parameters to save visual space in the config

port: 80                         # [number] HTTP port
logs:                            # Logging options
  level:      'simple'              # [string|null] Logging level
  savetofile: true                  # [boolean]     Toggle for saving console logs to files
  extension:  '.log'                # [string]      Log file extension
  path:       './logs'              # [path]        Path to which to save the log files
  format:     'log-DD.MM.YYYY'      # [date]        Log file naming format. For date symbols, visit https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
static:                           # Static configuration
  path: './static'                  # [path]        Static location on disk (path)
  url:  '/'                         # [url]         Static url, served to the templater for use with the rendered page
templater:                        # Templater options
  enabled: true                     # [boolean]     Templater toggle
  views: './views'                  # [path]        Path to templater views
  wrapper: './views/template.ejs'   # [path]        Path to templater wrapper
seo:                              # SEO options for templater
  default:                            # SEO defaults. If you don't know what this is, search for "meta tags"
    type: 'website'                   # [string]    Page type
    title: 'bouncytorch'              # [string]    Page title
    description: 'bouncytorch - Electronic, Orchestral and World music, immature film, audio and sound design studies, web and game development discussions and updates.' 
                                      # [string]    Page description
    image: '/images/seo/default.webp' # [url]       Default page link thumbnail image (NOTE: this is relative to static.url)
	
blog:                             # Blog engine options
  enabled: false                    # [boolean]     Blog engine toggle
  seo: './static/images/seo/blog'   # [path]        Path, to which render blog embed images
  pages: './blog'                   # [path]        Location for blog pages in .md format
  sub: 'blog'                       # [string]      Blog subdomain. If set to a string, will only return blog pages on that subdomain
  url: '/'                          # [url]         Url at which to serve blog index (the list of all the blog posts). Can not be null
  url_page: '/'                     # [url]         Url at which to serve blog pages (is more of a prefix). Can not be null
                                    # NOTE: Here's a couple examples of using the three above:
                                    #       1. If you set sub: null, url: '/blog' and url_page: '/', your blog index will be available at "domain.com/blog", and each post at "domain.com/blog/<postname>"
                                    #       2. If you set sub: 'blog', url: '/', url_page: '/post', your blog index will be available at "blog.domain.com", and each post at "blog.domain.com/post/<postname>"
                                    #       3. If you set sub: null, url: '/' and url_page: '/post', your blog index will be available at "domain.com", and each post at "domain.com/post/<postname>"
                                    #       If you wish your site to have a blog and nothing else, you'd want to choose option 3. 
                                    #       If you wish your site to serve your blog at a separate subdomain, pick option 2.
                                    #       If you don't want to fiddle with subdomains, you ought to use option 1.
  template: './blog/template.hbs'   # [path]        Blog page template. Doesn't depend on templater options
  thumbnail: './blog/thumbnail.hbs' # [path]        Blog meta image template. Modify if you wish to change the thumbnail styling
https:                            # SSL options
  enabled: false                    # [boolean]   HTTPS toggle
  port: 443                         # [number]    HTTPS port
  paths:                            # SSL paths
    ca: './ssl/ca.pem'                # [path]      Chain
    cert: './ssl/cert.pem'            # [path]      Cert
    key: './ssl/key.pem'              # [path]      Key
`;

function envToConfig(): Config {
	const envc: Omit<Config, 'logs'> & { logs: { level: string, savetofile: boolean, extension: string, path: string, format: string } } = {
		// the JSON.parse here is to turn the env string into boolean. this seems to work, but to handle a missing env paramenter i have to do a ternary expression like this
		// i wonder if there's a way to do it without the ternary
		port: $.PORT ? JSON.parse($.PORT) : undefined,
		logs: {
			level: $.LOGS_LEVEL,
			savetofile: JSON.parse($.LOGS_SAVETOFILE),
			extension: $.LOGS_EXTENSION,
			path: $.LOGS_PATH,
			format: $.LOGS_FORMAT
		},
		static: { path: $.STATIC_PATH, url: $.STATIC_URL },
		templater: {
			enabled: $.TEMPLATER_ENABLED ? JSON.parse($.TEMPLATER_ENABLED) : undefined,
			wrapper: $.TEMPLATER_WRAPPER,
			views: $.TEMPLATER_VIEWS,
			seo: {
				type: $.TEMPLATER_SEO_TYPE,
				title: $.TEMPLATER_SEO_TITLE,
				description: $.TEMPLATER_SEO_DESCRIPTION,
				image: $.TEMPLATER_SEO_IMAGE
			}
		},
		blog: {
			enabled: $.BLOG_ENABLED ? JSON.parse($.BLOG_ENABLED) : undefined,
			sub: $.BLOG_SUB,
			seo: $.BLOG_SEO,
			pages: $.BLOG_PAGES,
			url: $.BLOG_URL,
			url_page: $.BLOG_URL_PAGE,
			template: $.BLOG_TEMPLATE,
			thumbnail: $.BLOG_THUMBNAIL
		},
		https: {
			enabled: $.HTTPS_ENABLED ? JSON.parse($.HTTPS_ENABLED) : undefined,
			paths: {
				ca: $.HTTPS_PATHS_CA,
				cert: $.HTTPS_PATHS_CERT,
				key: $.HTTPS_PATHS_KEY
			}
		}
	};
	if (!isConfig(envc)) throw new Error ('Missing environment (.env) variables');
	return envc;
}
// this feels like it's not too great either, but it works pretty consistently so... too bad!
// eslint-disable-next-line @typescript-eslint/no-explicit-any 
function isConfig(c: any): c is Config {
	if (typeof c !== 'object' || c === null) return false;
	const { port, logs, static: static_, templater, blog, https } = c;
	return port && typeof port == 'number' && port < 65535 && port > -1 && 
	
		logs && ([null, 'off'].includes(logs.level) || (['simple', 'verbose'].includes(logs.level) && typeof logs.savetofile === 'boolean' && typeof logs.extension === 'string' &&
		typeof logs.path === 'string' && typeof logs.format === 'string')) &&

		static_ && typeof static_.path === 'string' && typeof static_.url === 'string' &&

		templater && (templater.enabled === false || (templater.enabled === true && typeof templater.wrapper === 'string' &&
			typeof templater.views === 'string' && templater.seo && typeof templater.seo.type === 'string' &&
			typeof templater.seo.title === 'string' && typeof templater.seo.description === 'string' &&
			typeof templater.seo.image === 'string')) &&

		blog && (blog.enabled === false || (blog.enabled === true && typeof blog.seo === 'string' &&
			typeof blog.pages === 'string' && typeof blog.thumbnail === 'string' &&
			typeof blog.url_page === 'string' && typeof blog.template == 'string' &&
			(blog.sub === undefined || typeof blog.sub === 'string'))) &&

		https && (https.enabled === false || (https.enabled === true && https.paths &&
		typeof https.paths.ca === 'string' && typeof https.paths.cert === 'string' &&
		typeof https.paths.key === 'string'));
}

// check for config type (env/yaml)
// i know it's not the most elegant... too bad!
const option = process.argv.indexOf('-c') !== -1 ? process.argv.indexOf('-c') : process.argv.indexOf('--config-type'),
	type = process.argv[option + 1];

if (option !== -1 && type === 'env') config = envToConfig();
else if (option === -1 || (option !== -1 && type === 'yml')) {
	if (fs.existsSync('./config.yml')) config = yaml.parse(fs.readFileSync('./config.yml').toString());
	else { 
		fs.writeFileSync('./config.yml', config_default);
		log.alert('No config file found. Created a new one with default values')
		process.exit(0);
	}
	if (!isConfig(config)) throw new Error('Config invalid/missing parameters');
}
else throw new Error('Invalid `--config-type`, can only be of "env" or "yml"');

// validating config paths and fixing variables
if (config.logs.level && config.logs.level !== 'off' && !config.logs.extension.startsWith('.')) config.logs.extension = '.' + config.logs.extension;
if (!fs.existsSync(config.static.path) || !fs.lstatSync(config.static.path).isDirectory()) log.warn('Static path invalid/doesn\'t exist. Static content won\'t be served until you create it');
if (config.templater.enabled && (!fs.existsSync(config.templater.wrapper) || !fs.lstatSync(config.templater.wrapper))) throw new Error('Templater wrapper does not exist. Pages can\'t be rendered without a wrapper');
if (config.templater.enabled && (!fs.existsSync(config.templater.views) || !fs.lstatSync(config.templater.views).isDirectory())) throw new Error('Views path invalid/doesn\'t exist');
if (config.blog.enabled && ((!fs.existsSync(config.blog.pages) || !fs.lstatSync(config.blog.pages).isDirectory()))) log.warn('Blog pages path invalid/doesn\'t exist. Your blog will not have any posts');
if (config.blog.enabled && ((!fs.existsSync(config.blog.template) || !fs.lstatSync(config.blog.template).isDirectory()))) throw new Error('Blog template invalid/doesn\'t exist. Blog pages can\'t be rendered');
if (config.https.enabled && ((!fs.existsSync(config.https.paths.ca) || !fs.lstatSync(config.https.paths.ca).isFile()))) throw new Error('Your SSL CA file is invalid');
if (config.https.enabled && ((!fs.existsSync(config.https.paths.cert) || !fs.lstatSync(config.https.paths.cert).isFile()))) throw new Error('Your SSL cert file is invalid');
if (config.https.enabled && ((!fs.existsSync(config.https.paths.key) || !fs.lstatSync(config.https.paths.key).isFile()))) throw new Error('Your SSL key file is invalid');

export default config;