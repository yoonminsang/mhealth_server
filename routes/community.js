const express = require("express");
const router = express.Router();
const pool = require("../lib/pool");
const path = require("path");

router.get("/all", async (req, res) => {
  const [postList, fields] = await pool.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10"
  );
  const [postCount, fields2] = await pool.query(
    "SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1"
  );
  res.json({ postList, postCount });
});

router.get("/all/page/:pageId", async (req, res) => {
  const page_id = path.parse(req.params.pageId).base;
  const offset = 10 * (page_id - 1);
  const [
    postList,
    fields,
  ] = await pool.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10 OFFSET ?",
    [offset]
  );
  const [postCount, fields2] = await pool.query(
    "SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1"
  );
  res.json({ postList, postCount });
});

router.get("/all/page/:pageId/:postId", async (req, res) => {
  const page_id = path.parse(req.params.pageId).base;
  const offset = 10 * (page_id - 1);
  const post_id = path.parse(req.params.postId).base;
  const [
    postList,
    fields,
  ] = await pool.query(
    "SELECT post.id, title, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id order by id desc LIMIT 10 OFFSET ?",
    [offset]
  );
  const [postCount, fields2] = await pool.query(
    "SELECT sum(post1Count+post2Count) as postCount FROM counting WHERE id=1"
  );
  const [
    post,
    fields3,
  ] = await pool.query(
    "SELECT post.id as post_id, title, content, category_id, users.displayName as user_displayName, view, recommend, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM post JOIN users ON user_id=users.id WHERE post.id=?",
    [post_id]
  );
  const [
    comments,
    fields4,
  ] = await pool.query(
    "SELECT comments.id, displayName as user_displayName, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM comments JOIN users ON user_id=users.id WHERE post_id=? order by comments.id desc",
    [post_id]
  );
  await pool.query("UPDATE post set view = view + 1 where id=?", [post_id]);
  if (req.user) {
    const [
      recommend,
      fields5,
    ] = await pool.query("SELECT id FROM recommends WHERE post_id=? AND user_id=?", [
      post_id,
      req.user[0].id,
    ]);
    res.json({ postList, postCount, post, comments, recommend });
  } else {
    res.json({ postList, postCount, post, comments });
  }
});

router.get("/:category", async (req, res) => {
  const category = path.parse(req.params.category).base;
  let category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  const [
    postList,
    fields,
  ] = await pool.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10",
    [category_id]
  );
  const [
    postCount,
    fields2,
  ] = await pool.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id]);
  res.json({ postList, postCount });
});

router.get("/:category/page/:pageId", async (req, res) => {
  const category = path.parse(req.params.category).base;
  let category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  const page_id = path.parse(req.params.pageId).base;
  const offset = 10 * (page_id - 1);
  const [
    postList,
    fields,
  ] = await pool.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10 OFFSET ?",
    [category_id, offset]
  );
  const [
    postCount,
    fields2,
  ] = await pool.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id]);
  res.json({ postList, postCount });
});

router.get("/:category/page/:pageId/:postId", async (req, res) => {
  const category = path.parse(req.params.category).base;
  let category_id;
  if (category === "training") {
    category_id = 1;
  } else if (category === "nutrition") {
    category_id = 2;
  }
  const page_id = path.parse(req.params.pageId).base;
  const offset = 10 * (page_id - 1);
  const post_id = path.parse(req.params.postId).base;
  const [
    postList,
    fields,
  ] = await pool.query(
    "SELECT post.id, title, content, category_id, users.displayName as user_displayName, view, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE category_id=? order by id desc LIMIT 10 OFFSET ?",
    [category_id, offset]
  );
  const [
    postCount,
    fields2,
  ] = await pool.query("SELECT post?Count as postCount FROM counting WHERE id=1", [category_id]);
  const [
    post,
    fields3,
  ] = await pool.query(
    "SELECT post.id as post_id, title, content, category_id, users.displayName as user_displayName, view, recommend, comment, date_format(modified, '%Y-%m-%d') as modified FROM post JOIN users ON user_id=users.id WHERE post.id=? AND category_id=?",
    [post_id, category_id]
  );
  const [
    comments,
    fields4,
  ] = await pool.query(
    "SELECT comments.id, displayName as user_displayName, comment, date_format(modified, '%Y-%m-%d %H:%i:%s') as modified FROM comments JOIN users ON user_id=users.id WHERE post_id=? order by comments.id desc",
    [post_id]
  );
  await pool.query("UPDATE post set view = view + 1 where id=?", [post_id]);
  if (req.user) {
    const [
      recommend,
      fields5,
    ] = await pool.query("SELECT id FROM recommends WHERE post_id=? AND user_id=?", [
      post_id,
      req.user[0].id,
    ]);
    res.json({ postList, postCount, post, comments, recommend });
  } else {
    res.json({ postList, postCount, post, comments });
  }
});

router.post("/create_process", async (req, res) => {
  const title = req.body.title;
  const category_id = req.body.category_id;
  const content = req.body.content;
  const user_id = req.body.id;
  await pool.query("INSERT INTO post(title, category_id, content, user_id) VALUES(?, ?, ?, ?)", [
    title,
    category_id,
    content,
    user_id,
  ]);
  await pool.query(
    `UPDATE counting SET post${category_id}Count = post${category_id}Count + 1 where id=1`
  );
  const [post, fields] = await pool.query("SELECT id from post order by id desc limit 1");
  res.json({ create: true, post });
});

router.post("/delete_process", async (req, res) => {
  const category_id = req.body.category_id;
  const post_id = req.body.post_id;
  await pool.query("DELETE FROM post WHERE id =?", [post_id]);
  await pool.query("DELETE FROM comments WHERE post_id =?", [post_id]);
  await pool.query("DELETE FROM recommends WHERE post_id =?", [post_id]);
  await pool.query(
    `UPDATE counting SET post${category_id}Count = post${category_id}Count - 1 where id=1`
  );
  res.json({ delete: true });
});

router.post("/comment/create_process", async (req, res) => {
  const user_id = req.body.user_id;
  const post_id = req.body.post_id;
  const comment = req.body.comment;
  await pool.query("INSERT INTO comments(user_id, post_id, comment) VALUES(?, ?, ?)", [
    user_id,
    post_id,
    comment,
  ]);
  await pool.query("UPDATE post SET comment = comment + 1 where id=?", [post_id]);
  res.json({ create: true });
});

router.post("/comment/delete_process", async (req, res) => {
  const id = req.body.id;
  const post_id = req.body.post_id;
  await pool.query("DELETE FROM comments WHERE id =?", [id]);
  await pool.query("UPDATE post SET comment = comment - 1 WHERE id=?", [post_id]);
  res.json({ delete: true });
});

router.post("/recommend_process", async (req, res) => {
  const post_id = req.body.post_id;
  const user_id = req.body.user_id;
  const updown = req.body.updown;
  if (updown === "down") {
    await pool.query("UPDATE post SET recommend = recommend - 1 WHERE id=?", [post_id]);
    await pool.query("DELETE FROM recommends WHERE post_id=? AND user_id=?", [post_id, user_id]);
  } else if (updown === "up") {
    await pool.query("UPDATE post SET recommend = recommend + 1 WHERE id=?", [post_id]);
    await pool.query("INSERT INTO recommends(post_id, user_id) VALUES(?,?)", [post_id, user_id]);
  }
  res.json({ recommend: true });
});

module.exports = router;
