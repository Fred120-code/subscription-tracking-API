import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
        minlength: 5,
        maxlength: 50,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: Number,
        required: true,
        enum: ['USD', 'EUR', "GBP"],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum:['daily', 'weekly', 'monthly', 'yearly']
    },
    category: {
        type: String,
        enum:["sport", 'news','entertainment','technology','finance', 'other'],
        required: true
    },
    paymentMethod:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['active', 'canceled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start date must be in the past"
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startDate
            },
            message: "renewalDate must be after the startDate"
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index:true
    }
}, {
        timestamps: true
})

//automatic calculate of renewal date
SubscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
    }

    //auto update the status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired'
    }
    next()
})