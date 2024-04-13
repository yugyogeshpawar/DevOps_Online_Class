
const { AssignedTask } = require('../models/Task');
const doublechecktask = require('../helper/checkintask');
const { User } = require('../models/Task');
const Twit = require('twit');

// Example controller to create an assigned task
const assignTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const user = await User.findOne({ _id: userId });

    const assignedTask = await AssignedTask.create({ user: userId, task: taskId, twitterId: user.twitterId });
    return res.json(assignedTask);
  } catch (error) {
    console.error('Error assigning task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const markTaskCompleted = async (req, res) => {
  try {
    const assignedTaskId = req.params.assignedTaskId;

    const updatedTask = await AssignedTask.findOneAndUpdate(
      { task: assignedTaskId },
      { completed: true },
      { new: true }
    );

    // Check if the task was found and updated
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    doublechecktask();
    res.json(updatedTask);


  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Example controller for admin to confirm completion of a task
const confirmTaskCompletion = async (req, res) => {
  try {
    const assignedTaskId = req.params.assignedTaskId;
    const updatedTask = await AssignedTask.findOneAndUpdate(
      { task: assignedTaskId },
      { adminConfirmed: true },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error('Error confirming task completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//twitter apis
const getUserInfo = async (req, res) => {
  try {
    const T = new Twit({
      consumer_key: 'X8Eq7GmsZQinj9ulddxQ7r57I',
      consumer_secret: 'dZ1patCeux5O7AbmXdJk2M1s3Ljrnd61vvmiBjribU7WyiGt2f',
      access_token: '1720674783707422720-Eax5oaWYz0vBegAz3ykM8VpM3NBWwy',
      access_token_secret: 'tTB0SlrOTf73kWEyHsU9yUaczlBVreugLtKumfOX2KM8y'
    });

    // id = '1720674783707422720';
    const response = await T.get(`https://api.twitter.com/2/users/me`);
    if (response && response.data) {
      return res.json(response.data);
    } else {
      return res.status(500).json({ error: 'Failed to get user information' });
    }
  } catch (error) {
    console.log('Error getting user info:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


const postTweet = async (req, res) => {
  try {
    const T = new Twit({
      consumer_key: 'X8Eq7GmsZQinj9ulddxQ7r57I',
      consumer_secret: 'dZ1patCeux5O7AbmXdJk2M1s3Ljrnd61vvmiBjribU7WyiGt2f',
      access_token: '1720674783707422720-Eax5oaWYz0vBegAz3ykM8VpM3NBWwy',
      access_token_secret: 'tTB0SlrOTf73kWEyHsU9yUaczlBVreugLtKumfOX2KM8y'
    });

    const tweetText = req.body.tweetText; 

    const response = await T.post(`https://api.twitter.com/2/tweets`, { text: tweetText });

    if (response && response.data) {
      return res.json(response.data);
    } else {
      return res.status(500).json({ error: 'Failed to post tweet' });
    }
  } catch (error) {
    console.log('Error posting tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


const deleteTweet = async (req, res) => {
  try {
    const T = new Twit({
      consumer_key: 'X8Eq7GmsZQinj9ulddxQ7r57I',
      consumer_secret: 'dZ1patCeux5O7AbmXdJk2M1s3Ljrnd61vvmiBjribU7WyiGt2f',
      access_token: '1720674783707422720-Eax5oaWYz0vBegAz3ykM8VpM3NBWwy',
      access_token_secret: 'tTB0SlrOTf73kWEyHsU9yUaczlBVreugLtKumfOX2KM8y'
    });

    const tweetId = req.params.tweetId; 
    const response = await T.delete(`https://api.twitter.com/2/tweets/${tweetId}`);

    if (response && response.data) {
      return res.json(response);
    } else {
      return res.status(500).json({ error: 'Failed to delete tweet' });
    }
  } catch (error) {
    console.error('Error deleting tweet:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = { assignTask, markTaskCompleted, confirmTaskCompletion, getUserInfo, postTweet, deleteTweet };