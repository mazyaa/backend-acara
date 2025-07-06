import e, { Request, Response } from "express";
import { UsersModel } from "../models/usersModel";
import * as Yup from "yup";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/authMiddleware";

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
    ).test('at-least-one-number', 'password must contain at least one number', (value) => {
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

    await UsersModel.create({
      fullName,
      userName,
      email,
      password,
    });

    res.status(200).json({
      message: "Resgistrattion Successfully",
      data: {
        fullName,
        userName,
        email,
      },
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        messsage: "Validation Error",
        errors: error.errors, // return all validation errors
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
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
    return res.status(404).json({
      message: "User not found!",
      data: null,
    });
  }

  // Check if password is correct

  const validatePassword: boolean =
    encrypt(password) === getUserByIdentifier.password;

  if (!validatePassword) {
    return res.status(403).json({
      message: "Invalid password",
      data: null,
    });
  }

  //return token

  const token = generateToken({
    id: getUserByIdentifier._id, // use _id default property from mongoose for getting id
    role: getUserByIdentifier.role,
  });

  res.status(200).json({
    message: "Login Successfully!",
    data: token,
  });
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
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Successfully get user data",
      data: result,
    });
  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    });
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

    res.status(200).json({
      message: "Account activated successfully",
      data: user,
    })

  } catch (error) {
    const err = error as unknown as Error;
    res.status(400).json({
      message: err.message,
      data: null,
    })
  }
}
