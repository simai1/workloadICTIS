import { CronJob } from 'cron';

export default {
	checkHours: new CronJob('0 9 * * *', async () => {
		console.log('Cron start (Every 1 day at 9:00 am)');

		// code

		console.log('Cron end');
	}),
};
