class PostsController {
  // [GET] /api/posts
  index(req, res, next) {
    res.send('Posts API');
  }
}

module.exports = new PostsController();
