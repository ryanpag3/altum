/**
 * Created by dev on 6/27/2017.
 */
var express = require('express');
var router = express.Router();
var queueManager = require('../utils/queue-manager');

/**
 * handles the call to the queue manager to add the user with the specified username and queue url
 * @returns {JSON} success: msg
 *                 failure: msg
 */
router.post('/add', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  // add user to queue
  var added = queueManager.add(username, queue);
  if (added) {
    return res.status(200).json({
      msg: username + ' was successfully added to ' + queue
    })
  } else {
    return res.status(500).json({
      msg: 'Error! ' + username + ' was not added to ' + queue
    })
  }
});

/**
 * handles the call to the queue manager to remove a user with a specified username and queue url
 * @returns {JSON} success: msg
 *                 failure: msg
 */
router.post('/remove', function(req, res) {
  var username = req.body.username, queue = req.body.queue;
  var removed = queueManager.remove(username, queue);
  if (removed) {
    return res.status(200).json({
      msg: username + ' was successfully removed from ' + queue
    })
  } else {
    return res.status(500).json({
      msg: username + ' could not be removed from ' + queue
    })
  }
});

/**
 * handles the call to the queue manager to remove the specified user from all currently occupied queues
 * @returns {JSON} success: msg
 *                 failure: msg
 */
router.post('/remove-all', function(req, res) {
  var username = req.body.username;
  var removed = queueManager.removeAll(username);
  if (removed) {
    return res.status(200).json({
      msg: username + ' has been removed from all queues.'
    })
  } else {
    return res.status(500).json({
      msg: username + ' has not been removed from all queues. If you see this,' +
      ' please contact the developers.'
    })
  }
});

module.exports = router;
