const createTimbrConnector = require('./index'); // Adjust path if needed

// --- Required Options ---
const options = {
    ontology: '', // Add your Timbr ontology name
    password: '', // Add your Timbr user token
    host: '', // Add your Timbr Platform host
};

// Create the connector instance
const timbrConnector = createTimbrConnector(options);

// --- Async Test Function ---
async function runTest() {
    try {
        console.log('Attempting to connect...');
        await timbrConnector.connect();
        console.log('Successfully connected!');

        // --- Execute a query ---
        const sqlQuery = 'SHOW CONCEPTS';
        console.log(`Executing query: ${sqlQuery}`);
        const results = await timbrConnector.executeQuery(sqlQuery);
        console.log(`Query results for "${sqlQuery}":`);
        console.log(results); // results is an array of objects

    } catch (err) {
        // Log the specific error that occurred during connect or executeQuery
        console.error('An error occurred during operation:', err);
    } finally {
        // --- Close the connection when done ---
        console.log('Attempting to close connection...');
        try {
            await timbrConnector.close();
            console.log('Connection closed successfully.\nPress CTRL + C to exit.');
        } catch (closeErr) {
            console.error('Failed to close connection:', closeErr);
        }
    }
}

// Run the async test function
runTest();
