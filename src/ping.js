// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {Client} = require('pg');

import {successResponse, runWarm} from './utils';

// Reuse DB connection
if (typeof client === 'undefined') {
    var client = (client = new Client({
        connectionString: process.env.DATABASE_CONNECTION_STRING,
    }));

    client.connect();
}

const hello = (event, context, callback) => {
    client.query('SELECT $1::text as message', ['I\'m alive!'], (err, res) => {
        let response;
        if (err) {
            response = errorResponse({
                err,
            });
        } else {
            response = successResponse({
                ...res.rows[0],
            });
        }

        callback(null, response);
    });
};

export default runWarm(hello);
