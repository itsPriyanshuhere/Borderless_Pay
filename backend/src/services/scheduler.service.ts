// For view - would be integrated in the backend service managing scheduled payrolls for future

import cron from 'node-cron';
import config from '../config';
import blockchainService from './blockchain.service';

class SchedulerService {
    private cronJob: cron.ScheduledTask | null = null;
    private employeeAddresses: string[] = [];

    // Set employee addresses for scheduled payroll
    setEmployees(addresses: string[]) {
        this.employeeAddresses = addresses;
        console.log(`Scheduler updated with ${addresses.length} employees`);
    }

    // Start automated payroll scheduling
    start() {
        if (this.cronJob) {
            console.log('Scheduler already running');
            return;
        }

        // Parse cron schedule from config (default: "0 0 1 * *" = monthly on the 1st)
        this.cronJob = cron.schedule(config.cronSchedule, async () => {
            console.log(`Scheduled payroll execution triggered at ${new Date().toISOString()}`);

            if (this.employeeAddresses.length === 0) {
                console.log(' No employees configured for scheduled payroll');
                return;
            }

            try {
                const result = await blockchainService.payAllEmployees(this.employeeAddresses);
                console.log(`Scheduled payroll completed successfully`);
                console.log(`   Transaction: ${result.txHash}`);
                console.log(`   Employees paid: ${this.employeeAddresses.length}\n`);
            } catch (error: any) {
                console.error('Scheduled payroll failed:', error.message);
            }
        });

        console.log(`Payroll scheduler started with schedule: ${config.cronSchedule}`);
        console.log(`   Next run: ${this.getNextRunTime()}\n`);
    }

    // Stop the scheduler
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            console.log('Payroll scheduler stopped');
        }
    }

    // Get next scheduled run time
    getNextRunTime(): string {
        
        return 'Check cron schedule configuration';
    }

    // Get scheduler status
    getStatus() {
        return {
            running: this.cronJob !== null,
            schedule: config.cronSchedule,
            employeeCount: this.employeeAddresses.length,
            nextRun: this.getNextRunTime(),
        };
    }
}

export default new SchedulerService();
