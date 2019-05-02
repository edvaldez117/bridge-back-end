// Puerto de la aplicación
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BD
process.env.DBCONNECT = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/bridge' : process.env.MONGO_URI;

// Vencimiento del Token (2 días)
process.env.TOKEN_EXPIRES = '48h';

// Semilla del Token
process.env.SEED = process.env.SEED || 'seed-de-desarrollo';