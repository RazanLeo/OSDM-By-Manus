import { useState } from 'react';
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { MessageCircle, Send, Search } from 'lucide-react';

export default function Messages() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');

  const { data: allConversations = [], isLoading: convsLoading } = trpc.conversations.list.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const { data: messages = [], isLoading: messagesLoading } = trpc.conversations.messages.useQuery(
    { conversationId: selectedChat ?? 0 },
    { enabled: selectedChat !== null, refetchInterval: 5000 },
  );

  const sendMutation = trpc.conversations.send.useMutation({
    onSuccess: () => {
      utils.conversations.messages.invalidate();
      utils.conversations.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || t('فشل إرسال الرسالة', 'Failed to send message'));
    },
  });

  const formatTime = (d: string | Date) =>
    new Date(d).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'short', timeStyle: 'short' });

  const conversations = allConversations.filter((conv) =>
    (conv.otherUserName ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const selectedConv = conversations.find((c) => c.id === selectedChat) ?? allConversations.find((c) => c.id === selectedChat);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat !== null && !sendMutation.isPending) {
      sendMutation.mutate({ conversationId: selectedChat, message: messageText.trim() });
      setMessageText('');
    }
  };

  return (
    <OSDMDashboardLayout>
      <div className="h-[calc(100vh-12rem)]">
        <Card className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="border-r">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-4">
                  {t('الرسائل', 'Messages')}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('بحث...', 'Search...')}
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-8rem)]">
                {convsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {t('لا توجد محادثات بعد', 'No conversations yet')}
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                        selectedChat === conv.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>{(conv.otherUserName ?? '?')[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold truncate">{conv.otherUserName ?? t('مستخدم', 'User')}</p>
                            <span className="text-xs text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage ?? ''}</p>
                            {conv.unread > 0 && (
                              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {(selectedConv?.otherUserName ?? '?')[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {selectedConv?.otherUserName ?? t('مستخدم', 'User')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedConv?.lastMessageAt
                            ? `${t('آخر رسالة', 'Last message')}: ${formatTime(selectedConv.lastMessageAt)}`
                            : t('نشط الآن', 'Active now')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.senderId === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-accent'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className="text-xs mt-1 opacity-70">{formatTime(msg.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('اكتب رسالتك...', 'Type your message...')}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        className="bg-osdm-blue hover:bg-osdm-blue/90"
                        disabled={sendMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>{t('اختر محادثة لبدء المراسلة', 'Select a conversation to start messaging')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </OSDMDashboardLayout>
  );
}
