module.exports = {
  init(app){
    const logger = require('morgan');
    const staticRoutes = require("../routes/static");
    const userRoutes = require("../routes/users");
    
    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(logger('dev'));
  }
}