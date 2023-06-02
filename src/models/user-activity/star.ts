import { format } from 'date-fns';
import mongoose, { Schema } from 'mongoose';

export const starSchema = new Schema({
  last: {
    given_ds: {
      type: String,
      default: '',
    },
  },
  total: {
    given: {
      type: Number,
      default: 0,
    },
  },
});

starSchema.methods.getLastStar = function () {
  return this.last;
};

starSchema.methods.getTotal = function () {
  return this.total;
};

starSchema.methods.incrementTotal = function () {
  let currentTotal = this.total.given || 0;
  this.total.given = currentTotal++;
};

starSchema.methods.updateLastStarDs = function () {
  const newDate = format(new Date(), 'yyyy-MM-dd');
  this.last.given_ds = newDate;
};

export const Star = mongoose.model('Star', starSchema);
