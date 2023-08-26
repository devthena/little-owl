import { Model, Schema, model } from 'mongoose';
import { format } from 'date-fns';

interface IStar extends Document {
  last: {
    given_ds: string;
  };
  total: {
    given: number;
  };
  updateLastGivenStarDS(newGivenDS: string): void;
  incrementTotalGiven(): void;
}

interface IStarModel extends Model<IStar> {
  createStar(): Promise<IStar>;
}

export const starSchema = new Schema<IStar>({
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

// static methods
starSchema.statics.createStar = async function () {
  const star = await this.create({
    last: {
      given_ds: format(new Date(), 'yyyy-MM-dd'),
    },
    total: {
      given: 1,
    },
  });

  return star;
};

// instance methods
starSchema.methods.incrementTotalGiven = function () {
  let currentTotal = this.total.given || 0;
  this.total.given = ++currentTotal;
};

starSchema.methods.updateLastGivenStarDS = function (newGivenDS: string): void {
  this.last.given_ds = newGivenDS;
};

export const Star: IStarModel = model<IStar, IStarModel>('Star', starSchema);
