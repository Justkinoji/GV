import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "eu-north-1";

if (!region) {
    throw new Error("AWS region is not defined in the environment variables.");
}

const s3Client = new S3Client({ region: region } as any);

export default s3Client;

