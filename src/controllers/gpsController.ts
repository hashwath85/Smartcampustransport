import type { Request, Response } from 'express';
import { db } from '../config/firebase.js';

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { busId, latitude, longitude, heading, speed } = req.body as {
      busId?: string;
      latitude?: number | string;
      longitude?: number | string;
      heading?: number | string;
      speed?: number | string;
    };

    if (!busId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing busId, latitude, or longitude'
      });
    }

    const busRef = db.collection('buses').doc(busId);

    await busRef.set(
      {
        lastLocation: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          heading: Number(heading ?? 0),
          speed: Number(speed ?? 0),
          updatedAt: new Date().toISOString()
        }
      },
      { merge: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
