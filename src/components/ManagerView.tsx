import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  MessageSquare, 
  User, 
  Building2, 
  CalendarDays, 
  FileText, 
  ThumbsUp, 
  CornerDownRight, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { Meeting, Hospital, Department, Doctor, UserRole } from '../types';
import { getSystemSettings, getMeetingStatus } from '../db';

interface ManagerViewProps {
  meetings: Meeting[];
  hospitals: Hospital[];
  departments: Department[];
  doctors: Doctor[];
  onSaveMeeting: (meeting: Meeting) => void;
  currentRole: UserRole;
}

export default function ManagerView({
  meetings,
  hospitals,
  departments,
  doctors,
  onSaveMeeting,
  currentRole
}: ManagerViewProps) {
  // Load configuration settings
  const settings = getSystemSettings();

  // Local state for filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [repFilter, setRepFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected report in Master-Detail view
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  
  // Feedback comment local state
  const [managerComment, setManagerComment] = useState('');

  // Dictionaries and helper data
  const getHospitalName = (id: string) => hospitals.find(h => h.id === id)?.name || 'Nieznany szpital';
  const getHospitalCity = (id: string) => hospitals.find(h => h.id === id)?.city || '';
  const getDeptName = (id: string | null) => id ? departments.find(d => d.id === id)?.name : null;
  const getDoctorName = (id: string | null) => {
    if (!id) return null;
    const doc = doctors.find(d => d.id === id);
    return doc ? `${doc.title} ${doc.first_name} ${doc.last_name}` : null;
  };

  // Pre-sets for quick manager comments
  const QUICK_COMMENT_PRESETS = [
    "Good job! Great identification of customer needs.",
    "Please clarify the budget details in the note.",
    "Approved. Let's prepare the offer and send it this week.",
    "Insufficient information. Please contact by phone again.",
    "Excellent progress with sterilization, keep it up!"
  ];

  // We consider all meetings as representatives' reports, but prioritize closed/submitted ones
  // Ensure every meeting has a fallback representative name
  const reports = meetings.map(m => ({
    ...m,
    representative_name: m.representative_name || "Łukasz Nowak",
    approval_status: m.approval_status || "pending",
    meeting_status: getMeetingStatus(m)
  }));

  // Unique list of representatives for filters
  const uniqueReps = Array.from(new Set(reports.map(r => r.representative_name)));

  // Filtered reports
  const filteredReports = reports.filter(r => {
    // Status filter
    const matchesStatus = statusFilter === 'all' || r.approval_status === statusFilter;
    
    // Representative filter
    const matchesRep = repFilter === 'all' || r.representative_name === repFilter;
    
    // Text search filter
    const hName = getHospitalName(r.hospital_id).toLowerCase();
    const hCity = getHospitalCity(r.hospital_id).toLowerCase();
    const title = r.title.toLowerCase();
    const note = r.content_markdown.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = !searchQuery || 
      hName.includes(query) || 
      hCity.includes(query) || 
      title.includes(query) || 
      note.includes(query) ||
      r.representative_name.toLowerCase().includes(query);

    return matchesStatus && matchesRep && matchesSearch;
  });

  // Selected report entity
  const activeReport = reports.find(r => r.id === selectedMeetingId) || (filteredReports.length > 0 ? filteredReports[0] : null);

  // Sync comment field when selected report changes
  React.useEffect(() => {
    if (activeReport) {
      setManagerComment(activeReport.manager_comment || '');
      setSelectedMeetingId(activeReport.id);
    } else {
      setManagerComment('');
      setSelectedMeetingId(null);
    }
  }, [selectedMeetingId, activeReport?.id]);

  // Handle report review actions
  const handleReviewStatus = (status: 'approved' | 'rejected') => {
    if (!activeReport) return;
    
    const updated: Meeting = {
      ...activeReport,
      approval_status: status,
      manager_comment: managerComment.trim() || undefined,
      updated_at: new Date().toISOString()
    };
    
    onSaveMeeting(updated);
    alert(`Report marked as ${status === 'approved' ? 'APPROVED' : 'REJECTED'}.`);
  };

  const handleSaveCommentOnly = () => {
    if (!activeReport) return;
    
    const updated: Meeting = {
      ...activeReport,
      manager_comment: managerComment.trim() || undefined,
      updated_at: new Date().toISOString()
    };
    
    onSaveMeeting(updated);
    alert('Manager evaluation comments updated successfully!');
  };

  // Stats calculation
  const totalCount = reports.length;
  const pendingCount = reports.filter(r => r.approval_status === 'pending').length;
  const approvedCount = reports.filter(r => r.approval_status === 'approved').length;
  const rejectedCount = reports.filter(r => r.approval_status === 'rejected').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in font-sans text-slate-800" id="manager-panel-container">
      {/* Header & Stats bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Award size={28} />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Manager Dashboard</h2>
            <p className="text-slate-500 text-sm mt-0.5">Evaluate submitted representative visits, review notes, approve budgets, and log feedback.</p>
          </div>
        </div>

        {/* Dynamic workflow status badge */}
        <div className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-600">
          Workflow Approvals: <span className="font-bold text-blue-600">{settings.enableMeetingApprovals ? 'ACTIVE' : 'DISABLED'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="manager-metrics-grid">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Submitted Reports</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">All visits</span>
          </div>
        </div>
        
        <button 
          onClick={() => setStatusFilter('pending')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-1 ${
            statusFilter === 'pending'
              ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-amber-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-semibold text-amber-600/80 block uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={12} /> Pending Review
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
            <span className="text-[10px] text-amber-600/60 font-semibold uppercase tracking-widest font-mono">Needs Action</span>
          </div>
        </button>

        <button 
          onClick={() => setStatusFilter('approved')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-1 ${
            statusFilter === 'approved'
              ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-emerald-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-semibold text-emerald-600/80 block uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Approved Reports
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{approvedCount}</span>
            <span className="text-[10px] text-emerald-600/60 font-semibold uppercase tracking-widest font-mono">Accepted</span>
          </div>
        </button>

        <button 
          onClick={() => setStatusFilter('rejected')}
          className={`text-left p-4 rounded-2xl border transition-all space-y-1 ${
            statusFilter === 'rejected'
              ? 'bg-red-50/50 border-red-300 ring-1 ring-red-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-200 shadow-sm'
          }`}
        >
          <span className="text-xs font-semibold text-red-600/80 block uppercase tracking-wider flex items-center gap-1.5">
            <XCircle size={12} /> Rejected Reports
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">{rejectedCount}</span>
            <span className="text-[10px] text-red-600/60 font-semibold uppercase tracking-widest font-mono">Declined</span>
          </div>
        </button>
      </div>

      {/* Main split work area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COMPONENT: Master List of Reports (Col-span 5) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
          
          {/* Filtering Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shrink-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search reports, clinics, representatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>

            {/* Rep selector & reset filter */}
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Representative:</span>
                <select
                  value={repFilter}
                  onChange={(e) => setRepFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer flex-1"
                >
                  <option value="all">👥 All Team Members</option>
                  {uniqueReps.map(repName => (
                    <option key={repName} value={repName}>{repName}</option>
                  ))}
                </select>
              </div>

              {(statusFilter !== 'all' || repFilter !== 'all' || searchQuery) && (
                <button 
                  onClick={() => {
                    setStatusFilter('all');
                    setRepFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline shrink-0"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Master Reports List */}
          <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl bg-white divide-y divide-slate-100 shadow-inner p-2 space-y-1.5">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2 mt-8">
                <Inbox size={32} className="mx-auto text-slate-300" />
                <p className="text-sm font-semibold">No reports match your filters</p>
                <p className="text-xs">Try selecting 'All' statuses or clearing your search queries.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const isSelected = report.id === selectedMeetingId;
                const dateStr = new Date(report.meeting_date).toLocaleDateString('pl-PL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedMeetingId(report.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                      isSelected 
                        ? 'bg-slate-900 text-slate-100 border-slate-900 shadow-md ring-1 ring-slate-800' 
                        : 'bg-white text-slate-800 border-slate-150 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-blue-400' : 'text-blue-600'}`}>
                          {dateStr}
                        </span>
                        <h4 className="font-display font-bold text-xs line-clamp-1 leading-snug">
                          {report.title}
                        </h4>
                      </div>

                      {/* Approval badge */}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                        report.approval_status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : report.approval_status === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {report.approval_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/10">
                      <div className="flex items-center gap-1 text-[10px] font-medium opacity-80">
                        <User size={10} />
                        <span>{report.representative_name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] font-semibold opacity-70">
                        <Building2 size={10} className="shrink-0" />
                        <span className="break-words">{getHospitalCity(report.hospital_id)}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Review/Detail Board (Col-span 7) */}
        <div className="lg:col-span-7">
          {activeReport ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6 animate-fade-in" id="report-detail-card">
              
              {/* Header Information */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <User size={14} className="text-slate-400" />
                    <span>Submitted by: <strong>{activeReport.representative_name}</strong></span>
                  </div>
                  
                  {/* Approval State badge larger */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Approval Status:</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                      activeReport.approval_status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : activeReport.approval_status === 'rejected'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {activeReport.approval_status === 'approved' && <CheckCircle2 size={12} />}
                      {activeReport.approval_status === 'rejected' && <XCircle size={12} />}
                      {activeReport.approval_status === 'pending' && <Clock size={12} />}
                      {activeReport.approval_status}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
                  {activeReport.title}
                </h3>

                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <CalendarDays size={12} />
                    {new Date(activeReport.meeting_date).toLocaleString('pl-PL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Building2 size={12} />
                    {getHospitalName(activeReport.hospital_id)} ({getHospitalCity(activeReport.hospital_id)})
                  </span>
                </div>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Hospital Department</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <CornerDownRight size={12} className="text-slate-400" />
                    {getDeptName(activeReport.department_id) || 'Ogólny (brak oddziału)'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Target Personnel</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <CornerDownRight size={12} className="text-slate-400" />
                    {getDoctorName(activeReport.doctor_id) || 'Administracja / Apteka'}
                  </span>
                </div>

                {activeReport.product_tags && activeReport.product_tags.length > 0 && (
                  <div className="md:col-span-2 space-y-1.5 pt-2 border-t border-slate-200/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Promoted Medical Products</span>
                    <div className="flex flex-wrap gap-1">
                      {activeReport.product_tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-mono font-black border border-blue-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visit Note / Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <FileText size={14} className="text-slate-400" />
                  <span>Representative Report Notes</span>
                </div>
                <div className="p-4 bg-white border border-slate-150 rounded-2xl text-xs text-slate-700 leading-relaxed shadow-inner max-h-56 overflow-y-auto whitespace-pre-line">
                  {activeReport.content_markdown || <span className="italic text-slate-400">Empty notes provided by representative.</span>}
                </div>
              </div>

              {/* Evaluation Workpanel (Zarządzanie raportem) */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span>Manager Review Comments & Evaluation</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Evaluation presets</span>
                </div>

                {/* Preset comments helper */}
                <div className="flex flex-wrap gap-1">
                  {QUICK_COMMENT_PRESETS.map((preset, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setManagerComment(preset)}
                      className="text-[10px] px-2 py-1 bg-slate-50 border border-slate-150 text-slate-600 rounded-lg hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-all font-semibold"
                      title={preset}
                    >
                      Preset {idx+1}
                    </button>
                  ))}
                </div>

                {/* Comment Textarea */}
                <div className="space-y-1.5">
                  <textarea
                    rows={3}
                    placeholder="Enter an optional comment or feedback for the representative..."
                    value={managerComment}
                    onChange={(e) => setManagerComment(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 hover:bg-slate-100/50 transition-all font-semibold"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={() => handleReviewStatus('approved')}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Report</span>
                  </button>

                  <button
                    onClick={() => handleReviewStatus('rejected')}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={14} />
                    <span>Reject Report</span>
                  </button>

                  <button
                    onClick={handleSaveCommentOnly}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                  >
                    Save Comment Only
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <Inbox size={48} className="mx-auto text-slate-300" />
              <h4 className="font-display font-bold text-base text-slate-800">No reports submitted</h4>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                There are no reports submitted in this category, or you need to select one from the left-side list to evaluate.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
