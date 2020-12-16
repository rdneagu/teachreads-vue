'use strict';

const { InterestsController } = require('../controllers/_index').controllers;

exports.config = (app) => {
  // /* GET interests by user */
  app.get('/api/interests/:user', InterestsController.getInterests);

  // /* POST new interest by user */
  // /* body should be of the form {"user":"anon", "category":"JavaScript"} */
  app.post('/api/interests/add', InterestsController.addInterest);

  // /* DELETE category from user's interests */
  app.delete('/api/interests/:user/delete/:category', InterestsController.deleteInterest);
};
