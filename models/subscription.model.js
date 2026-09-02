import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: 5,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sport",
        "news",
        "Entertainment",
        "technology",
        "finance",
        "other",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in the past",
      },
      value: new Date(),
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "renewalDate must be after the startDate",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

//automatic calculate of renewal date
SubscriptionSchema.pre("save", async function () {
  // 1. Calculate renewal date if it's missing OR if dependencies changed
  if (
    !this.renewalDate ||
    this.isModified("startDate") ||
    this.isModified("frequency")
  ) {
    const baseDate = this.startDate ? new Date(this.startDate) : new Date();

    switch (this.frequency) {
      case "daily":
        baseDate.setDate(baseDate.getDate() + 1);
        break;
      case "weekly":
        baseDate.setDate(baseDate.getDate() + 7);
        break;
      case "monthly":
        baseDate.setMonth(baseDate.getMonth() + 1); // Handles true calendar months
        break;
      case "yearly":
        baseDate.setFullYear(baseDate.getFullYear() + 1); // Handles true calendar years
        break;
      default:
        baseDate.setDate(baseDate.getDate() + 30); // Fallback default
    }

    this.renewalDate = baseDate;
  }

  // 2. Auto-update status if the renewal date has passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
