const express = require('express');
const router = express.Router();
const {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} = require('../controllers/invoiceController');
const { verifyToken } = require('../controllers/adminController');

// Protected routes (require JWT)
router.get('/', verifyToken, getInvoices);
router.get('/:id', verifyToken, getInvoice);
router.post('/', verifyToken, createInvoice);
router.put('/:id', verifyToken, updateInvoice);
router.delete('/:id', verifyToken, deleteInvoice);

module.exports = router;
