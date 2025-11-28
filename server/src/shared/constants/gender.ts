export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export const GENDER_VALUES = [
  Gender.MALE,
  Gender.FEMALE,
  Gender.OTHER
] as const;
