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
        deviceInfo.api_level,
        deviceInfo.build_number,
        deviceInfo.bundle_id,
        deviceInfo.brand,
        deviceInfo.country,
        deviceInfo.device_id,
        deviceInfo.device_locale,
        deviceInfo.device_type,
        deviceInfo.device_unique_id,
        deviceInfo.height,
        deviceInfo.width,
        deviceInfo.is_emulator,
        deviceInfo.is_tablet,
        deviceInfo.manufacturer,
        deviceInfo.max_memory,
        deviceInfo.model,
        deviceInfo.server_version,
        deviceInfo.system_name,
        deviceInfo.system_version,
        deviceInfo.timezone,
        deviceInfo.app_version,
        now,
        now,
    ]);

    return format(
        `INSERT INTO traces (
            "metric_id",
            "trace_cat",
            "trace_name",
            "trace_dur",
            "api_level",
            "build_number",
            "bundle_id",
            "brand",
            "country",
            "device_id",
            "device_locale",
            "device_type",
            "device_unique_id",
            "height",
            "width",
            "is_emulator",
            "is_tablet",
            "manufacturer",
            "max_memory",
            "model",
            "server_version",
            "system_name",
            "system_version",
            "timezone",
            "app_version",
            "created_at",
            "updated_at"
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
            "device_info",
            "display_time_unit",
            "trace_events",
            "created_at",
            "updated_at"
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

    if (body && body.data && body.data.device_info && body.data.trace_events) {
        insertMetric(body.data.device_info, body.data.trace_events, now, callback);
    } else {
        const response = errorResponse({
            err: {message: 'Invalid data'},
        });
        callback(null, response);
    }
};

export default runWarm(postMetric);
