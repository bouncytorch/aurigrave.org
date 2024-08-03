// TODO: this module requires extensive testing

import fs from 'fs';
import yaml from 'yaml';

import { Config } from './types';
import Log from './logs';

let config: Config;
const $ = process.env,
	log = new Log('config', 'simple'),
	// why? because yml is fucking awesome
	config_default = `# NOTE: If a submodule in this config has a toggle (an on/off switch, is either "enable" or "level" in the case of logs), 
# if you disable it you can shave off the rest of submodule parameters to save visual space in the config

port: 80                         # [number] HTTP port
logs:                            # Logging options
  level:      'simple'              # [string]    Log level. Can be: verbose, simple, off/null
  savetofile: true                  # [boolean]   Save to file toggle
  extension:  '.log'                # [extension] Log file extension (regardless of extension will still be a text file)
  path:       './logs'              # [path]      Path to save log files to
  format:     'log-DD.MM.YYYY'      # [date]      Log file naming format: https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
static:                           # Static configuration
  path: './static'                  # [path]      Static location on disk (path)
  url:  '/'                         # [url]       Static url, served to the templater for use with the rendered page
                                    # WARNING: If you don't use templater and only serve static pages be wary that if you set this url to anything 
                                    #          but the default value your pages root will be at that address. 
                                    #          F.e. if you set it to "/assets" all the files in your static folder will be served like http://example.com/assets/*, including the web pages: http://example.com/index.html
                                    #          "How do I separate my HTML pages from my sites assets?". Without changing the default value, in your local static folder (located at the static.path you defined)
                                    #          create a folder called "assets". Put your images, fonts, css and stuff like that in there and there you go! you can now separate your assets and pages.
                                    #          This works at any depth, depending on your system's limits. However, do consider how long your URL will be when your file is served: https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
templater:                        # Handlebars templater options
  enabled: false                    # [boolean]   Templater toggle. If false, you'll need to store your .html pages in the static folder
                                    # NOTE: Templater pages currently work only if you create an according endpoint and manually assign an express endpoint to serve it.
                                    #       I am hoping to make it similarly easy to set up as a static site
                                    # WARNING: If you're mixing templater with static html pages, templater will override static in case the pages are on the identical path
  wrapper: './views/template.hbs'   # [path]      SEO wrapper template location
  views: './views'	                # [path]      Templater views location
  seo:                              # SEO defaults. If you don't know what this is, search for "meta tags"
    type: 'website'                   # [string]    Page type
    title: 'bouncytorch'              # [string]    Page title
    description: 'bouncytorch - Electronic, Orchestral and World music, immature film, audio and sound design studies, web and game development discussions and updates.' 
                                      # [string]    Page description
    image: '/images/seo/default.webp' # [url]       Default page link thumbnail image (NOTE: this is relative to static.url)
blog:                             # Blog engine options
  enabled: false                    # [boolean]     Blog engine toggle
  seo: './static/images/seo/blog'   # [path]        Path, to which render blog embed images
  pages: './blog'                   # [path]        Location for blog pages in .md format
  thumbnail: './blog/thumbnail.hbs' # [path]        Blog meta image template. Modify if you wish to change the thumbnail styling
https:                            # SSL options
  enabled: true                     # [boolean]   HTTPS toggle
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
			(blog.sub === undefined || typeof blog.sub === 'string'))) &&

		https && (https.enabled === false || (https.enables === true && https.paths &&
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
if (config.https.enabled && ((!fs.existsSync(config.https.paths.ca) || !fs.lstatSync(config.https.paths.ca).isFile()))) throw new Error('Your SSL CA file is invalid');
if (config.https.enabled && ((!fs.existsSync(config.https.paths.cert) || !fs.lstatSync(config.https.paths.cert).isFile()))) throw new Error('Your SSL cert file is invalid');
if (config.https.enabled && ((!fs.existsSync(config.https.paths.key) || !fs.lstatSync(config.https.paths.key).isFile()))) throw new Error('Your SSL key file is invalid');

export default config;