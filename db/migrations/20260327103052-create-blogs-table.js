'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const { DataTypes } = Sequelize;

        await queryInterface.sequelize.transaction(async (transaction) => {

            //  1. Create table
            await queryInterface.createTable('blogs', {
                id: {
                    type:       DataTypes.STRING(79),
                    primaryKey: true,
                    allowNull:  false,
                },
                title: {
                    type:      DataTypes.STRING(64),
                    allowNull: false,
                },
                description: {
                    type:      DataTypes.STRING(255),
                    allowNull: false,
                },
                content: {
                    type:      DataTypes.TEXT,
                    allowNull: false,
                },
                keywords: {
                    type:         DataTypes.ARRAY(DataTypes.STRING(32)),
                    allowNull:    false,
                    defaultValue: Sequelize.literal('\'{}\''),
                },
                tags: {
                    type:         DataTypes.ARRAY(DataTypes.STRING(48)),
                    allowNull:    false,
                    defaultValue: Sequelize.literal('\'{}\''),
                },
                state: {
                    type:         DataTypes.STRING(16),
                    allowNull:    false,
                    defaultValue: 'draft',
                },
                createdAt: {
                    type:      DataTypes.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type:      DataTypes.DATE,
                    allowNull: false,
                },
            }, { transaction });

            //  2. URL-safe id constraint
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD CONSTRAINT "blogs_id_urlsafe_chk"
                 CHECK (id ~ '^[A-Za-z0-9\\-._~]+$');`,
                { transaction },
            );

            //  3. State CHECK constraint
            // Chosen over a PG enum: adding/removing states is a plain
            // ALTER TABLE DROP/ADD CONSTRAINT — no pg_enum hacking needed.
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD CONSTRAINT "blogs_state_chk"
                 CHECK (state IN ('draft', 'unlisted', 'published'));`,
                { transaction },
            );

            //  4. Generated tsvector column (PG 12+)
            // Maintained automatically by Postgres on every write; no hooks needed.
            // title → weight A, description → B, content → C (affects ts_rank).
            await queryInterface.sequelize.query(
                `ALTER TABLE "blogs"
                 ADD COLUMN "search_vector" tsvector
                     GENERATED ALWAYS AS (
                         setweight(to_tsvector('english', coalesce(title, '')),       'A') ||
                         setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
                         setweight(to_tsvector('english', coalesce(content, '')),     'C')
                     ) STORED;`,
                { transaction },
            );

            //  5. GIN index on search_vector
            // Drops full-text search from O(n) sequential scan to O(log n).
            await queryInterface.sequelize.query(
                'CREATE INDEX "blogs_search_vector_gin" ON "blogs" USING GIN (search_vector);',
                { transaction },
            );

            //  6. GIN index on tags array
            // Makes `WHERE 'tag' = ANY(tags)` fast.
            await queryInterface.sequelize.query(
                'CREATE INDEX "blogs_tags_gin" ON "blogs" USING GIN (tags);',
                { transaction },
            );

            //  7. Materialized view: all unique tags
            // SELECT DISTINCT unnest(tags) on the raw table is a full scan.
            // This view gives O(1) tag listing; refreshed by model hooks on writes.
            await queryInterface.sequelize.query(
                `CREATE MATERIALIZED VIEW "unique_blog_tags" AS
                     SELECT DISTINCT unnest(tags) AS tag
                     FROM   "blogs"
                     ORDER  BY tag;`,
                { transaction },
            );

            // 8. Unique index on view
            // Required for REFRESH MATERIALIZED VIEW CONCURRENTLY (non-blocking).
            await queryInterface.sequelize.query(
                `CREATE UNIQUE INDEX "unique_blog_tags_tag_idx"
                     ON "unique_blog_tags" (tag);`,
                { transaction },
            );
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.sequelize.query(
                'DROP MATERIALIZED VIEW IF EXISTS "unique_blog_tags";',
                { transaction },
            );
            // Dropping the table also drops all its indexes and the generated column.
            await queryInterface.dropTable('blogs', { transaction });
        });
    },
};
