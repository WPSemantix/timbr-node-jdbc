![Timbr logo description](https://timbr.ai/wp-content/uploads/2023/06/timbr-ai-l-5-226x60-1.png)

<!-- Badges -->
![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen?logo=nodedotjs)
![NPM](https://img.shields.io/npm/v/timbr-node-jdbc?color=cb3837&label=npm%20package%20version&logo=npm)
	<a href="https://img.shields.io/badge/dependencies-up--to--date-brightgreen.svg"><img src="https://img.shields.io/badge/dependencies-up--to--date-brightgreen.svg" alt="Dependencies upto date"></a>
	<a href="https://img.shields.io/badge/status-stable-brightgreen.svg"><img src="https://img.shields.io/badge/status-stable-brightgreen.svg" alt="Status"></a>

---

# Timbr Node JDBC Connector Module

This project provides a Node.js module to connect to a Timbr instance (using its Hive interface) via JDBC. It wraps the [node-jdbc-driver](https://github.com/jaynath-d/node-jdbc-driver) package to offer a simplified, Promise-based interface for connecting and executing queries.

## Installation

Install the package using npm:

```bash
npm install timbr-node-jdbc
```

## Prerequisites

-   Node.js (v16 or higher recommended for async/await) installed on your machine.
-   Java Development Kit (JDK) installed and `JAVA_HOME` environment variable set correctly (required by `timbr-node-jdbc`).

## Project Structure

```
timbr-node-jdbc
├── jars
│   └── hive-jdbc-4.0.1-standalone.jar # Default location for the JDBC driver JAR
├── index.js          # The connector module logic
├── package.json        # NPM configuration file
└── README.md           # This documentation
└── test.js           # Test file for Timbr connector, should be modified before running
```

## Development Setup Instructions

1.  **Clone or Download:** Get the code for this module.
    ```bash
    # If it's a git repo:
    git clone <repository-url>
    cd timbr-node-jdbc
    ```

2.  **Install Dependencies:**
    Run the following command in the `timbr-node-jdbc` directory:
    ```bash
    npm install
    ```
    This installs the `timbr-node-jdbc` package and its dependencies.

3.  **Verify Java Setup:** Ensure your JDK is installed and the `JAVA_HOME` environment variable points to the JDK installation directory. `timbr-node-jdbc` needs this to interact with the Java Bridge.

## Usage

After installing, import the module and create a connector instance by providing connection options. Use `async/await` or Promise chains to handle the asynchronous operations.

```javascript
const createTimbrConnector = require('timbr-node-jdbc');

// --- Required Options ---
const options = {
    ontology: '<your_ontology_name>', // Replace with your Timbr ontology name
    password: '<your_timbr_user_token>',  // Replace with your Timbr token/password
    host: '<your_timbr-server_host>',      // Replace with your Timbr Plattform hostname
    // --- Optional Options (with defaults) ---
    // userName: 'token',          // Default: 'token'
    // isSSL: true,                // Default: true
    // port: 443,                  // Default: 443 if isSSL=true, 80 otherwise
    // driverPath: require('path').resolve(__dirname, '../jars/hive-jdbc-4.0.1-standalone.jar'), // Default path (absolute)
    // driverName: 'org.apache.hive.jdbc.HiveDriver'       // Default driver class
};

// Create the connector instance
const timbrConnector = createTimbrConnector(options);

// --- Example using async/await ---
async function runQuery() {
    try {
        // --- Connect to the database ---
        console.log('Attempting to connect...');
        await timbrConnector.connect();
        console.log('Successfully connected!');

        // --- Execute a query ---
        const sqlQuery = 'SHOW CONCEPTS'; // Example query
        console.log(`Executing query: ${sqlQuery}`);
        const results = await timbrConnector.executeQuery(sqlQuery);

        console.log(`Query results for "${sqlQuery}":`);
        console.log(results); // results is an array of objects

    } catch (error) {
        console.error('An error occurred during operation:', error);
    } finally {
        // --- Close the connection when done ---
        console.log('Attempting to close connection...');
        try {
            await timbrConnector.close();
            console.log('Connection closed successfully.');
        } catch (closeErr) {
            console.error('Failed to close connection:', closeErr);
        }
    }
}

// Run the example function
runQuery();

```

### Connector Methods

-   **`createTimbrConnector(options)`**: (Factory Function) Creates and returns a new connector instance.
    -   `options` (Object): Configuration object.
        -   `ontology` (String, **required**): The name of the Timbr ontology.
        -   `password` (String, **required**): The user's password or token.
        -   `host` (String, **required**): The hostname of the Timbr server.
        -   `userName` (String, optional): The username. Defaults to `'token'`.
        -   `isSSL` (Boolean, optional): Whether to use SSL. Defaults to `true`.
        -   `port` (Number | String, optional): The port number. Defaults to `443` if `isSSL` is true, `80` otherwise.
        -   `driverPath` (String, optional): The **absolute** file path to the JDBC driver JAR. Defaults to an absolute path pointing to `'./jars/hive-jdbc-4.0.1-standalone.jar'` relative to `index.js`.
        -   `driverName` (String, optional): The Java class name of the JDBC driver. Defaults to `'org.apache.hive.jdbc.HiveDriver'`.
-   **`connector.connect()`**: Opens a connection to the database.
    -   Returns: `Promise<void>` - Resolves on success, rejects on error.
-   **`connector.executeQuery(query)`**: Executes a SQL query against the connected database.
    -   `query` (String): The SQL query string.
    -   Returns: `Promise<Array>` - Resolves with an array of row objects on success, rejects on error.
-   **`connector.close()`**: Closes the database connection.
    -   Returns: `Promise<void>` - Resolves on success, rejects on error.
