import { useState, useEffect } from 'react';
import API_URL from '../config';

// Admin dashboard - SQL-style table viewer for the five core entities, with user delete
function Admin() {
  const [activeTab, setActiveTab] = useState('user');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Tab definitions paired with their backend admin endpoint
  const tables = [
    { key: 'user', label: 'Users', endpoint: '/api/v1/admin/users' },
    { key: 'transaction', label: 'Transactions', endpoint: '/api/v1/admin/transactions' },
    { key: 'termplan', label: 'Term Plans', endpoint: '/api/v1/admin/termplans' },
    { key: 'installment', label: 'Installments', endpoint: '/api/v1/admin/installments' },
    { key: 'budget', label: 'Budgets', endpoint: '/api/v1/admin/budgets' },
  ];

  // Fetch the rows for whichever table tab is currently active
  const fetchData = async (endpoint) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        setData([]);
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setData([]);
    }
    setLoading(false);
  };

  // Re-fetch whenever the user switches tabs
  useEffect(() => {
    const table = tables.find(t => t.key === activeTab);
    if (table) fetchData(table.endpoint);
  }, [activeTab]);

  // Delete a user - backend cascades to their transactions, term plans and instalments
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/v1/admin/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDeleteConfirm(null);
      const table = tables.find(t => t.key === activeTab);
      if (table) fetchData(table.endpoint);
    } catch (err) {
      console.error(err);
    }
  };

  // Build the column list dynamically from the first row, hiding Spring Security internals
  const getColumns = () => {
    if (data.length === 0) return [];
    const exclude = ['authorities', 'accountNonExpired', 'accountNonLocked', 'credentialsNonExpired', 'enabled', 'username'];
    return Object.keys(data[0]).filter(k => !exclude.includes(k));
  };

  const columns = getColumns();

  // Filter rows client-side based on the search query (matches against any column)
  const filteredData = query.trim()
    ? data.filter(row =>
        columns.some(col => {
          const val = row[col];
          return val !== null && val !== undefined && val.toString().toLowerCase().includes(query.toLowerCase());
        })
      )
    : data;

  // Format cell values for display - truncates long password hashes, stringifies nested objects
  const formatCell = (value, col) => {
    if (value === null || value === undefined) return '-';
    if (col === 'password') return value.substring(0, 20) + '...';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#f0e8ea]">Admin Dashboard</h1>
        <p className="text-sm text-[rgba(255,255,255,0.35)] mt-1">Database management</p>
      </div>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl overflow-hidden">

        {/* Table tabs - one per core entity */}
        <div className="flex border-b border-[rgba(200,150,160,0.08)]">
          {tables.map(table => (
            <button
              key={table.key}
              onClick={() => setActiveTab(table.key)}
              className={`px-6 py-3.5 text-sm font-medium transition-all ${
                activeTab === table.key
                  ? 'text-white border-b-2 border-[#c896a0] bg-[rgba(200,150,160,0.05)]'
                  : 'text-[rgba(255,255,255,0.4)] hover:text-white hover:bg-[rgba(200,150,160,0.03)]'
              }`}
            >
              {table.label}
            </button>
          ))}
        </div>

        {/* Query bar and row count */}
        <div className="p-4 border-b border-[rgba(200,150,160,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[rgba(255,255,255,0.3)] uppercase tracking-widest">
              Tables / {activeTab}
            </span>
            <span className="text-xs text-[rgba(255,255,255,0.2)]">
              {filteredData.length} {filteredData.length === 1 ? 'row' : 'rows'}
            </span>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter rows..."
            className="px-3 py-2 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors text-sm w-64"
          />
        </div>

        {/* SQL-style indicator showing which table is being viewed */}
        <div className="p-4 border-b border-[rgba(200,150,160,0.08)]">
          <div className="bg-[#1a1c2e] border border-[rgba(200,150,160,0.08)] rounded-lg px-4 py-2.5">
            <code className="text-sm text-[rgba(255,255,255,0.5)]">
              SELECT * FROM <span className="text-[#c896a0]">{activeTab}</span>
            </code>
          </div>
        </div>

        {/* Data table - dynamically renders columns based on the row schema */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-[rgba(255,255,255,0.3)]">Loading...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[rgba(255,255,255,0.3)]">No data found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(200,150,160,0.08)]">
                  {columns.map(col => (
                    <th key={col} className="px-4 py-3 text-left text-xs font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                  {/* Extra column for the delete button on the users tab */}
                  {activeTab === 'user' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-[rgba(255,255,255,0.4)] uppercase tracking-wider w-16">
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i} className="border-b border-[rgba(200,150,160,0.04)] hover:bg-[rgba(200,150,160,0.03)] transition-colors">
                    {columns.map(col => (
                      <td key={col} className="px-4 py-3 text-sm text-[rgba(255,255,255,0.7)] font-mono max-w-[200px] truncate">
                        {/* Special rendering for role badge, money columns, default formatter otherwise */}
                        {col === 'role' ? (
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            row[col] === 'ADMIN'
                              ? 'bg-[rgba(200,150,160,0.15)] text-[#c896a0]'
                              : 'bg-[rgba(138,184,160,0.1)] text-[#8ab8a0]'
                          }`}>
                            {row[col]}
                          </span>
                        ) : col === 'amount' || col === 'weeklyBudget' || col === 'totalBudget' ? (
                          <span className={
                            col === 'amount' && row.type === 'EXPENSE'
                            ? 'text-[#d08888]'
                            : 'text-[#8ab8a0]'
                           }>
                            £{Number(row[col]).toLocaleString('en-GB', { minimumFractionDigits: 2 })}  
                          </span>
                        ) : (
                          formatCell(row[col], col)
                        )}
                      </td>
                    ))}
                    {activeTab === 'user' && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDeleteConfirm(row.id)}
                          className="text-[rgba(255,255,255,0.2)] hover:text-[#d08888] transition-colors text-xs">
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete user confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(208,136,136,0.2)] rounded-2xl p-8 w-full max-w-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-[rgba(208,136,136,0.1)] border border-[rgba(208,136,136,0.2)] rounded-full flex items-center justify-center mb-4">
                <span className="text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete User #{deleteConfirm}?</h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)] text-center">
                This will permanently delete this user and all their data.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="flex-1 py-2.5 bg-[#d08888] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;