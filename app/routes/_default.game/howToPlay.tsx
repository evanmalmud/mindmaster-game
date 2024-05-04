import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';

export function HowToPlay() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How To Play</DialogTitle>
          <DialogDescription>Explain How to Play</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
