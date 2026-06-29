(function () {
  router.route('/', (app) => renderDashboard(app));
  router.route('/home', (app) => renderHome(app));
  router.route('/login', (app) => renderLogin(app));
  router.route('/register', (app) => renderRegister(app));
  router.route('/teams', (app) => renderTeamsPage(app));
  router.route('/calendar', (app) => renderCalendarPage(app));
  router.route('/admin', (app) => renderAdminPage(app));
  router.route('/profile', (app) => renderProfilePage(app));

  if (!window.location.hash) {
    window.location.hash = store.get().token ? '#/' : '#/home';
  }

  router.init();
})();
