'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, MessageCircle, Trash2 } from 'lucide-react';
import { TriageItemWithThread } from '@/lib/types/triage';
import { markTriageResolved } from '@/app/protected/triage/actions';
import { useState } from 'react';

interface ActionCardProps {
  item: TriageItemWithThread;
}

export function ActionCard({ item }: ActionCardProps) {
  const [isResolving, setIsResolving] = useState(false);

  const getPriorityVariant = (priority: number) => {
    if (priority <= 2) return 'destructive';
    if (priority === 3) return 'default';
    return 'secondary';
  };

  const getActionIcon = () => {
    switch (item.action.type) {
      case 'amplify':
        return <TrendingUp className="h-4 w-4" />;
      case 'respond':
        return <MessageCircle className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const handleMarkResolved = async () => {
    setIsResolving(true);
    try {
      await markTriageResolved(item.id);
    } catch (error) {
      console.error('Failed to mark as resolved:', error);
      setIsResolving(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getActionIcon()}
              <CardTitle className="text-lg">{item.thread.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(item.action.priority)}>
                Priority {item.action.priority}
              </Badge>
              <span className="text-sm text-muted-foreground">
                by {item.thread.author}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Summary</p>
          <p className="text-sm text-muted-foreground">{item.action.summary}</p>
        </div>

        {item.action.suggested_reply && (
          <div>
            <p className="text-sm font-medium mb-1">Suggested Reply</p>
            <p className="text-sm text-muted-foreground italic">
              {item.action.suggested_reply}
            </p>
          </div>
        )}

        {item.action.target && (
          <div>
            <p className="text-sm font-medium mb-1">Target</p>
            <p className="text-sm text-muted-foreground">{item.action.target}</p>
          </div>
        )}

        {item.action.evidence && item.action.evidence.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Evidence</p>
            <ul className="list-disc list-inside space-y-1">
              {item.action.evidence.map((evidence, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {evidence}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a
              href={item.thread.external_activity_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Thread
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleMarkResolved}
            disabled={isResolving}
          >
            {isResolving ? 'Marking...' : 'Mark Resolved'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
