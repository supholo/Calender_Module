import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PendingChangesDialogProps {
  showPendingDialog: boolean;
  setShowPendingDialog: (show: boolean) => void;
  pendingChanges: any[];
  handleRejectClick: (id: number) => void;
  handleItemAction: (id: number, approved: boolean, comment: string) => void;
  handleApproveAll: () => void;
  submitChanges: () => void;
  setPendingChanges: (changes: any) => void;
}

export const PendingChangesDialog: React.FC<PendingChangesDialogProps> = ({
  showPendingDialog,
  setShowPendingDialog,
  pendingChanges,
  handleRejectClick,
  handleItemAction,
  handleApproveAll,
  submitChanges,
  setPendingChanges,
}) => {
  return (
    <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pending Changes for Approval</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {pendingChanges.map((change) => (
              <Card 
                key={change.id}
                className={`
                  ${change.status === 'approved' ? 'bg-green-50' : ''}
                  ${change.status === 'rejected' ? 'bg-red-50' : ''}
                  ${change.status === 'pending' ? 'bg-white' : ''}
                `}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{change.date}</span>
                    <Badge 
                      variant={change.status === 'pending' ? 'default' : 
                              change.status === 'approved' ? 'success' : 'destructive'}
                    >
                      {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Status change: {change.oldStatus ? 'Working' : 'Non-working'} → 
                    {change.newStatus ? 'Working' : 'Non-working'}
                  </CardDescription>
                  <CardDescription>
                    Maker Description: {change.description}
                  </CardDescription>
                  {change.status !== 'pending' && change.comment && (
                    <CardDescription>
                      Comments: {change.comment}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {change.status === 'pending' ? (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectClick(change.id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleItemAction(change.id, true, '')}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPendingChanges(prevChanges =>
                            prevChanges.map(c =>
                              c.id === change.id
                                ? { ...c, status: 'pending', comment: '' }
                                : c
                            )
                          );
                        }}
                        className="flex items-center gap-2"
                      >
                        Reset Action
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {pendingChanges.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No pending changes to review
              </div>
            )}
          </div>
        </div>
        <div className="pt-4 flex justify-end gap-2 border-t">
          <Button
            onClick={handleApproveAll}
            disabled={
              !pendingChanges.some(change => change.status === 'pending') ||
              pendingChanges.some(change => change.status === 'rejected')
            }
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve All
          </Button>
          <Button
            onClick={submitChanges}
            disabled={!pendingChanges.some(change => change.status !== 'pending')}
            className="flex items-center gap-2"
          >
            Submit Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}