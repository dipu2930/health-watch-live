
-- Fix: All SELECT policies are RESTRICTIVE, which means no data is ever returned.
-- We need to drop them and recreate as PERMISSIVE.

-- ALERTS
DROP POLICY IF EXISTS "Authenticated users can view alerts" ON public.alerts;
CREATE POLICY "Authenticated users can view alerts"
  ON public.alerts FOR SELECT
  USING (true);

-- STATES
DROP POLICY IF EXISTS "Authenticated users can view states" ON public.states;
CREATE POLICY "Authenticated users can view states"
  ON public.states FOR SELECT
  USING (true);

-- DISEASES
DROP POLICY IF EXISTS "Authenticated users can view diseases" ON public.diseases;
CREATE POLICY "Authenticated users can view diseases"
  ON public.diseases FOR SELECT
  USING (true);

-- DISTRICTS
DROP POLICY IF EXISTS "Authenticated users can view districts" ON public.districts;
CREATE POLICY "Authenticated users can view districts"
  ON public.districts FOR SELECT
  USING (true);

-- PREDICTIONS
DROP POLICY IF EXISTS "Authenticated users can view predictions" ON public.predictions;
CREATE POLICY "Authenticated users can view predictions"
  ON public.predictions FOR SELECT
  USING (true);

-- WEATHER_DATA
DROP POLICY IF EXISTS "Authenticated users can view weather data" ON public.weather_data;
CREATE POLICY "Authenticated users can view weather data"
  ON public.weather_data FOR SELECT
  USING (true);

-- OUTBREAK_REPORTS
DROP POLICY IF EXISTS "Users can view outbreak reports in their jurisdiction" ON public.outbreak_reports;
CREATE POLICY "Users can view outbreak reports in their jurisdiction"
  ON public.outbreak_reports FOR SELECT
  USING (user_in_state_jurisdiction(state_id) OR (reported_by = auth.uid()));

-- NLP_SIGNALS
DROP POLICY IF EXISTS "Users can view nlp signals in their jurisdiction" ON public.nlp_signals;
CREATE POLICY "Users can view nlp signals in their jurisdiction"
  ON public.nlp_signals FOR SELECT
  USING ((state_id IS NULL) OR user_in_state_jurisdiction(state_id));
