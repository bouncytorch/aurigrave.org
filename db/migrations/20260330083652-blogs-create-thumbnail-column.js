'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            // Add thumbnail flag; existing rows default to false.
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD COLUMN IF NOT EXISTS "showThumbnail" BOOLEAN NOT NULL DEFAULT FALSE;`,
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 DROP COLUMN IF EXISTS "showThumbnail";`,
                { transaction },
            );
        });
    },
};
