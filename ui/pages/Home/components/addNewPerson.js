import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Collections } from '../../../../shared/collections';
import { Communities } from '../../../../communities/communities';

export const AddNewPerson = () => {
  const [person, setPerson] = useState({
    firstName: '',
    lastName: '',
    title: '',
    companyName: '',
    communityId: '',
  });
  const [communitySelectedId, setCommunitySelectedId] = useState({
    name: '',
    _id: '',
  });

  const communitiesData = useTracker(() => {
    const data = { communities: [], loading: true };
    const handle = Meteor.subscribe(Collections.Communities);

    if (!handle.ready()) {
      return data;
    }
    return { communities: Communities.find({}).fetch(), loading: false };
  }, []);

  const handleAddPerson = async () => {
    const newPerson = {
      ...person,
      communityId: communitySelectedId,
    };

    await Meteor.callAsync('addNewPerson', newPerson);
  };

  const handlePersonFirstName = (event) => {
    setPerson({ ...person, firstName: event.target.value });
  };

  const handlePersonLastName = (event) => {
    setPerson({ ...person, lastName: event.target.value });
  };

  const handlePersonTitle = (event) => {
    setPerson({ ...person, title: event.target.value });
  };

  const handleSelectCommunity = (event) => {
    setCommunitySelectedId(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-4">
        <input
          placeholder="First Name"
          value={person.firstName}
          onChange={handlePersonFirstName}
          className="block w-full rounded-lg border border-primary bg-surfaces p-2.5 text-sm text-copy-primary focus:border-secondary focus:ring-copy-primary"
        />
        <input
          placeholder="Last Name"
          value={person.lastName}
          onChange={handlePersonLastName}
          className="block w-full rounded-lg border border-primary bg-surfaces p-2.5 text-sm text-copy-primary focus:border-secondary focus:ring-copy-primary"
        />
        <input
          placeholder="Title"
          value={person.title}
          onChange={handlePersonTitle}
          className="block w-full rounded-lg border border-primary bg-surfaces p-2.5 text-sm text-copy-primary focus:border-secondary focus:ring-copy-primary"
        />
        <select
          value={communitySelectedId._id}
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
      </div>
      <button
        className="mt-4 flex items-center justify-center rounded-md bg-secondary px-3 py-2 font-bold text-surfaces hover:bg-copy-secondary disabled:bg-disabled"
        onClick={handleAddPerson}
      >
        Add
      </button>
    </div>
  );
};
