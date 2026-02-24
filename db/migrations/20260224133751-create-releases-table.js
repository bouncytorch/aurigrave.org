'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'releases',
        {
          id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
          },

          type: {
            type: DataTypes.ENUM('game', 'film', 'sfx'),
            allowNull: true,
          },

          name: {
            type: DataTypes.STRING(128),
            allowNull: false,
          },

          release_date: {
            type: DataTypes.DATE,
            allowNull: true,
          },

          shortname: {
            type: DataTypes.STRING(64),
            allowNull: false,
          },

          description: {
            type: DataTypes.STRING(2048),
            allowNull: true,
          },

          genres: {
            type: DataTypes.ARRAY(DataTypes.STRING(32)),
            allowNull: false,
          },

          linktree_urls: {
            type: DataTypes.ARRAY(DataTypes.STRING(256)),
            allowNull: false,
          },

          cover_url: {
            type: DataTypes.STRING(256),
            allowNull: true,
          },

          sample_urls: {
            type: DataTypes.ARRAY(DataTypes.STRING(256)),
            allowNull: false,
          },
        },
        { transaction }
      );

      // DB-level constraints (Postgres)
      await queryInterface.sequelize.query(
        `
        ALTER TABLE "releases"
          ADD CONSTRAINT "releases_id_urlsafe_chk"
          CHECK ("id" ~ '^[A-Za-z0-9\\-._~]+$');
        `,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `
        ALTER TABLE "releases"
          ADD CONSTRAINT "releases_cover_url_http_chk"
          CHECK ("cover_url" IS NULL OR "cover_url" ~* '^https?://');
        `,
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('releases', { transaction });

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_releases_type";',
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
