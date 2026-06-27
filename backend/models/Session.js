import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    userAgent: String,

    ipAddress: String,

    expiresAt: Date,
  },
  {
    timestamps: true,
  },
);

// TTL index — MongoDB automatically removes expired session documents.
// expireAfterSeconds: 0 means "expire at the date stored in expiresAt".
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
