import mongoose, { Schema, Document } from 'mongoose';

export interface IPuja extends Document {
    name: string;
    price: number;
    category: string;
    categorySlug?: string;
    image?: string;
    video?: string;
    shortDescription?: string;
    fullDescription?: string;
    duration?: string;
    sku?: string;
    priceLabel?: string;
    japaOptions?: { label: string; value: string }[];
    specifications?: { label: string; value: string }[];
    reviews?: { user: string; rating: number; comment: string; date?: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const PujaSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        categorySlug: { type: String },
        image: { type: String, default: '/placeholder.jpg' },
        video: { type: String },
        shortDescription: { type: String },
        fullDescription: { type: String },
        duration: { type: String },
        sku: { type: String },
        priceLabel: { type: String, default: 'Starting from' },
        japaOptions: [
            {
                label: { type: String },
                value: { type: String },
            },
        ],
        specifications: [
            {
                label: { type: String },
                value: { type: String },
            },
        ],
        reviews: [
            {
                user: { type: String },
                rating: { type: Number },
                comment: { type: String },
                date: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Puja || mongoose.model<IPuja>('Puja', PujaSchema);
