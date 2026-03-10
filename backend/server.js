import app from './src/app.js';
import { env } from './src/config/env.js';

const port = env.APP_PORT ;

if (!env.APP_PORT) {
    console.warn('⚠️  APP_PORT no está definido. Usando puerto por defecto', port);
}

app.listen(port, () => {
    try {
        console.log(`Servidor corriendo en puerto ${port}`);
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
});

