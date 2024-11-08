import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide a name'],
        trim: true,
        maxLength: [20, 'name must be less than 20 characters']
    },
    completed: {
        type: Boolean,
        default: false
    },
    position: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Task', TaskSchema);
