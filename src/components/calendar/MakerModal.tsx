import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface MakerModalProps {
  showMakerModal: boolean;
  setShowMakerModal: (show: boolean) => void;
  selectedDateInfo: any;
  makerDescription: string;
  setMakerDescription: (description: string) => void;
  handleMakerSubmit: () => void;
}

export const MakerModal: React.FC<MakerModalProps> = ({
  showMakerModal,
  setShowMakerModal,
  selectedDateInfo,
  makerDescription,
  setMakerDescription,
  handleMakerSubmit,
}) => {
  return (
    <Dialog open={showMakerModal} onOpenChange={setShowMakerModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Date Status</DialogTitle>
        </DialogHeader>
        {selectedDateInfo && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{selectedDateInfo.date}</span>
              <Badge variant={selectedDateInfo.currentStatus ? "default" : "secondary"}>
                {selectedDateInfo.currentStatus ? "Working" : "Non-Working"}
              </Badge>
            </div>
            <Textarea
              placeholder="Description for status change"
              value={makerDescription}
              onChange={(e) => setMakerDescription(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button onClick={() => setShowMakerModal(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleMakerSubmit} disabled={!makerDescription}>
                Submit Change
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}