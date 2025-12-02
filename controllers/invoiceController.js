const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config();

const {
    getAllInvoices,
    getInvoiceById,
    createInvoice: createInvoiceModel,
    updateInvoice: updateInvoiceModel,
    deleteInvoice: deleteInvoiceModel,
} = require('../models/invoice');

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
};

const getInvoices = async (req, res) => {
    try {
        await connectDB();
        const invoices = await getAllInvoices();
        res.status(200).json(invoices);
    } catch (err) {
        console.error('Get invoices error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getInvoice = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid invoice ID' });
        }

        const invoice = await getInvoiceById(id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        console.error('Get invoice error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createInvoice = async (req, res) => {
    try {
        await connectDB();
        const invoiceData = req.body;
        // Basic validation
        if (!invoiceData.documentType || !invoiceData.clientName) {
            return res.status(400).json({ error: 'Document type and Client name are required' });
        }

        const newInvoice = await createInvoiceModel(invoiceData);
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error('Create invoice error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateInvoice = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid invoice ID' });
        }

        const invoiceData = req.body;
        const updatedInvoice = await updateInvoiceModel(id, invoiceData);

        if (!updatedInvoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json(updatedInvoice);
    } catch (err) {
        console.error('Update invoice error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid invoice ID' });
        }

        const deleted = await deleteInvoiceModel(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        console.error('Delete invoice error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
};
