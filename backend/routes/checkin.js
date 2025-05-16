const express = require('express');
const router = express.Router();
const { User } = require('../models/checkin');
const multer = require('multer');

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Not an image'));
    }
    cb(null, true);
  },
});

// Add a check-in for a user
router.post('/:username', async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    if (!user) {
      user = new User({
        username: req.params.username,
        checkins: [],
      })
    }
    const {
      lesion_1_1, lesion_1_2, lesion_1_3, lesion_1_4,
      lesion_2_1, lesion_2_2, lesion_2_3, lesion_2_4,
      lesion_3_1, lesion_3_2, lesion_3_3, lesion_3_4,
      lesion_4_1, lesion_4_2, lesion_4_3, lesion_4_4,
      stress_1, stress_2, stress_3, sun_hr, sun_min,
    } = req.body;
    const checkin = {
      date: Date.now(),
      lesion_1_1: req.body.lesion_1_1,
      lesion_1_2: req.body.lesion_1_2,
      lesion_1_1: lesion_1_1 ? parseInt(lesion_1_1) : undefined,
      lesion_1_2: lesion_1_2 ? parseInt(lesion_1_2) : undefined,
      lesion_1_3: lesion_1_3 ? parseInt(lesion_1_3) : undefined,
      lesion_1_4: lesion_1_4 ? parseInt(lesion_1_4) : undefined,
      lesion_2_1: lesion_2_1 ? parseInt(lesion_2_1) : undefined,
      lesion_2_2: lesion_2_2 ? parseInt(lesion_2_2) : undefined,
      lesion_2_3: lesion_2_3 ? parseInt(lesion_2_3) : undefined,
      lesion_2_4: lesion_2_4 ? parseInt(lesion_2_4) : undefined,
      lesion_3_1: lesion_3_1 ? parseInt(lesion_3_1) : undefined,
      lesion_3_2: lesion_3_2 ? parseInt(lesion_3_2) : undefined,
      lesion_3_3: lesion_3_3 ? parseInt(lesion_3_3) : undefined,
      lesion_3_4: lesion_3_4 ? parseInt(lesion_3_4) : undefined,
      lesion_4_1: lesion_4_1 ? parseInt(lesion_4_1) : undefined,
      lesion_4_2: lesion_4_2 ? parseInt(lesion_4_2) : undefined,
      lesion_4_3: lesion_4_3 ? parseInt(lesion_4_3) : undefined,
      lesion_4_4: lesion_4_4 ? parseInt(lesion_4_4) : undefined,
      lesion_itchy: lesion_itchy ? parseFloat(lesion_itchy) : undefined,
      lesion_pain: lesion_pain ? parseFloat(lesion_pain) : undefined,
      stress: [stress_1, stress_2, stress_3].filter(val => val !== undefined),
      sunExposure: {
        hours: sun_hr || undefined,
        minutes: sun_min || undefined,
      },
      images: req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
        name: file.originalname,
      })),
    };

    // Delete fields that are undefined (user didn't upload anything)
    Object.keys(checkin).forEach(key => {
      if (checkin[key] === undefined) {
        delete checkin[key];
      }
    });

    // Check if check-in exists for the same day
    const checkinDate = new Date(checkin.date).setHours(0, 0, 0, 0);
    const existingCheckinIndex = user.checkins.findIndex(checkin =>
      new Date(checkin.date).setHours(0, 0, 0, 0) === checkinDate
    );

    let updatedUser;
    if (existingCheckinIndex >= 0) {
      // Update existing check-in
      const updatePath = `checkins.${existingCheckinIndex}`;
      updatedUser = await User.findOneAndUpdate(
        { username, [`checkins.${existingCheckinIndex}.date`]: { $gte: checkinDate, $lt: checkinDate + 86400000 } },
        { $set: { [updatePath]: checkin } },
        { new: true }
      );
    } else {
      // Push new check-in
      updatedUser = await User.findOneAndUpdate(
        { username },
        { $push: { checkins: checkin } },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user' });
    }

    //user.checkins.push(checkin);
    await user.save();
    console.log('success');
    res.status(201).json(user.checkins[user.checkins.length - 1]);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// Get all check-ins for a user
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.checkins);
    console.log(user.checkins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Update a specific check-in
// router.put('/:userId/:checkinId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const checkin = user.checkins.id(req.params.checkinId);
//     if (!checkin) {
//       return res.status(404).json({ message: 'Check-in not found' });
//     }

//     checkin.date = req.body.date || checkin.date;
//     checkin.lesion_1_1 = req.body.lesion_1_1 ?? checkin.lesion_1_1;
//     checkin.lesion_1_2 = req.body.lesion_2_2 ?? checkin.lesion_1_2;

//     await user.save();
//     res.json(checkin);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a specific check-in
// router.delete('/:userId/:checkinId', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const checkin = user.checkins.id(req.params.checkinId);
//     if (!checkin) {
//       return res.status(404).json({ message: 'Check-in not found' });
//     }

//     user.checkins.pull(req.params.checkinId);
//     await user.save();
//     res.json({ message: 'Check-in deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;