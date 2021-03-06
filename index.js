const morgan = require('morgan');
const express = require('express');
require('express-async-errors');
const winston = require('winston');
const logger = require('./startup/logging');

const { config } = require('./config/index');

const app = express();

if (app.get('env') === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

  logger.stream = {
    write(message) {
      logger.info(message);
    },
  };

  app.use(morgan('tiny', { stream: logger.stream }));
  logger.info('Morgan enabled...');
}

require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation')();

const port = config.port;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;
