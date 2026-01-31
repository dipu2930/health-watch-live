-- Helper function to check if user is in a jurisdiction based on state
CREATE OR REPLACE FUNCTION public.user_in_state_jurisdiction(_state_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.states s ON s.code = p.state_code
    WHERE p.user_id = auth.uid()
    AND (s.id = _state_id OR p.state_code IS NULL) -- NULL state_code means national level access
  ) OR has_role(auth.uid(), 'admin')
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view case details" ON public.case_details;
DROP POLICY IF EXISTS "Authenticated users can view outbreak reports" ON public.outbreak_reports;
DROP POLICY IF EXISTS "Authenticated users can view nlp signals" ON public.nlp_signals;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create jurisdiction-based SELECT policy for case_details
-- Users can only view case details from outbreak reports within their state jurisdiction
CREATE POLICY "Users can view case details in their jurisdiction"
  ON public.case_details
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.outbreak_reports o
      WHERE o.id = case_details.outbreak_report_id
      AND (
        user_in_state_jurisdiction(o.state_id)
        OR o.reported_by = auth.uid()
      )
    )
  );

-- Create jurisdiction-based SELECT policy for outbreak_reports
-- Users can only view outbreak reports within their state jurisdiction
CREATE POLICY "Users can view outbreak reports in their jurisdiction"
  ON public.outbreak_reports
  FOR SELECT
  TO authenticated
  USING (
    user_in_state_jurisdiction(state_id)
    OR reported_by = auth.uid()
  );

-- Create jurisdiction-based SELECT policy for nlp_signals
-- Users can only view NLP signals from their state or signals with no state assigned
CREATE POLICY "Users can view nlp signals in their jurisdiction"
  ON public.nlp_signals
  FOR SELECT
  TO authenticated
  USING (
    state_id IS NULL 
    OR user_in_state_jurisdiction(state_id)
  );

-- Tighten profiles SELECT policy - users can only view their own profile
-- Admins still handled via the admin ALL policy
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));