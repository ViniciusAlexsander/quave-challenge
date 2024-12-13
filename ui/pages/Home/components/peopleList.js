import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { People } from '../../../../people/people';
import { Collections } from '../../../../shared/collections';
import { Person } from './person';

export const PeopleList = ({ communitySelected }) => {
  const peopleData = useTracker(() => {
    const data = { people: [], loading: true };
    const handle = Meteor.subscribe(Collections.People, communitySelected);

    if (!handle.ready()) {
      return data;
    }
    return { people: People.find({}).fetch(), loading: false };
  }, [communitySelected]);

  if (peopleData.loading) {
    return <h1>LOADING</h1>;
  }

  return (
    <div className="flex flex-col gap-4">
      {peopleData.people.map((person) => (
        <Person key={person._id} person={person} />
      ))}
    </div>
  );
};
