const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, json } = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logs/log-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '31d',
});

const loggerInfo = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), json()),
    transports: [fileRotateTransport]
});

module.exports = loggerInfo