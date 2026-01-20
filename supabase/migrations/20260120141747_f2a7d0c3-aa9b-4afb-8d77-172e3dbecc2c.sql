-- Fix function search_path warnings
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql set search_path = public;

create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (user_id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Health Official'));
    
    insert into public.user_roles (user_id, role)
    values (new.id, 'officer');
    
    return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Fix overly permissive RLS policies for case_details insert
drop policy if exists "Authenticated users can insert case details" on public.case_details;
create policy "Authenticated users can insert case details"
    on public.case_details for insert
    to authenticated
    with check (
        exists (
            select 1 from public.outbreak_reports 
            where id = outbreak_report_id 
            and (reported_by = auth.uid() or public.has_role(auth.uid(), 'admin'))
        )
    );

-- Fix overly permissive alerts update policy
drop policy if exists "Authenticated users can acknowledge alerts" on public.alerts;
create policy "Authenticated users can acknowledge alerts"
    on public.alerts for update
    to authenticated
    using (is_active = true)
    with check (acknowledged_by = auth.uid());