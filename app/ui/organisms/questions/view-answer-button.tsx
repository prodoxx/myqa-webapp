import { Unlock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/ui/atoms/button';
import { Dialog, DialogContent } from '~/ui/molecules/dialog';
import { ViewAnswer } from './view-answer';

interface QuestionCardProps {
  id: number;
  question: string;
  ownerOnlyAnswer?: string;
}

export function ViewAnswerButton({
  id,
  question,
  ownerOnlyAnswer,
}: QuestionCardProps) {
  const [showView, setShowView] = useState(false);

  return (
    <div className="space-y-4">
      <Button variant="default" onClick={() => setShowView(true)}>
        <Unlock className="mr-2 h-4 w-4" />
        View Answer
      </Button>

      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent className="p-0 border-none bg-transparent">
          <ViewAnswer
            questionId={id}
            question={question}
            onClose={() => setShowView(false)}
            ownerOnlyAnswer={ownerOnlyAnswer}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
