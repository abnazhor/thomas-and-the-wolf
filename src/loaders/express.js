import express from 'express';
import session from 'express-session';

import router from "../api/router.js";

export default async (app) => {
  // Session configuration to handle games
  // It is configured with insecure mode in mind as it is a test
  app.use(
    session({
      secret: "thomas-and-the-wolf",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false
      }
    })
  )

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use("", router());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    res.status(404).send({
      message: "Not found",
      status: 404,
      description: "Resource not found",
      details: {}
    })
  });
};