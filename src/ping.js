// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {successResponse, runWarm} from './utils';

const hello = (event, context, callback) => {
    const response = successResponse({
        message: "I'm alive!",
    });

    callback(null, response);
};

export default runWarm(hello);
