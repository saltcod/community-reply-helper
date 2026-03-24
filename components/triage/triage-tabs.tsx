'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ActionCard } from './action-card';
import { TriageItemWithThread } from '@/lib/types/triage';

interface TriageTabsProps {
  amplifyItems: TriageItemWithThread[];
  respondItems: TriageItemWithThread[];
  deleteItems: TriageItemWithThread[];
}

const filterAiTriaged = (items: TriageItemWithThread[]) =>
  items.filter((item) => item.ai_suggested_reply);

export function TriageTabs({ amplifyItems, respondItems, deleteItems }: TriageTabsProps) {
  const [showOnlyAiTriaged, setShowOnlyAiTriaged] = useState(false);

  const filteredAmplify = showOnlyAiTriaged ? filterAiTriaged(amplifyItems) : amplifyItems;
  const filteredRespond = showOnlyAiTriaged ? filterAiTriaged(respondItems) : respondItems;
  const filteredDelete = showOnlyAiTriaged ? filterAiTriaged(deleteItems) : deleteItems;

  return (
    <Tabs defaultValue="respond" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="respond" className="flex items-center gap-2">
            Respond
            <Badge variant="secondary">{filteredRespond.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="amplify" className="flex items-center gap-2">
            Amplify
            <Badge variant="secondary">{filteredAmplify.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="delete" className="flex items-center gap-2">
            Delete
            <Badge variant="secondary">{filteredDelete.length}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Checkbox
            id="ai-triaged-filter"
            checked={showOnlyAiTriaged}
            onCheckedChange={(checked) => setShowOnlyAiTriaged(checked === true)}
          />
          <Label htmlFor="ai-triaged-filter" className="text-sm cursor-pointer">
            Show only AI triaged
          </Label>
        </div>
      </div>

      <TabsContent value="respond" className="mt-6">
        {filteredRespond.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {showOnlyAiTriaged ? 'No AI triaged respond actions.' : 'No respond actions at this time.'}
          </div>
        ) : (
          <div>
            {filteredRespond.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="amplify" className="mt-6">
        {filteredAmplify.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {showOnlyAiTriaged ? 'No AI triaged amplify actions.' : 'No amplify actions at this time.'}
          </div>
        ) : (
          <div>
            {filteredAmplify.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="delete" className="mt-6">
        {filteredDelete.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {showOnlyAiTriaged ? 'No AI triaged delete actions.' : 'No delete actions at this time.'}
          </div>
        ) : (
          <div>
            {filteredDelete.map((item, index) => (
              <ActionCard key={`${item.id}-${item.action.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
