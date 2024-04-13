const { Task, CompletedTask } = require('../models/Task');
const Member = require('../models/memberModel');
const Stake = require('../models/stake');
const Joi = require('joi');


const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { log } = require('util');

const azurecontainer = process.env.AZURE_CONTAINER;
const azureconnectionString = process.env.AZURE_STRING;


const getuserbalance = async (req, res) => {
  try {
    const userId = req.user.member_user_id;

    const member = await Member.findOne({ member_user_id: userId });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    return res.status(200).json({ balance: member.coins });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const completeTask = async (req, res) => {
  const completeTaskSchema = Joi.object({
    taskId: Joi.string().required(),
  });
  try {
    // Validate request body
    const { error, value } = completeTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { taskId } = value;
    const userId = req.user.member_user_id; // Assuming you have the authenticated user stored in req.user

    // Fetch user details
    const member = await Member.findOne({ member_user_id: userId });

    if (!member) {
      console.log('Member not found for userId:', userId);
      return res.status(404).json({ message: 'Member not found' });
    }

    // Fetch task details
    const task = await Task.findOne({ taskId });
    if (!task) {
      console.log('Task not found for taskId:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    // Retrieve scheduledTime and completionTime from the task object
    const { scheduledTime, completionTime } = task;

    const options = { timeZone: 'Asia/Kolkata' };

    // Convert date strings to Date objects
    const currentTime = new Date();
    const parsedScheduledTime = new Date(scheduledTime);
    const parsedCompletionDateTime = new Date(completionTime);

    // Adjust date objects to the specified time zone and assign the formatted strings
    const formattedCurrentTime = currentTime.toLocaleString('en-US', options);
    const formattedScheduledTime = parsedScheduledTime.toLocaleString('en-US', options);
    const formattedCompletionDateTime = parsedCompletionDateTime.toLocaleString('en-US', options);

    console.log("Time of completed task :", formattedCurrentTime, formattedScheduledTime, formattedCompletionDateTime);

    if (currentTime < parsedScheduledTime || currentTime > parsedCompletionDateTime) {
      console.log('Task submission is not allowed at this time.');
      return res.status(400).json({ message: 'Task submission is not allowed at this time.' });
    }

    // Check if the user has already completed this task
    const existingCompletedTask = await CompletedTask.findOne({ userId, taskId, taskId });
    if (existingCompletedTask) {
      console.log('Task already completed by this user.');
      return res.status(400).json({ message: 'Task already Submitted by this user; Admin will review and reward to your task' });
    }

    console.log(member.twitterId);
    // Create a new completed task record
    const completedTask = new CompletedTask({
      userId,
      taskId,
      coins: task.coins,
      taskName: task.taskName,
      name: member.member_name,
      description: task.description,
      link: task.link,
      twitterId: member.twitterId,
      status: 'pending'
    });
    console.log(completeTask.twitterId)
    await completedTask.save();

    // Reward the user (Update user's coins balance, etc.)
    // Your reward logic goes here...

    console.log('Task submitted successfully.');
    res.status(200).json({ message: 'Task in review; admin will review and confirm completion' });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// working but on click it is  confirmed 
// const confirmTaskCompletion = async (req, res) => {
//   const confirmTaskCompletionSchema = Joi.object({
//     taskId: Joi.string().required(),
//     userId: Joi.string().required(),
//   });
//   try {
//     // Validate request body
//     const { error, value } = confirmTaskCompletionSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     const { taskId, userId } = value;

//     const completedTask = await CompletedTask.findOne({ userId: userId, taskId: taskId, status: 'pending' });

//     console.log(completedTask);
//     if (!completedTask) {
//       return res.status(404).json({ message: 'Pending task completion not found' });
//     }

//     // Fetch task details to get the reward amount
//     const task = await Task.findOne({ taskId });
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Reward the user
//     const user = await Member.findOne({ member_user_id: userId });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     completedTask.status = 'confirmed';
//     await completedTask.save();

//     // Update user's coins balance with the reward from the task
//     user.coins += task.coins; // Assuming task.reward contains the reward amount
//     await user.save();

//     res.status(200).json({ message: 'Task completion confirmed. User rewarded.' });
//   } catch (error) {
//     console.error('Error confirming task completion:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const confirmTaskCompletion = async (req, res) => {
  const confirmTaskCompletionSchema = Joi.object({
    taskId: Joi.string().required(),
    userId: Joi.string().required(),
    status: Joi.string().valid('confirmed', 'rejected').required(),
    reason: Joi.string().required(),
  });

  try {
    // Validate request body
    const { error, value } = confirmTaskCompletionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { taskId, userId, status, reason } = value;

    const completedTask = await CompletedTask.findOne({ userId: userId, taskId: taskId });
    if (!completedTask) {
      return res.status(404).json({ message: 'Pending task completion not found' });
    }

    // Check if the status is already confirmed or rejected
    if (completedTask.status === 'confirmed' || completedTask.status === 'rejected') {
      return res.status(400).json({ message: `Task completion is already ${completedTask.status}` });
    }

    // Update status
    completedTask.status = status;
    await completedTask.save();

    if (status === 'confirmed') {
      // Fetch task details to get the reward amount
      const task = await Task.findOne({ taskId });
      if (!task) {
        q
        return res.status(404).json({ message: 'Task not found' });
      }

      // Reward the user
      const user = await Member.findOne({ member_user_id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user's coins balance with the reward from the task
      user.coins += task.coins; // Assuming task.reward contains the reward amount
      await user.save();

      return res.status(200).json({ message: 'Task completion confirmed. User rewarded.' });
    } else if (status === 'rejected') {
      completedTask.reason = reason; // Save the reason for rejection
      await completedTask.save();
      return res.status(400).json({ message: 'Task completion rejected. User not rewarded.' });
    } else {
      return res.status(400).json({ message: 'Invalid status' });
    }
  } catch (error) {
    console.error('Error confirming task completion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllTasksUser = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const userId = req.user.member_user_id;
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    const totalUserTasks = await CompletedTask.countDocuments({ userId });
    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalUserTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalUserTasks,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllTasks = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    // Set default values if not provided
    const page_number = value.page_number || 1;
    const count = value.count || 10; // You can adjust the default count as needed
    const offset = (page_number - 1) * count;
    const currentTime = new Date(); // Define currentTime here
    const allTasks = await Task.find();
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found",
        allTasks: allTasks.length,
        tasks: [],
      });
    }


    // const allUsersTask = await CompletedTask.find({ userId: req.user.member_user_id, status: 'completed' });
    // const completedTaskIds = allUsersTask.map(task => task.taskId);
    // console.log(completedTaskIds);
    // const updatedTasks = [];

    // tasks.forEach(task => {
    //   const status = completedTaskIds.includes(task.taskId) ? 'completed' : 'pending';
    //   updatedTasks.push({ ...task.toObject(), status });
    // });

    const allUsersTask = await CompletedTask.find({ userId: req.user.member_user_id });
    const completedTaskStatus = allUsersTask.reduce((acc, task) => {
      acc[task.taskId] = task.status;
      return acc;
    }, {});

    const updatedTasks = tasks.map(task => {
      let status = completedTaskStatus[task.taskId] || 'OPEN';


      // Check if the task's scheduled time is in the past
      if (task.scheduledTime <= currentTime) {
        // Check if the task's completion time is in the past
        if (task.completionTime <= currentTime) {
          status = 'EXPIRED'; // Set status to CLOSE if completion time has passed
        }
      }
      return { ...task.toObject(), status };
    });


    return res.status(200).json({
      status: true,
      message: "Tasks found",
      allTasks: allTasks.length,
      tasks: updatedTasks,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// below code is for admin 
const getAllTasksforAdminWithoutStatus = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    // Set default values if not provided
    const page_number = value.page_number || 1;
    const count = value.count || 10; // You can adjust the default count as needed
    const offset = (page_number - 1) * count;
    const allTasks = await Task.find();
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found",
        allTasks: allTasks.length,
        tasks: [],
      });
    }


    // const allUsersTask = await CompletedTask.find({ userId: req.user.member_user_id, status: 'completed' });
    // const completedTaskIds = allUsersTask.map(task => task.taskId);
    // console.log(completedTaskIds);
    // const updatedTasks = [];

    // tasks.forEach(task => {
    //   const status = completedTaskIds.includes(task.taskId) ? 'completed' : 'pending';
    //   updatedTasks.push({ ...task.toObject(), status });
    // });


    // const tasks = await Task.find();
    return res.status(200).json({
      status: true,
      message: "Tasks found",
      allTasks: allTasks.length,
      tasks: tasks,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getConfirmedTasksForUser = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    const userId = req.user.member_user_id;
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ userId, status: 'confirmed' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    const totalCompletedTasks = await CompletedTask.countDocuments({ userId, status: 'confirmed' });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalCompletedTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalCompletedTasks,
      tasks: tasks,

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPendingTasksForUser = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const userId = req.user.member_user_id;
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ userId, status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const totalPenidngTasks = await CompletedTask.countDocuments({ userId, status: 'pending' });
    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalPenidngTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalPenidngTasks,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRejectedTasksForUser = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const userId = req.user.member_user_id;
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ userId, status: 'rejected' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const totalRejectedTasks = await CompletedTask.countDocuments({ userId, status: 'rejected' });
    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalRejectedTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalRejectedTasks,
      tasks: tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getOneTask = async (req, res) => {
  try {
    const taskId = req.params; // Assuming you're passing the task ID in the request parameters
    const task = await Task.findOne(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOneTaskforAdminConfirmationTask = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    const task = await CompletedTask.findOne({ taskId, userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPendingTasks = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    const totalPendingTasks = await CompletedTask.countDocuments({ status: 'pending' });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalPendingTasks: totalPendingTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalPendingTasks: totalPendingTasks,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCompletedTasks = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ status: 'confirmed' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    const totalCompletedTasks = await CompletedTask.countDocuments({ status: 'confirmed' });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalCompletedTasks: totalCompletedTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalCompletedTasks: totalCompletedTasks,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getRejectedTasks = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }
  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch tasks for the user with sorting and pagination
    const tasks = await CompletedTask.find({ status: 'rejected' })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const totalRejectedTasks = await CompletedTask.countDocuments({ status: 'rejected' });

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No tasks found for the user",
        totalRejectedTasks: totalRejectedTasks,
        tasks: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Tasks found for the user",
      totalRejectedTasks: totalRejectedTasks,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const addTask = async (req, res) => {
//   try {
//     // Extract task data from request body
//     const { taskName, description, coins, link } = req.body;
//     const imageFiles = req.files;

//     // Create a new task document
//     const newTask = new Task({
//       taskName,
//       taskId: generateRandomNumber(),
//       description,
//       coins,
//       // imageUrl: null,
//       link,
//       imageUrls: [],
//     });

//     if (imageFiles && Array.isArray(imageFiles) && imageFiles.length > 0) {
//       const blobServiceClient = BlobServiceClient.fromConnectionString(azureconnectionString);
//       const containerName = azurecontainer;
//       const containerClient = blobServiceClient.getContainerClient(containerName);

//       // Loop through each image file
//       for (let i = 0; i < imageFiles.length; i++) {
//         const imageFile = imageFiles[i];
//         const blobName = `${newTask.taskId}-${imageFile.originalname}`;
//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         const imageData = imageFile.buffer;
//         await blockBlobClient.uploadData(imageData, imageData.length);

//         newTask.imageUrls.push(blockBlobClient.url); // Add the image URL to the array
//       }
//     }

//     // Save the task to the database
//     await newTask.save();

//     res.status(201).json(newTask); // Respond with the newly created task
//   } catch (error) {
//     console.error('Error adding task:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


const addTask = async (req, res) => {
  const addTaskSchema = Joi.object({
    taskName: Joi.string().required(),
    description: Joi.string().required(),
    coins: Joi.number().required(),
    link: Joi.string().uri().required(),
    scheduledTime: Joi.date().iso().required(),
    completionTime: Joi.date().iso().required(),
  });
  try {
    // Check if the user making the request is an admin
    const isAdmin = req.user.userType === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission Denied. Only admin can set scheduled time.' });
    }
    // Validate request body
    const { error, value } = addTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Destructure variables from req.body
    const {
      taskName,
      description,
      coins,
      link,
      scheduledTime,
      completionTime,
    } = value;

    const options = { timeZone: 'Asia/Kolkata' }; // 'Asia/Kolkata' is the time zone for Indian Standard Time

    // Convert date strings to Date objects
    const parsedScheduledTime = new Date(scheduledTime);
    const parsedCompletionDateTime = new Date(completionTime);

    // Adjust date objects to the specified time zone
    parsedScheduledTime.toLocaleString('en-US', options);
    parsedCompletionDateTime.toLocaleString('en-US', options);

    // Check if completion time is before scheduled time
    if (parsedCompletionDateTime < parsedScheduledTime) {
      return res.status(400).json({ error: 'Completion time cannot be before scheduled time.' });
    }

    // Check if scheduled time is in the past
    if (parsedScheduledTime < new Date()) {
      return res.status(400).json({ error: 'Scheduled time cannot be in the past.' });
    }

    // Check if completion time is in the past
    if (parsedCompletionDateTime < new Date()) {
      return res.status(400).json({ error: 'Completion time cannot be in the past.' });
    }

    // Set submissionOpen based on current time compared to scheduledTime and completionDateTime
    const currentTime = new Date();

    console.log(currentTime, parsedScheduledTime, parsedCompletionDateTime);

    // Define newTask here with the correct variables
    const newTask = new Task({
      taskId: generateRandomNumber(),
      taskName,
      description,
      coins,
      link,
      imageUrls: [],
      scheduledTime: parsedScheduledTime,
      completionTime: parsedCompletionDateTime,
      // submissionOpen: isSubmissionOpen,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// only one task can be added in a day code is below
// const addTask = async (req, res) => {
//   try {
//     // Extract task data from request body
//     const { taskName, description, coins, link } = req.body;
//     const imageFiles = req.files;

//     // Check if a task has already been added on the current day
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for date comparison

//     const existingTask = await Task.findOne({ createdAt: { $gte: today } });

//     if (existingTask) {
//       return res.status(400).json({ error: 'You can only add one task per day.' });
//     }

//     // Create a new task document
//     const newTask = new Task({
//       taskName,
//       taskId: generateRandomNumber(),
//       description,
//       coins,
//       // imageUrl: null,
//       link,
//       imageUrls: [],
//     });

//     if (imageFiles && Array.isArray(imageFiles) && imageFiles.length > 0) {
//       // ... (your existing image upload logic)
//     }

//     // Save the task to the database
//     await newTask.save();

//     res.status(201).json(newTask); // Respond with the newly created task
//   } catch (error) {
//     console.error('Error adding task:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const editTask = async (req, res) => {
  const editTaskSchema = Joi.object({
    scheduledTime: Joi.date().iso().required(),
    completionTime: Joi.date().iso().required(),
  });
  try {
    // Extract task data from request body
    const { taskId } = req.params;
    const { scheduledTime, completionTime } = req.body; // Add this line to extract scheduledTime and completionDateTime


    const { error, value } = editTaskSchema.validate({ scheduledTime, completionTime });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Convert date strings to Date objects
    const parsedScheduledTime = new Date(value.scheduledTime);
    const parsedCompletionDateTime = new Date(value.completionTime);

    // Check if completion time is before scheduled time
    if (parsedCompletionDateTime < parsedScheduledTime) {
      return res.status(400).json({ error: 'Completion time cannot be before scheduled time.' });
    }

    // Check if scheduled time is in the past
    if (parsedScheduledTime < new Date()) {
      return res.status(400).json({ error: 'Scheduled time cannot be in the past.' });
    }

    // Check if completion time is in the past
    if (parsedCompletionDateTime < new Date()) {
      return res.status(400).json({ error: 'Completion time cannot be in the past.' });
    }


    const imageData = [];
    // Set submissionOpen based on current time compared to scheduledTime and completionDateTime
    const currentTime = new Date();
    // const isSubmissionOpen = currentTime >= new Date(scheduledTime) && currentTime <= new Date(completionTime);


    // Find the task by taskId
    const updatedData = { ...req.body, images: imageData };
    const task = await Task.findOneAndUpdate(
      { taskId },
      { $set: updatedData },
      { new: true }
    );

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error editing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTask = async (req, res) => {
  const deleteTaskSchema = Joi.object({
    taskId: Joi.string().required()
  });
  try {
    // Validate request parameters
    const { error, value } = deleteTaskSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extract taskId from request parameters
    const { taskId } = value;

    // Find the task by taskId and delete it
    const task = await Task.findOneAndDelete({ taskId });

    if (!task) {
      console.log('Task not found');
      return res.status(404).json({ error: 'Task not found' });
    }

    // Respond with a success message
    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteManyTasks = async (req, res) => {
  const deleteManyTasksSchema = Joi.object({
    taskIds: Joi.array().items(Joi.string().required()).min(1).required()
  });
  try {
    // Validate request body
    const { error, value } = deleteManyTasksSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Extract taskIds from request body
    const { taskIds } = value;

    // Check if taskIds array is provided
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty taskIds array provided.' });
    }

    // Find and delete tasks by taskIds
    const deletedTasks = await Task.deleteMany({ taskId: { $in: taskIds } });

    if (deletedTasks.deletedCount === 0) {
      console.log('Tasks not found');
      return res.status(404).json({ error: 'Tasks not found' });
    }

    // Respond with a success message
    return res.status(200).json({ message: 'Tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// for admin
const getAllStakes = async (req, res) => {
  const schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10;
    const offset = (page_number - 1) * count;

    // Fetch all stakes with sorting and pagination
    const stakes = await Stake.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);

    // If there are no stakes found, return an empty array
    if (!stakes || stakes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No stakes found",
        stakes: [],
      });
    }

    // Return the list of stakes
    return res.status(200).json({
      status: true,
      message: "Stakes found",
      stakes: stakes,
    });
  } catch (error) {
    console.error("Error retrieving stakes:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//for user 
const getAllStake = async (req, res) => {
  try {
    const { member_user_id } = req.user;
    const stakes = await Stake.find({ member_user_id: member_user_id });

    // Check if there are no stakes found
    if (!stakes || stakes.length === 0) {
      return res.status(404).json({
        message: "No stakes found",
      });
    }

    // Respond with the Stakes
    return res.status(200).json({
      message: "Stakes retrieved successfully",
      data: stakes,
    });
  } catch (error) {
    console.error("Error retrieving stakes:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


async function updateMemberDetails(req, res) {
  try {
    const { contactNo, member_name, email, wallet_address } = req.body;
    const userId = req.user.member_user_id; // Assuming user id is stored in the request object after authentication

    // Check if the user exists
    const existingMember = await Member.findOne({ member_user_id: userId });
    if (!existingMember) {
      return res.status(404).json({
        status: false,
        message: "Member not found",
      });
    }

    // Update member details
    if (contactNo) existingMember.contactNo = contactNo;
    if (member_name) existingMember.member_name = member_name;
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   existingMember.password = await bcrypt.hash(password, salt);
    // }
    if (email) existingMember.email = email;
    // if (twitterId) existingMember.twitterId = twitterId;
    if (wallet_address) existingMember.wallet_address = wallet_address;

    // Save updated member details
    await existingMember.save();

    return res.status(200).json({
      status: true,
      message: "Member details updated successfully",
    });
  } catch (error) {
    console.error("Error updating member details:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


async function getMemberDetails(req, res) {
  try {
    // Extract user_id from the request object
    const userId = req.user.member_user_id; // Assuming you have user data stored in the request object

    // Fetch the member from the database based on user_id
    const member = await Member.findOne({ member_user_id: userId });

    // If the member is not found, return a 404 response
    if (!member) {
      return res.status(200).json({
        status: false,
        message: `Member details not found for the current user`,
        member: null,
      });
    }

    // Return the found member details
    return res.status(200).json({
      status: true,
      message: `Member details found for the current user`,
      member: member,
    });
  } catch (error) {
    console.error("Error fetching member details:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


async function getMemberByUserId(req, res) {
  try {
    // Extract member_user_id from request parameters
    const { member_user_id } = req.params;

    // Fetch the member from the database based on member_user_id
    const member = await Member.findOne({ member_user_id: member_user_id });

    // If the member is not found, return a 404 response
    if (!member) {
      return res.status(200).json({
        status: false,
        message: `Member with user_id ${member_user_id} not found`,
        member: null,
      });
    }

    // Return the found member
    return res.status(200).json({
      status: true,
      message: `Member found with member_user_id ${member_user_id}`,
      member: member,
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}

// async function getAllMembers(req, res) {
//   try {
//     // Fetch all members from the database
//     const members = await Member.find();

//     // If there are no members found, return an empty array
//     if (!members || members.length === 0) {
//       return res.status(404).json({
//         status: false,
//         message: "No members found",
//         members: [],
//       });
//     }

//     // Return the list of members
//     return res.status(200).json({
//       status: true,
//       message: "Members found",
//       members: members,
//     });
//   } catch (error) {
//     console.error("Error fetching members:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error",
//     });
//   }
// }

// =============================================================================================


const getAllMembers = async (req, res) => {
  const Schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = Schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    // Set default values if not provided
    const page_number = value.page_number || 1;
    const count = value.count || 10; // You can adjust the default count as needed
    const offset = (page_number - 1) * count;

    const members = await Member.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    // Count total members
    const totalMembers = await Member.countDocuments();
    if (!members || members.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No members found",
        totalMembers: totalMembers,
        members: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Members found",
      totalMembers: totalMembers,
      members: members,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};



async function getActiveMembers(req, res) {
  const schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10; // You can adjust the default count as needed
    const offset = (page_number - 1) * count;

    // Fetch active members with sorting and pagination
    const activeMembers = await Member.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);


    const totalActiveMembers = await Member.countDocuments({ isActive: true });


    // If there are no active members found, return an empty array
    if (!activeMembers || activeMembers.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No active members found",
        totalActiveMembers: totalActiveMembers,
        members: [],
      });
    }

    // Return the list of active members
    return res.status(200).json({
      status: true,
      message: "Active members found",
      totalActiveMembers: totalActiveMembers,
      members: activeMembers,
    });
  } catch (error) {
    console.error("Error fetching active members:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


async function getBlockedMembers(req, res) {
  const schema = Joi.object({
    page_number: Joi.number(),
    count: Joi.number(),
  });

  const { error, value } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ status: false, error: error.details[0].message });
  }

  try {
    const page_number = value.page_number || 1;
    const count = value.count || 10; // You can adjust the default count as needed
    const offset = (page_number - 1) * count;

    // Fetch active members with sorting and pagination
    const activeMembers = await Member.find({ isActive: false })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const totalActiveMembers = await Member.countDocuments({ isActive: false });
    // If there are no active members found, return an empty array
    if (!activeMembers || activeMembers.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Blocked members found",
        totalActiveMembers: totalActiveMembers,
        members: [],
      });
    }

    // Return the list of active members
    return res.status(200).json({
      status: true,
      message: "Blocked members found",
      totalActiveMembers: totalActiveMembers,
      members: activeMembers,
    });
  } catch (error) {
    console.error("Error fetching active members:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


const updateMemberStatus = async (req, res) => {
  const updateMemberStatusSchema = Joi.object({
    isActive: Joi.boolean().required(),
  });

  try {
    // Check if the user making the request is an admin
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Only admin can update member status.' });
    }

    const { member_user_id } = req.params;
    const { error, value } = updateMemberStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { isActive } = value;
    // Validate if member_user_id is provided
    if (!member_user_id) {
      return res.status(400).json({ error: 'Member user ID is required.' });
    }

    // Validate if isActive is provided
    if (isActive === undefined || isActive === null) {
      return res.status(400).json({ error: 'isActive field is required.' });
    }

    // Find the member by member_user_id
    const member = await Member.findOne({ member_user_id });

    // Check if the member exists
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    // Update isActive field
    member.isActive = isActive;

    // Save the updated member
    await member.save();

    return res.status(200).json({ message: 'Member status updated successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteUser = async (req, res) => {
  const deleteUserSchema = Joi.object({
    member_user_id: Joi.string().required(),
  });
  try {
    // Check if the user making the request is an admin
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Only admin can delete a user.' });
    }
    // Validate request parameters
    const { error, value } = deleteUserSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { member_user_id } = value;

    // Validate if member_user_id is provided
    if (!member_user_id) {
      return res.status(400).json({ error: 'Member user ID is required.' });
    }

    // Find the Member by member_user_id
    const member = await Member.findOne({ member_user_id });

    // Check if the Member exists
    if (!member) {
      return res.status(404).json({ error: 'Member not found.' });
    }

    // Delete the Member
    await Member.findOneAndDelete({ member_user_id });

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

function generateRandomNumber() {
  const min = 1000000; // Minimum 7-digit number (inclusive)  
  const max = 9999999; // Maximum 7-digit number (inclusive)

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { getuserbalance, getAllStakes, getAllStake, getAllTasks, addTask, getOneTask, getMemberByUserId, editTask, deleteTask, deleteManyTasks, completeTask, confirmTaskCompletion, getAllMembers, getRejectedTasks, getActiveMembers, getBlockedMembers, updateMemberStatus, deleteUser, getPendingTasks, getCompletedTasks, getConfirmedTasksForUser, getPendingTasksForUser, getOneTaskforAdminConfirmationTask, getRejectedTasksForUser, getAllTasksUser, getMemberDetails, updateMemberDetails, getAllTasksforAdminWithoutStatus };
