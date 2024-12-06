const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Permission Schema
const permissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate permissions
    },
    description: {
        type: String,
        required: true,
    },
});

const Permission = model('Permission', permissionSchema);

// Role Schema
const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['Farmer', 'Supplier', 'Buyer', 'Admin', 'GovernmentOfficial'], // Defined roles
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission', // Reference to Permission schema
        },
    ],
});

const Role = model('Role', roleSchema);


const ContactInfoSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
});

const BusinessDetailsSchema = new mongoose.Schema({
    businessName: { type: String },
    businessType: { type: String },
});

const PersonalDetailsSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactInfo: { type: ContactInfoSchema, required: true },
    address: { type: String, required: true },
    businessDetails: BusinessDetailsSchema,
});

const PreferencesSchema = new mongoose.Schema({
    notifications: { type: Boolean, default: true },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, minlength: 3, maxlength: 30, required: true },
    password: { type: String, required: true }, // Hashed password
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role', // Reference to Role schema
        required: true,
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    failedLoginAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date },
    personalDetails: { type: PersonalDetailsSchema, required: true },
    preferences: { type: PreferencesSchema },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = { User, Role, Permission };