'use strict';

const { HistoryController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  // /* GET history by user */
  app.get('/history/:user', HistoryController.getReadHistory);

  // /* POST new read to history by user */
  // /* body should be of the form {"user":"anon", "book":2, "date":"2020-11-10T13:54:39.040Z"} */
  app.post('/history/add', HistoryController.addReadHistory);
};
