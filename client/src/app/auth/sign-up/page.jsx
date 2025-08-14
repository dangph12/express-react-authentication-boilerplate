import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
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
import { signUpSchema } from '~/lib/validations/auth';
import { loadUser } from '~/store/features/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async data => {
    try {
      console.log('Sign up data:', data);
      const response = await axiosInstance.post('/api/auth/sign-up', data);
      const { accessToken } = response.data.data;

      dispatch(loadUser({ accessToken }));

      navigate('/');
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm your password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className='flex flex-col space-y-4 pt-6'>
              <Button
                variant='outline'
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Creating account...'
                  : 'Create account'}
              </Button>
              <p className='text-sm text-muted-foreground text-center'>
                Already have an account?{' '}
                <Link
                  to='/auth/login'
                  className='text-primary underline hover:text-primary/80'
                >
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
