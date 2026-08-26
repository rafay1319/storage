'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS, INITIAL_FEED_ITEMS } from '@/lib/mockData';
import { FeedItem, FeedCategory, FeedComment, LinkedTaskInfo } from '@/lib/types';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Share2, 
  Image as ImageIcon, 
  MapPin, 
  MoreHorizontal, 
  Sparkles, 
  CheckCircle2, 
  Truck, 
  Wrench, 
  ClipboardCheck, 
  DollarSign, 
  X,
  TrendingUp,
  Pin,
  CornerDownRight,
  MessageSquare
} from 'lucide-react';

const CURRENT_USER = {
  name: 'Eleanor Vance',
  role: 'Chief Executive',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
};

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000',
  'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1000',
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1000',
];

export default function SocialFeedPage() {
  const [currentRole, setCurrentRole] = useState('OWNER_ADMIN');
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Feed State
  const [posts, setPosts] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'MEDIA' | 'GATE_MOVE' | 'INSPECTION' | 'AI_ALERT' | 'SAVED'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Post State
  const [newPostText, setNewPostText] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostTaskTitle, setNewPostTaskTitle] = useState('');
  const [newPostTaskReply, setNewPostTaskReply] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<FeedCategory>('GENERAL');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [newPostContainer, setNewPostContainer] = useState('');
  const [newPostFacility, setNewPostFacility] = useState('Austin Port Terminal Yard');
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showTaskComposer, setShowTaskComposer] = useState(false);

  // Comment Input state mapped by post ID
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'feed-001': true, 'feed-002': true });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Like Toggle
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

  // Bookmark Toggle
  const handleToggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isSaved = !post.isSaved;
        showToast(isSaved ? 'Post saved to bookmarks' : 'Post removed from bookmarks');
        return { ...post, isSaved };
      }
      return post;
    }));
  };

  // Add Comment to Post
  const handleAddComment = (postId: string, textToAdd?: string) => {
    const text = textToAdd || commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: FeedComment = {
      id: 'c-' + Date.now(),
      authorName: CURRENT_USER.name,
      authorRole: CURRENT_USER.role,
      authorAvatar: CURRENT_USER.avatar,
      text: text.trim(),
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
    showToast('Comment posted! 💬');
  };

  // Like a Comment
  const handleLikeComment = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c.id === commentId) {
              const isLiked = !c.isLiked;
              return {
                ...c,
                isLiked,
                likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
              };
            }
            return c;
          })
        };
      }
      return post;
    }));
  };

  // Submit New Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    let linkedTaskData: LinkedTaskInfo | undefined = undefined;
    if (newPostTaskTitle.trim()) {
      linkedTaskData = {
        taskNumber: 'TSK-' + Math.floor(10000 + Math.random() * 90000),
        taskTitle: newPostTaskTitle.trim(),
        assignedTo: CURRENT_USER.name,
        priority: 'High',
        status: 'Completed',
        reply: {
          authorName: CURRENT_USER.name,
          authorRole: CURRENT_USER.role,
          authorAvatar: CURRENT_USER.avatar,
          text: newPostTaskReply.trim() || 'Work verified and completed on schedule. Operational status updated.',
          timestamp: 'Just now'
        }
      };
    } else {
      // Default auto-linked dispatch task for completeness
      linkedTaskData = {
        taskNumber: 'TSK-' + Math.floor(10000 + Math.random() * 90000),
        taskTitle: `Yard Operation Dispatch • ${newPostFacility}`,
        assignedTo: CURRENT_USER.name,
        priority: 'Medium',
        status: 'Completed',
        reply: {
          authorName: CURRENT_USER.name,
          authorRole: CURRENT_USER.role,
          authorAvatar: CURRENT_USER.avatar,
          text: 'Field update logged and verified on terminal ledger.',
          timestamp: 'Just now'
        }
      };
    }

    const captionText = newPostCaption.trim() || `${newPostText.trim()} #StorageYard #ContainerYard #LogisticsOperations`;

    const newPost: FeedItem = {
      id: 'feed-' + Date.now(),
      timestamp: 'Just now',
      category: newPostCategory,
      title: newPostText.slice(0, 45) + (newPostText.length > 45 ? '...' : ''),
      description: newPostText,
      caption: captionText,
      facilityName: newPostFacility,
      containerNumber: newPostContainer || undefined,
      actorName: CURRENT_USER.name,
      actorRole: CURRENT_USER.role,
      actorAvatar: CURRENT_USER.avatar,
      severity: newPostCategory === 'AI_ALERT' ? 'danger' : 'info',
      image: newPostImage || undefined,
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      linkedTask: linkedTaskData,
      comments: [],
      actionable: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostCaption('');
    setNewPostTaskTitle('');
    setNewPostTaskReply('');
    setNewPostImage(null);
    setNewPostContainer('');
    setShowPhotoPicker(false);
    setShowTaskComposer(false);
    showToast('✨ Your yard update has been shared with task status!');
  };

  // Quick Emoji for comments
  const handleAddEmoji = (postId: string, emoji: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: (prev[postId] || '') + emoji
    }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'SAVED') return post.isSaved;
    if (activeTab === 'MEDIA') return !!post.image;
    if (activeTab === 'ALL') return true;
    return post.category === activeTab;
  });

  const getCategoryBadge = (cat: FeedCategory) => {
    switch (cat) {
      case 'GATE_MOVE':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Gate Move</span>;
      case 'INSPECTION':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><ClipboardCheck className="w-3 h-3" /> Inspection</span>;
      case 'AI_ALERT':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Alert</span>;
      case 'RENTAL_PAYMENT':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><DollarSign className="w-3 h-3" /> Lease / Payment</span>;
      case 'MAINTENANCE':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Wrench className="w-3 h-3" /> Maintenance</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Yard Update</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
      <Sidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          facilities={INITIAL_FACILITIES}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={setSelectedFacilityId}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-5 overflow-y-auto">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-white border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed Column (Left / Center) */}
            <div className="lg:col-span-2 space-y-5">
              {/* 1. Create Post Card with Task Attachment & Captions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <textarea
                      rows={2}
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder="Share a yard update, gate arrival, inspection photo, or safety alert..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
                    />

                    {/* Optional Post Caption Input */}
                    <input
                      type="text"
                      value={newPostCaption}
                      onChange={(e) => setNewPostCaption(e.target.value)}
                      placeholder="Add photo caption & hashtags (e.g. #AustinPort #DoorGasketPassed)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />

                    {/* Task Attachment Drawer Toggle */}
                    {showTaskComposer && (
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                            <Pin className="w-3 h-3 text-blue-600" />
                            Attach Dispatch Task & Field Reply (Appears on top of post)
                          </span>
                          <button onClick={() => setShowTaskComposer(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={newPostTaskTitle}
                          onChange={(e) => setNewPostTaskTitle(e.target.value)}
                          placeholder="Task Title (e.g. Container ATX-2004 Seal Overhaul)..."
                          className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newPostTaskReply}
                          onChange={(e) => setNewPostTaskReply(e.target.value)}
                          placeholder="Field Tech Reply (e.g. Replaced seal with marine EPDM. Verified airtight.)..."
                          className="w-full bg-white border border-blue-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Attached Photo Preview */}
                    {newPostImage && (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40 group">
                        <img src={newPostImage} alt="Attachment" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewPostImage(null)}
                          className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full hover:bg-slate-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Preset Photo Picker Drawer */}
                    {showPhotoPicker && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Select a photo from yard camera:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_PHOTOS.map((src, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setNewPostImage(src); setShowPhotoPicker(false); }}
                              className="h-16 rounded-lg overflow-hidden border border-slate-200 hover:border-blue-500 transition-all group relative"
                            >
                              <img src={src} alt="Preset" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Composer Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {/* Attach photo */}
                        <button
                          type="button"
                          onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                            newPostImage ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[11px]">{newPostImage ? 'Photo Attached' : 'Photo'}</span>
                        </button>

                        {/* Attach Task Button */}
                        <button
                          type="button"
                          onClick={() => setShowTaskComposer(!showTaskComposer)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                            showTaskComposer || newPostTaskTitle ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[11px]">Task & Reply</span>
                        </button>

                        {/* Tag container */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Tag Unit # (e.g. ATX-2004)"
                            value={newPostContainer}
                            onChange={(e) => setNewPostContainer(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 placeholder-slate-400 w-32 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Category tag selector */}
                        <select
                          value={newPostCategory}
                          onChange={(e) => setNewPostCategory(e.target.value as FeedCategory)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="GENERAL">General</option>
                          <option value="GATE_MOVE">Gate Move</option>
                          <option value="INSPECTION">Inspection</option>
                          <option value="AI_ALERT">AI Safety</option>
                          <option value="RENTAL_PAYMENT">Lease</option>
                          <option value="MAINTENANCE">Maintenance</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreatePost}
                        disabled={!newPostText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Feed Navigation Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                {[
                  { id: 'ALL', label: 'All Posts' },
                  { id: 'MEDIA', label: '📸 Photos Only' },
                  { id: 'GATE_MOVE', label: 'Gate Moves' },
                  { id: 'INSPECTION', label: 'Inspections' },
                  { id: 'AI_ALERT', label: 'AI Alerts' },
                  { id: 'SAVED', label: '🔖 Bookmarks' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 3. Instagram Post Cards Stream */}
              <div className="space-y-6">
                {filteredPosts.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2 shadow-xs">
                    <p className="text-sm font-semibold text-slate-800">No posts in this category yet</p>
                    <p className="text-xs text-slate-500">Be the first to share an update from the storage yard!</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => {
                    const isCommentsOpen = !!expandedComments[post.id];
                    const currentCommentText = commentInputs[post.id] || '';

                    return (
                      <article
                        key={post.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                      >
                        {/* 📌 TOP OF POST: PINNED TASK & FIELD REPLY BANNER */}
                        {post.linkedTask && (
                          <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50/80 border-b border-blue-100 p-3.5 space-y-2.5">
                            {/* Task Headline */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-blue-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                                  <Pin className="w-2.5 h-2.5" />
                                  {post.linkedTask.taskNumber}
                                </span>
                                <span className="font-bold text-xs text-slate-900">
                                  {post.linkedTask.taskTitle}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500">Assigned: <strong className="text-slate-800">{post.linkedTask.assignedTo}</strong></span>
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                  {post.linkedTask.status}
                                </span>
                              </div>
                            </div>

                            {/* Field Reply to Task */}
                            {post.linkedTask.reply && (
                              <div className="bg-white/90 border border-blue-200/70 rounded-xl p-2.5 flex items-start gap-2.5 shadow-2xs">
                                <CornerDownRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div className="flex-1 text-xs">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="font-bold text-blue-900 text-[11px] flex items-center gap-1.5">
                                      {post.linkedTask.reply.authorAvatar && (
                                        <img src={post.linkedTask.reply.authorAvatar} alt="" className="w-4 h-4 rounded-full object-cover inline" />
                                      )}
                                      {post.linkedTask.reply.authorName} <span className="text-[10px] font-normal text-slate-500">({post.linkedTask.reply.authorRole})</span>
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-mono">{post.linkedTask.reply.timestamp}</span>
                                  </div>
                                  <p className="text-slate-700 text-xs leading-relaxed">
                                    "{post.linkedTask.reply.text}"
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Post Header */}
                        <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500">
                              <img
                                src={post.actorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={post.actorName}
                                className="w-8 h-8 rounded-full object-cover border border-white"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-xs text-slate-900">{post.actorName}</span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500">{post.actorRole}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-rose-500" />
                                {post.facilityName || 'Global Network'} • {post.timestamp}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getCategoryBadge(post.category)}
                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Post Media (Image) */}
                        {post.image && (
                          <div
                            onDoubleClick={() => handleToggleLike(post.id)}
                            className="relative bg-slate-950 max-h-96 overflow-hidden cursor-pointer select-none group"
                          >
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-80 object-cover group-hover:scale-[1.01] transition-transform duration-300"
                            />
                            {post.containerNumber && (
                              <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-white/10">
                                Unit #{post.containerNumber}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Post Social Action Bar (Like, Comment, Share, Save) */}
                        <div className="p-3.5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Like Heart Button */}
                              <button
                                onClick={() => handleToggleLike(post.id)}
                                className={`flex items-center gap-1.5 transition-transform active:scale-125 ${
                                  post.isLiked ? 'text-rose-600' : 'text-slate-600 hover:text-rose-600'
                                }`}
                              >
                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current text-rose-600' : ''}`} />
                                <span className="text-xs font-semibold">{post.likesCount}</span>
                              </button>

                              {/* Comment Button */}
                              <button
                                onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                                className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors"
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-xs font-semibold">{post.comments.length}</span>
                              </button>

                              {/* Share Button */}
                              <button
                                onClick={() => showToast('Link copied to clipboard!')}
                                className="text-slate-600 hover:text-slate-900 transition-colors"
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Bookmark Button */}
                            <button
                              onClick={() => handleToggleSave(post.id)}
                              className={`transition-colors ${
                                post.isSaved ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current text-amber-600' : ''}`} />
                            </button>
                          </div>

                          {/* 💬 CAPTION BELOW POST (Instagram Style) */}
                          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px] mb-0.5">
                              <MessageSquare className="w-3 h-3 text-blue-600" />
                              <span>Post Caption:</span>
                            </div>
                            <p className="text-slate-800 leading-relaxed text-xs">
                              <strong className="font-bold text-slate-900 mr-1.5">{post.actorName}</strong>
                              {post.caption || post.description}
                            </p>

                            {/* Tagged Meta pills */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 text-[10px]">
                              {post.containerNumber && (
                                <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  #{post.containerNumber}
                                </span>
                              )}
                              <span className="text-slate-500 font-medium">📍 {post.facilityName}</span>
                              <span className="text-slate-400 ml-auto font-mono">{post.timestamp}</span>
                            </div>
                          </div>

                          {/* Interactive Comments Thread */}
                          <div className="border-t border-slate-100 pt-2.5 space-y-2">
                            {post.comments.length > 0 && !isCommentsOpen && (
                              <button
                                onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: true }))}
                                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                View all {post.comments.length} comments
                              </button>
                            )}

                            {isCommentsOpen && post.comments.map((cmt) => (
                              <div key={cmt.id} className="flex items-start justify-between gap-2 text-xs py-1">
                                <div className="flex items-start gap-2">
                                  <img
                                    src={cmt.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                    alt={cmt.authorName}
                                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                  />
                                  <div>
                                    <p className="text-slate-800 leading-snug">
                                      <strong className="font-bold text-slate-900 mr-1">{cmt.authorName}</strong>
                                      {cmt.text}
                                    </p>
                                    <span className="text-[9px] text-slate-400 mt-0.5 block">{cmt.timestamp}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleLikeComment(post.id, cmt.id)}
                                  className={`flex items-center gap-1 text-[10px] p-1 ${
                                    cmt.isLiked ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${cmt.isLiked ? 'fill-current text-rose-600' : ''}`} />
                                  {cmt.likes > 0 && <span>{cmt.likes}</span>}
                                </button>
                              </div>
                            ))}

                            {/* Inline Comment Composer */}
                            <div className="flex items-center gap-2 pt-1">
                              <img
                                src={CURRENT_USER.avatar}
                                alt="You"
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 focus-within:border-blue-500 focus-within:bg-white transition-all">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={currentCommentText}
                                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                  className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                                />
                                <div className="flex items-center gap-1 text-slate-400">
                                  {['👏', '🚛', '📦'].map(emoji => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => handleAddEmoji(post.id, emoji)}
                                      className="text-xs hover:scale-125 transition-transform"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddComment(post.id)}
                                disabled={!currentCommentText.trim()}
                                className="text-blue-600 hover:text-blue-700 disabled:opacity-40 font-bold text-xs px-2 py-1 transition-all"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Social Sidebar Column */}
            <div className="space-y-5 hidden lg:block">
              {/* Profile Snapshot Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{CURRENT_USER.name}</h3>
                    <p className="text-xs text-slate-500">{CURRENT_USER.role}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online • Control Tower
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Field Personnel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs text-slate-900">Yard Staff Online</h4>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">4 Active</span>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { name: 'Jason Miller', role: 'Yard Manager', yard: 'Austin Port', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
                    { name: 'Carlos Ramirez', role: 'Field Tech Lead', yard: 'Austin Port', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
                    { name: 'Sarah Jenkins', role: 'Operations', yard: 'Long Beach', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
                    { name: 'David Miller', role: 'Tenant Rep', yard: 'Boulder Const', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
                  ].map((staff) => (
                    <div key={staff.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{staff.name}</p>
                          <p className="text-[10px] text-slate-400">{staff.role} • {staff.yard}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Paging ${staff.name}...`)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-all"
                      >
                        Ping
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Yard Topics */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    Trending in Yards
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { tag: '#ATX2004Repair', count: '14 updates', desc: 'Door seal overhaul & inspection' },
                    { tag: '#LongBeachReefer', count: '9 updates', desc: 'IoT temperature anomaly check' },
                    { tag: '#Gate2Checkin', count: '28 gate moves', desc: 'Morning tractor haul arrivals' },
                    { tag: '#Q3LeaseRenewals', count: '6 contracts', desc: 'Commercial customer renewals' }
                  ].map((t) => (
                    <div key={t.tag} className="p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="font-bold text-blue-700">{t.tag}</p>
                      <p className="text-[11px] text-slate-600">{t.desc}</p>
                      <span className="text-[9px] text-slate-400">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        facilities={INITIAL_FACILITIES}
        containers={INITIAL_CONTAINERS}
        customers={INITIAL_CUSTOMERS}
        tasks={INITIAL_TASKS}
      />
    </div>
  );
}
