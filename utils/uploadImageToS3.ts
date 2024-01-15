import { ObjectCannedACL, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import s3Client from "../../config/awsConfig";

export const uploadImageToS3 = async (file: Express.Multer.File | undefined): Promise<string> => {
    if (!file) {
        throw new Error("No file provided.");
    }

    const uploadParams: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: 'image/webp',
        ACL: 'public-read' as ObjectCannedACL
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        const response = await s3Client.send(command);

        console.log('File uploaded successfully:', response);

        return `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    } catch (error) {
        throw new Error(`Failed to upload file to S3. ${error}`);
    }
};

