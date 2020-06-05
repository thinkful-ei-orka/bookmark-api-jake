const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const { bookmarks } = require('../store');


bookmarkRouter
    .route('/bookmark')
    .get((req,res) => {
        res.json(bookmarks);
    })
    .post(bodyParser, (req,res) => {
        const { title, url, desc = '', rating } = req.body;
        if (!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        if (!url) {
            logger.error('url is required');
            return res
                .status(400)
                .send('Invalid data');
        }
        if(!rating || isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) >5 ) {
            logger.error('Please enter a valid rating(1-5)');
            return res
                .status(400)
                .send('Invalid data');
        }
        const id = uuid();
        const newBookmark = {
            id,
            title,
            url,
            desc,
            rating
        };
        bookmarks.push(newBookmark);
        logger.info(`Bookmark with id ${id} created`);
        res
            .status(201)
            .location(`http://localhost:8000/bookmark/${id}`)
            .json({id});
    });

bookmarkRouter
    .route('/bookmark/:id')
    .get((req, res) => {
        const { id } = req.params;
        
        const bookmark = bookmarks.find(bookmark => bookmark.id == id);
  
        // make sure we found a bookmark
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
  
        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);
  
        // make sure we found a bookmark
        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
                .status(404)
                .send('Bookmark Not Found');
        }
        bookmarks.splice(bookmarkIndex, 1);
  
        logger.info(`Bookmark with id ${id} deleted.`);
        res
            .status(204)
            .end();
    });
   
    
module.exports = bookmarkRouter;