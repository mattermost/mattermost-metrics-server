import Sequelize from 'sequelize';

import {successResponse, runWarm} from './utils';
import models from './models';

const getMetrics = (event, context, callback) => {
    models.Metric.findAll().then((metrics) => {
        const response = successResponse({
            metrics,
        });
    
        callback(null, response);
    });
};

export default runWarm(getMetrics);
