// Load the shared Express app and environment variables before starting the server.
import app from './src/app.js';
import { env } from './src/config/env.js';

// The backend expects an `APP_PORT` to determine where to listen.
const port = env.APP_PORT;

if (!env.APP_PORT) {
    console.warn('⚠️  APP_PORT is undefined. Falling back to the default value.', port);
}

// Start the HTTP server and log success or startup errors.
app.listen(port, () => {
    try {
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.error('Server bootstrap failed:', error);
    }
});

