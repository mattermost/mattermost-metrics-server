import Sequelize from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: process.env.DATABASE_DIALECT,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
    },
);

const Metric = sequelize.define('metric', {
    deviceInfo: Sequelize.JSON,
    displayTimeUnit: Sequelize.STRING,
    traceEvents: Sequelize.JSON,
});

Metric.associate = (models) => {
    Metric.hasMany(models.Trace, {
        foreignKey: 'metricId',
        onDelete: 'CASCADE',
    });
};

Metric.findById = async (id) => {
    return await Metric.findOne({
        where: {id},
    });
};

const Trace = sequelize.define('trace', {
    traceCat: Sequelize.STRING,
    traceName: Sequelize.STRING,
    traceDur: Sequelize.INTEGER,
    apiLevel: Sequelize.STRING,
    buildNumber: Sequelize.STRING,
    bundleId: Sequelize.STRING,
    brand: Sequelize.STRING,
    country: Sequelize.STRING,
    deviceId: Sequelize.STRING,
    deviceLocale: Sequelize.STRING,
    deviceType: Sequelize.STRING,
    deviceUniqueId: Sequelize.STRING,
    height: Sequelize.INTEGER,
    width: Sequelize.INTEGER,
    isEmulator: Sequelize.BOOLEAN,
    isTablet: Sequelize.BOOLEAN,
    manufacturer: Sequelize.STRING,
    maxMemory: Sequelize.INTEGER,
    model: Sequelize.STRING,
    serverVersion: Sequelize.STRING,
    systemName: Sequelize.STRING,
    systemVersion: Sequelize.STRING,
    timezone: Sequelize.STRING,
    version: Sequelize.STRING,
});

Trace.associate = (models) => {
    Trace.belongsTo(models.Metric);
};

const models = {
    Metric,
    Trace,
};

Object.keys(models).forEach((key) => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export {sequelize};

export default models;
