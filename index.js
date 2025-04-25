const { default: JdbcDriver, ConnectionType } = require("node-jdbc-driver");
const path = require('path');
const fs = require('fs');
// Function to create and manage the Timbr JDBC connection
function createTimbrConnector(options) {
    // --- Parameter Validation and Defaults ---
    if (!options || !options.ontology || !options.password || !options.host) { // Ensure host is used
        throw new Error('Missing required options: ontology, password, and host are required.');
    }

    const {
        ontology,
        password,
        host, // Use host here
        userName = 'token',
        isSSL = true,
        driverPath = path.resolve(__dirname, './jars/hive-jdbc-4.0.1-standalone.jar'),
        driverName = 'org.apache.hive.jdbc.HiveDriver'
    } = options;

    if (!fs.existsSync(driverPath)) {
        throw new Error(`Driver path does not exist: ${driverPath}`);
    }

    // Determine port based on isSSL if not provided explicitly
    const port = options.port || (isSSL ? '443' : '80');
    const sslParam = isSSL ? ';ssl=true' : '';

    // --- JDBC Configuration ---
    const config = {
        jdbcUrl: `jdbc:hive2://${host}:${port}/${ontology};transportMode=http${sslParam};httpPath=/timbr-server/ontology/${ontology}`,
        driverClass: driverName,
        jars: driverPath,
        username: userName,
        password: password,
    };

    // const jdbc = new JdbcDriver(ConnectionType.custom, config);
    const jdbc = new JdbcDriver(ConnectionType.hive, config);

    // --- Connector Object ---
    return {
        /**
         * Opens a connection using the configured driver.
         * @returns {Promise<void>} A promise that resolves on successful connection or rejects on error.
         */
        connect: async function() {
            await jdbc.open();
        },

        /**
         * Executes a SQL query. Assumes connect() has been called successfully.
         * @param {string} query - The SQL query to execute.
         * @returns {Promise<Array|null>} A promise that resolves with the results array or rejects on error.
         */
        executeQuery: async function(query) {
            return await jdbc.sql(query);
        },

        /**
         * Closes the database connection.
         * @returns {Promise<void>} A promise that resolves on successful close or rejects on error.
         */
        close: async function() {
            await jdbc.close();
        },

        // Expose the raw config if needed
        _config: config,
        _jdbcDriverInstance: jdbc // Expose the driver instance if needed
    };
}

// Export the factory function
module.exports = createTimbrConnector;
