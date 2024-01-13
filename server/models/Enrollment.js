const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: Number,
        required: true
    },
    courseId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'In Progress'],
        default: 'In Progress'
    },
    progress: {
        type: Number,
        default: 0
    },
    enrolledAt: {
        type: String
    },
    isLiked: {
        type: Boolean,
        default: false 
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
})

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.pre('save', function (next) {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    this.enrolledAt = formattedDate;

    next();
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);