'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_FEED_ITEMS } from '@/lib/mockData';
import { FeedItem, FeedCategory, FeedComment, Task } from '@/lib/types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Share2, 
  Image as ImageIcon, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ClipboardCheck, 
  DollarSign, 
  X, 
  Plus, 
  Camera, 
  Upload, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  CheckSquare, 
  Layers, 
  Search, 
  ArrowRight,
  Maximize2,
  FileText,
  UserCheck,
  Tag
} from 'lucide-react';

const PRESET_WORK_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000', label: 'After: Fresh Marine Gasket & Clean Interior' },
  { url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000', label: 'Before: Dry-rotted Rubber & Oxidation' },
  { url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1000', label: 'During: High-Pressure Power Washing' },
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1000', label: 'Detail: Lock Rod & Cam Lubrication' },
  { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1000', label: 'Final: Stacking Corner Casting ISO Alignment' }
];

const EMPLOYEES = [
  { name: 'Carlos Ramirez', role: 'Field Tech Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', facility: 'Austin Port Terminal Yard' },
  { name: 'Sarah Jenkins', role: 'Yard Facility Manager', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', facility: 'Long Beach Harbor Storage' },
  { name: 'Jason Miller', role: 'Yard Facility Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', facility: 'Austin Port Terminal Yard' },
  { name: 'David Chen', role: 'Maintenance Specialist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', facility: 'Houston Freight Logistics Yard' }
];

import { useRole } from '@/lib/RoleContext';

export default function FieldReportsFeedPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Feed & Tasks State
  const [posts, setPosts] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'INSPECTION' | 'MAINTENANCE' | 'CLEANING' | 'PENDING_APPROVAL' | 'SAVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal / Composer State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTaskForReport, setSelectedTaskForReport] = useState<Task | null>(null);
  
  // Form fields for report submission
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>('Carlos Ramirez');
  const [reportTitle, setReportTitle] = useState('');
  const [reportNotes, setReportNotes] = useState('');
  const [taskStatusUpdate, setTaskStatusUpdate] = useState<'Completed' | 'In Progress' | 'Review'>('Completed');
  const [timeSpent, setTimeSpent] = useState('45');
  const [extraCost, setExtraCost] = useState('0');
  const [gpsLocation, setGpsLocation] = useState('Bay B-04 (Austin Port Terminal)');
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; label: string }[]>([
    { url: PRESET_WORK_PHOTOS[0].url, label: 'After: Work Completed' }
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ label: string; done: boolean }[]>([
    { label: 'Inspected structural integrity & door alignment', done: true },
    { label: 'Cleaned and prepared surface area', done: true },
    { label: 'Fitted OEM replacement parts / materials', done: true },
    { label: 'Completed final quality & seal test', done: true }
  ]);

  // Lightbox State
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; taskNumber?: string } | null>(null);

  // Comments State
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({
    'feed-002': true,
    'feed-001': false,
    'feed-003': false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Composer with pre-selected task
  const handleOpenReportModal = (task?: Task) => {
    if (task) {
      setSelectedTaskId(task.id);
      setSelectedTaskForReport(task);
      setReportTitle(`Completed ${task.title}`);
      setReportNotes(`Carried out full maintenance and inspection in response to work order ${task.taskNumber}. All items verified and ready for deployment.`);
      if (task.checklist && task.checklist.length > 0) {
        setChecklistItems(task.checklist.map(c => ({ label: c.label, done: true })));
      }
    } else {
      setSelectedTaskId(tasks[0]?.id || '');
      setSelectedTaskForReport(tasks[0] || null);
      setReportTitle('');
      setReportNotes('');
    }
    setIsUploadModalOpen(true);
  };

  // Handle task selection change in composer
  const handleTaskSelectionChange = (taskId: string) => {
    setSelectedTaskId(taskId);
    const foundTask = tasks.find(t => t.id === taskId);
    setSelectedTaskForReport(foundTask || null);
    if (foundTask) {
      if (!reportTitle || reportTitle.startsWith('Completed ')) {
        setReportTitle(`Completed ${foundTask.title}`);
      }
      if (foundTask.checklist && foundTask.checklist.length > 0) {
        setChecklistItems(foundTask.checklist.map(c => ({ label: c.label, done: true })));
      }
    }
  };

  // Add photo to uploaded list
  const handleAddPresetPhoto = (photo: { url: string; label: string }) => {
    if (!uploadedPhotos.some(p => p.url === photo.url)) {
      setUploadedPhotos(prev => [...prev, photo]);
    }
  };

  const handleAddCustomPhoto = () => {
    if (customPhotoUrl.trim()) {
      setUploadedPhotos(prev => [...prev, { url: customPhotoUrl.trim(), label: 'Field Photo Evidence' }]);
      setCustomPhotoUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUploadedPhotos(prev => [...prev, { url: reader.result as string, label: `Uploaded: ${file.name}` }]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Field Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      showToast('Please enter a report title.');
      return;
    }

    const currentEmployee = EMPLOYEES.find(emp => emp.name === selectedEmployeeName) || EMPLOYEES[0];
    const linkedTask = selectedTaskForReport || tasks.find(t => t.id === selectedTaskId);

    const newFeedItem: FeedItem = {
      id: `report-${Date.now()}`,
      timestamp: 'Just now',
      category: linkedTask?.type === 'Cleaning' ? 'GENERAL' : (linkedTask?.type === 'Repair' ? 'MAINTENANCE' : 'INSPECTION'),
      title: reportTitle,
      description: reportNotes || `Field report submitted in response to work order ${linkedTask?.taskNumber || 'ad-hoc'}.`,
      caption: `Field Report submitted by ${currentEmployee.name} in response to ${linkedTask?.taskNumber || 'assigned task'}. Container ${linkedTask?.containerNumber || 'Yard General'} has been inspected and serviced with photo evidence attached.`,
      facilityId: linkedTask?.facilityId || 'fac-001',
      facilityName: linkedTask?.facilityName || 'Austin Port Terminal Yard',
      containerNumber: linkedTask?.containerNumber || 'ATX-2004',
      actorName: currentEmployee.name,
      actorRole: currentEmployee.role,
      actorAvatar: currentEmployee.avatar,
      severity: 'success',
      image: uploadedPhotos[0]?.url || PRESET_WORK_PHOTOS[0].url,
      photos: uploadedPhotos.length > 0 ? uploadedPhotos : [{ url: PRESET_WORK_PHOTOS[0].url, label: 'Work Evidence' }],
      beforePhoto: uploadedPhotos.length > 1 ? uploadedPhotos[1].url : undefined,
      afterPhoto: uploadedPhotos[0]?.url,
      likesCount: 1,
      isLiked: false,
      isSaved: false,
      approvalStatus: 'PENDING_REVIEW',
      timeSpentMins: Number(timeSpent) || 45,
      costMaterials: extraCost ? `$${extraCost}` : '$0.00',
      gpsLocation: gpsLocation || 'Austin Terminal Yard',
      checklistResults: checklistItems.map(c => ({ label: c.label, done: c.done })),
      linkedTask: linkedTask ? {
        taskNumber: linkedTask.taskNumber,
        taskTitle: linkedTask.title,
        assignedTo: linkedTask.assignedToName,
        priority: linkedTask.priority,
        status: taskStatusUpdate,
        reply: {
          authorName: currentEmployee.name,
          authorRole: currentEmployee.role,
          authorAvatar: currentEmployee.avatar,
          text: reportNotes || `Task ${linkedTask.taskNumber} marked as ${taskStatusUpdate}. All checklist items verified with uploaded photo evidence.`,
          timestamp: 'Just now'
        }
      } : undefined,
      comments: []
    };

    // Update tasks state
    if (linkedTask) {
      setTasks(prev => prev.map(t => t.id === linkedTask.id ? { ...t, status: taskStatusUpdate } : t));
    }

    // Prepend to feed
    setPosts(prev => [newFeedItem, ...prev]);
    setIsUploadModalOpen(false);
    showToast(`✅ Field report for ${linkedTask?.taskNumber || 'Task'} published successfully!`);
    
    // Reset form
    setReportTitle('');
    setReportNotes('');
  };

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    }));
  };

  // Toggle Bookmark
  const handleToggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isSaved = !post.isSaved;
        showToast(isSaved ? 'Report saved to audit bookmarks' : 'Report removed from bookmarks');
        return { ...post, isSaved };
      }
      return post;
    }));
  };

  // Manager Approval Toggle
  const handleToggleApproval = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isApproved = post.approvalStatus === 'APPROVED';
        const newStatus = isApproved ? 'PENDING_REVIEW' : 'APPROVED';
        showToast(isApproved ? 'Sign-off revoked' : '✅ Report officially approved & signed off by Manager');
        return {
          ...post,
          approvalStatus: newStatus,
          approvedBy: isApproved ? undefined : 'Jason Miller (Yard Facility Manager)'
        };
      }
      return post;
    }));
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: FeedComment = {
      id: `c-${Date.now()}`,
      authorName: 'Eleanor Vance',
      authorRole: 'Chief Executive',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      text,
      timestamp: 'Just now',
      likes: 0
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
    showToast('Comment posted to report');
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Facility Filter
    if (selectedFacilityId !== 'ALL' && post.facilityId && post.facilityId !== selectedFacilityId) {
      return false;
    }
    // Category / Tab Filter
    if (activeTab === 'INSPECTION' && post.category !== 'INSPECTION') return false;
    if (activeTab === 'MAINTENANCE' && post.category !== 'MAINTENANCE') return false;
    if (activeTab === 'CLEANING' && post.category !== 'GENERAL') return false;
    if (activeTab === 'PENDING_APPROVAL' && post.approvalStatus !== 'PENDING_REVIEW') return false;
    if (activeTab === 'SAVED' && !post.isSaved) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchActor = post.actorName.toLowerCase().includes(q);
      const matchContainer = post.containerNumber?.toLowerCase().includes(q);
      const matchTask = post.linkedTask?.taskNumber.toLowerCase().includes(q) || post.linkedTask?.taskTitle.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchActor || matchContainer || matchTask;
    }

    return true;
  });

  // Pending Tasks list for Quick Upload Tray
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-5 md:p-7 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Top Hero Banner & Quick Actions */}
          <div className="bg-gradient-to-br from-white via-white to-amber-50/40 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Field Tech Stream
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Verification
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Facility Field Reports & Task Submissions</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                Real-time activity stream of maintenance proofs, inspection photos, and work order completions uploaded by on-site technicians across container yards.
              </p>
            </div>

            {/* Quick Upload Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenReportModal()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Report & Photos</span>
              </button>
            </div>
          </div>

          {/* "Tasks Awaiting Field Report" Action Carousel */}
          {pendingTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Assigned Tasks Awaiting Field Verification ({pendingTasks.length})
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Click to attach photo proof & complete</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pendingTasks.map(task => (
                  <div 
                    key={task.id}
                    className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {task.taskNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {task.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {task.description || 'Inspection and maintenance proof required for yard records.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[110px]">{task.containerNumber || task.facilityName}</span>
                      </div>
                      <button
                        onClick={() => handleOpenReportModal(task)}
                        className="flex items-center gap-1 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all shadow-2xs cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Submit Proof</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                All Reports ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('INSPECTION')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'INSPECTION'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Inspections
              </button>
              <button
                onClick={() => setActiveTab('MAINTENANCE')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'MAINTENANCE'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Repairs & Overhauls
              </button>
              <button
                onClick={() => setActiveTab('PENDING_APPROVAL')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'PENDING_APPROVAL'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Awaiting Sign-Off
              </button>
              <button
                onClick={() => setActiveTab('SAVED')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'SAVED'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Saved / Bookmarks
              </button>
            </div>

            {/* Keyword Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports, containers, techs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Reports Feed Stream */}
          <div className="space-y-5">
            {filteredPosts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">No field reports found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No submissions match the current filter or search criteria. Be the first to upload a report with pictures.
                </p>
                <button
                  onClick={() => handleOpenReportModal()}
                  className="mt-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Field Report</span>
                </button>
              </div>
            ) : (
              filteredPosts.map(post => {
                const isExpanded = expandedComments[post.id];
                const photosList = post.photos && post.photos.length > 0 
                  ? post.photos 
                  : (post.image ? [{ url: post.image, label: 'Inspection Photo' }] : []);

                return (
                  <article
                    key={post.id}
                    className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* 1. Header: Submitting Employee & Facility Info */}
                    <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-white via-white to-slate-50/40">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={post.actorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                            alt={post.actorName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-bold text-slate-900">{post.actorName}</h3>
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {post.actorRole}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">• {post.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{post.facilityName || 'Austin Port Terminal Yard'}</span>
                            {post.containerNumber && (
                              <span className="text-slate-400 font-mono">({post.containerNumber})</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Approval Status Badge */}
                      <div className="flex items-center gap-2">
                        {post.approvalStatus === 'APPROVED' ? (
                          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Approved by Manager</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Sign-Off</span>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleToggleSave(post.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            post.isSaved
                              ? 'bg-blue-50 text-blue-600 border-blue-200'
                              : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                          }`}
                          title="Save for audit"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Linked Work Order / Task Context Banner */}
                    {post.linkedTask && (
                      <div className="mx-4 sm:mx-5 mt-4 p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            <ClipboardCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono font-bold text-blue-800 bg-white/80 px-1.5 py-0.2 rounded border border-blue-200">
                                {post.linkedTask.taskNumber}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600">
                                In Response to Work Order:
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded border border-emerald-200">
                                Status: {post.linkedTask.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                              {post.linkedTask.taskTitle}
                            </h4>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 sm:self-center">
                          <span className="font-semibold text-slate-600">Assigned Tech:</span>
                          <span className="text-slate-800 font-medium">{post.linkedTask.assignedTo}</span>
                        </div>
                      </div>
                    )}

                    {/* 3. Report Narrative & Findings */}
                    <div className="p-4 sm:p-5 space-y-3.5">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                          {post.title}
                        </h2>
                        <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                          {post.description}
                        </p>
                      </div>

                      {/* 4. Multi-Photo Gallery with Lightbox Previews */}
                      {photosList.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                              <Camera className="w-3.5 h-3.5 text-blue-600" />
                              <span>Photo Evidence ({photosList.length} Uploaded)</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Click picture to view high-res</span>
                          </div>

                          <div className={`grid gap-2.5 ${
                            photosList.length === 1 
                              ? 'grid-cols-1' 
                              : photosList.length === 2 
                                ? 'grid-cols-1 sm:grid-cols-2' 
                                : 'grid-cols-1 sm:grid-cols-3'
                          }`}>
                            {photosList.map((photo, pIdx) => (
                              <div
                                key={pIdx}
                                onClick={() => setLightboxImage({ url: photo.url, title: photo.label || post.title, taskNumber: post.linkedTask?.taskNumber })}
                                className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900/5 aspect-4/3 cursor-pointer shadow-2xs hover:shadow-md transition-all"
                              >
                                <img
                                  src={photo.url}
                                  alt={photo.label || 'Work proof photo'}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                
                                {photo.label && (
                                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-semibold">
                                    <span className="truncate bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                                      {photo.label}
                                    </span>
                                    <Maximize2 className="w-3.5 h-3.5 text-white/80 shrink-0 ml-1" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 5. Checklist Verification Badges */}
                      {post.checklistResults && post.checklistResults.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Field Inspection Checklist
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {post.checklistResults.map((chk, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-1.5 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[11px] font-medium">{chk.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. Report Metadata Strip */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 font-medium">
                        {post.timeSpentMins && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>Duration: <strong>{post.timeSpentMins}m</strong></span>
                          </div>
                        )}
                        {post.costMaterials && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Materials: <strong>{post.costMaterials}</strong></span>
                          </div>
                        )}
                        {post.gpsLocation && (
                          <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span>GPS: {post.gpsLocation}</span>
                          </div>
                        )}
                        {post.approvedBy && (
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Signed by: {post.approvedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 7. Action Bar: Sign-off, Kudos, Comments */}
                    <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {/* Manager Sign-off Action */}
                        <button
                          onClick={() => handleToggleApproval(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            post.approvalStatus === 'APPROVED'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'
                              : 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300 hover:border-emerald-400'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{post.approvalStatus === 'APPROVED' ? 'Verified & Signed' : 'Sign Off / Approve'}</span>
                        </button>

                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            post.isLiked
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span>{post.likesCount}</span>
                        </button>

                        {/* Comments Toggle */}
                        <button
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments.length} Comments</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        REF: {post.id}
                      </div>
                    </div>

                    {/* 8. Discussion / Comments Thread */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
                        {post.comments.length > 0 && (
                          <div className="space-y-2.5">
                            {post.comments.map(c => (
                              <div key={c.id} className="bg-white border border-slate-200/80 p-3 rounded-xl shadow-2xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={c.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                                      alt={c.authorName}
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span className="text-xs font-bold text-slate-800">{c.authorName}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">({c.authorRole})</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                                </div>
                                <p className="text-xs text-slate-700 pl-7 leading-relaxed">{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add feedback, manager review, or notes..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-xs transition-all cursor-pointer"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT FIELD REPORT & PHOTO PROOF                                  */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                  Field Operations Dispatch
                </span>
                <h2 className="font-bold text-base text-slate-900">Upload Task Report & Photo Evidence</h2>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReport} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* 1. Select Linked Task */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Assigned Task / Work Order *</span>
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => handleTaskSelectionChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.taskNumber}: {t.title} ({t.facilityName} - {t.containerNumber || 'Yard General'}) [{t.priority}]
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Submitting Employee & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Submitting Technician / Staff</label>
                  <select
                    value={selectedEmployeeName}
                    onChange={(e) => setSelectedEmployeeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    {EMPLOYEES.map(emp => (
                      <option key={emp.name} value={emp.name}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Work Status Result</label>
                  <select
                    value={taskStatusUpdate}
                    onChange={(e) => setTaskStatusUpdate(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                  >
                    <option value="Completed">✅ Completed & Verified</option>
                    <option value="In Progress">⏳ In Progress / Partial Completion</option>
                    <option value="Review">⚠️ Completed - Needs Manager Review</option>
                  </select>
                </div>
              </div>

              {/* 3. Report Title & Findings */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Report Headline / Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Container ATX-2004 Weather Seal Overhaul & Smoke Test Completed"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Detailed Field Notes & Observations</label>
                <textarea
                  rows={3}
                  placeholder="Describe parts replaced, seal integrity, paint thickness readings, pressure test outcome..."
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* 4. Multi-Photo Upload Area */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Attach Photo Proof ({uploadedPhotos.length} Attached)</span>
                  </label>
                  <label className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Upload from Device</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Uploaded Thumbnails */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uploadedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video group">
                        <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="bg-rose-600 text-white p-1 rounded-md text-[10px] font-semibold hover:bg-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-white truncate bg-slate-900/80 px-1 rounded">
                          {photo.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preset Library Quick Pick */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Quick-Add from Preset Yard Camera Library
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_WORK_PHOTOS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddPresetPhoto(p)}
                        className="shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer hover:ring-2 hover:ring-blue-500"
                        title={p.label}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-slate-900/30 group-hover:bg-blue-600/40 flex items-center justify-center text-white text-[10px] font-bold">
                          + Add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Inspection Checklist */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Field Verification Checklist</span>
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  {checklistItems.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={(e) => {
                          const updated = [...checklistItems];
                          updated[idx].done = e.target.checked;
                          setChecklistItems(updated);
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={item.done ? 'font-medium' : 'text-slate-500 line-through'}>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Metrics & GPS Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Time Spent (Mins)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                    <input
                      type="number"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Extra Costs ($)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                    <input
                      type="number"
                      value={extraCost}
                      onChange={(e) => setExtraCost(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">GPS / Yard Bay</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1.5" />
                    <input
                      type="text"
                      value={gpsLocation}
                      onChange={(e) => setGpsLocation(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Report & Update Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIGHTBOX: FULL IMAGE MODAL                                                */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-60 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                {lightboxImage.taskNumber && (
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 mr-2">
                    {lightboxImage.taskNumber}
                  </span>
                )}
                <span className="text-xs font-bold">{lightboxImage.title}</span>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black p-2">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={INITIAL_FACILITIES}
        containers={INITIAL_CONTAINERS}
        customers={INITIAL_CUSTOMERS}
        tasks={tasks}
      />
    </div>
  );
}
