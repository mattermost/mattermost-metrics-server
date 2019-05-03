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

const hello = (event, context, callback) => {
    // Allows to freeze open connections to a database
    context.callbackWaitsForEmptyEventLoop = false;

    client.query('SELECT $1::text as message', ["I'm alive!"], (err, res) => {
        let response;
        if (err) {
            response = errorResponse({
                err,
            });
        } else {
            const ping = res.rows[0];
            response = successResponse({
                ...ping,
            });
        }

        callback(null, response);
    });

};

export default runWarm(hello);
