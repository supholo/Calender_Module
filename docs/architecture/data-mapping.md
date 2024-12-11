# Data Mapping and Processing Guidelines

## Database Operations Mapping

### 1. Calendar Change Submission

```typescript
interface CalendarChangeMapping {
  // Input mapping to CALENDAR_MASTER
  calendarMaster: {
    calendar_date: input.date,
    branch_code: input.branchCode,
    status_code: input.statusCode,
    is_working_day: determineFromStatus(input.statusCode),
    description: input.description,
    is_pending: true,
    maker_comment: input.makerComment,
    version: 1
  };

  // Input mapping to LABOR_WORKING_HOURS
  laborWorkingHours: {
    working_hours: input.workingHours.hours,
    working_hours_uom: input.workingHours.uom,
    is_active: true
  };

  // Input mapping to APPROVAL_HISTORY
  approvalHistory: {
    calendar_date: input.date,
    branch_code: input.branchCode,
    action: 'PENDING',
    old_status: currentStatus,
    new_status: input.statusCode,
    old_working_hours: currentHours,
    new_working_hours: input.workingHours.hours,
    maker_comment: input.makerComment
  };
}
```

### 2. Approval Processing

```typescript
interface ApprovalProcessingMapping {
  // Update CALENDAR_MASTER
  calendarMaster: {
    is_pending: false,
    is_approved: input.action === 'APPROVED',
    is_rejected: input.action === 'REJECTED',
    checker_comment: input.checkerComment,
    reject_reason: input.rejectReason,
    version: currentVersion + 1
  };

  // Update LABOR_WORKING_HOURS
  laborWorkingHours: {
    is_active: input.action === 'APPROVED'
  };

  // Create APPROVAL_HISTORY
  approvalHistory: {
    calendar_date: input.date,
    branch_code: input.branchCode,
    action: input.action,
    old_status: currentStatus,
    new_status: currentStatus,
    old_working_hours: currentHours,
    new_working_hours: currentHours,
    checker_comment: input.checkerComment,
    reject_reason: input.rejectReason
  };
}
```

## Transaction Management

1. Calendar Change Submission
   ```sql
   BEGIN TRANSACTION;
     -- Insert into CALENDAR_MASTER
     -- Insert into LABOR_WORKING_HOURS
     -- Insert into APPROVAL_HISTORY
   COMMIT;
   ```

2. Bulk Approval Processing
   ```sql
   BEGIN TRANSACTION;
     FOR EACH entry IN bulkApprovalInput.entries:
       -- Update CALENDAR_MASTER
       -- Update LABOR_WORKING_HOURS
       -- Insert into APPROVAL_HISTORY
   COMMIT;
   ```

## Validation Rules

1. Working Hours Validation
   - Default to 8 hours for working days
   - Must be 0 for non-working days
   - UOM must be 'HOURS'
   - Cannot be negative

2. Date-based Validations
   - Unique composite key: (calendar_date, branch_code)
   - Cannot modify past dates
   - Cannot have gaps in calendar dates

3. Status Transitions
   ```typescript
   const validTransitions = {
     PENDING: ['APPROVED', 'REJECTED'],
     APPROVED: [],  // Cannot change approved status
     REJECTED: ['PENDING']  // Can resubmit rejected entries
   };
   ```

## Error Handling

```typescript
enum CalendarErrorCode {
  INVALID_WORKING_HOURS = 'INVALID_WORKING_HOURS',
  DATE_ALREADY_EXISTS = 'DATE_ALREADY_EXISTS',
  PAST_DATE_MODIFICATION = 'PAST_DATE_MODIFICATION',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  CALENDAR_GAP_DETECTED = 'CALENDAR_GAP_DETECTED'
}
```