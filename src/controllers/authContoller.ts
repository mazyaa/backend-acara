import { Request, Response } from "express";
import { userDTO, userLoginDTO, UsersModel, userUpdatePasswordDTO } from "../models/usersModel";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import * as Yup from "yup";
import * as response from "../utils/response";

export async function register(req: Request, res: Response) {
  const { fullName, userName, email, password, confirmPassword } = req.body;

  try {
    await userDTO.validate(
      {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      },
      { abortEarly: false },
    ); // show all validation errors at once

    const result = await UsersModel.create({
      fullName,
      userName,
      email,
      password,
    });

    response.success(
      res,
      result,
      "Success Registration! Please activate your account",
    );
  } catch (error) {
    response.error(res, error, "Failed to register user");
  }
}

export async function login(req: Request, res: Response) {
  const { identifier, password } = req.body;

  try {
    await userLoginDTO.validate({
      identifier,
      password,
    });

    const getUserByIdentifier = await UsersModel.findOne({
      // find user by identifier, which can be email or username
      $or: [
        {
          userName: identifier,
        },
        {
          email: identifier,
        },
      ],
      isActive: true, // check if user is active
    });

    // Check if user exists
    if (!getUserByIdentifier) {
      return response.unauthorized(res, "User not found");
    }

    // Check if password is correct
    const validatePassword: boolean =
      encrypt(password) === getUserByIdentifier.password;

    if (!validatePassword) {
      return response.unauthorized(res, "Invalid Password");
    }

    //return token

    const token = generateToken({
      id: getUserByIdentifier._id, // use _id default property from mongoose for getting id
      role: getUserByIdentifier.role,
    });

    response.success(res, token, "Login Successfully!");
  } catch (error) {
    response.error(res, error, "Login failed");
  }
}

export async function me(req: IReqUser, res: Response) {
  try {
    const user = req.user; // get user from request object, which is set in authMiddleware
    const result = await UsersModel.findById(user?.id); // use optional chaining to avoid error if user is undefined and

    if (!result) {
      return response.unauthorized(res, "User not found");
    }

    response.success(res, result, "Successfully get user data");
  } catch (error) {
    response.error(res, error, "Login failed");
  }
}
export async function activation(req: Request, res: Response) {
  try {
    const { code } = req.body as { code: string }; // destruct code as string from request body

    const user = await UsersModel.findOneAndUpdate(
      {
        activationCode: code, // find user by activation code
      },
      {
        isActive: true, // set isAcrtive to true
      },
      {
        new: true, // use new for realtime update property isActive set to true
      },
    );

    response.success(res, user, "Account activated successfully");
  } catch (error) {
    response.error(res, error, "Activation failed");
  }
}

export async function updateProfile(req: IReqUser, res: Response) {
  try {
    const userId = req.user?.id;

    const { fullName, profilePicture } = req.body;

    const result = await UsersModel.findByIdAndUpdate(
      userId,
      {
        fullName,
        profilePicture,
      },
      {
        new: true, // return the updated document
      }
    );

    if (!result) {
      return response.notFound(res, "User not found!");
    };

    response.success(res, result, "Profile updated successfully!");
  } catch (error) {
    response.error(res, error, "Update profile failed");
  }
}

export async function updatePassword(req: IReqUser, res: Response) {
    try {
    const userId = req.user?.id;

    const { oldPassword, password, confirmPassword } = req.body;

    await userUpdatePasswordDTO.validate({
      oldPassword,
      password,
      confirmPassword,
    });

    const user = await UsersModel.findById(userId);

    if (!user || user.password !== encrypt(oldPassword)) {
      return response.notFound(res, "User not found!");
    }

    const result = await  UsersModel.findByIdAndUpdate(
      userId,
      {
        password: encrypt(password),
      },
      {
        new: true, // return the updated document
      }
    );

    return response.success(res, result, "Successfully update profile password!");
  } catch (error) {
    response.error(res, error, "Update profile password");
  }
}
