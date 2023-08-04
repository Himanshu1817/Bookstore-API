const winston = require('winston');
const logger = winston.createLogger({

  level: 'info', // Set the desired log level

  format: winston.format.json(),

  defaultMeta: { service: 'bookstore-api' },

  transports: [

    new winston.transports.Console(),

    new winston.transports.File({ filename: 'error.log', level: 'error' }),

    new winston.transports.File({ filename: 'combined.log' }),

  ],

});

 

module.exports = logger;