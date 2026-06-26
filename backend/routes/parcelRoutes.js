const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createParcel, getParcels, getParcelByTracking,
  updateParcelStatus, assignCourier, deleteParcel
} = require('../controllers/parcelController');

router.post('/', protect, createParcel);
router.get('/', protect, getParcels);
router.get('/track/:trackingNumber', getParcelByTracking);
router.put('/:id/status', protect, updateParcelStatus);
router.put('/:id/assign', protect, assignCourier);
router.delete('/:id', protect, deleteParcel);

module.exports = router;