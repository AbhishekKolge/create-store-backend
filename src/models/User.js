import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    firstName: {
      type: String,
      trim: true,
      required: [true, 'Please provide first name'],
      minLength: [3, 'First name should be minimum 3 characters'],
      maxLength: [20, 'First name should not be more than 20 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Please provide last name'],
      minLength: [3, 'Last name should be minimum 3 characters'],
      maxLength: [20, 'Last name should not be more than 20 characters'],
    },
    mobile: {
      type: String,
      trim: true,
      validate: {
        validator: validator.isMobilePhone,
        message: 'Please provide valid contact no',
      },
    },
    authenticationPlatform: {
      type: String,
      enum: {
        values: ['app', 'google', 'facebook'],
        message: '{VALUE} is not supported',
      },
      default: 'app',
    },
    verificationCode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', UserSchema);
