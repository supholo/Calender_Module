# Implementation Guidelines for Working Hours Query

## Validation Rules

1. Date Range Validation
   - Start date must be before or equal to end date
   - Maximum date range span (e.g., 1 year)
   - Dates must be valid calendar dates

2. Branch Validation
   - Branch must exist and be active
   - User must have access to the branch

## Error Handling

```typescript
enum WorkingHoursErrorCode {
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  DATE_RANGE_TOO_LARGE = 'DATE_RANGE_TOO_LARGE',
  BRANCH_NOT_FOUND = 'BRANCH_NOT_FOUND',
  UNAUTHORIZED_BRANCH_ACCESS = 'UNAUTHORIZED_BRANCH_ACCESS'
}
```

## Performance Optimization

1. Query Optimization
   - Index on (branch_code, calendar_date)
   - Index on (calendar_id) in labor_working_hours
   - Partition large tables by branch and/or year

2. Caching Strategy
   ```typescript
   const cacheKey = `working-hours:${branchCode}:${startDate}:${endDate}`;
   const cacheTTL = 3600; // 1 hour
   ```

## Example Usage

```graphql
query GetWorkingHours($input: DateRangeInput!) {
  getWorkingHours(input: {
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    branchCode: "BR001"
  }) {
    totalHours
    uom
    details {
      date
      hours
      uom
      status {
        code
        name
      }
      isWorkingDay
    }
  }
}
```

## Response Example

```json
{
  "data": {
    "getWorkingHours": {
      "totalHours": 168.0,
      "uom": "HOURS",
      "details": [
        {
          "date": "2024-01-01",
          "hours": 0.0,
          "uom": "HOURS",
          "status": {
            "code": "HOLIDAY",
            "name": "Public Holiday"
          },
          "isWorkingDay": false
        },
        {
          "date": "2024-01-02",
          "hours": 8.0,
          "uom": "HOURS",
          "status": {
            "code": "WORKING",
            "name": "Working Day"
          },
          "isWorkingDay": true
        }
      ]
    }
  }
}
```