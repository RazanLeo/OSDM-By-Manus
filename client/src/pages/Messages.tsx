import { useState } from 'react';
import OSDMDashboardLayout from '@/components/OSDMDashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Search } from 'lucide-react';

export default function Messages() {
  const { t } = useLanguage();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');

  // Mock data - replace with real data from API
  const conversations = [
    { id: 1, name: 'أحمد محمد', lastMessage: 'شكراً لك', time: '10:30 ص', unread: 2 },
    { id: 2, name: 'فاطمة علي', lastMessage: 'متى يمكنك التسليم؟', time: 'أمس', unread: 0 },
    { id: 3, name: 'محمد سعيد', lastMessage: 'تم استلام المشروع', time: '2024-01-15', unread: 0 },
  ];

  const messages = selectedChat ? [
    { id: 1, sender: 'other', text: 'مرحباً، هل يمكنك مساعدتي؟', time: '10:00 ص' },
    { id: 2, sender: 'me', text: 'بالتأكيد، كيف يمكنني مساعدتك؟', time: '10:05 ص' },
    { id: 3, sender: 'other', text: 'أحتاج تصميم شعار لشركتي', time: '10:10 ص' },
    { id: 4, sender: 'me', text: 'ممتاز، يمكنني المساعدة. ما هي تفاصيل المشروع؟', time: '10:15 ص' },
  ] : [];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // TODO: Send message via API
      console.log('Sending:', messageText);
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
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-8rem)]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                      selectedChat === conv.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                          {conversations.find(c => c.id === selectedChat)?.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {conversations.find(c => c.id === selectedChat)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('نشط الآن', 'Active now')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-accent'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs mt-1 opacity-70">{msg.time}</p>
                        </div>
                      </div>
                    ))}
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
                      <Button onClick={handleSendMessage} className="bg-osdm-blue hover:bg-osdm-blue/90">
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

