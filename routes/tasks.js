import express from 'express'
import { getAllTasks,
     createTask,
     getTask,
     updateTask,updateTaskOrder,
     deleteTask} from '../controllers/tasks.js';

const app = express();
app.route('/').get(getAllTasks).post(createTask)
app.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
app.put('/order', updateTaskOrder); // New endpoint to update task order

export default app;