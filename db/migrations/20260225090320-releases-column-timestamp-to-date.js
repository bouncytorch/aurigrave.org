'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query(
                `ALTER TABLE "releases"
         ALTER COLUMN "release_date" TYPE DATE
         USING "release_date"::DATE`,
                { transaction }
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const { DataTypes } = Sequelize;
            await queryInterface.changeColumn(
                'releases',
                'release_date',
                {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                { transaction }
            );
        });
    },
};
