import Task from "../models/Task.js"
import { asyncWrapper } from "../middleware/async.js"
import { createCustomError } from "../errors/custom-error.js"

export const getAllTasks =asyncWrapper( async(req,res)=>{
        const tasks = await Task.find({})
        res.status(200).json({tasks})})

export const createTask =asyncWrapper( async (req,res)=>{
        const task = await Task.create(req.body)
        res.status(201).json({task})})

export const getTask = asyncWrapper (async(req,res,next)=>{
        const {id}= req.params
        const task = await Task.findById(id)
        
        if(!task){
            return next(createCustomError(`no task with id ${id}`,404))
        }
        res.status(200).json({task})  
})

export const updateTask = asyncWrapper (async(req,res)=>{
    const {id} = req.params;

    const task = await Task.findOneAndUpdate({_id:id},req.body,{
        new:true,runValidators:true
    })
    if(!task){
        return next(createCustomError(`no task with id ${id}`,404))
        }
    res.status(200).json({task})
})

export const deleteTask = asyncWrapper( async(req,res)=>{
        const {id} = req.params;
        const task = await Task.findOneAndDelete({_id:id})
        if(!task){
            return next(createCustomError(`no task with id ${id}`,404))
        }
        res.status(200).json({task})  
})