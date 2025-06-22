import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';

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

// encrypt password before saving to the database
UserSchema.pre('save', function (next) {
    const user = this;
    user.password = encrypt(user.password);
    next();
});

// remove password from the response
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

export const UsersModel = mongoose.model('Users', UserSchema);