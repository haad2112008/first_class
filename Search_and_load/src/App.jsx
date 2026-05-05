import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch data
  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);          // IMPORTANT CHANGE
        setFilteredUsers(data.users);  // IMPORTANT CHANGE
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  return (
    <div className="App">
      <h1>User List</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Loader */}
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="card-container">
          {filteredUsers.map((user) => (
            <div key={user.id} className="card">
              <img src={user.image} alt={user.firstName} />
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              <p>{user.company.name}</p>
              <p>{user.address.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
