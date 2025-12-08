import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['application_received', 'status_change', 'interview_scheduled', 'system'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Types.ObjectId,
      // Can ref Job or Application depending on context
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);
