'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            // 1. Drop the HTTP check constraint on cover_url before removing the column
            await queryInterface.sequelize.query(
                'ALTER TABLE "releases" DROP CONSTRAINT IF EXISTS "releases_cover_url_http_chk";',
                { transaction }
            );

            // 2. Drop the cover_url column
            await queryInterface.removeColumn('releases', 'cover_url', { transaction });

            // 3. Rename sample_urls -> samples
            await queryInterface.renameColumn('releases', 'sample_urls', 'samples', { transaction });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            // 1. Rename samples back to sample_urls
            await queryInterface.renameColumn('releases', 'samples', 'sample_urls', { transaction });

            // 2. Re-add the cover_url column
            await queryInterface.addColumn(
                'releases',
                'cover_url',
                {
                    type: Sequelize.STRING(256),
                    allowNull: true,
                },
                { transaction }
            );

            // 3. Restore the HTTP check constraint on cover_url
            await queryInterface.sequelize.query(
                `ALTER TABLE "releases"
                 ADD CONSTRAINT "releases_cover_url_http_chk"
                 CHECK ("cover_url" IS NULL OR "cover_url" ~* '^https?://');`,
                { transaction }
            );
        });
    },
};
