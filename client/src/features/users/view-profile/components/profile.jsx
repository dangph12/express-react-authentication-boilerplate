import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Camera,
  LogOut,
  Pencil,
  Save,
  X
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
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
import { useUpdateProfile } from '~/features/users/update-profile/api/update-profile';
import { useProfile } from '~/features/users/view-profile/api/view-profile';
import { cn } from '~/lib/utils';
import { logout } from '~/store/features/auth-slice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleEdit = () => {
    setFormData({
      name: profile?.name || '',
      gender: profile?.gender || '',
      dob: profile?.dob ? profile.dob.split('T')[0] : ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleSave = () => {
    const dataToUpdate = { ...formData };
    if (avatarFile) {
      dataToUpdate.avatar = avatarFile;
    }
    updateProfile(dataToUpdate, {
      onSuccess: () => {
        setIsEditing(false);
        setAvatarPreview(null);
        setAvatarFile(null);
      }
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      updateProfile({ avatar: file });
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = dateString => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderLabel = value => {
    const option = GENDER_OPTIONS.find(opt => opt.value === value);
    return option?.label || 'Not set';
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex flex-col items-center gap-4 p-6 bg-card rounded-lg border mb-6 md:flex-row md:items-center'>
        <div className='relative'>
          <div
            className='relative cursor-pointer group'
            onClick={handleAvatarClick}
          >
            <Avatar className='h-24 w-24'>
              <AvatarImage
                src={avatarPreview || profile?.avatar}
                alt={profile?.name}
              />
              <AvatarFallback>
                <img
                  src='/default-avatar.jpg'
                  alt='Default avatar'
                  className='h-full w-full object-cover'
                />
              </AvatarFallback>
            </Avatar>
            <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
              <Camera className='h-6 w-6 text-white' />
            </div>
            <div className='absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center'>
              <Camera className='h-3.5 w-3.5' />
            </div>
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
          <h1 className='text-2xl font-bold'>{profile?.name}</h1>
          <p className='text-muted-foreground'>{profile?.email}</p>
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
              <Button size='sm' onClick={handleSave} disabled={isUpdating}>
                {isUpdating ? (
                  <Spinner className='h-4 w-4 mr-1' />
                ) : (
                  <Save className='h-4 w-4 mr-1' />
                )}
                Save
              </Button>
            </>
          ) : (
            <Button variant='outline' size='sm' onClick={handleEdit}>
              <Pencil className='h-4 w-4 mr-1' />
              Edit
            </Button>
          )}
          <Button variant='destructive' size='sm' onClick={handleLogout}>
            <LogOut className='h-4 w-4 mr-1' />
            Logout
          </Button>
        </div>
      </div>
      <div className='bg-card rounded-lg border p-6'>
        <h2 className='text-lg font-semibold mb-4'>Personal Information</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Full Name
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder='Enter your name'
              />
            ) : (
              <p className='text-sm py-2'>{profile?.name || 'Not set'}</p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Email
            </label>
            <p className='text-sm py-2'>{profile?.email}</p>
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Gender
            </label>
            {isEditing ? (
              <Select
                value={formData.gender}
                onValueChange={value => handleInputChange('gender', value)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select gender' />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className='text-sm py-2'>{getGenderLabel(profile?.gender)}</p>
            )}
          </div>

          <div className='space-y-1'>
            <label className='text-sm font-medium text-muted-foreground'>
              Date of Birth
            </label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !formData.dob && 'text-muted-foreground'
                    )}
                  >
                    {formData.dob ? (
                      format(new Date(formData.dob), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    captionLayout='dropdown'
                    selected={formData.dob ? new Date(formData.dob) : undefined}
                    onSelect={date => {
                      handleInputChange(
                        'dob',
                        date ? format(date, 'yyyy-MM-dd') : ''
                      );
                    }}
                    disabled={date =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    defaultMonth={
                      formData.dob ? new Date(formData.dob) : new Date(2000, 0)
                    }
                    startMonth={new Date(1900, 0)}
                    endMonth={new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className='text-sm py-2'>{formatDate(profile?.dob)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
