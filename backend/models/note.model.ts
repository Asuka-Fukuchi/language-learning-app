import mongoose, { Schema, Document } from "mongoose";

export type NoteBlockType = 'title' | 'paragraph' | 'list' | 'table';

export interface INoteBlock {
  type: NoteBlockType;
  content?: string;       // title / paragraph 用
  items?: string[];       // list 用
  headers?: string[];     // table 用
  rows?: string[][];      // table 用
}

// Note ドキュメントの型定義
export interface INote extends Document {
  noteTitle: string;
  blocks: INoteBlock[];
  creator: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// ブロックのスキーマ
const NoteBlockSchema = new Schema<INoteBlock>(
  {
    type: { type: String, enum: ['title','paragraph','list','table'], required: true },
    content: { type: String },    // title / paragraph
    items: [{ type: String }],    // list
    headers: [{ type: String }],  // table
    rows: [[String]]               // table
  },
  { _id: false } // blocks 配列内では自動 _id は不要
);

// Note スキーマ
const noteSchema = new Schema<INote>(
  {
    noteTitle: { type: String, required: true },
    blocks: { type: [NoteBlockSchema], required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",    // 作成者は User コレクションを参照
      required: true,
      immutable: true
    }
  },
  { timestamps: true }
);

// モデルのエクスポート
export const Note = mongoose.model<INote>("Note", noteSchema);