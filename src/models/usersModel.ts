import mongoose, { Schema } from "mongoose";
import { encrypt, generateActivationCode } from "../utils/encryption";
import { sendMail, renderMailHtml } from "../utils/mail/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";
import * as Yup from "yup";
export const USERS_MODEL_NAME = "Users";

const validatePassword = Yup.string()
  .min(6)
  .required()
  .min(6, "password must be at least 6 characters")
  .test(
    "at-least-one-uppercase-letter",
    "password must contain at least one uppercase letter",
    (value) => {
      if (!value) return false; // if value is undefined or null or '' (not mandatory) because have been use required() method
      const regex = /^(?=.*[A-Z])/; // regex to check at least one uppercase letter
      return regex.test(value);
    },
  )
  .test(
    "at-least-one-number",
    "password must contain at least one number",
    (value) => {
      if (!value) return false; // if value is undefined or null or '' (not mandatory) because have been use required() method
      const regex = /^(?=.*\d)/; // regex to check at least one number
      return regex.test(value);
    },
  );

const validateConfirmPassword = Yup.string()
  .oneOf([Yup.ref("password")], "passwords must be matched")
  .min(6)
  .required();

  export const userLoginDTO = Yup.object({
    identifier: Yup.string().required(),
    password: validatePassword,
  });

  export const userUpdatePasswordDTO = Yup.object({
    oldPassword: validatePassword,
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
  });

  export const userDTO = Yup.object({
    fullName: Yup.string().required(),
    userName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: validatePassword,
    confirmPassword: validateConfirmPassword,
  });

  export type TypeUser = Yup.InferType<typeof userDTO>;

  export interface User extends Omit<TypeUser, "confirmPassword"> {
    isActive: boolean;
    activationCode: string;
    role: string;
    createdAt?: string;
  }

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

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    userName: {
      type: Schema.Types.String,
      requires: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
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
  },
);

// encrypt password before saving to the database
UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  user.activationCode = generateActivationCode(user.id);
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

export const UsersModel = mongoose.model(USERS_MODEL_NAME, UserSchema);
