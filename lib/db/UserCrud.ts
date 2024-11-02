'use server';

import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GetUser(): Promise<User | null | any> {
  const token = (await cookies()).get('sessionToken')?.value;

  if (!token) {
    throw new Error('No session token found');
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      name: string;
      iat: number;
      exp: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    if (!user) throw new Error('User not found');

    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

type LoginResponse = {
  status: number;
  message: string;
};

type LoginData = {
  email: string;
  password: string;
};

//Todo: compare passwords the stored one and the entered one
async function comparePasswordsFn(loginPassword: string, userPassword: string) {
  const comparePasswords = await bcrypt.compare(loginPassword, userPassword);

  return comparePasswords;
}

//Todo: GeneratingToken
function generateToken(userId: number, name: string) {
  return jwt.sign({ userId, name }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
}

export const Login = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return { status: 401, message: 'Email or Password is incorrect' };
    }

    const isPasswordCorrect = await comparePasswordsFn(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return { status: 401, message: 'Email or Password is incorrect' };
    }

    const token = generateToken(user.id, user.name);

    (await cookies()).set('sessionToken', token, {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Only send in HTTPS
      sameSite: 'strict', // Prevent CSRF
      maxAge: 3600 * 24, // 24 hours
    });

    return { status: 200, message: 'Welcome Back!!' };
  } catch (error: any) {
    return {
      status: 500,
      message: 'An unknown error occurred. Please try again.',
    };
  }
};

type LogoutResponse = {
  status: number;
  message: string;
};

export const Logout = async (email: string): Promise<LoginResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { status: 401, message: 'User not found' };
    }

    (await cookies()).delete('sessionToken');
    return { status: 200, message: 'Sad to see you leaving' };
  } catch (error) {
    throw new Error('Something went wrong ');
  }
};

type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
};

type UpdateUserDataResponse = {
  status: number;
  message: string;
};

//Todo: Hashing the admins password
function hashMyPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

export const UpdateUser = async (
  id: number,
  data: UpdateUserData
): Promise<UpdateUserDataResponse> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error('Invalid User, user not found');
    }

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: data.name ? data.name : user.name,
        email: data.email ? data.email : user.email,
        password: data.password ? hashMyPassword(data.password) : user.password,
      },
    });

    return { status: 200, message: 'Updated Successfully' };
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};
