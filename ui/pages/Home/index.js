import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { Communities } from '../../../communities/communities';
import { People } from '../../../people/people';
import { Collections } from '../../../shared/collections';
import { PeopleList } from './components/peopleList';
import { Summary } from './components/summary';

export const Home = () => {
  const [communitySelected, setCommunitySelected] = useState('');

  const communitiesData = useTracker(() => {
    const data = { communities: [], loading: true };
    const handle = Meteor.subscribe(Collections.Communities);

    if (!handle.ready()) {
      return data;
    }
    return { communities: Communities.find({}).fetch(), loading: false };
  }, []);

  const peopleData = useTracker(() => {
    const data = { people: [], loading: true };
    const handle = Meteor.subscribe(Collections.People, communitySelected);

    if (!handle.ready()) {
      return data;
    }
    return { people: People.find({}).fetch(), loading: false };
  }, [communitySelected]);

  if (communitiesData.loading || peopleData.loading) {
    return <h1>LOADING</h1>;
  }

  const handleSelectCommunity = (event) => {
    setCommunitySelected(event.target.value);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="w-full p-4 md:w-3/4 lg:w-3/5">
        <select
          value={communitySelected}
          onChange={handleSelectCommunity}
          className="block w-full rounded-lg border border-primary bg-surfaces p-2.5 text-sm text-copy-primary focus:border-secondary focus:ring-copy-primary"
        >
          <option value="" className="font-bold">
            Select an event
          </option>
          {communitiesData.communities.map((community) => (
            <option
              key={community._id}
              value={community._id}
              className="font-bold"
            >
              {community.name}
            </option>
          ))}
        </select>
        <div className="mt-4">
          <Summary communitySelected={communitySelected} />
        </div>
        <div className="mt-4">
          <PeopleList communitySelected={communitySelected} />
        </div>
      </div>
    </div>
  );
};
