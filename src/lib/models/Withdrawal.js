import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    net: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Completed",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "withdrawals",
  }
);

const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", withdrawalSchema);

export default Withdrawal;
