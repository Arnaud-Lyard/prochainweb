import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../types/user';
import AppError from '../../utils/appError';
import { getUserInformations } from '../../utils/getUserInformations';
import { getUserInformationsByToken } from '../../utils/getUserInformationsByToken';
import { UpdateUserInput } from '../schema/user.schema';
import { updateUser } from '../service/user.service';

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (await getUserInformations(req, next)) as IUser;
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }
    const userInfos = await getUserInformationsByToken(next, access_token);

    res.status(200).json({
      status: 'success',
      data: {
        isConnect: Boolean(access_token),
        informations: userInfos,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserHandler = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (await getUserInformations(req, next)) as IUser;

    const { username, notification } = req.body;

    await updateUser({
      user,
      username,
      notification: notification === 'true' ? true : false,
      avatar: req.file,
    });

    const message =
      req.language === 'fr' ? 'Profil mis à jour' : 'Profile updated';
    res.status(200).json({
      status: 'success',
      message,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (await getUserInformations(req, next)) as IUser;

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err: any) {
    next(err);
  }
};
