import mongoose, { Schema, Document } from "mongoose";

export type NoteBlockType = 'title' | 'paragraph' | 'list' | 'table' | 'image';

export interface INoteBlock {
  type: NoteBlockType;
  content?: string;       // For title & paragraph 
  items?: string[];       // For list 
  headers?: string[];     // For table
  rows?: string[][];      // For table
  url?: string;           // For image
  caption?: string;       // For image
}

export interface INote extends Document {
  noteTitle: string;
  blocks: INoteBlock[];
  creator: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const NoteBlockSchema = new Schema<INoteBlock>(
  {
    type: { type: String, enum: ['title','paragraph','list','table', 'image'], required: true },
    content: { type: String },    
    items: [{ type: String }],    
    headers: [{ type: String }],  
    rows: [[String]],               
    url: { type: String },
    caption: { type: String } 
  },
  { _id: false } 
);

const noteSchema = new Schema<INote>(
  {
    noteTitle: { type: String, required: true },
    blocks: { type: [NoteBlockSchema], required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
      immutable: true
    }
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);