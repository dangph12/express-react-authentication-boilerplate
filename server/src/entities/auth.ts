// One user can have multiple auth accounts
// For local authentication, provider will be 'local' and providerId will be the user's email
export interface Auth {
  user: string;
  provider: string;
  providerId: string;
  localPassword?: string;
  verifyAt: Date;
}
