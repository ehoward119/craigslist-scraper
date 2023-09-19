import './App.css';
import { useEffect, useState } from 'react';
import { groupBy } from 'lodash';

function App() {
  const [dogFriendlyApts, setDogFriendlyApts] = useState(null);
  const [badApts, setBadApts] = useState(null);
  const [localLat, setLocalLat] = useState('');
  const [lat, setLat] = useState('');
  const [localLon, setLocalLon] = useState('');
  const [lon, setLon] = useState('');
  const [showApartments, setShowApartments] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon })
    };
      const response = await fetch('http://localhost:3001/api', requestOptions);
      if (response) {
        const data = await response.json();
        const apartments = data.apartments;
        const sorted = groupBy(apartments, 'isDogFriendly');
        setDogFriendlyApts(sorted[true]);
        setBadApts(sorted[false]);
      }
    }
    if (lat && lon) {
      fetchData().catch(console.error);
    }
  }, [lat, lon]);

  const onGo = () => {
    setBadApts(null);
    setDogFriendlyApts(null);
    setShowApartments(true);
    setLat(localLat);
    setLon(localLon);
  }

  return (
    <div className="App">
      <h1> Find apartments near: </h1>
      <div className='latAndLon'>
        <label>Latitude: </label>
        <input value={localLat} onChange={(e) => setLocalLat(e.target.value)} />
        <label>Longitude:</label>
        <input value={localLon} onChange={(e) => setLocalLon(e.target.value)} />
        <button onClick={onGo}>Go</button>
      </div>
      {(showApartments && lat && lon) ? (<>
          {(!dogFriendlyApts && !badApts) ? <div>Loading...</div> : <>
          <div> 
          <h2 className='apartmentTitle'>Dog Friendly Apartments: </h2>
            <div>
              {dogFriendlyApts && dogFriendlyApts.map((apt) => {
                return (<a href={apt.link}>{apt.title}</a>);
              })}
            </div>

          </div>
          <div>
            <h2 className='apartmentTitle'>
              Sad Apartments:
            </h2>
            {badApts && badApts.map((apt) => {
              return (<a href={apt.link}>{apt.title}</a>)
            })}
          </div>
          </>}
        </>) : <div>Enter coordinates to see apartments</div>}
    </div>
  );
}

export default App;
