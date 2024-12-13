import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const Person = ({ person }) => {
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const handleCheckIn = async () => {
    if (person.checkIn) await Meteor.callAsync('checkOut', person._id);
    else {
      setLoadingCheckIn(true);
      await Meteor.callAsync('checkIn', person._id);
      setTimeout(() => setLoadingCheckIn(false), 5000);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-primary p-3">
      <p>
        <strong>Full Name:</strong> {`${person.firstName} ${person.lastName}`}
      </p>
      <div className="flex gap-2">
        <p className="w-1/2">
          <strong>Company Name:</strong> {person.companyName || '-'}
        </p>
        <p className="w-1/2">
          <strong>Title:</strong> {person.title || '-'}
        </p>
      </div>

      <div>
        <strong>Check-in:</strong>{' '}
        {person.checkIn ? person.checkIn.toLocaleDateString() : ''}
      </div>

      <div>
        <strong>Check-out:</strong>{' '}
        {person.checkOut ? person.checkOut.toLocaleDateString() : '-'}
      </div>

      {!person.checkOut && (
        <button
          className="flex items-center justify-center rounded-md bg-secondary px-3 py-2 font-bold text-surfaces hover:bg-copy-secondary disabled:bg-disabled"
          onClick={handleCheckIn}
          disabled={person.checkOut || loadingCheckIn}
        >
          {person.checkIn ? 'Check-out' : 'Check-in'}
        </button>
      )}
    </div>
  );
};
