-- Create a safer SECURITY INVOKER alternative for checking current user's role
-- This prevents the risk of checking arbitrary user roles
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = _role
  )
$$;

-- Add input validation to the existing has_role function
-- Also add a comment warning about security review requirements
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- SECURITY WARNING: This function uses SECURITY DEFINER and bypasses RLS.
  -- Any modifications to this function MUST undergo security review.
  -- The function is intentionally kept simple to minimize attack surface.
  SELECT CASE 
    WHEN _user_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
      AND role = _role
    )
  END
$$;

-- Grant execute permission on the new function to authenticated users
GRANT EXECUTE ON FUNCTION public.current_user_has_role(app_role) TO authenticated;