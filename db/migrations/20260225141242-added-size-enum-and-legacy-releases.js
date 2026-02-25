'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const { DataTypes } = Sequelize;
        const transaction = await queryInterface.sequelize.transaction();
        try {
            // 1. Add 'legacy' to the existing release type enum.
            //    Note: ALTER TYPE ... ADD VALUE cannot run inside a transaction
            //    in Postgres < 12, so we commit first, then do it outside.
            await transaction.commit();

            await queryInterface.sequelize.query(
                'ALTER TYPE "enum_releases_type" ADD VALUE IF NOT EXISTS \'legacy\';'
            );

            // 2. Add the new 'size' column with its own enum type, in a fresh transaction.
            const t2 = await queryInterface.sequelize.transaction();
            try {
                await queryInterface.addColumn(
                    'releases',
                    'size',
                    {
                        type: DataTypes.ENUM('album', 'ep', 'single'),
                        allowNull: false,
                        defaultValue: 'album', // temporary default to satisfy NOT NULL for existing rows
                    },
                    { transaction: t2 }
                );

                // Remove the default now that existing rows are populated.
                await queryInterface.sequelize.query(
                    'ALTER TABLE "releases" ALTER COLUMN "size" DROP DEFAULT;',
                    { transaction: t2 }
                );

                // Rename the auto-created enum to match Sequelize's naming convention.
                // Sequelize names it enum_releases_size when using addColumn.
                await t2.commit();
            } catch (err) {
                await t2.rollback();
                throw err;
            }
        } catch (err) {
            // Only rollback if the first transaction wasn't already committed.
            try { await transaction.rollback(); } catch (_) { /* already committed */ }
            throw err;
        }
    },

    async down(queryInterface) {
        // 1. Drop the 'size' column and its enum type.
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.removeColumn('releases', 'size', { transaction });

            await queryInterface.sequelize.query(
                'DROP TYPE IF EXISTS "enum_releases_size";',
                { transaction }
            );

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }

        // 2. Remove 'legacy' from enum_releases_type via pg_enum.
        //    ALTER TYPE ... DROP VALUE does not exist in Postgres;
        //    the only way to remove an enum value is to delete it from pg_enum.
        await queryInterface.sequelize.query(`
            DELETE FROM pg_enum
            WHERE enumlabel = 'legacy'
              AND enumtypid = (
                SELECT oid FROM pg_type WHERE typname = 'enum_releases_type'
              );
        `);
    },
};
