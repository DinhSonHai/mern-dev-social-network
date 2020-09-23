const users = require('./api/users');
const auth = require('./api/auth');
const profile = require('./api/profile');
const posts = require('./api/posts');

function route(app) {
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/profile', profile);
  app.use('/api/posts', posts);
  app.use('/', (req, res) => res.send('API running'));

  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = route;
