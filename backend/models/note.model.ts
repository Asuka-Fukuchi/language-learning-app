import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    noteTitle: string;
    description: string;
    creator: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const noteSchema = new Schema<INote>({
    noteTitle: { type: String, required: true },
    description: { type: String, required: true },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: true,
        immutable: true
    }
},
    { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);