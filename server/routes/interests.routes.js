'use strict';

const { InterestsController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  // /* GET interests by user */
  app.get('/api/interests/:user', InterestsController.getInterests);

  // /* POST new interest by user */
  // /* body should be of the form {"user":"anon", "topic":"JavaScript"} */
  app.post('/api/interests/add', InterestsController.addInterests);
};
