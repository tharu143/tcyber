const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    description: String,
    type: String,
    hours: Number,
    rate: Number,
    amount: Number,
});

const invoiceSchema = new mongoose.Schema({
    documentType: {
        type: String,
        enum: ['invoice', 'quotation'],
        required: true,
    },
    companyName: String,
    companyPhone: String,
    companyAddress: String,
    companyEmail: String,
    clientName: String,
    clientContact: String,
    clientAddress: String,
    projectName: String,
    documentNumber: String,
    date: Date,
    currency: String,
    items: [itemSchema],
    notes: String,
    paymentMethods: String,
    logo: String, // Base64 string or URL
    taxPercentage: Number,
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

const getAllInvoices = async () => {
    return await Invoice.find().sort({ created_at: -1 });
};

const getInvoiceById = async (id) => {
    return await Invoice.findById(id);
};

const createInvoice = async (invoiceData) => {
    const invoice = new Invoice(invoiceData);
    return await invoice.save();
};

const updateInvoice = async (id, invoiceData) => {
    return await Invoice.findByIdAndUpdate(id, invoiceData, { new: true });
};

const deleteInvoice = async (id) => {
    return await Invoice.findByIdAndDelete(id);
};

module.exports = {
    Invoice,
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
};
