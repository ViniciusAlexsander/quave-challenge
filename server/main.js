import { Meteor } from 'meteor/meteor';
import { loadInitialData } from '../infra/initial-data';
import { Communities } from '../communities/communities';
import { People } from '../people/people';
import { Collections } from '../shared/collections';

Meteor.startup(async () => {
  // DON'T CHANGE THE NEXT LINE
  await loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
  Meteor.publish(Collections.Communities, () => Communities.find({}));
  Meteor.publish(Collections.People, (communityId) =>
    People.find({ communityId })
  );
  Meteor.methods({
    async checkIn(personId) {
      await People.updateAsync(
        { _id: personId },
        { $set: { checkIn: new Date(), checkOut: null } }
      );
    },
    async checkOut(personId) {
      await People.updateAsync(
        { _id: personId },
        { $set: { checkOut: new Date() } }
      );
    },
    async addNewPerson(person) {
      await People.insertAsync(person);
    },
  });
});
