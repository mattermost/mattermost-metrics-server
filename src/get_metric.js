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

const getMetric = (event, context, callback) => {
    // Allows to freeze open connections to a database
    context.callbackWaitsForEmptyEventLoop = false;

    const {id} = event.pathParameters;
    client.query(`SELECT * FROM metrics WHERE id=${id};`, (err, res) => {
        let response;
        if (err) {
            response = errorResponse({
                err,
            });
        }

        const metric = res.rows[0];
        response = successResponse({
            ...metric,
        });

        callback(null, response);
    });
};

export default runWarm(getMetric);
