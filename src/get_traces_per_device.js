// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {Client} = require('pg');

import {errorResponse, getQueryParams, successResponse, runWarm} from './utils';

// Reuse DB connection
if (typeof client === 'undefined') {
    var client = (client = new Client({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
    }));

    client.connect();
}

const getTracesPerDeviceUniqueId = (event, context, callback) => {
    // Allows to freeze open connections to a database
    context.callbackWaitsForEmptyEventLoop = false;

    const {device_unique_id: deviceUniqueId} = event.pathParameters;

    const {isChrome, page, perPage} = getQueryParams(
        event.queryStringParameters,
    );

    const limitQuery = `LIMIT ${perPage}`;
    const offsetQuery = `OFFSET ${page * perPage}`;

    client.query(
        `SELECT * FROM metrics WHERE device_info ->> 'device_unique_id' = '${deviceUniqueId}' ORDER BY id DESC ${limitQuery} ${offsetQuery};`,
        (err, res) => {
            let response;
            if (err) {
                response = errorResponse({
                    err,
                });
            } else if (isChrome) {
                const traceEvents = [];
                const metricIds = [];
                res.rows.forEach((metric) => {
                    metricIds.push(metric.id);

                    metric.trace_events.forEach((traceEvent) => {
                        traceEvents.push(traceEvent);
                    });
                });

                response = successResponse({
                    chromeTracing: 'true',
                    displayTimeUnit: 'ms',
                    metricIds,
                    traceEvents,
                });
            } else {
                response = successResponse({
                    metrics: res.rows,
                });
            }

            callback(null, response);
        },
    );
};

export default runWarm(getTracesPerDeviceUniqueId);
