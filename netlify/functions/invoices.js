const { verifyToken } = require('../../controllers/adminController');
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../../controllers/invoiceController');

const { getCorsHeaders } = require('../../utils/cors');

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const headers = getCorsHeaders(event);

    const startTime = Date.now();
    try {
        if (event.httpMethod === 'OPTIONS') {
            console.log(`OPTIONS request completed in ${Date.now() - startTime}ms`);
            return {
                statusCode: 200,
                headers,
                body: '',
            };
        }

        const req = {
            headers: event.headers,
            params: {},
            body: event.body ? JSON.parse(event.body) : {},
        };

        let statusCode = 200;
        let body = '';

        const res = {
            status: (code) => {
                statusCode = code;
                return res;
            },
            json: (data) => {
                body = JSON.stringify(data);
                return res;
            },
        };

        const pathParts = event.path.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        // If the last part is not 'invoices' and not empty, treat it as an ID
        if (lastPart && lastPart !== 'invoices') {
            req.params.id = lastPart;
        }

        let nextCalled = false;
        const next = () => {
            nextCalled = true;
        };
        await verifyToken(req, res, next);
        if (!nextCalled) {
            console.log(`Token verification failed in ${Date.now() - startTime}ms`);
            statusCode = statusCode || 401;
            body = JSON.stringify({ error: 'Unauthorized or invalid token' });
            return {
                statusCode,
                headers,
                body,
            };
        }

        if (event.httpMethod === 'GET' && !req.params.id) {
            await getInvoices(req, res);
            // If body is still empty, assume no invoices were found
            if (!body) {
                console.log('No invoices found');
                body = JSON.stringify([]);
            }
        } else if (event.httpMethod === 'GET' && req.params.id) {
            await getInvoice(req, res);
        } else if (event.httpMethod === 'POST') {
            await createInvoice(req, res);
        } else if (event.httpMethod === 'PUT' && req.params.id) {
            await updateInvoice(req, res);
        } else if (event.httpMethod === 'DELETE' && req.params.id) {
            await deleteInvoice(req, res);
        } else {
            statusCode = 405;
            body = JSON.stringify({ error: 'Method not allowed' });
        }

        console.log(`Invoices request completed in ${Date.now() - startTime}ms, Response body: ${body}`);
        return {
            statusCode,
            headers,
            body,
        };
    } catch (error) {
        console.error('Function error:', error.message, error.stack);
        console.log(`Error response sent in ${Date.now() - startTime}ms`);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', details: error.message }),
        };
    }
};
