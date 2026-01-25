'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActionCard } from './action-card';
import { TriageItemWithThread } from '@/lib/types/triage';

interface TriageTabsProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
}

export function TriageTabs({ amplifyItems, respondItems, deleteItems }: TriageTabsProps) {
  return (
    <Tabs defaultValue="respond" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="respond" className="flex items-center gap-2">
          Respond
          <Badge variant="secondary">{respondItems.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="amplify" className="flex items-center gap-2">
          Amplify
          <Badge variant="secondary">{amplifyItems.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="delete" className="flex items-center gap-2">
          Delete
          <Badge variant="secondary">{deleteItems.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="respond" className="mt-6">
        {respondItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No respond actions at this time.
          </div>
        ) : (
          <div>
            {respondItems.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="amplify" className="mt-6">
        {amplifyItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No amplify actions at this time.
          </div>
        ) : (
          <div>
            {amplifyItems.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="delete" className="mt-6">
        {deleteItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No delete actions at this time.
          </div>
        ) : (
          <div>
            {deleteItems.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
