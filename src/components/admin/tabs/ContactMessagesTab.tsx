import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreVertical, 
  Mail,
  User,
  Calendar,
  Eye,
  Check,
  Archive,
  Reply,
  Filter,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { safeUpdate } from "@/utils/supabaseUtils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at?: string;
}

interface ContactMessagesTabProps {
  messages: ContactMessage[];
  onMessageUpdate: () => void;
}

export function ContactMessagesTab({ messages, onMessageUpdate }: ContactMessagesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  
  // Debug logging
  console.log('ContactMessagesTab received messages:', messages?.length || 0, messages);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === 'all' ||
      message.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleMessageAction = async (messageId: string, action: 'read' | 'replied' | 'archived') => {
    setLoading(true);
    try {
      let updateData: any = {};
      let successMessage = '';
      
      switch (action) {
        case 'read':
          updateData = { 
            status: 'read', 
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Message marked as read ✅';
          break;
        case 'replied':
          updateData = { 
            status: 'replied', 
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Message marked as replied 📧';
          break;
        case 'archived':
          updateData = { 
            status: 'archived', 
            updated_at: new Date().toISOString() 
          };
          successMessage = 'Message archived 📦';
          break;
      }

      // Update message status in database
      const { error } = await safeUpdate('contact_messages', updateData, [{ column: 'id', value: messageId }]);
      
      if (error) {
        throw error;
      }

      toast.success(successMessage);
      onMessageUpdate();
    } catch (error: any) {
      console.error(`❌ Error updating message:`, error);
      toast.error(`Failed to update message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-green-400 bg-green-400/10';
      case 'read': return 'text-blue-400 bg-blue-400/10';
      case 'replied': return 'text-purple-400 bg-purple-400/10';
      case 'archived': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <MessageCircle className="h-4 w-4" />;
      case 'read': return <Eye className="h-4 w-4" />;
      case 'replied': return <Reply className="h-4 w-4" />;
      case 'archived': return <Archive className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Count messages by status
  const newMessages = messages.filter(m => m.status === 'new').length;
  const readMessages = messages.filter(m => m.status === 'read').length;
  const repliedMessages = messages.filter(m => m.status === 'replied').length;
  const archivedMessages = messages.filter(m => m.status === 'archived').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Messages</h2>
          <p className="text-gray-400 text-sm sm:text-base">Manage messages from your website's contact form</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-dark-200 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm min-w-0 flex-shrink-0"
          >
            <option value="all">All Messages</option>
            <option value="new">New ({newMessages})</option>
            <option value="read">Read ({readMessages})</option>
            <option value="replied">Replied ({repliedMessages})</option>
            <option value="archived">Archived ({archivedMessages})</option>
          </select>
          <div className="relative min-w-0 flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-dark-200 border-gray-700 text-white w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-dark-200 p-3 sm:p-4 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white">{newMessages}</p>
              <p className="text-gray-400 text-xs sm:text-sm">New Messages</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-200 p-3 sm:p-4 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white">{readMessages}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Read</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-200 p-3 sm:p-4 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Reply className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white">{repliedMessages}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Replied</p>
            </div>
          </div>
        </div>
        <div className="bg-dark-200 p-3 sm:p-4 rounded-lg border border-gray-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Archive className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-white">{archivedMessages}</p>
              <p className="text-gray-400 text-xs sm:text-sm">Archived</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-dark-200 border border-gray-800 rounded-lg">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-dark-300">
                <TableHead className="text-gray-300">Contact</TableHead>
                <TableHead className="text-gray-300">Message Preview</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id} className="border-gray-700 hover:bg-dark-300">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-steel/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-steel" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{message.name}</p>
                        <p className="text-gray-400 text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {message.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {message.message.length > 100 
                          ? message.message.substring(0, 100) + '...' 
                          : message.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{formatDate(message.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusIcon(message.status)}
                      <span className="capitalize">{message.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedMessage(message)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-dark-200 border-gray-700">
                          {message.status === 'new' && (
                            <DropdownMenuItem
                              onClick={() => handleMessageAction(message.id, 'read')}
                              disabled={loading}
                              className="text-blue-400 hover:text-blue-300 hover:bg-dark-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          {(message.status === 'read' || message.status === 'new') && (
                            <DropdownMenuItem
                              onClick={() => handleMessageAction(message.id, 'replied')}
                              disabled={loading}
                              className="text-purple-400 hover:text-purple-300 hover:bg-dark-300"
                            >
                              <Reply className="h-4 w-4 mr-2" />
                              Mark as Replied
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleMessageAction(message.id, 'archived')}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-300 hover:bg-dark-300"
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(`mailto:${message.email}?subject=Re: Your message&body=Hi ${message.name},%0A%0AThank you for contacting us.%0A%0ABest regards,%0ASiddhi Vinayaka Steel`)}
                            className="text-steel hover:text-steel-light hover:bg-dark-300"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Reply via Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 p-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className="bg-dark-300 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-steel/20 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-steel" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{message.name}</p>
                    <p className="text-gray-400 text-sm flex items-center truncate">
                      <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{message.email}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                    {getStatusIcon(message.status)}
                    <span className="capitalize hidden sm:inline">{message.status}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-dark-200 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => setSelectedMessage(message)}
                        className="text-steel hover:text-steel-light hover:bg-dark-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Message
                      </DropdownMenuItem>
                      {message.status === 'new' && (
                        <DropdownMenuItem
                          onClick={() => handleMessageAction(message.id, 'read')}
                          disabled={loading}
                          className="text-blue-400 hover:text-blue-300 hover:bg-dark-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      {(message.status === 'read' || message.status === 'new') && (
                        <DropdownMenuItem
                          onClick={() => handleMessageAction(message.id, 'replied')}
                          disabled={loading}
                          className="text-purple-400 hover:text-purple-300 hover:bg-dark-300"
                        >
                          <Reply className="h-4 w-4 mr-2" />
                          Mark as Replied
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleMessageAction(message.id, 'archived')}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-300 hover:bg-dark-300"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`mailto:${message.email}?subject=Re: Your message&body=Hi ${message.name},%0A%0AThank you for contacting us.%0A%0ABest regards,%0ASiddhi Vinayaka Steel`)}
                        className="text-green-400 hover:text-green-300 hover:bg-dark-300"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Reply via Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-300 text-sm line-clamp-3">
                  {message.message.length > 150 
                    ? message.message.substring(0, 150) + '...' 
                    : message.message}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(message.created_at)}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedMessage(message)}
                  className="text-steel hover:text-steel-light h-6 px-2"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            {messages.length === 0 ? (
              <div>
                <p className="text-gray-400 text-lg mb-2">No contact messages yet</p>
                <p className="text-gray-500 text-sm mb-4">Messages from your website's contact form will appear here</p>
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-blue-400 text-sm">
                    💡 <strong>Tip:</strong> Test the contact form on your website to see messages appear here
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-lg">No messages match your filters</p>
                <p className="text-gray-500">Try adjusting your search criteria or status filter</p>
                <p className="text-blue-400 text-sm mt-2">Total messages available: {messages.length}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-dark-200 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-white pr-4">Message Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white flex-shrink-0 h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Name</p>
                    <p className="text-white font-medium break-words">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white break-all">{selectedMessage.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                      {getStatusIcon(selectedMessage.status)}
                      <span className="capitalize">{selectedMessage.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Received</p>
                    <p className="text-white text-sm">{formatDate(selectedMessage.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-400 text-sm mb-2">Message</p>
                  <div className="bg-dark-300 border border-gray-700 rounded-lg p-3 sm:p-4 max-h-64 overflow-y-auto">
                    <p className="text-white whitespace-pre-wrap break-words text-sm sm:text-base">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0A%0AThank you for contacting us.%0A%0ABest regards,%0ASiddhi Vinayaka Steel`)}
                    className="bg-steel hover:bg-steel/80 flex-1 sm:flex-initial"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>
                  {selectedMessage.status !== 'replied' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleMessageAction(selectedMessage.id, 'replied');
                        setSelectedMessage(null);
                      }}
                      className="border-gray-700 text-white hover:bg-dark-300 flex-1 sm:flex-initial"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}