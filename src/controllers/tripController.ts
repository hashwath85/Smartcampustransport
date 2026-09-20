import type { Request, Response } from 'express';
import { db } from '../config/firebase.js';

export const startTrip = async (req: Request, res: Response) => {
  try {
    const { busId, driverId, shift } = req.body as {
      busId?: string;
      driverId?: string;
      shift?: string;
    };

    if (!busId || !driverId || !shift) {
      return res.status(400).json({
        success: false,
        message: 'Missing busId, driverId, or shift'
      });
    }

    const tripsRef = db.collection('trips');
    const activeQuery = await tripsRef
      .where('busId', '==', busId)
      .where('status', '==', 'ACTIVE')
      .get();

    if (!activeQuery.empty) {
      return res.status(400).json({
        success: false,
        message: 'Trip already active for this bus'
      });
    }

    const newTripRef = tripsRef.doc();
    const tripData = {
      tripId: newTripRef.id,
      busId,
      driverId,
      shift,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'ACTIVE'
    };

    await newTripRef.set(tripData);
    await db.collection('buses').doc(busId).set(
      { activeTripId: newTripRef.id },
      { merge: true }
    );

    return res.status(201).json({
      success: true,
      data: tripData
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const endTrip = async (req: Request, res: Response) => {
  try {
    const { tripId, busId } = req.body as {
      tripId?: string;
      busId?: string;
    };

    if (!tripId || !busId) {
      return res.status(400).json({
        success: false,
        message: 'Missing tripId or busId'
      });
    }

    await db.collection('trips').doc(tripId).update({
      endTime: new Date().toISOString(),
      status: 'COMPLETED'
    });

    await db.collection('buses').doc(busId).update({
      activeTripId: null
    });

    return res.status(200).json({
      success: true,
      message: 'Trip ended successfully'
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
