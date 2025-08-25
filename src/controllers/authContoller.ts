import { Request, Response } from "express";
import { UsersModel } from "../models/usersModel";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import * as Yup from "yup";
import * as response from "../utils/response";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidationSchema = Yup.object({
  fullName: Yup.string().min(3).required(),
  userName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string()
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
      }
    )
    .test(
      "at-least-one-number",
      "password must contain at least one number",
      (value) => {
        if (!value) return false; // if value is undefined or null or '' (not mandatory) because have been use required() method
        const regex = /^(?=.*\d)/; // regex to check at least one number
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "passwords must be matched")
    .min(6)
    .required(),
});

export async function register(req: Request, res: Response) {
  /**
   #swagger.tags = ['Auth']
   #swagger.requestBody = {
   required: true,
   schema: {
      $ref: "#/components/schemas/registerRequest"
   }
   }
   */
  const { fullName, userName, email, password, confirmPassword } =
    req.body as unknown as TRegister; // set and change type data on req.body to unknown first and then cast to TRegister for type safety

  try {
    await registerValidationSchema.validate(
      {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
      },
      { abortEarly: false }
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
      "Success Registration! Please activate your account"
    );
  } catch (error) {
    response.error(res, error, "Failed to register user");
  }
}

export async function login(req: Request, res: Response) {
  //define anotation for swagger documentation
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/loginRequest"
      }
    }
   */
  const { identifier, password } = req.body as unknown as TLogin;

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
}

export async function me(req: IReqUser, res: Response) {
  //define anotation for swagger documentation
  /**
    #swagger.tags = ['Auth']
    #swagger.security = [{
      "bearerAuth": []
    }]
   */
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
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/activationRequest"
      }

    }
   */
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
      }
    );

    response.success(res, user, "Account activated successfully");
  } catch (error) {
    response.error(res, error, 'Activation failed');
  }
}
