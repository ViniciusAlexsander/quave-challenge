import { Mongo } from 'meteor/mongo';
import { Collections } from '../shared/collections';

export const Communities = new Mongo.Collection(Collections.Communities);
