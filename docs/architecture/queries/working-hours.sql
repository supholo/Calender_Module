-- Query to get working hours for a date range
WITH calendar_hours AS (
  SELECT 
    cm.calendar_date,
    cm.is_working_day,
    cm.status_code,
    sm.name as status_name,
    COALESCE(lw.working_hours, 
      CASE 
        WHEN cm.is_working_day = true THEN 8.0 
        ELSE 0.0 
      END
    ) as working_hours,
    COALESCE(lw.working_hours_uom, 'HOURS') as working_hours_uom
  FROM calendar_master cm
  LEFT JOIN labor_working_hours lw ON cm.id = lw.calendar_id
  JOIN status_master sm ON cm.status_code = sm.code
  WHERE 
    cm.branch_code = :branchCode
    AND cm.calendar_date BETWEEN :startDate AND :endDate
    AND cm.is_approved = true
    AND (lw.is_active IS NULL OR lw.is_active = true)
  ORDER BY cm.calendar_date
)
SELECT 
  -- Summary
  SUM(working_hours) as total_hours,
  MAX(working_hours_uom) as uom,
  -- Daily details
  json_agg(
    json_build_object(
      'date', calendar_date,
      'hours', working_hours,
      'uom', working_hours_uom,
      'status', json_build_object(
        'code', status_code,
        'name', status_name
      ),
      'isWorkingDay', is_working_day
    )
  ) as details
FROM calendar_hours;