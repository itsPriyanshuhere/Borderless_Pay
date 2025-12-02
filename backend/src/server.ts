import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import employeeRoutes from './routes/employee.routes';
import payrollRoutes from './routes/payroll.routes';
import oracleRoutes from './routes/oracle.routes';
import transferRoutes from './routes/transfer.routes';
import authRoutes from './routes/auth.routes';
import blockchainService from './services/blockchain.service';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/transfer', transferRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: config.nodeEnv === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`\n🚀 Crypto Payroll Backend Server`);
    console.log(`==================================`);
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`⛓️  Contract: ${config.contractAddress || 'Not configured'}`);
    console.log(`🔗 RPC: ${config.rpcUrl || 'Not configured'}`);
    console.log(`==================================\n`);

    // Start blockchain event listeners
    if (config.contractAddress && config.rpcUrl) {
        blockchainService.listenToEvents();
    } else {
        console.warn('⚠️  Blockchain service not fully configured');
    }
});

export default app;
