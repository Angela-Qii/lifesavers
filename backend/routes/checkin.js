const express = require('express');
const router = express.Router();
const { User } = require('../models/checkin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save images
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 4, // Max 4 files
  },
});

// Add a check-in for a user
router.post('/:username', upload.array('image', 4), async (req, res) => {
    console.log(req.body)
    let username = req.params.username;
  try {
    const {
      lesion_1_1, lesion_1_2, lesion_1_3, lesion_1_4,
      lesion_2_1, lesion_2_2, lesion_2_3, lesion_2_4,
      lesion_3_1, lesion_3_2, lesion_3_3, lesion_3_4,
      lesion_4_1, lesion_4_2, lesion_4_3, lesion_4_4,
      lesion_itchy, lesion_pain,
      stress_1, stress_2, stress_3, sun_hr, sun_min,
      user_diets, daily_diets,
    } = req.body;
    let user_diets2;
    let daily_diets2;
    if (user_diets) {
      user_diets2 = JSON.parse(user_diets);
    }
    if (daily_diets) {
      daily_diets2 = JSON.parse(daily_diets);
    }
    const files = req.files;

    let user = await User.findOne({ username: username });
    if (!user) {
      user = new User({
        username: username,
        checkins: [],
        diets: user_diets2 || undefined,
      })
    }

    const checkin = {
      date: Date.now(),
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
      stress_1: stress_1 ? parseInt(stress_1) : undefined,
      stress_2: stress_2 ? parseInt(stress_2) : undefined,
      stress_3: stress_3 ? parseInt(stress_3) : undefined,
      sunExposure: {
        hours: sun_hr || undefined,
        minutes: sun_min || undefined,
      },
      diets: daily_diets2 || undefined,
      images: files ? files.map(f => f.filename) : [],
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
      // Update existing check-in and diets
      const updatePath = `checkins.${existingCheckinIndex}`;
      updatedUser = await User.findOneAndUpdate(
        {
          username,
          [`checkins.${existingCheckinIndex}.date`]: { $gte: checkinDate, $lt: checkinDate + 86400000 }
        },
        {
          $set: {
            [updatePath]: checkin,
            diets: user_diets2
          }
        },
        { new: true }
      );
    } else {
      // Push new check-in and update diets
      updatedUser = await User.findOneAndUpdate(
        { username },
        {
          $push: { checkins: checkin },
          $set: { diets: user_diets2 }
        },
        { new: true }
      );
    }

    if (!updatedUser) {
      user.checkins.push(checkin);
      await user.save();
    }
    console.log('success');
    res.status(201).json(user.checkins[user.checkins.length - 1]);

    // Delete image files after processing
    for (const file of files) {
      try {
        await fs.promises.unlink(file.path);
      } catch (err) {
        console.error(`Error deleting file ${file.path}:`, err.message);
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
});

// Get routines and diets for a user
router.get('/routines/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({diets: user.diets, routines: user.routines});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single check-in for a user, for a specific date
router.get('/single/:username/:date', async (req, res) => {
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

// Get all check-ins for a user
router.get('/all/:username', async (req, res) => {
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