-- Query to get pending approvals with counts
WITH pending_calendars AS (
  SELECT 
    lc.calendar_date,
    lc.branch_code,
    lc.date_status_code as old_status_code,
    lc.new_date_status_code as new_status_code,
    lc.holiday_desc,
    lc.date_comment as maker_comment,
    lc.create_date as submitted_at,
    lc.create_user as submitted_by,
    lwh.working_hours as old_working_hours,
    lwh.working_hours_uom as old_working_hours_uom,
    b.name as branch_name,
    ds_old.name as old_status_name,
    ds_new.name as new_status_name
  FROM labor_calendar lc
  LEFT JOIN labor_working_hours lwh ON lc.id = lwh.labor_calendar_id
  JOIN branch b ON lc.branch_code = b.code
  JOIN date_status ds_old ON lc.date_status_code = ds_old.code
  JOIN date_status ds_new ON lc.new_date_status_code = ds_new.code
  WHERE lc.approval_ind = false
    AND (:branch_code IS NULL OR lc.branch_code = :branch_code)
    AND (:start_date IS NULL OR lc.calendar_date >= :start_date)
    AND (:end_date IS NULL OR lc.calendar_date <= :end_date)
)
SELECT 
  -- Total count
  COUNT(*) as total_count,
  
  -- Count by branch
  json_agg(
    DISTINCT jsonb_build_object(
      'branch_code', branch_code,
      'branch_name', branch_name,
      'count', COUNT(*) OVER (PARTITION BY branch_code)
    )
  ) as branch_counts,
  
  -- Count by status
  json_agg(
    DISTINCT jsonb_build_object(
      'status_code', new_status_code,
      'status_name', new_status_name,
      'count', COUNT(*) OVER (PARTITION BY new_status_code)
    )
  ) as status_counts,
  
  -- Detailed pending records
  json_agg(
    jsonb_build_object(
      'date', calendar_date,
      'branch', jsonb_build_object(
        'code', branch_code,
        'name', branch_name
      ),
      'old_status', jsonb_build_object(
        'code', old_status_code,
        'name', old_status_name
      ),
      'new_status', jsonb_build_object(
        'code', new_status_code,
        'name', new_status_name
      ),
      'description', holiday_desc,
      'maker_comment', maker_comment,
      'submitted_at', submitted_at,
      'submitted_by', submitted_by,
      'working_hours', jsonb_build_object(
        'old', old_working_hours,
        'old_uom', old_working_hours_uom
      )
    )
  ) as pending_details
FROM pending_calendars;