import { Request, Response } from "express";
import { UsersModel } from "../models/usersModel"; 
import * as Yup from "yup";
import { encrypt } from "../utils/encryption";

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
}

const registerValidationSchema = Yup.object({
  fullName: Yup.string().min(3).required(),
  userName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'passwords must be matched')
    .min(6)
    .required()
});

export async function register(req: Request, res: Response) {
  const { fullName, userName, email, password, confirmPassword } =
    req.body as unknown as TRegister; // set and change type data on req.body to unknown first and then cast to TRegister for type safety

  try {
    await registerValidationSchema.validate({
      fullName,
      userName,
      email,
      password,
      confirmPassword,
    }, { abortEarly: false }); // show all validation errors at once

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
        messsage: 'Validation Error',
        errors: error.errors // return all validation errors
      })
    } else {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export async function login(req: Request, res: Response) {
  const { identifier, password } = req.body as unknown as TLogin;

  const getUserByIdentifier = await UsersModel.findOne({
    $or: [
      {
        userName: identifier, 
      },
      {
        email: identifier,
      }
    ]
  });

  // Check if user exists
  if (!getUserByIdentifier) {
    return res.status(404).json({
      message: 'User not found!',
      data: null
    });
  }

  // Check if password is correct

  const validatePassword: boolean = encrypt(password) === getUserByIdentifier.password;
  
  if (!validatePassword) {
    return res.status(403).json({
      message: 'Invalid password',
      data: null
    })
  }

  res.status(200).json({
    message: 'Login Successfully!',
    data: getUserByIdentifier
  })

}
