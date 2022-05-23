import React, { useEffect, useState } from 'react';

function App() {
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');

  const baseUrl = 'https://guest-list-react-ta.herokuapp.com/guests';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);
  // const [isAttending, setIsAttending] = useState(false);
  const [refetch, setRefetch] = useState(true);
  const [loading, setLoading] = useState(true);

  // CREATING A NEW GUEST!!! and SEND TO SERVER
  async function addGuest() {
    console.log('addGuest was called');
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    console.log(createdGuest);
    setGuestList([...guestList, createdGuest]);
  }

  const updateGuest = async (guestId, checkStatus) => {
    const response = await fetch(`${baseUrl}/${guestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: checkStatus }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
    setRefetch(!refetch);
  };
  const deleteGuest = async (guest) => {
    const response = await fetch(`${baseUrl}/${guest}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    response.status === 200
      ? setGuestList(guestList.filter((g) => g.id !== deletedGuest.id))
      : alert('Error Deleting This Guest');
  };

  useEffect(() => {
    async function fetchGuests() {
      const response = await fetch(baseUrl);
      const allGuests = await response.json();
      setGuestList(allGuests);
      console.log('guest list was fetched');
      setLoading(false);
    }
    fetchGuests().catch(() => {
      console.log('fetch failed');
    });
  }, [refetch]);

  if (loading) {
    return 'Loading...';
  }

  return (
    <div data-test-id="guest">
      <h2> Sign Up </h2>
      <form name="form">
        <label htmlFor="first-name">First name</label>
        <input
          id="first-name"
          required
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />

        <label htmlFor="last-name">Last name </label>
        <input
          id="last-name"
          required
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addGuest().catch(() => {
                console.log('addGuest failed');
              });
              document.form.reset();
            }
          }}
        />
      </form>

      <h1>Guest List</h1>
      {guestList.map((guest) => {
        return (
          <div key={guest.id}>
            <h3>First Name: {guest.firstName}</h3>
            <h3>Last Name: {guest.lastName}</h3>
            <h3>
              Attending: {guest.attending ? 'attending' : 'not attending'}
            </h3>

            <input
              type="checkbox"
              aria-label="attending"
              checked={guest.attending}
              onChange={(event) => {
                const guestCheckStatus = event.currentTarget.checked;
                updateGuest(guest.id, guestCheckStatus).catch(() => {
                  setRefetch(!refetch);
                  console.log('import failed');
                });
              }}
            />

            <button
              type="button"
              aria-label="Remove"
              onClick={() => {
                deleteGuest(guest.id).catch(() => {
                  console.log('import failed');
                });
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
