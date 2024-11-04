import LoginForm from '@/components/LoginForm';
import { cookies } from 'next/headers';
import React from 'react';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

async function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
