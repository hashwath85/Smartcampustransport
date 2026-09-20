import { Request, Response } from 'express';
import { db, adminFieldValue } from '../config/firebase.js';

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { studentId, busId, category, description } = req.body;
    const complaintRef = db.collection('complaints').doc();

    const complaintData = {
      complaintId: complaintRef.id,
      studentId,
      busId,
      category,
      description,
      status: 'SUBMITTED',
      adminResponse: null,
      createdAt: adminFieldValue.serverTimestamp()
    };

    await complaintRef.set(complaintData);
    return res.status(200).json({ success: true, message: 'Complaint created', data: complaintData });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const { studentId, status, category } = req.query;
    let query: FirebaseFirestore.Query = db.collection('complaints');

    if (studentId && typeof studentId === 'string') {
      query = query.where('studentId', '==', studentId);
    }
    if (status && typeof status === 'string') {
      query = query.where('status', '==', status);
    }
    if (category && typeof category === 'string') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    const records = snapshot.docs.map(doc => doc.data());

    return res.status(200).json({ success: true, data: records });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const doc = await db.collection('complaints').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    return res.status(200).json({ success: true, data: doc.data() });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, adminResponse } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Complaint ID is required' });
    }

    const complaintRef = db.collection('complaints').doc(id);
    await complaintRef.update({
      status,
      adminResponse: adminResponse || null,
      updatedAt: adminFieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true, message: 'Complaint status updated' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
