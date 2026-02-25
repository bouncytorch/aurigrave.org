'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addColumn(
                'releases',
                'featured_video_url',
                {
                    type: Sequelize.STRING(256),
                    allowNull: true,
                },
                { transaction }
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeColumn(
                'releases',
                'featured_video_url',
                { transaction }
            );
        });
    },
};
