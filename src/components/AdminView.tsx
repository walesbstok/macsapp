import React, { useState } from 'react';
import { 
  Shield, 
  Settings, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  RefreshCw, 
  Sliders, 
  Tag, 
  Mail, 
  UserCheck,
  FileCheck,
  Zap
} from 'lucide-react';
import { UserRole, CrmUser, SystemSettings, Meeting } from '../types';
import { getSystemSettings, saveSystemSettings, getUsers, saveUser, deleteUser, getMeetings, saveMeeting } from '../db';

interface AdminViewProps {
  onSettingsChange?: () => void;
  currentRole: UserRole;
}

export default function AdminView({ onSettingsChange, currentRole }: AdminViewProps) {
  // Load settings & users from localStorage
  const [settings, setSettings] = useState<SystemSettings>(() => getSystemSettings());
  const [users, setUsers] = useState<CrmUser[]>(() => getUsers());
  
  // Local state for forms
  const [brandName, setBrandName] = useState(settings.brandName);
  const [enableApprovals, setEnableApprovals] = useState(settings.enableMeetingApprovals);
  const [newProduct, setNewProduct] = useState('');
  
  // User form state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('sales representative');
  const [editUserActive, setEditUserActive] = useState(true);
  
  // New user form state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('sales representative');
  const [newUserPassword, setNewUserPassword] = useState('Macs123');
  const [editUserPassword, setEditUserPassword] = useState('');

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      brandName: brandName.trim() || "Mac's CRM",
      enableMeetingApprovals: enableApprovals
    };
    saveSystemSettings(updated);
    setSettings(updated);
    if (onSettingsChange) onSettingsChange();
    alert('System settings updated successfully!');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.trim()) return;
    const tag = newProduct.trim().toUpperCase();
    if (settings.productsList.includes(tag)) {
      alert('This product tag already exists.');
      return;
    }
    const updated = {
      ...settings,
      productsList: [...settings.productsList, tag]
    };
    saveSystemSettings(updated);
    setSettings(updated);
    setNewProduct('');
  };

  const handleRemoveProduct = (tag: string) => {
    const updated = {
      ...settings,
      productsList: settings.productsList.filter(p => p !== tag)
    };
    saveSystemSettings(updated);
    setSettings(updated);
  };

  const handleSaveUserEdit = (userId: string) => {
    if (!editUserName.trim() || !editUserEmail.trim()) {
      alert('Name and Email are required.');
      return;
    }
    const existing = users.find(u => u.id === userId);
    const updatedUser: CrmUser = {
      id: userId,
      name: editUserName.trim(),
      email: editUserEmail.trim(),
      role: editUserRole,
      isActive: editUserActive,
      created_at: existing?.created_at || new Date().toISOString(),
      password: editUserPassword.trim() ? editUserPassword.trim() : (existing?.password || 'base44'),
      mustChangePassword: editUserPassword.trim() ? true : (existing?.mustChangePassword ?? true)
    };
    saveUser(updatedUser);
    setUsers(getUsers());
    setEditingUserId(null);
    setEditUserPassword('');
  };

  const handleStartEdit = (user: CrmUser) => {
    setEditingUserId(user.id);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setEditUserActive(user.isActive);
    setEditUserPassword('');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('All fields are required.');
      return;
    }
    const newUser: CrmUser = {
      id: `usr_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      isActive: true,
      created_at: new Date().toISOString(),
      password: newUserPassword.trim() || 'base44',
      mustChangePassword: true
    };
    saveUser(newUser);
    setUsers(getUsers());
    
    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('sales representative');
    setNewUserPassword('base44');
    setShowAddUser(false);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
      setUsers(getUsers());
    }
  };

  // Generate mock representative reports for quick demonstration
  const handleGenerateDemoReports = () => {
    const mockReports: Partial<Meeting>[] = [
      {
        id: `meet_demo_1`,
        title: "Presentation of Allium Stents in Urology",
        meeting_date: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        hospital_id: "hosp_1",
        department_id: "dept_1_1",
        doctor_id: "doc_siedlce_krol",
        doctor_ids: ["doc_siedlce_krol"],
        product_tags: ["ALLIUM"],
        content_markdown: "Demonstrated Allium ureteral stents. Doctors expressed interest in 30F versions. They asked about the reimbursement procedure and the possibility of borrowing an introductory set.",
        meeting_type: "PRESENTATION",
        closed_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        approval_status: "pending",
        representative_name: "Łukasz W."
      },
      {
        id: `meet_demo_2`,
        title: "Testing the Orascoptic Light",
        meeting_date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        hospital_id: "hosp_2",
        department_id: "dept_2_1",
        doctor_id: "doc_siedlce_kania",
        doctor_ids: ["doc_siedlce_kania"],
        product_tags: ["ORASCOPTIC"],
        content_markdown: "The doctor tested Orascoptic 3.0x magnifying glasses with wireless lighting. The manufacturing quality was considered outstanding, but the system price is a barrier to entry. Request for a leasing offer.",
        meeting_type: "REGULAR",
        closed_at: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
        created_at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        approval_status: "pending",
        representative_name: "Łukasz W."
      },
      {
        id: `meet_demo_3`,
        title: "Discussion about SternFix System",
        meeting_date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        hospital_id: "hosp_3",
        department_id: "dept_3_1",
        doctor_id: "doc_lublin_bozy_sokolowski",
        doctor_ids: ["doc_lublin_bozy_sokolowski"],
        product_tags: ["NEOS SternFix"],
        content_markdown: "Meeting with the head of cardiosurgery. Presented the clinical benefits of SternFix compared to classic steel wire suturing. First demonstration surgery planned for the end of the month.",
        meeting_type: "REGULAR",
        closed_at: new Date(Date.now() - 47 * 3600 * 1000).toISOString(),
        created_at: new Date(Date.now() - 49 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        approval_status: "approved",
        manager_comment: "Excellent work! Keeping my fingers crossed for the demo surgery.",
        representative_name: "Łukasz W."
      }
    ];

    mockReports.forEach(m => {
      saveMeeting(m as Meeting);
    });

    alert('Successfully generated 3 representative demo reports (2 Pending, 1 Approved) for Manager Panel testing!');
    if (onSettingsChange) onSettingsChange();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in" id="admin-panel-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Admin Administration Panel</h2>
            <p className="text-slate-500 text-sm mt-0.5">Configure system-wide variables, custom workflows, products list, and team roles.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100 uppercase tracking-wider font-mono">
            🛡️ God Mode Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: System Config & Medical Inventory */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* General CRM Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4" id="card-general-settings">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings size={18} className="text-slate-500" />
              <h3 className="font-display font-bold text-base text-slate-800">General CRM Settings</h3>
            </div>

            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 block">CRM Brand Name</label>
                <input 
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-slate-100/50 transition-all font-semibold"
                  placeholder="e.g. Mac's CRM"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={enableApprovals}
                    onChange={(e) => setEnableApprovals(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Enable Representative Report Approvals</span>
                    <span className="text-xs text-slate-500 block">If checked, manager approval is required to mark representative's reports as final.</span>
                  </div>
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Save General Settings
              </button>
            </form>
          </div>

          {/* Medical Product Tag Inventory */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4" id="card-product-settings">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 justify-between">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-slate-500" />
                <h3 className="font-display font-bold text-base text-slate-800">Medical Product Catalog</h3>
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold">
                {settings.productsList.length} Active
              </span>
            </div>

            <form onSubmit={handleAddProduct} className="flex gap-2">
              <input 
                type="text"
                placeholder="ADD NEW TAG (e.g. ALLIUM)"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
              />
              <button 
                type="submit"
                className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                title="Add product tag"
              >
                <Plus size={16} />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-1.5 border border-slate-100 rounded-xl bg-slate-50">
              {settings.productsList.map((tag) => (
                <div 
                  key={tag}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 shadow-sm"
                >
                  <span>{tag}</span>
                  <button 
                    onClick={() => handleRemoveProduct(tag)}
                    className="p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    type="button"
                    title={`Delete tag ${tag}`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">Deleting a tag removes it from filters but preserves historic reports containing that tag.</p>
          </div>

          {/* Quick Sandbox Tools */}
          <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl" id="card-sandbox-tools">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Zap size={18} className="text-amber-400" />
              <h3 className="font-display font-bold text-base text-white">Interactive CRM Sandbox</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instantly generate test representative reports with Polish notes and dynamic products to quickly check the <strong>Manager Panel</strong>.
            </p>
            <button 
              onClick={handleGenerateDemoReports}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
              Generate Demo Representative Reports
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Team Role Configuration & Users */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4" id="card-user-management">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-500" />
                <h3 className="font-display font-bold text-base text-slate-800">Team Users & Roles</h3>
              </div>
              
              <button 
                onClick={() => setShowAddUser(!showAddUser)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  showAddUser 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {showAddUser ? <X size={14} /> : <Plus size={14} />}
                <span>{showAddUser ? 'Cancel' : 'Add Team Member'}</span>
              </button>
            </div>

            {/* New User Form */}
            {showAddUser && (
              <form onSubmit={handleAddUser} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-slide-down">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Team Member Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Caroline Nowak"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Email Address</label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. caroline@base44.pl"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Initial Password</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. base44"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-500 outline-none font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-semibold text-slate-500 shrink-0">System Role:</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white font-semibold outline-none"
                    >
                      <option value="admin">🔧 Admin</option>
                      <option value="manager">📈 Manager</option>
                      <option value="sales representative">💼 Sales Rep</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Register User
                  </button>
                </div>
              </form>
            )}

            {/* Users List Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-inner bg-slate-50/50">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold">
                    <th className="p-3">User</th>
                    <th className="p-3">System Role</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {users.map((user) => {
                    const isEditing = editingUserId === user.id;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3">
                          {isEditing ? (
                            <div className="space-y-1.5 max-w-[180px]">
                              <input 
                                type="text"
                                value={editUserName}
                                onChange={(e) => setEditUserName(e.target.value)}
                                className="w-full text-xs font-bold border rounded px-1.5 py-1 bg-slate-50"
                              />
                              <input 
                                type="email"
                                value={editUserEmail}
                                onChange={(e) => setEditUserEmail(e.target.value)}
                                className="w-full text-[10px] text-slate-500 border rounded px-1.5 py-1 bg-slate-50 font-mono"
                              />
                              <input 
                                type="text"
                                placeholder="Reset password (optional)"
                                value={editUserPassword}
                                onChange={(e) => setEditUserPassword(e.target.value)}
                                className="w-full text-[10px] text-slate-600 border rounded px-1.5 py-1 bg-slate-50 font-semibold"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{user.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                <Mail size={10} /> {user.email}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          {isEditing ? (
                            <select
                              value={editUserRole}
                              onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                              className="text-xs border rounded p-1 bg-slate-50 font-semibold"
                            >
                              <option value="admin">🔧 Admin</option>
                              <option value="manager">📈 Manager</option>
                              <option value="sales representative">💼 Sales Rep</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] uppercase tracking-wider ${
                              user.role === 'admin' 
                                ? 'bg-red-50 text-red-700 border border-red-100' 
                                : user.role === 'manager'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              {user.role === 'admin' ? '🛡️' : user.role === 'manager' ? '📈' : '💼'} {user.role}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isEditing ? (
                            <label className="inline-flex items-center gap-1 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={editUserActive}
                                onChange={(e) => setEditUserActive(e.target.checked)}
                                className="w-3.5 h-3.5 border-slate-300 text-blue-600 rounded"
                              />
                              <span className="text-[11px] font-semibold text-slate-600">Active</span>
                            </label>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.isActive 
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                                : 'text-slate-400 bg-slate-100'
                            }`}>
                              {user.isActive ? 'Active' : 'Suspended'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => handleSaveUserEdit(user.id)}
                                className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                                title="Save changes"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => setEditingUserId(null)}
                                className="p-1 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => handleStartEdit(user)}
                                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-all text-[11px] font-bold px-2"
                              >
                                Edit Role
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
              <UserCheck size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-blue-900 block">Active User Role Context</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To test views as any registered member, select the appropriate role (🔧 Admin, 📈 Manager, or 💼 Sales Rep) from the <strong>Select User Role</strong> dropdown in the sidebar's bottom-left active profile card.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
