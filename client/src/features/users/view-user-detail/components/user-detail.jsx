import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Camera,
  Pencil,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { Spinner } from '~/components/ui/spinner';
import { GENDER_OPTIONS } from '~/constants/gender';
import { ROLE_OPTIONS } from '~/constants/role';
import DeleteUserDialog from '~/features/users/delete-user/components/delete-user-dialog';
import { useUpdateUser } from '~/features/users/update-user/api/update-user';
import { updateUserSchema } from '~/features/users/update-user/utils/validation';
import { useUserDetail } from '~/features/users/view-user-detail/api/view-user-detail';
import {
  formatDate,
  getGenderLabel,
  getRoleLabel
} from '~/features/users/view-user-detail/utils/utils';
import { cn } from '~/lib/utils';

const IS_ACTIVE_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' }
];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: user, isLoading } = useUserDetail(id);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      email: '',
      name: '',
      gender: '',
      role: '',
      dob: '',
      isActive: '',
      avatar: undefined
    }
  });

  useEffect(() => {
    if (isEditing && user) {
      form.reset({
        email: user.email || '',
        name: user.name || '',
        gender: user.gender || '',
        role: user.role || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        isActive: user.isActive?.toString() || 'true',
        avatar: undefined
      });
    }
  }, [isEditing, user, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    form.reset();
  };

  const handleSave = data => {
    updateUser(
      { id, data },
      {
        onSuccess: () => {
          setIsEditing(false);
          setAvatarPreview(null);
        }
      }
    );
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      form.setValue('avatar', file);
    }
  };

  const handleToggleActive = () => {
    updateUser(
      { id, data: { isActive: !user.isActive } },
      {
        onSuccess: () => {}
      }
    );
  };

  const handleBack = () => {
    navigate('/admin/manage-users');
  };

  const handleDeleteSuccess = () => {
    navigate('/admin/manage-users');
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <p className='text-muted-foreground'>User not found</p>
        <Button variant='outline' onClick={handleBack}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex flex-col items-center gap-4 p-6 bg-card rounded-lg border mb-6 md:flex-row md:items-center'>
        <div className='relative'>
          <div
            className={cn('relative group', isEditing && 'cursor-pointer')}
            onClick={handleAvatarClick}
          >
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src={avatarPreview || user?.avatar}
                alt={user?.name}
              />
              <AvatarFallback>
                <img
                  src='/default-avatar.jpg'
                  alt='Default avatar'
                  className='h-full w-full object-cover'
                />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className='absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center'>
                <Camera className='h-3.5 w-3.5' />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleAvatarChange}
          />
          {isUpdating && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full'>
              <Spinner className='text-white' />
            </div>
          )}
        </div>

        <div className='flex-1 text-center md:text-left'>
          <div className='flex items-center justify-center md:justify-start gap-2'>
            <h2 className='text-2xl font-bold'>{user?.name}</h2>
            <Badge variant={user?.isActive ? 'default' : 'secondary'}>
              {user?.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className='text-muted-foreground'>{user?.email}</p>
          <Badge variant='outline' className='mt-1'>
            {getRoleLabel(user?.role)}
          </Badge>
        </div>

        <div className='flex items-center gap-2'>
          {isEditing ? (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className='h-4 w-4 mr-1' />
                Cancel
              </Button>
              <Button
                size='sm'
                onClick={form.handleSubmit(handleSave)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Spinner className='h-4 w-4 mr-1' />
                ) : (
                  <Save className='h-4 w-4 mr-1' />
                )}
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant='outline' size='sm' onClick={handleEdit}>
                <Pencil className='h-4 w-4 mr-1' />
                Edit
              </Button>
              <Button
                variant={user?.isActive ? 'secondary' : 'default'}
                size='sm'
                onClick={handleToggleActive}
                disabled={isUpdating}
              >
                {user?.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className='bg-card rounded-lg border p-6'>
        <h2 className='text-lg font-semibold mb-4'>User Information</h2>
        <Form {...form}>
          <form className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>Email</FormLabel>
                  {isEditing ? (
                    <FormControl>
                      <Input placeholder='Enter email' {...field} />
                    </FormControl>
                  ) : (
                    <p className='text-sm py-2'>{user?.email || 'Not set'}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>
                    Full Name
                  </FormLabel>
                  {isEditing ? (
                    <FormControl>
                      <Input placeholder='Enter name' {...field} />
                    </FormControl>
                  ) : (
                    <p className='text-sm py-2'>{user?.name || 'Not set'}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>
                    Gender
                  </FormLabel>
                  {isEditing ? (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className='text-sm py-2'>
                      {getGenderLabel(user?.gender)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>Role</FormLabel>
                  {isEditing ? (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className='text-sm py-2'>{getRoleLabel(user?.role)}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dob'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>
                    Date of Birth
                  </FormLabel>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          captionLayout='dropdown'
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={date => {
                            field.onChange(
                              date ? format(date, 'yyyy-MM-dd') : ''
                            );
                          }}
                          disabled={date =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          defaultMonth={
                            field.value
                              ? new Date(field.value)
                              : new Date(2000, 0)
                          }
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className='text-sm py-2'>{formatDate(user?.dob)}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-muted-foreground'>
                    Status
                  </FormLabel>
                  {isEditing ? (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {IS_ACTIVE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className='text-sm py-2'>
                      {user?.isActive ? 'Active' : 'Inactive'}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className='flex justify-between items-center mt-6 pt-6 border-t'>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className='h-4 w-4 mr-1' />
            Delete User
          </Button>
          <Button variant='outline' size='sm' onClick={handleBack}>
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to Users
          </Button>
        </div>
      </div>

      <DeleteUserDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default UserDetail;
