import { GENDER_OPTIONS } from '~/constants/gender';

export const formatDate = dateString => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getGenderLabel = value => {
  const option = GENDER_OPTIONS.find(opt => opt.value === value);
  return option?.label || 'Not set';
};
