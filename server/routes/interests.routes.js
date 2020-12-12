'use strict';

const { InterestsController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  // /* GET interests by user */
  app.get('/interests/:user', InterestsController.getInterests);

  // /* POST new interest by user */
  // /* body should be of the form {"user":"anon", "topic":"JavaScript"} */
  app.post('/interests/add', InterestsController.addInterests);
};
