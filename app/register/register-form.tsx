'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TypeOf, object, string } from 'zod';
import { signIn } from 'next-auth/react';

const createUserSchema = object({
  name: string({ required_error: 'Name is required' }).min(
    1,
    'Name is required'
  ),
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  photo: string().optional(),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string({
    required_error: 'Please confirm your password',
  }).min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

type CreateUserInput = TypeOf<typeof createUserSchema>;

export const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = async (values) => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitting(false);
      if (!res.ok) {
        const message = (await res.json()).message;
        toast.error(message);
        return;
      }

      signIn(undefined, { callbackUrl: '/' });
    } catch (error: any) {
      setSubmitting(false);
      toast.error(error.message);
    }
  };

  const input_style =
    'form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className='mb-6'>
        <input
          {...register('name')}
          placeholder='Name'
          className={`${input_style}`}
        />
        {errors['name'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['name']?.message as string}
          </span>
        )}
      </div>
      <div className='mb-6'>
        <input
          type='email'
          {...register('email')}
          placeholder='Email address'
          className={`${input_style}`}
        />
        {errors['email'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['email']?.message as string}
          </span>
        )}
      </div>
      <div className='mb-6'>
        <input
          type='password'
          {...register('password')}
          placeholder='Password'
          className={`${input_style}`}
        />
        {errors['password'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['password']?.message as string}
          </span>
        )}
      </div>
      <div className='mb-6'>
        <input
          type='password'
          {...register('passwordConfirm')}
          placeholder='Confirm Password'
          className={`${input_style}`}
        />
        {errors['passwordConfirm'] && (
          <span className='text-red-500 text-xs pt-1 block'>
            {errors['passwordConfirm']?.message as string}
          </span>
        )}
      </div>
      <button
        type='submit'
        style={{ backgroundColor: `${submitting ? '#ccc' : '#3446eb'}` }}
        className='inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full'
        disabled={submitting}
      >
        {submitting ? 'loading...' : 'Sign Up'}
      </button>
    </form>
  );
};
