const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const path = require("path");

router.get("/all", function (req, res) {
  db.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10",
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1", function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        res.json({ postList, postCount });
      });
    }
  );
});

router.get("/all/page/:pageId", function (req, res) {
  var page_id = path.parse(req.params.pageId).base;
  var offset = 10 * (page_id - 1);
  db.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10 OFFSET ?",
    [offset],
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1", function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        res.json({ postList, postCount });
      });
    }
  );
});

router.get("/all/page/:pageId/:postId", function (req, res) {
  var page_id = path.parse(req.params.pageId).base;
  var offset = 10 * (page_id - 1);
  var post_id = path.parse(req.params.postId).base;
  db.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10 OFFSET ?",
    [offset],
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1", function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        db.query(
          "SELECT post.id as post_id, title, content, category_id, users.displayName as user_displayName, view, recommend, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM post JOIN users ON user_id=users.id WHERE post.id=?",
          [post_id],
          function (err3, post) {
            if (err3) {
              throw err3;
            }
            db.query(
              "SELECT comments.id, displayName as user_displayName, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM comments JOIN users ON user_id=users.id WHERE post_id=? order by comments.id desc",
              [post_id],
              function (err4, comments) {
                if (err4) {
                  throw err4;
                }
                if (req.user) {
                  db.query(
                    "SELECT id FROM recommends WHERE post_id=? AND user_id=?",
                    [post_id, req.user[0].id],
                    function (err5, recommend) {
                      if (err5) {
                        throw err5;
                      }
                      res.json({ postList, postCount, post, comments, recommend });
                    }
                  );
                } else {
                  res.json({ postList, postCount, post, comments });
                }
              }
            );
          }
        );
      });
    }
  );
  db.query("UPDATE post set view = view + 1 where id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
});

router.get("/:category", function (req, res) {
  var category = path.parse(req.params.category).base;
  var category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  db.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10",
    [category_id],
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id], function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        res.json({ postList, postCount });
      });
    }
  );
});

router.get("/:category/page/:pageId", function (req, res) {
  var category = path.parse(req.params.category).base;
  var category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  var page_id = path.parse(req.params.pageId).base;
  var offset = 10 * (page_id - 1);
  db.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10 OFFSET ?",
    [category_id, offset],
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id], function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        res.json({ postList, postCount });
      });
    }
  );
});

router.get("/:category/page/:pageId/:postId", function (req, res) {
  var category = path.parse(req.params.category).base;
  var category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  var page_id = path.parse(req.params.pageId).base;
  var offset = 10 * (page_id - 1);
  var post_id = path.parse(req.params.postId).base;
  db.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10 OFFSET ?",
    [category_id, offset],
    function (err, postList) {
      if (err) {
        throw err;
      }
      db.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id], function (
        err2,
        postCount
      ) {
        if (err2) {
          throw err2;
        }
        db.query(
          "SELECT post.id as post_id, title, content, category_id, users.displayName as user_displayName, view, recommend, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE post.id=? AND category_id=?",
          [post_id, category_id],
          function (err3, post) {
            if (err3) {
              throw err3;
            }
            db.query(
              "SELECT comments.id, displayName as user_displayName, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM comments JOIN users ON user_id=users.id WHERE post_id=? order by comments.id desc",
              [post_id],
              function (err4, comments) {
                if (err4) {
                  throw err4;
                }
                if (req.user) {
                  db.query(
                    "SELECT id FROM recommends WHERE post_id=? AND user_id=?",
                    [post_id, req.user[0].id],
                    function (err5, recommend) {
                      if (err5) {
                        throw err5;
                      }
                      res.json({ postList, postCount, post, comments, recommend });
                    }
                  );
                } else {
                  res.json({ postList, postCount, post, comments });
                }
              }
            );
          }
        );
      });
    }
  );
  db.query("UPDATE post SET view = view + 1 where id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
});

router.post("/create_process", function (req, res) {
  var post = req.body;
  var title = post.title;
  var category_id = post.category_id;
  var content = post.content;
  var user_id = post.id;
  db.query(
    "INSERT INTO post(title, category_id, content, user_id) VALUES(?, ?, ?, ?)",
    [title, category_id, content, user_id],
    function (err) {
      if (err) {
        throw err;
      }
      db.query("SELECT id from post order by id desc limit 1", function (err2, post) {
        if (err2) {
          throw err2;
        }
        res.json({ create: true, post });
      });
    }
  );
  db.query(
    `UPDATE counting SET post${category_id}Count = post${category_id}Count + 1 where id=1`,
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
});

router.post("/delete_process", function (req, res) {
  var post = req.body;
  var category_id = post.category_id;
  var post_id = post.post_id;
  console.log(post);
  db.query("DELETE FROM post WHERE id =?", [post_id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ delete: true });
  });
  db.query(
    `UPDATE counting SET post${category_id}Count = post${category_id}Count - 1 where id=1`,
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
  db.query("DELETE FROM comments WHERE post_id =?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
  db.query("DELETE FROM recommends WHERE post_id =?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
});

router.post("/comment/create_process", function (req, res) {
  var post = req.body;
  var user_id = post.user_id;
  var post_id = post.post_id;
  var comment = post.comment;
  db.query(
    "INSERT INTO comments(user_id, post_id, comment) VALUES(?, ?, ?)",
    [user_id, post_id, comment],
    function (err) {
      if (err) {
        throw err;
      }
      res.json({ create: true });
    }
  );
  db.query("UPDATE post SET comment = comment + 1 where id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
});

router.post("/comment/delete_process", function (req, res) {
  var post = req.body;
  var id = post.id;
  var post_id = post.post_id;
  db.query("DELETE FROM comments WHERE id =?", [id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ delete: true });
  });
  db.query("UPDATE post SET comment = comment - 1 WHERE id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
  });
});

router.post("/recommend_up_process", function (req, res) {
  var post = req.body;
  var post_id = post.post_id;
  var user_id = post.user_id;
  db.query("UPDATE post SET recommend = recommend + 1 WHERE id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ recommend: true });
  });
  db.query("INSERT INTO recommends(post_id, user_id) VALUES(?,?)", [post_id, user_id], function (
    err
  ) {
    if (err) {
      throw err;
    }
  });
});

router.post("/recommend_down_process", function (req, res) {
  var post = req.body;
  var post_id = post.post_id;
  var user_id = post.user_id;
  db.query("UPDATE post SET recommend = recommend - 1 WHERE id=?", [post_id], function (err) {
    if (err) {
      throw err;
    }
    res.json({ recommend: true });
  });
  db.query("DELETE FROM recommends WHERE post_id=? AND user_id=?", [post_id, user_id], function (
    err
  ) {
    if (err) {
      throw err;
    }
  });
});

module.exports = router;
