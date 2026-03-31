'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            // Widen each keyword element from VARCHAR(32) to VARCHAR(72).
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ALTER COLUMN "keywords" TYPE VARCHAR(72)[]
                 USING "keywords"::VARCHAR(72)[];`,
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            // Revert keyword elements back to VARCHAR(32).
            // NOTE: any existing keyword longer than 32 chars will be truncated.
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ALTER COLUMN "keywords" TYPE VARCHAR(32)[]
                 USING "keywords"::VARCHAR(32)[];`,
                { transaction },
            );
        });
    },
};
