import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
    destinationId: { type: String, required: true },
    destinationTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    people: { type: Number, required: true },
    duration: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'failed'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

export default model('Booking', bookingSchema);