import React, {useEffect, useState} from 'react';
import History from './History';
import NoHistory from './NoHistory';
import { useFirebase } from '../context/Firebase';

export default function HistoryList() {

  const firebase = useFirebase();
  const [history, setHistory] = useState([]);
  useEffect(() => {
    firebase.getHistory().then((history) => setHistory(history.docs));
  })
  return (
    <>
      <p className='historyLabel'>Your History :</p>
      {firebase.user ? (
        <div className='historylist'>
                {history.map((hist) => (
                  <History key={hist.id} text={hist.data().code.substring(0,20)+" ... "+hist.id}/>
                ))}
        </div>
      ) : (
        <NoHistory />
      )}
    </>
  );
}
