const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  lesion_1_1: Number,
  lesion_1_2: Number,
  lesion_1_3: Number,
  lesion_1_4: Number,
  lesion_2_1: Number,
  lesion_2_2: Number,
  lesion_2_3: Number,
  lesion_2_4: Number,
  lesion_3_1: Number,
  lesion_3_2: Number,
  lesion_3_3: Number,
  lesion_3_4: Number,
  lesion_4_1: Number,
  lesion_4_2: Number,
  lesion_4_3: Number,
  lesion_4_4: Number,
  lesion_itchy: Number,
  lesion_pain: Number,
  stress: [String], // stress_1, stress_2, stress_3
  sunExposure: {
    hours: String,
    minutes: String,
  },
  images: [
    {
      data: Buffer,
      contentType: String,
      name: String,
    },
  ],
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  checkins: [checkinSchema]
})

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
//   dueDate: { type: Date },
//   priority: { type: Number, min: 1, max: 5, default: 3 },
// });

// const checkinSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   tasks: [taskSchema], // Embedded array of task objects
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
//   budget: {
//     total: { type: Number, default: 0 },
//     currency: { type: String, default: 'USD' },
//   }, // Nested object
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// Update `updatedAt` timestamp on save
// checkinSchema.pre('save', function (next) {
//   this.date = Date.now();
//   next();
// });

// module.exports = mongoose.model('Project', checkinSchema);
module.exports = {
  User: mongoose.model('User', userSchema),
  Checkin: checkinSchema, // Export schema for reuse if needed
};