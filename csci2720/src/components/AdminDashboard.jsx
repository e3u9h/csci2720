import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
    const [newUser, setNewUser] = useState({ username: '', password: '', isAdmin: false });
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchUsersAndAdmins();
    }, []);

    const fetchUsersAndAdmins = async () => {
        try {
            const userResponse = await API.get('/api/users');
            const adminResponse = await API.get('/api/admins');
            setUsers(userResponse.data);
            setAdmins(adminResponse.data);
        } catch (error) {
            setFeedback({ message: 'Error fetching users or admins', type: 'error' });
        }
    };

    const handleCreateUser = async () => {
        try {
            const endpoint = newUser.isAdmin ? '/api/admins' : '/api/users';
            await API.post(endpoint, {
                username: newUser.username,
                password: newUser.password,
            });
            setFeedback({ message: 'User created successfully!', type: 'success' });
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error creating user: ' + errorMessage, type: 'error' });
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setNewUser({ username: user.username, password: '', isAdmin: user.__t === 'Admin' });
    };

    const handleModifyUser = async () => {
        try {
            const endpoint = selectedUser.__t === 'Admin' ? '/api/admins' : '/api/users';
            await API.put(`${endpoint}/${selectedUser._id}`, {
                username: newUser.username,
                password: newUser.password,
            });

            setFeedback({ message: 'User updated successfully!', type: 'success' });
            setSelectedUser(null);
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error updating user: ' + errorMessage, type: 'error' });
        }
    };

    const handleDeleteUser = async () => {
        try {
            if (!selectedUser) {
                setFeedback({ message: 'No user selected for deletion.', type: 'error' });
                return;
            }

            const userType = selectedUser.__t === 'Admin' ? 'admins' : 'users';
            await API.delete(`/api/${userType}/${selectedUser._id}`);

            setFeedback({ message: 'User deleted successfully!', type: 'success' });
            setSelectedUser(null);
            setNewUser({ username: '', password: '', isAdmin: false });
            fetchUsersAndAdmins();
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
            setFeedback({ message: 'Error deleting user: ' + errorMessage, type: 'error' });
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>

            {feedback.message && (
                <div className={`feedback ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}

            <h3>Create User</h3>
            <input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <label>
                <input
                    type="checkbox"
                    checked={newUser.isAdmin}
                    onChange={() => setNewUser(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
                />
                Admin User
            </label>
            <button onClick={handleCreateUser}>Create User</button>

            <h3>User List</h3>
            <ul>
                {users.map(user => (
                    <li key={user._id} onClick={() => handleSelectUser(user)}>
                        {user.username} (User)
                    </li>
                ))}
            </ul>

            <h3>Admin List</h3>
            <ul>
                {admins.map(admin => (
                    <li key={admin._id} onClick={() => handleSelectUser(admin)}>
                        {admin.username} (Admin)
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div>
                    <h3>Modify User</h3>
                    <input
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={newUser.isAdmin}
                            onChange={() => setNewUser(prev => ({ ...prev, isAdmin: !prev.isAdmin }))}
                        />
                        Admin User
                    </label>
                    <button onClick={handleModifyUser}>Update User</button>
                    <button onClick={handleDeleteUser}>Delete User</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
