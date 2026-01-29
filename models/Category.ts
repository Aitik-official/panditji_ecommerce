import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    id?: string; // For legacy ID support
    name: string;
    slug: string;
    description?: string;
    showOnNavbar?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        id: { type: String }, // For legacy ID support
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
        showOnNavbar: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
