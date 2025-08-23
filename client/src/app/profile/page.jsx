import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Input } from '~/components/ui/input';
import { Spinner } from '~/components/ui/spinner';
import axiosInstance from '~/lib/axiosInstance';
import { avatarSchema } from '~/validations/avatar';

const Page = () => {
  const { user, loading } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(avatarSchema)
  });

  const watchedAvatar = watch('avatar');

  useEffect(() => {
    if (!loading && user?.id) {
      const fetchUserData = async () => {
        setFetchingData(true);
        try {
          const response = await axiosInstance.get(`/api/users/${user.id}`);
          setUserData(response.data.data);
          setAvatar(response.data.data.avatar);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setFetchingData(false);
        }
      };

      fetchUserData();
    }
  }, [user?.id, loading]);

  useEffect(() => {
    if (watchedAvatar && watchedAvatar[0]) {
      handleSubmit(onSubmit)();
    }
  }, [watchedAvatar, handleSubmit]);

  const onSubmit = async data => {
    if (!data.avatar || !data.avatar[0]) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', data.avatar[0]);

      const response = await axiosInstance.patch(
        `/api/users/${user.id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setAvatar(response.data.data.avatar);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const { ref, ...registerProps } = register('avatar');

  // Trigger hidden file input when avatar is clicked
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (loading || fetchingData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto p-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <div
            className='w-32 h-32 cursor-pointer hover:opacity-60 transition-opacity'
            onClick={handleAvatarClick}
          >
            <Avatar className='w-full h-full'>
              <AvatarImage
                src={
                  watchedAvatar && watchedAvatar[0]
                    ? URL.createObjectURL(watchedAvatar[0])
                    : avatar
                }
                alt={userData?.name}
                className='pointer-events-none'
              />
              <AvatarFallback className='pointer-events-none'>
                {uploading ? <Spinner size='sm' /> : 'CN'}
              </AvatarFallback>
            </Avatar>
          </div>

          <Input
            {...registerProps}
            ref={e => {
              ref(e);
              fileInputRef.current = e;
            }}
            id='avatar'
            type='file'
            accept='image/*'
            className='hidden'
          />

          {errors.avatar && (
            <p className='text-red-500 text-sm mt-1'>{errors.avatar.message}</p>
          )}
        </div>
      </form>

      <div className='mt-8 space-y-2'>
        <h1 className='text-2xl font-bold'>Profile Page</h1>
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
      </div>
    </div>
  );
};

export default Page;
