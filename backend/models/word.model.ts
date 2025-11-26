import mongoose, { Schema, Document } from "mongoose";

export type WordType = "word" | "idiom" | "structure" | "phrase";

export type WordPartOfSpeech =
    "article" | "noun" | "pronoun" | "verb" | "auxiliary verb" |
    "adjective" | "adverb" | "preposition" | "conjunction" | "interjection";

export type WordStatus = "perfect" | "almost" | "notYet";


export interface ISpaced {
    repetitions?: number;
    interval?: number;
    nextReview?: Date;
    easiness?: number;
}

export interface IWord extends Document {
    word: string;
    phoneticSymbols?: string;
    type: WordType;
    partOfSpeech?: WordPartOfSpeech;
    synonyms?: string[];
    antonyms?: string[];
    meaning: string;
    examples: string[];    
    status: WordStatus;
    spaced?: ISpaced;
    creator: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const WordSchema = new Schema<IWord>(
    {
        word: { type: String, required: true, trim:true },
        phoneticSymbols: { type: String },
        type: {
            type: String,
            enum: ["word", "idiom", "structure", "phrase"],
            required: true
        },
        partOfSpeech: {
            type: String,
            enum: ["article", "noun", "pronoun", "verb", "auxiliary verb",
                "adjective", "adverb", "preposition", "conjunction", "interjection"]
        },
        synonyms: { type: [String], default: [] },
        antonyms: { type: [String], default: [] },
        meaning: { type: String, required: true },
        examples: { type: [String], required: true },        
        status: {
            type: String,
            enum: ["perfect", "almost", "notYet"],
            default: "notYet"
        },
        spaced: {
            repetitions: { type: Number, default: 0 },
            interval: { type: Number, default: 0 },
            nextReview: { type: Date },
            easiness: { type: Number, default: 2.5 }
        },
        creator: { 
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true,
            immutable: true 
        }
    },
    { timestamps: true }
);

export const Word = mongoose.model<IWord>("Word", WordSchema);