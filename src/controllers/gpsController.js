const { db } = require('../config/firebase');

exports.updateLocation = async (req, res) => {
  try {
    const { busId, latitude, longitude, heading, speed } = req.body;
    if (!busId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Missing busId, latitude, or longitude' });
    }
    const busRef = db.collection('buses').doc(busId);
    await busRef.set({
      lastLocation: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        heading: heading || 0,
        speed: speed || 0,
        updatedAt: new Date().toISOString()
      }
    }, { merge: true });
    return res.status(200).json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
