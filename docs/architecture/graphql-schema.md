# GraphQL Schema

## Types

```graphql
type Calendar {
  date: Date!
  branch: Branch!
  status: Status!
  isWorkingDay: Boolean!
  description: String
  isPending: Boolean!
  isApproved: Boolean!
  isRejected: Boolean!
  rejectReason: String
  makerComment: String
  checkerComment: String
  workingHours: WorkingHours!
  createdAt: DateTime!
  createdBy: String!
  updatedAt: DateTime!
  updatedBy: String!
  version: Int!
}

type WorkingHours {
  hours: Decimal!
  uom: String!
}

type WorkingHoursSummary {
  totalHours: Decimal!
  uom: String!
  details: [DailyWorkingHours!]!
}

type DailyWorkingHours {
  date: Date!
  hours: Decimal!
  uom: String!
  status: Status!
  isWorkingDay: Boolean!
}

input DateRangeInput {
  startDate: Date!
  endDate: Date!
  branchCode: ID!
}

type Query {
  # Existing queries...

  # Get working hours for a date range
  getWorkingHours(input: DateRangeInput!): WorkingHoursSummary!
}

# ... rest of the schema remains the same
```