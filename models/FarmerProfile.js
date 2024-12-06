const mongoose = require('mongoose');


const FarmLocationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
});

const FarmDetailsSchema = new mongoose.Schema({
    farmLocation: { type: FarmLocationSchema, required: true },
    farmSize: { type: Number, required: true, min: 0 },
    cropsGrown: { type: [String], required: true },
    licenseCertifications: [String],
});

const CreditScoreSchema = new mongoose.Schema({
    score: { type: Number, min: 300, max: 850 },
    lastUpdated: { type: Date, default: Date.now },
});

const BankDetailsSchema = new mongoose.Schema({
    accountNumber: { type: String },
    bankName: { type: String },
    accountHolder: { type: String },
});

const ContributionStatsSchema = new mongoose.Schema({
    numContributed: { type: Number, default: 0 },
    numLabeled: { type: Number, default: 0 },
    numValidated: { type: Number, default: 0 },
});

// Thresholds Schema (added)
const ThresholdsSchema = new mongoose.Schema({
    temperature: {
        heat: { type: Number, required: true, default: 35 }, // Heat threshold
        frost: { type: Number, required: true, default: 0 }, // Frost threshold
    },
    precipitation: {
        droughtDays: { type: Number, required: true, default: 7 }, // Drought risk days
        flood: { type: Number, required: true, default: 50 }, // Flood warning threshold
    },
    humidity: {
        pestRiskHumidity: { type: Number, required: true, default: 80 }, // Pest risk humidity
        pestRiskTempRange: { type: [Number], required: true, default: [15, 30] }, // Pest risk temperature range
    },
    wind: {
        strongWind: { type: Number, required: true, default: 40 }, // Strong wind threshold
    },
    uv: {
        highUV: { type: Number, required: true, default: 8 }, // High UV threshold
    },
});

const FarmerProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    farmDetails: { type: FarmDetailsSchema, required: true },
    creditScore: CreditScoreSchema,
    bankDetails: BankDetailsSchema,
    contributionStats: ContributionStatsSchema,
    thresholds: ThresholdsSchema, // Thresholds Schema (added)
}, { timestamps: true });

module.exports = mongoose.model('FarmerProfile', FarmerProfileSchema);