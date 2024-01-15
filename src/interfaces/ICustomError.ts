export interface CustomError extends Error {
    extensions?: {
        code: string;
    };
}