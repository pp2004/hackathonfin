import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ClientData } from "@/hooks/use-client-data";

interface ChatInterfaceProps {
  clientData: ClientData | null;
}

export function ChatInterface({ clientData }: ChatInterfaceProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI investment assistant. How can I help you with your portfolio today?`
    }
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const chatMutation = useMutation({
    mutationFn: async ({ clientId, message }: { clientId: number, message: string }) => {
      const response = await apiRequest('POST', '/api/chat', { clientId, message });
      return response.json();
    },
    onSuccess: (data) => {
      setChatHistory(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      ]);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/clients', clientData?.client?.clientId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !clientData?.client?.id) return;

    chatMutation.mutate({
      clientId: clientData.client.id,
      message: message.trim()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {t('ai_assistant')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-start space-x-3 ${chat.role === 'user' ? 'justify-end' : ''}`}
                >
                  {chat.role === 'assistant' && (
                    <div className="w-8 h-8 bg-[var(--ubs-red)] rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`rounded-lg p-3 max-w-md ${
                    chat.role === 'user' 
                      ? 'bg-[var(--ubs-red)] text-white' 
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    <p className="text-sm">{chat.content}</p>
                  </div>
                  {chat.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-[var(--ubs-red)] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your portfolio, risk analysis, or investment recommendations..."
              className="flex-1"
              disabled={chatMutation.isPending || !clientData?.client?.id}
            />
            <Button 
              type="submit" 
              className="bg-[var(--ubs-red)] hover:bg-[var(--ubs-red-dark)]"
              disabled={chatMutation.isPending || !message.trim() || !clientData?.client?.id}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
