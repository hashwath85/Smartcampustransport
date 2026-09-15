const { db } = require('../config/firebase');

// POST /api/v1/complaints
exports.createComplaint = async (req, res) => {
  try {
    const { studentId, category, description, evidence, busId, tripId } = req.body;

    if (!studentId || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: studentId, category, and description are required.'
      });
    }

    const complaintRef = db.collection('complaints').doc();
    const payload = {
      complaintId: complaintRef.id,
      studentId,
      category,
      description,
      evidence: evidence || null,
      busId: busId || null,
      tripId: tripId || null,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: null,
      adminResponse: null
    };

    await complaintRef.set(payload);

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: payload
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const { studentId, status, category } = req.query;

    let query = db.collection('complaints');

    if (studentId) {
      query = query.where('studentId', '==', studentId);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    const complaints = [];

    if (snapshot.docs && Array.isArray(snapshot.docs)) {
      snapshot.docs.forEach((doc) => {
        complaints.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    } else if (typeof snapshot.forEach === 'function') {
      snapshot.forEach((doc) => {
        complaints.push(typeof doc.data === 'function' ? doc.data() : doc);
      });
    }

    return res.status(200).json({
      success: true,
      data: complaints
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/v1/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Missing complaint ID'
      });
    }

    const complaintRef = db.collection('complaints').doc(id);
    const doc = await complaintRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: doc.data()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PATCH /api/v1/complaints/:id/status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const allowedStatuses = ['SUBMITTED', 'IN_REVIEW', 'RESOLVED'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`
      });
    }

    const complaintRef = db.collection('complaints').doc(id);
    const doc = await complaintRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse;
    }

    await complaintRef.update(updateData);

    const updatedDoc = await complaintRef.get();

    return res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: updatedDoc.data()
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
