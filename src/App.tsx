import React, {useEffect} from 'react';
import {useUsers} from "./Users.context";

function App() {
  const {users, loading, error, fetchUsers} = useUsers();

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {loading && <p>Loading...</p>}
      {users.map(user => (
        <div key={user.id}>
          <p>{user.username}</p>
          <p>{user.age}</p>
        </div>
      ))
      }
    </div>
  );
}

export default App;
