import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { sendMail, renderMailHtml } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface IUser {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: Date;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    userName: {
      type: Schema.Types.String,
      requires: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

// encrypt password before saving to the database
UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

// send activation email after saving the user
UserSchema.post("save", async function (doc, next) {
  try {
    console.log("📩 User post-save hook called!");
    const user = doc;

    console.log("sending activation email to", user.email);

    const contentMail = await renderMailHtml("registrationSuccess", {
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });

    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Account Activation",
      html: contentMail,
    });
  } catch (error) {
    console.error("Error sending activation email:", error);
  } finally {
    next();
  }
});

// remove password from the response
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const UsersModel = mongoose.model("Users", UserSchema);
