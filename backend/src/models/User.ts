import { model, Schema, Document } from 'mongoose';

interface Availability {
  status: 'Available' | 'Not Available';
  reason?: string;
  nextAvailability?: Date;
}

export interface UserDocument extends Document {
  name: string;
  password: string;
  email: string;
  level: 'Junior' | 'Mid-level' | 'Senior' | 'CEO';
  yearsOfWork: number;
  availability: Availability;
  userType: 'Employee' | 'Organization';
  organizationName?: string;
  employees?: string[];
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) =>
        /\S+@\S+\.\S+/.test(value),
      message: 'Invalid email format',
    },
  },
  level: {
    type: String,
    enum: ['Junior', 'Mid-level', 'Senior', 'CEO'],
    required: true,
  },
  yearsOfWork: {
    type: Number,
    required: true,
    min: 0,
    max: 99,
  },
  availability: {
    type: {
      status: {
        type: String,
        enum: ['Available', 'Not Available'],
        required: true,
      },
      reason: {
        type: String,
        required: function (this: UserDocument) {
          return (
            this.availability?.status === 'Not Available'
          );
        },
      },
      nextAvailability: {
        type: Date,
        required: function (this: UserDocument) {
          return (
            this.availability?.status === 'Not Available'
          );
        },
      },
    },
  },
  userType: {
    type: String,
    enum: ['Employee', 'Organization'],
    required: true,
  },
  organizationName: {
    type: String,
    required: function (this: UserDocument) {
      return this.userType === 'Organization';
    },
  },
  employees: {
    type: [String],
    required: function (this: UserDocument) {
      return this.userType === 'Organization';
    },
    default: [],
  },
});

export const User = model<UserDocument>('User', userSchema);
