// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {Client} = require('pg');
const format = require('pg-format');

import {errorResponse, successResponse, runWarm} from './utils';

const insertTraceQuery = (deviceInfo, traceEvents, metricId, now) => {
    const traces = traceEvents.map((trace) => [
        metricId,
        trace.cat,
        trace.name,
        trace.dur,
        deviceInfo.apiLevel,
        deviceInfo.buildNumber,
        deviceInfo.bundleId,
        deviceInfo.brand,
        deviceInfo.country,
        deviceInfo.deviceId,
        deviceInfo.deviceLocale,
        deviceInfo.deviceType,
        deviceInfo.deviceUniqueId,
        deviceInfo.height,
        deviceInfo.width,
        deviceInfo.isEmulator,
        deviceInfo.isTablet,
        deviceInfo.manufacturer,
        deviceInfo.maxMemory,
        deviceInfo.model,
        deviceInfo.serverVersion,
        deviceInfo.systemName,
        deviceInfo.systemVersion,
        deviceInfo.timezone,
        deviceInfo.version,
        now,
        now,
    ]);

    return format(
        `INSERT INTO traces (
            "metricId",
            "traceCat",
            "traceName",
            "traceDur",
            "apiLevel",
            "buildNumber",
            "bundleId",
            "brand",
            "country",
            "deviceId",
            "deviceLocale",
            "deviceType",
            "deviceUniqueId",
            "height",
            "width",
            "isEmulator",
            "isTablet",
            "manufacturer",
            "maxMemory",
            "model",
            "serverVersion",
            "systemName",
            "systemVersion",
            "timezone",
            "version",
            "createdAt",
            "updatedAt"
        )
        VALUES %L RETURNING id`,
        traces,
    );
};

const insertTraceEvents = (traceEvents, deviceInfo, metricId, now, callback) => {
    client.query(insertTraceQuery(deviceInfo, traceEvents, metricId, now), (err) => {
        let response;
        if (err) {
            response = errorResponse({
                err,
            });
        } else {
            response = successResponse({
                message: 'Successfully saved',
            });
        }

        callback(null, response);
    });
};

const insertMetricQuery = (deviceInfo, traceEvents, now) => {
    const metric = [
        [
            JSON.stringify(deviceInfo),
            'ms',
            JSON.stringify(traceEvents),
            now,
            now,
        ],
    ];

    return format(
        `
        INSERT INTO metrics (
            "deviceInfo",
            "displayTimeUnit",
            "traceEvents",
            "createdAt",
            "updatedAt"
        )
        VALUES %L RETURNING id`,
        metric,
    );
};

const insertMetric = (deviceInfo, traceEvents, now, callback) => {
    client.query(insertMetricQuery(deviceInfo, traceEvents, now), (err, res) => {
        if (err) {
            const response = errorResponse({
                err,
            });

            callback(null, response);
        } else {
            const metricId = res.rows[0].id;

            if (metricId && traceEvents.length > 0) {
                insertTraceEvents(traceEvents, deviceInfo, metricId, now, callback);
            }
        }
    });
};

// Reuse DB connection
if (typeof client === 'undefined') {
    var client = (client = new Client({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
    }));

    client.connect();
}

const postMetric = (event, context, callback) => {
    // Allows to freeze open connections to a database
    context.callbackWaitsForEmptyEventLoop = false;

    const body = JSON.parse(event.body);

    const now = new Date();

    if (body && body.data && body.data.deviceInfo && body.data.traceEvents) {
        insertMetric(body.data.deviceInfo, body.data.traceEvents, now, callback);
    } else {
        const response = errorResponse({
            err: {message: 'Invalid data'},
        });
        callback(null, response);
    }
};

export default runWarm(postMetric);
