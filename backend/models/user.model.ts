import mongoose, { Schema, Document } from "mongoose";

// For future expansion
export interface IUserList {
  listTitle: string;
  words: mongoose.Types.ObjectId[];
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  lists?: IUserList[];
  isAdmin:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserListSchema = new Schema<IUserList>(
  {
    listTitle: { type: String, required: true },
    words: [{ type: Schema.Types.ObjectId, ref: "Word", default: [] }]
  },
  { _id: false }
);

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  lists: { type: [UserListSchema], default: [] },
  isAdmin: { type: Boolean, default: false }
},
  { timestamps: true }
);

// For security
userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    const { password, __v, ...clean } = ret;
    return clean;
  }
});

export const User = mongoose.model<IUser>("User", userSchema);