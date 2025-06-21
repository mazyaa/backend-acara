import mongoose from 'mongoose';

export interface IUser {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
    fullName: {
        type: Schema.Types.String,
        required: true
    },
    userName: {
        type: Schema.Types.String,
        requires: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    profilePicture: {
        type: Schema.Types.String,
        default: 'user.jpg'
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false
    },
    activationCode: {
        type: Schema.Types.String
    }
}, 
{
    timestamps: true
}

);

export const UsersModel = mongoose.model('Users', UserSchema);