'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            // 0. Pre-flight: abort early if any two blogs share the same
            //    14-char timestamp prefix (same-second posts).
            //    Resolving PK collisions cannot be automated safely — the
            //    developer must handle them manually before re-running.
            const [[{ collisions }]] = await queryInterface.sequelize.query(
                `SELECT COUNT(*) - COUNT(DISTINCT substring(id FROM 1 FOR 14)) AS collisions
                 FROM "blogs"
                 WHERE id ~ '^[0-9]{14}-';`,
                { transaction },
            );
            if (parseInt(collisions, 10) > 0) {
                throw new Error(
                    `[Migration] ${collisions} blog row(s) share the same 14-char timestamp ` +
                    'prefix. Resolve duplicate IDs manually before re-running this migration.\n' +
                    'Run this query to find them:\n' +
                    '  SELECT substring(id FROM 1 FOR 14) AS ts, array_agg(id) FROM blogs ' +
                    '  GROUP BY 1 HAVING COUNT(*) > 1;',
                );
            }

            // 1. Strip the slug suffix from all existing rows.
            //    Old format: "YYYYMMDDHHmmss-some-title-slug"
            //    New format: "YYYYMMDDHHmmss"
            await queryInterface.sequelize.query(
                `UPDATE "blogs"
                 SET id = substring(id FROM 1 FOR 14)
                 WHERE id ~ '^[0-9]{14}-';`,
                { transaction },
            );

            // 2. Drop the old URL-safe CHECK (replaced by the tighter digits check below).
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 DROP CONSTRAINT IF EXISTS "blogs_id_urlsafe_chk";`,
                { transaction },
            );

            // 3. Resize the column now that all values are exactly 14 chars.
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ALTER COLUMN "id" TYPE VARCHAR(14);`,
                { transaction },
            );

            // 4. Enforce the new format at the DB level.
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD CONSTRAINT "blogs_id_datetime_chk"
                 CHECK (id ~ '^[0-9]{14}$');`,
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {

            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 DROP CONSTRAINT IF EXISTS "blogs_id_datetime_chk";`,
                { transaction },
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ALTER COLUMN "id" TYPE VARCHAR(79);`,
                { transaction },
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD CONSTRAINT "blogs_id_urlsafe_chk"
                 CHECK (id ~ '^[A-Za-z0-9\\-._~]+$');`,
                { transaction },
            );
        });
    },
};
