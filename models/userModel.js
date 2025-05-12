import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "both"],
      required: true,
    },
    nic: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },

    // Newly added fields
    company: {
      type: String,
      required: true,
    },
    companyVAT: {
      type: String,
      required: true,
    },

    companyActivity: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "EN",
      required: true,
    },
    preferredProducts: {
      type: [String],
      default: [],
    },
    otherProducts: {
      type: String,
    },
    termsAgreed: {
      type: Boolean,
      required: true,
    },

    resetPasswordToken: String,
    resetPasswordExpireAt: Date,
    verificationToken: String,
    verificationTokenExpireAt: Date,
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
export default User