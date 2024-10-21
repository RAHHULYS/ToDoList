import express from 'express'
import { getAllTasks,
     createTask,
     getTask,
     updateTask,
     deleteTask} from '../controllers/tasks.js';

const app = express();
app.route('/').get(getAllTasks).post(createTask)
app.route('/:id').get(getTask).patch(updateTask).delete(deleteTask);
export default app;