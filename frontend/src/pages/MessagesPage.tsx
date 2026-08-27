import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { INITIAL_FACILITIES, INITIAL_CONTAINERS, INITIAL_CUSTOMERS, INITIAL_TASKS } from '@/lib/mockData';
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Circle,
  Building2,
  Users,
  Smile
} from 'lucide-react';

interface ChatThread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  type: 'direct' | 'facility' | 'customer';
  unreadCount?: number;
  lastMessage: string;
  lastMessageTime: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'th-1',
    name: 'Austin Yard Operations',
    role: 'Austin Port Terminal Yard',
    avatar: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150',
    online: true,
    type: 'facility',
    unreadCount: 2,
    lastMessage: 'Gate 2 check-in completed for unit #ATX-2024.',
    lastMessageTime: '10:42 AM'
  },
  {
    id: 'th-2',
    name: 'Jason Miller',
    role: 'Facility Manager (Austin)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    online: true,
    type: 'direct',
    lastMessage: 'All scheduled morning transfers are clear.',
    lastMessageTime: '10:15 AM'
  },
  {
    id: 'th-3',
    name: 'Sarah Connor',
    role: 'Apex Global Logistics',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    online: true,
    type: 'customer',
    lastMessage: 'Thanks for confirming the bay assignment!',
    lastMessageTime: 'Yesterday'
  },
  {
    id: 'th-4',
    name: 'Carlos Ramirez',
    role: 'Lead Field Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    online: false,
    type: 'direct',
    lastMessage: 'Inspection report for ATX-2004 submitted.',
    lastMessageTime: 'Yesterday'
  },
  {
    id: 'th-5',
    name: 'Sarah Jenkins',
    role: 'Facility Manager (Long Beach)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    online: true,
    type: 'direct',
    lastMessage: 'Long Beach fill rate hit 90% this morning.',
    lastMessageTime: 'Aug 24'
  },
  {
    id: 'th-6',
    name: 'David Miller',
    role: 'Boulder Construction LLC',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    online: false,
    type: 'customer',
    lastMessage: 'Need to add two additional 40ft units next week.',
    lastMessageTime: 'Aug 22'
  }
];

const INITIAL_MESSAGES_MAP: Record<string, Message[]> = {
  'th-1': [
    { id: 'm-1', senderId: 'jason', senderName: 'Jason Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Morning team! Yard status check: Gate 1 and Gate 2 are operating at normal throughput.', timestamp: '09:30 AM', isMe: false },
    { id: 'm-2', senderId: 'carlos', senderName: 'Carlos Ramirez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', text: 'Gasket replacement on ATX-2004 completed. Forklift operator moving it to Bay 4.', timestamp: '10:05 AM', isMe: false },
    { id: 'm-3', senderId: 'me', senderName: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', text: 'Excellent turnaround. Let us ensure the arrival logs for Apex Logistics are updated promptly.', timestamp: '10:20 AM', isMe: true },
    { id: 'm-4', senderId: 'jason', senderName: 'Jason Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Gate 2 check-in completed for unit #ATX-2024. RFID synced with customer account.', timestamp: '10:42 AM', isMe: false },
  ],
  'th-2': [
    { id: 'm-201', senderId: 'jason', senderName: 'Jason Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Hi Eleanor, reviewing the Q3 container utilization targets.', timestamp: '09:45 AM', isMe: false },
    { id: 'm-202', senderId: 'me', senderName: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', text: 'Austin is looking strong at 79% occupancy. Keep up the great work.', timestamp: '10:00 AM', isMe: true },
    { id: 'm-203', senderId: 'jason', senderName: 'Jason Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'All scheduled morning transfers are clear.', timestamp: '10:15 AM', isMe: false },
  ],
  'th-3': [
    { id: 'm-301', senderId: 'sarah', senderName: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Hello! Our freight driver is arriving around 11 AM for bay transfer.', timestamp: 'Yesterday', isMe: false },
    { id: 'm-302', senderId: 'me', senderName: 'Eleanor Vance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', text: 'Hi Sarah, bay 2 has been reserved and cleared for your arrival.', timestamp: 'Yesterday', isMe: true },
    { id: 'm-303', senderId: 'sarah', senderName: 'Sarah Connor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Thanks for confirming the bay assignment!', timestamp: 'Yesterday', isMe: false },
  ]
};

import { useRole } from '@/lib/RoleContext';

export function MessagesPage() {
  const { role: currentRole, setRole: setCurrentRole } = useRole();
  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'customer' | 'facility'>('all');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES_MAP);
  const [inputText, setInputText] = useState('');

  const activeThread = INITIAL_THREADS.find(t => t.id === activeThreadId) || INITIAL_THREADS[0];
  const activeMessages = messagesMap[activeThreadId] || [];

  const filteredThreads = INITIAL_THREADS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Eleanor Vance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      text: inputText.trim(),
      timestamp: 'Just now',
      isMe: true
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMsg]
    }));

    setInputText('');
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

        <main className="flex-1 flex overflow-hidden p-6 gap-5">
          {/* Left Panel: Conversation List */}
          <div className="w-80 bg-white border border-slate-200 rounded-2xl flex flex-col shadow-xs overflow-hidden shrink-0">
            {/* Thread Header & Search */}
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Messages</h2>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {INITIAL_THREADS.length} Active
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'direct', label: 'Staff' },
                  { id: 'customer', label: 'Clients' },
                  { id: 'facility', label: 'Yards' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id as any)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${filterType === tab.id
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${isActive ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50/80'
                      }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={thread.avatar}
                        alt={thread.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      {thread.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`text-xs truncate ${isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                          {thread.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                          {thread.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mb-1">
                        {thread.role}
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        {thread.lastMessage}
                      </p>
                    </div>

                    {thread.unreadCount && thread.unreadCount > 0 && (
                      <span className="shrink-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {thread.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Active Chat Canvas */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col shadow-xs overflow-hidden">
            {/* Active Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  {activeThread.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeThread.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>{activeThread.role}</span>
                    <span>•</span>
                    <span className={activeThread.online ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                      {activeThread.online ? 'Online now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message History Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              <div className="text-center my-2">
                <span className="text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
                  Today
                </span>
              </div>

              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <img
                      src={msg.avatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 mb-1 shrink-0"
                    />
                  )}

                  <div className={`max-w-md ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!msg.isMe && (
                      <span className="text-[10px] text-slate-500 font-semibold mb-1 ml-1">
                        {msg.senderName}
                      </span>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${msg.isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                        }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {msg.isMe && <CheckCheck className="w-3 h-3 text-blue-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeThread.name}...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
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

export default MessagesPage;
