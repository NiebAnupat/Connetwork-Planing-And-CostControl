import {DataSource} from 'typeorm';
import {DATA_SOURCE} from "../constants";

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mongodb',
                url: process.env.MONGO_URI,
                synchronize: true, // disable in production
                useUnifiedTopology: true,
                entities: [__dirname + '/../**/*.entity.{js,ts}']
            });

            return dataSource.initialize();
        },
    },
];
