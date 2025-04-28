const express = require('express');
const router = express.Router();
const { User } = require('../models/checkin');

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

    const checkin = {
      date: req.body.date || Date.now(),
      lesion_1_1: req.body.lesion_1_1 || 0,
      lesion_1_2: req.body.lesion_1_2 || 0,
    };

    user.checkins.push(checkin);
    await user.save();
    console.log('succeed');
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