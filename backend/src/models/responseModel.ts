import mongoose, { Document, Schema } from 'mongoose';

// Define the plain object type for the response
export interface IResponseData {
   timestamp: Date;
   requestPayload: Record<string, any>;
   response: Record<string, any>;
}

// Extend the plain object with Mongoose's Document type
export interface IResponse extends IResponseData, Document {}

const responseSchema = new Schema<IResponse>({
   timestamp: { type: Date, default: Date.now },
   requestPayload: { type: Object, required: true },
   response: { type: Object, required: true },
});

const Response = mongoose.model<IResponse>('Response', responseSchema);

export default Response;
