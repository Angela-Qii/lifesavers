import { connectToDatabase } from './mongo';

export default async function handleSubmitCheckin(req, res) {
  if (req.method === 'POST') {
    const { data } = req.body;
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('items').insertOne({
        data
      });
      res.status(200).json({message: 'Event handled successfully'});
      // COMMENT: Switch pages
      // COMMENT: Fetch stuff into checkin form
    } catch (err) {
      res.status(500).json('Failed to submit checkin', err.message);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}