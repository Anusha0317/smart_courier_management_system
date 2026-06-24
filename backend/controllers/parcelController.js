const Parcel = require('../models/Parcel');

const generateTracking = () => 'SCM' + Date.now() + Math.floor(Math.random() * 1000);

const createParcel = async (req, res) => {
  try {
    const parcel = await Parcel.create({
      ...req.body, sender: req.user._id, trackingNumber: generateTracking(),
      statusHistory: [{ status: 'pending', note: 'Parcel created' }]
    });
    res.status(201).json(parcel);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getParcels = async (req, res) => {
  try {
    let parcels;
    if (req.user.role === 'admin') parcels = await Parcel.find().populate('sender assignedCourier', 'name email');
    else if (req.user.role === 'courier') parcels = await Parcel.find({ assignedCourier: req.user._id }).populate('sender', 'name email');
    else parcels = await Parcel.find({ sender: req.user._id });
    res.json(parcels);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getParcelByTracking = async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ trackingNumber: req.params.trackingNumber })
      .populate('sender assignedCourier', 'name email');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.json(parcel);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateParcelStatus = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    parcel.status = req.body.status;
    parcel.statusHistory.push({ status: req.body.status, note: req.body.note || '' });
    await parcel.save();
    res.json(parcel);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const assignCourier = async (req, res) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id, { assignedCourier: req.body.courierId }, { new: true }
    );
    res.json(parcel);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteParcel = async (req, res) => {
  try {
    await Parcel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Parcel removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createParcel, getParcels, getParcelByTracking, updateParcelStatus, assignCourier, deleteParcel };