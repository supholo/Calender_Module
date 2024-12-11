import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface RejectModalProps {
  showRejectModal: boolean;
  setShowRejectModal: (show: boolean) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  handleRejectConfirm: () => void;
  setSelectedRejectItem: (id: number | null) => void;
}

export const RejectModal: React.FC<RejectModalProps> = ({
  showRejectModal,
  setShowRejectModal,
  rejectReason,
  setRejectReason,
  handleRejectConfirm,
  setSelectedRejectItem,
}) => {
  return (
    <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Please provide a reason for rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button onClick={() => {
              setShowRejectModal(false);
              setRejectReason('');
              setSelectedRejectItem(null);
            }} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim()}
              variant="destructive"
            >
              Reject
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}