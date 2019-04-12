// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {Client} = require('pg');

import {errorResponse, successResponse, runWarm} from './utils';

// Reuse DB connection
if (typeof client === 'undefined') {
    var client = (client = new Client({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
    }));

    client.connect();
}

const getMetrics = (event, context, callback) => {
    // Allows to freeze open connections to a database
    context.callbackWaitsForEmptyEventLoop = false;

    client.query(
        'SELECT * FROM metrics ORDER BY id DESC LIMIT 100;',
        (err, res) => {
            let response;
            if (err) {
                response = errorResponse({
                    err,
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

export default runWarm(getMetrics);
