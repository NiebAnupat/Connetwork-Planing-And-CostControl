import {DataSource} from 'typeorm';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mongodb',
                url: process.env.MONGO_URI,
                synchronize: true, // disable in production
                useUnifiedTopology: true,
                entities: ['dist/**/*.entity{.ts,.js}'],
            });

            return dataSource.initialize();
        },
    },
];
