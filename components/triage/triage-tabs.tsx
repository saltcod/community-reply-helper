'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from './action-card';
import { TriageItemWithThread } from '@/lib/types/triage';
import { MessageCircle, TrendingUp, Trash2, Inbox } from 'lucide-react';

interface TriageTabsProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
}

export function TriageTabs({ amplifyItems, respondItems, deleteItems }: TriageTabsProps) {
  const renderEmpty = (type: string) => (
    <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
      <div
        className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <Inbox className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        {`No ${type} actions at this time.`}
      </p>
    </div>
  );

  const renderItems = (items: TriageItemWithThread[]) => (
    <div className="space-y-3" role="list" aria-label="Triage items">
      {items.map((item, index) => (
        <div
          key={`${item.id}-${item.action.type}-${index}`}
          role="listitem"
          className="animate-card-enter"
          style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
        >
          <ActionCard item={item} />
        </div>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="respond" className="w-full">
      <TabsList variant="line" className="h-auto w-full sm:w-auto gap-0 border-b border-border/40 rounded-none p-0 mb-6">
        <TabsTrigger
          value="respond"
          className="rounded-none px-4 py-2.5 gap-2 text-sm"
        >
          <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Respond</span>
          <Badge
            variant="secondary"
            className="ml-0.5 h-5 min-w-[20px] flex items-center justify-center text-[11px] tabular-nums rounded-md"
          >
            {respondItems.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="amplify"
          className="rounded-none px-4 py-2.5 gap-2 text-sm"
        >
          <TrendingUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Amplify</span>
          <Badge
            variant="secondary"
            className="ml-0.5 h-5 min-w-[20px] flex items-center justify-center text-[11px] tabular-nums rounded-md"
          >
            {amplifyItems.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="delete"
          className="rounded-none px-4 py-2.5 gap-2 text-sm"
        >
          <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Delete</span>
          <Badge
            variant="secondary"
            className="ml-0.5 h-5 min-w-[20px] flex items-center justify-center text-[11px] tabular-nums rounded-md"
          >
            {deleteItems.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="respond" className="mt-0">
        {respondItems.length === 0 ? renderEmpty('respond') : renderItems(respondItems)}
      </TabsContent>

      <TabsContent value="amplify" className="mt-0">
        {amplifyItems.length === 0 ? renderEmpty('amplify') : renderItems(amplifyItems)}
      </TabsContent>

      <TabsContent value="delete" className="mt-0">
        {deleteItems.length === 0 ? renderEmpty('delete') : renderItems(deleteItems)}
      </TabsContent>
    </Tabs>
  );
}
