export type Config = {
	port: number
	logs: {
		level?: 'off' | 'simple' | 'verbose' | 'null'
		savetofile: boolean
		extension: string
		path: string
		format: string
	}
	static: {
		path: string
		url: string
	}
	templater: {
		enabled: true
		wrapper: string
		views: string
		seo: {
			type: string
			title: string
			description: string
			image: string
		}
	}
	blog: {
		enabled: boolean
		sub?: string
		seo: string
		pages: string
		thumbnail: string
	}
	https: {
		enabled: boolean
		paths: {
			ca: string
			cert: string
			key: string
		}
	}
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			[key: string]: string | undefined;
			PORT: string
			LOGS_LEVEL: string
			LOGS_SAVETOFILE: string
			LOGS_EXTENSION: string
			LOGS_PATH: string
			LOGS_FORMAT: string
			STATIC_PATH: string
			STATIC_URL: string
			TEMPLATER_ENABLED: string
			TEMPLATER_WRAPPER: string
			TEMPLATER_VIEWS: string
			TEMPLATER_SEO_TYPE: string
			TEMPLATER_SEO_TITLE: string
			TEMPLATER_SEO_DESCRIPTION: string
			TEMPLATER_SEO_IMAGE: string
			BLOG_ENABLED: string
			BLOG_SUB: string
			BLOG_SEO: string
			BLOG_PAGES: string
			BLOG_THUMBNAIL: string
			HTTPS_ENABLED: string
			HTTPS_PATHS_CA: string
			HTTPS_PATHS_CERT: string
			HTTPS_PATHS_KEY: string
		}
	}
}