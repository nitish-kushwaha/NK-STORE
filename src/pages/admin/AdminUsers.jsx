import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';
import { Users, Mail, Calendar, Shield } from 'lucide-react';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">{users.length} registered users</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="admin-empty">
          <Users size={40} strokeWidth={1} style={{ marginBottom: '1rem' }} />
          <p>No users found. Users appear here once they register or login via Firebase Auth and create a profile document.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const joined = u.createdAt?.toDate?.()
                  ? u.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                  : '—';
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-cell__avatar">
                          {u.photoURL
                            ? <img src={u.photoURL} alt="" />
                            : (u.displayName || u.email || 'U')[0].toUpperCase()
                          }
                        </div>
                        <span className="admin-user-cell__name">{u.displayName || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                        <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                        {u.email}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>
                        {u.role === 'admin' ? <><Shield size={11} /> Admin</> : 'User'}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} />
                        {joined}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
