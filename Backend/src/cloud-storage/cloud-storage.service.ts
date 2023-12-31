import {Injectable} from '@nestjs/common';
import {DownloadResponse, Storage} from "@google-cloud/storage";
import {StorageConfig} from "./storage-config";
import {StorageFile} from "./models/storage-file";
import * as process from "process";

@Injectable()
export class CloudStorageService {
    private storage: Storage;
    private bucket: string;

    constructor() {
        this.storage = new Storage({
            projectId: process.env.PROJECT_ID,
            keyFilename: 'test-project-393323-9b6ca85dbfc7.json'
        });

        this.bucket = process.env.STORAGE_MEDIA_BUCKET;
    }

    async save(
        path: string,
        contentType: string,
        media: Buffer,
        metadata: { [key: string]: string }[]
    ) {
        const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
        const file = this.storage.bucket(this.bucket).file(path);
        const stream = file.createWriteStream();
        stream.on("finish", async () => {
            return await file.setMetadata({
                metadata: object,
            });
        });
        stream.end(media);
    }

    async delete(path: string) {
        await this.storage
            .bucket(this.bucket)
            .file(path)
            .delete({ignoreNotFound: true});
    }

    async get(path: string): Promise<StorageFile> {
        const fileResponse: DownloadResponse = await this.storage
            .bucket(this.bucket)
            .file(path)
            .download();
        const [buffer] = fileResponse;
        const storageFile = new StorageFile();
        storageFile.buffer = buffer;
        storageFile.metadata = new Map<string, string>();
        return storageFile;
    }

    async getWithMetaData(path: string): Promise<StorageFile> {
        const [metadata] = await this.storage
            .bucket(this.bucket)
            .file(path)
            .getMetadata();
        const fileResponse: DownloadResponse = await this.storage
            .bucket(this.bucket)
            .file(path)
            .download();
        const [buffer] = fileResponse;

        const storageFile = new StorageFile();
        storageFile.buffer = buffer;
        storageFile.metadata = new Map<string, any>(
            Object.entries(metadata || {})
        );
        storageFile.contentType = storageFile.metadata.get("contentType");
        return storageFile;
    }
}
