import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import { sendWelcomeEmail } from './email';

export const authOptions = {
  providers: [
    // Email + password credentials
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (user.isBanned) {
          throw new Error('Your account has been banned');
        }

        if (!user.passwordHash) {
          throw new Error('Please sign in with Google or Phone');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          trialEndDate: user.trialEndDate.toISOString(),
        };
      },
    }),

    // Phone number credentials (Firebase verified)
    CredentialsProvider({
      id: 'phone',
      name: 'phone',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        firebaseUid: { label: 'Firebase UID', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.firebaseUid) {
          throw new Error('Phone verification required');
        }

        await dbConnect();
        let user = await User.findOne({
          $or: [
            { phone: credentials.phone },
            { firebaseUid: credentials.firebaseUid },
          ],
        });

        if (user) {
          if (user.isBanned) throw new Error('Your account has been banned');
          // Update firebase UID if missing
          if (!user.firebaseUid) {
            user.firebaseUid = credentials.firebaseUid;
            await user.save();
          }
        } else {
          // Auto-register new phone user
          const now = new Date();
          user = await User.create({
            name: credentials.name || `User ${credentials.phone.slice(-4)}`,
            phone: credentials.phone,
            firebaseUid: credentials.firebaseUid,
            trialStartDate: now,
            trialEndDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          });

          await Profile.create({
            userId: user._id,
            name: user.name,
            avatar: '/avatars/default.png',
          });

          const profile = await Profile.findOne({ userId: user._id });
          user.profiles = [profile._id];
          await user.save();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email || user.phone,
          role: user.role,
          image: user.image,
          trialEndDate: user.trialEndDate.toISOString(),
        };
      },
    }),

    // Firebase Google sign-in credentials
    CredentialsProvider({
      id: 'firebase-google',
      name: 'firebase-google',
      credentials: {
        email: { label: 'Email', type: 'email' },
        name: { label: 'Name', type: 'text' },
        firebaseUid: { label: 'Firebase UID', type: 'text' },
        image: { label: 'Image', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.firebaseUid) {
          throw new Error('Google sign-in failed');
        }

        await dbConnect();
        let user = await User.findOne({
          $or: [
            { email: credentials.email.toLowerCase() },
            { firebaseUid: credentials.firebaseUid },
          ],
        });

        if (user) {
          if (user.isBanned) throw new Error('Your account has been banned');
          if (!user.firebaseUid) {
            user.firebaseUid = credentials.firebaseUid;
            if (!user.image && credentials.image) user.image = credentials.image;
            await user.save();
          }
        } else {
          const now = new Date();
          user = await User.create({
            name: credentials.name || 'User',
            email: credentials.email.toLowerCase(),
            firebaseUid: credentials.firebaseUid,
            image: credentials.image || '',
            isEmailVerified: true,
            trialStartDate: now,
            trialEndDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
          });

          await Profile.create({
            userId: user._id,
            name: user.name,
            avatar: credentials.image || '/avatars/default.png',
          });

          const profile = await Profile.findOne({ userId: user._id });
          user.profiles = [profile._id];
          await user.save();

          try {
            await sendWelcomeEmail(user);
          } catch (e) {
            console.error('Welcome email error:', e);
          }
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          trialEndDate: user.trialEndDate.toISOString(),
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Phone and firebase-google credentials are already handled in authorize()
      if (account?.provider === 'phone' || account?.provider === 'firebase-google' || account?.provider === 'credentials') {
        return true;
      }

      if (account?.provider === 'google') {
        await dbConnect();
        let existingUser = await User.findOne({ email: user.email.toLowerCase() });

        if (existingUser) {
          if (existingUser.isBanned) return false;
          if (!existingUser.googleId) {
            existingUser.googleId = account.providerAccountId;
            existingUser.image = user.image;
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
          user.role = existingUser.role;
          user.trialEndDate = existingUser.trialEndDate.toISOString();
        } else {
          const newUser = await User.create({
            name: user.name,
            email: user.email.toLowerCase(),
            googleId: account.providerAccountId,
            image: user.image,
            isEmailVerified: true,
            trialStartDate: new Date(),
            trialEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          });

          await Profile.create({
            userId: newUser._id,
            name: user.name,
            avatar: user.image || '/avatars/default.png',
          });

          newUser.profiles = [
            (await Profile.findOne({ userId: newUser._id }))._id,
          ];
          await newUser.save();

          user.id = newUser._id.toString();
          user.role = newUser.role;
          user.trialEndDate = newUser.trialEndDate.toISOString();

          try {
            await sendWelcomeEmail(newUser);
          } catch (e) {
            console.error('Welcome email error:', e);
          }
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.trialEndDate = user.trialEndDate;
      }
      if (trigger === 'update' && session) {
        token.role = session.role || token.role;
        token.trialEndDate = session.trialEndDate || token.trialEndDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.trialEndDate = token.trialEndDate;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
