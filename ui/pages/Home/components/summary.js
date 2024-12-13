import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { People } from '../../../../people/people';
import { Collections } from '../../../../shared/collections';

export const Summary = ({ communitySelected }) => {
  const summaryData = useTracker(() => {
    const data = {
      peopleInEvent: 0,
      peopleByCompany: [],
      peopleNotCheckIn: 0,
      loading: true,
    };
    const handle = Meteor.subscribe(Collections.People, communitySelected);

    if (!handle.ready()) {
      return data;
    }

    const peopleInEvent = People.find({
      checkIn: { $ne: null },
      checkOut: null,
    }).fetch();

    const groupedByCompany = peopleInEvent.reduce((acc, person) => {
      const { companyName } = person;
      if (!companyName) return acc;

      acc[companyName] = acc[companyName] || [];
      acc[companyName].push(person);

      return acc;
    }, {});

    const peopleByCompany = Object.entries(groupedByCompany).map(
      ([companyName, people]) => `${companyName} (${people.length})`
    );

    return {
      peopleInEvent: peopleInEvent.length,
      peopleByCompany,
      peopleNotCheckIn: People.find({
        checkIn: null,
        checkOut: null,
      }).count(),
      loading: false,
    };
  }, [communitySelected]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <p className="font-bold">People in the event right now:</p>{' '}
        <div className="rounded-3xl bg-copy-secondary px-4 py-1 font-bold text-surfaces">
          {summaryData.peopleInEvent}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <p className="font-bold">People by company in the event right now:</p>{' '}
        {summaryData.peopleByCompany.length > 0 &&
          summaryData.peopleByCompany.map((company) => (
            <div
              key={company}
              className="rounded-3xl bg-copy-secondary px-4 py-1 font-bold text-surfaces"
            >
              {company}
            </div>
          ))}
        {summaryData.peopleByCompany.length === 0 && <div>-</div>}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <p className="font-bold">People not checked in: </p>{' '}
        <div className="rounded-3xl bg-copy-secondary px-4 py-1 font-bold text-surfaces">
          {summaryData.peopleNotCheckIn}
        </div>
      </div>
    </div>
  );
};
