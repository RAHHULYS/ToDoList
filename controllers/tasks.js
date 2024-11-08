import Task from "../models/Task.js"
import { asyncWrapper } from "../middleware/async.js"
import { createCustomError } from "../errors/custom-error.js"

// Get all tasks
export const getAllTasks = asyncWrapper(async (req, res) => {
    const tasks = await Task.find({}).sort('position') // Sort tasks by position
    res.status(200).json({ tasks })
})

// Create a new task
export const createTask = asyncWrapper(async (req, res) => {
    const taskCount = await Task.countDocuments()
    const task = await Task.create({
        ...req.body,
        position: taskCount // Set position based on the current task count
    })
    res.status(201).json({ task })
})

// Get a specific task by ID
export const getTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const task = await Task.findById(id)

    if (!task) {
        return next(createCustomError(`No task with id ${id}`, 404))
    }
    res.status(200).json({ task })
})

// Update a task
export const updateTask = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const task = await Task.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    })
    if (!task) {
        return next(createCustomError(`No task with id ${id}`, 404))
    }
    res.status(200).json({ task })
})

// Delete a task
export const deleteTask = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const task = await Task.findOneAndDelete({ _id: id })
    if (!task) {
        return next(createCustomError(`No task with id ${id}`, 404))
    }
    res.status(200).json({ task })
})

// Update task order (drag and drop functionality)
export const updateTaskOrder = asyncWrapper(async (req, res) => {
    const { taskIds } = req.body // taskIds is an array of task IDs in the new order

    // Validate the input
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
        return next(createCustomError('Invalid task order data', 400))
    }

    // Update position for each task in the new order
    for (let index = 0; index < taskIds.length; index++) {
        await Task.findByIdAndUpdate(taskIds[index], { position: index })
    }

    res.status(200).json({ message: 'Task order updated successfully' })
})
