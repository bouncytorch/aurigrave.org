import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '@/lib/db';

// TODO: DONT FORGET ABOUT THE MIGRATION
export enum ReleaseType {
    Game   = 'game',
    Film   = 'film',
    SFX    = 'sfx',
    Legacy = 'legacy'
}

export enum ReleaseSize {
    Album  = 'album',
    EP     = 'ep',
    Single = 'single'
}

class Release extends Model<InferAttributes<Release>, InferCreationAttributes<Release>> {
    declare id:                 string;
    declare type:               ReleaseType | null;
    declare size:               ReleaseSize;
    declare name:               string;
    declare release_date:       string | null;
    declare shortname:          string;
    declare description:        string | null;
    declare genres:             string[];
    declare featured_video_url: string | null;
    declare linktree_urls:      string[];
    declare cover_url:          string;
    declare sample_urls:        string[];
}

const isValidUrl = (str: string): boolean => {
    try { const url = new URL(str); return url.protocol === 'http:' || url.protocol === 'https:'; }
    catch { return false; }
};

Release.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
            isUrlSafe: (value: string) => {
                if (!/^[A-Za-z0-9\-._~]+$/.test(value))
                    throw new Error('id must only contain URL-safe characters (A-Z, a-z, 0-9, -, ., _, ~)');
            }
        }
    },
    type: DataTypes.ENUM(...Object.values(ReleaseType)),
    size: { type: DataTypes.ENUM(...Object.values(ReleaseSize)), allowNull: false },
    name: { type: DataTypes.STRING(128), allowNull: false },
    release_date: DataTypes.DATEONLY,
    shortname: { type: DataTypes.STRING(64), allowNull: false },
    description: DataTypes.STRING(2048),
    genres: { type: DataTypes.ARRAY(DataTypes.STRING(32)), allowNull: false },
    featured_video_url: {
        type: DataTypes.STRING(256),
        allowNull: true,
        validate: {
            isValidVideoUrl(value: string | null) {
                if (value !== null && value !== undefined && !isValidUrl(value))
                    throw new Error('featured_video_url must be a valid URL');
            }
        }
    },

    linktree_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING(256)),
        allowNull: false,
        validate: {
            allValidUrls(value: string[]) {
                if (!Array.isArray(value)) throw new Error('linktree_urls must be an array');
                value.forEach((url, i) => {
                    if (url === null || url === undefined)
                        throw new Error(`linktree_urls[${i}] must not be null`);
                    if (!isValidUrl(url))
                        throw new Error(`linktree_urls[${i}] is not a valid URL: "${url}"`);
                });
            }
        }
    },
    cover_url: {
        type: DataTypes.STRING(256),
        validate: {
            isUrl: { msg: 'cover_url must be a valid URL' }
        }
    },
    sample_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING(256)),
        allowNull: false,
        validate: {
            allValidUrls(value: string[]) {
                if (!Array.isArray(value)) throw new Error('sample_urls must be an array');
                value.forEach((url, i) => {
                    if (url === null || url === undefined) {
                        throw new Error(`sample_urls[${i}] must not be null`);
                    }
                    if (!isValidUrl(url)) {
                        throw new Error(`sample_urls[${i}] is not a valid URL: "${url}"`);
                    }
                });
            }
        }
    },
}, { sequelize, modelName: 'Release', tableName: 'releases', timestamps: false, defaultScope: { order: [['release_date', 'DESC NULLS FIRST']] } });

export default Release;
