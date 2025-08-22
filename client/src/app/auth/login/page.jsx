import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import axiosInstance from '~/lib/axiosInstance';
import { loginSchema } from '~/lib/validations/auth';
import { loadUser } from '~/store/features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      isRemember: false
    }
  });

  const onSubmit = async data => {
    try {
      const { isRemember, ...loginData } = data;
      const response = await axiosInstance.post('/api/auth/login', loginData);
      const { accessToken } = response.data.data;
      dispatch(loadUser({ accessToken, isRemember }));
      navigate('/');
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed.');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please login to continue</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
            }}
          >
            <FaGoogle className='mr-2' />
            Continue with Google
          </Button>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/facebook`;
            }}
          >
            <FaFacebook className='mr-2' />
            Continue with Facebook
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Enter your password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isRemember'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 pt-2'>
                    <FormControl>
                      <Checkbox
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-2 leading-none'>
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='pt-6'>
          <p className='text-sm text-muted-foreground text-center w-full'>
            Don't have an account?{' '}
            <Link
              to='/auth/sign-up'
              className='text-primary underline hover:text-primary/80'
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
