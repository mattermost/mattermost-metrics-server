import {successResponse, runWarm} from './utils';
import models from './models';

const postMetric = (event, context, callback) => {
    const body = JSON.parse(event.body);
    if (body.data && body.data.deviceInfo && body.data.traceEvents) {
        saveMetricAndTraces(models, body.data).then((metric) => {
            const response = successResponse({
                metric,
            });
        
            callback(null, response);
        });
    }
};

export default runWarm(postMetric);

async function saveMetricAndTraces(models, data) {
    const {deviceInfo, traceEvents} = data;
    const createdMetric = await models.Metric.create({
        deviceInfo,
        traceEvents,
        displayTimeUnit: 'ms',
    });

    if (traceEvents && traceEvents.length > 0) {
        traceEvents.forEach(async (trace) => {
            await models.Trace.create({
                metricId: createdMetric.dataValues.id,
                traceCat: trace.cat,
                traceName: trace.name,
                traceDur: trace.dur,
                apiLevel: deviceInfo.apiLevel,
                buildNumber: deviceInfo.buildNumber,
                bundleId: deviceInfo.bundleId,
                brand: deviceInfo.brand,
                country: deviceInfo.country,
                deviceId: deviceInfo.deviceId,
                deviceLocale: deviceInfo.deviceLocale,
                deviceType: deviceInfo.deviceType,
                deviceUniqueId: deviceInfo.deviceUniqueId,
                height: deviceInfo.height,
                width: deviceInfo.width,
                isEmulator: deviceInfo.isEmulator,
                isTablet: deviceInfo.isTablet,
                manufacturer: deviceInfo.manufacturer,
                maxMemory: deviceInfo.maxMemory,
                model: deviceInfo.model,
                serverVersion: deviceInfo.serverVersion,
                systemName: deviceInfo.systemName,
                systemVersion: deviceInfo.systemVersion,
                timezone: deviceInfo.timezone,
                version: deviceInfo.version,
            });
        });
    }

    return {metric: createdMetric};
}
