import { Request, Response } from "express";
import * as Yup from "yup";

type TRegister = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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
