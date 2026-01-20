-- =============================================
-- BHARAT-NIDHI Database Schema
-- National Integrated Disease & Health Intelligence
-- =============================================

-- 1. USER ROLES ENUM AND TABLE
create type public.app_role as enum ('admin', 'officer');

create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null default 'officer',
    created_at timestamp with time zone not null default now(),
    unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- 2. PROFILES TABLE
create table public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    full_name text not null,
    designation text,
    department text,
    state_code text,
    district text,
    phone text,
    avatar_url text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;

-- 3. STATES TABLE
create table public.states (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    name text not null,
    population bigint,
    area_sqkm integer,
    capital text,
    health_facilities_count integer default 0,
    created_at timestamp with time zone not null default now()
);

alter table public.states enable row level security;

-- 4. DISTRICTS TABLE
create table public.districts (
    id uuid primary key default gen_random_uuid(),
    state_id uuid references public.states(id) on delete cascade not null,
    name text not null,
    population bigint,
    health_facilities_count integer default 0,
    created_at timestamp with time zone not null default now()
);

alter table public.districts enable row level security;

-- 5. DISEASES TABLE
create table public.diseases (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    icd_code text,
    category text,
    transmission_type text,
    incubation_days_min integer,
    incubation_days_max integer,
    symptoms text[],
    is_notifiable boolean default true,
    created_at timestamp with time zone not null default now()
);

alter table public.diseases enable row level security;

-- 6. OUTBREAK REPORTS TABLE
create table public.outbreak_reports (
    id uuid primary key default gen_random_uuid(),
    disease_id uuid references public.diseases(id) not null,
    state_id uuid references public.states(id) not null,
    district_id uuid references public.districts(id),
    reported_by uuid references auth.users(id),
    case_count integer not null default 0,
    death_count integer default 0,
    recovered_count integer default 0,
    hospitalized_count integer default 0,
    severity text check (severity in ('low', 'medium', 'high', 'critical')),
    status text default 'active' check (status in ('active', 'contained', 'resolved')),
    report_date date not null default current_date,
    latitude decimal(10, 7),
    longitude decimal(10, 7),
    notes text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

alter table public.outbreak_reports enable row level security;

-- 7. CASE DETAILS TABLE (individual cases with symptoms & lab results)
create table public.case_details (
    id uuid primary key default gen_random_uuid(),
    outbreak_report_id uuid references public.outbreak_reports(id) on delete cascade not null,
    patient_age integer,
    patient_gender text check (patient_gender in ('male', 'female', 'other')),
    symptoms text[],
    symptom_onset_date date,
    lab_test_type text,
    lab_result text check (lab_result in ('positive', 'negative', 'pending', 'inconclusive')),
    lab_test_date date,
    outcome text check (outcome in ('active', 'recovered', 'deceased', 'transferred')),
    hospitalized boolean default false,
    icu_required boolean default false,
    contact_traced boolean default false,
    contacts_identified integer default 0,
    created_at timestamp with time zone not null default now()
);

alter table public.case_details enable row level security;

-- 8. WEATHER DATA TABLE (for correlation analysis)
create table public.weather_data (
    id uuid primary key default gen_random_uuid(),
    state_id uuid references public.states(id) not null,
    record_date date not null,
    temperature_min decimal(5, 2),
    temperature_max decimal(5, 2),
    temperature_avg decimal(5, 2),
    rainfall_mm decimal(8, 2),
    humidity_percent integer,
    air_quality_index integer,
    created_at timestamp with time zone not null default now(),
    unique (state_id, record_date)
);

alter table public.weather_data enable row level security;

-- 9. NLP SIGNALS TABLE (detected health signals from media)
create table public.nlp_signals (
    id uuid primary key default gen_random_uuid(),
    source text not null check (source in ('news', 'social', 'radio', 'official')),
    language text not null,
    content text not null,
    translated_content text,
    location_detected text,
    state_id uuid references public.states(id),
    disease_keywords text[],
    sentiment text check (sentiment in ('positive', 'negative', 'neutral')),
    relevance_score integer check (relevance_score >= 0 and relevance_score <= 100),
    verified boolean default false,
    source_url text,
    detected_at timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now()
);

alter table public.nlp_signals enable row level security;

-- 10. ALERTS TABLE
create table public.alerts (
    id uuid primary key default gen_random_uuid(),
    type text not null check (type in ('critical', 'warning', 'info')),
    title text not null,
    description text,
    state_id uuid references public.states(id),
    district_id uuid references public.districts(id),
    disease_id uuid references public.diseases(id),
    outbreak_report_id uuid references public.outbreak_reports(id),
    is_active boolean default true,
    acknowledged_by uuid references auth.users(id),
    acknowledged_at timestamp with time zone,
    created_at timestamp with time zone not null default now()
);

alter table public.alerts enable row level security;

-- 11. PREDICTIONS TABLE
create table public.predictions (
    id uuid primary key default gen_random_uuid(),
    disease_id uuid references public.diseases(id) not null,
    state_id uuid references public.states(id) not null,
    prediction_date date not null,
    predicted_cases integer not null,
    confidence_lower integer,
    confidence_upper integer,
    model_version text,
    accuracy_score decimal(5, 2),
    created_at timestamp with time zone not null default now(),
    unique (disease_id, state_id, prediction_date)
);

alter table public.predictions enable row level security;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- User Roles: Admins can manage, users can view own
create policy "Admins can manage user roles"
    on public.user_roles for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

create policy "Users can view own role"
    on public.user_roles for select
    to authenticated
    using (user_id = auth.uid());

-- Profiles: Users manage own, admins see all
create policy "Users can view own profile"
    on public.profiles for select
    to authenticated
    using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Users can update own profile"
    on public.profiles for update
    to authenticated
    using (user_id = auth.uid());

create policy "Users can insert own profile"
    on public.profiles for insert
    to authenticated
    with check (user_id = auth.uid());

-- States: All authenticated users can read
create policy "Authenticated users can view states"
    on public.states for select
    to authenticated
    using (true);

create policy "Admins can manage states"
    on public.states for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Districts: All authenticated users can read
create policy "Authenticated users can view districts"
    on public.districts for select
    to authenticated
    using (true);

create policy "Admins can manage districts"
    on public.districts for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Diseases: All authenticated users can read
create policy "Authenticated users can view diseases"
    on public.diseases for select
    to authenticated
    using (true);

create policy "Admins can manage diseases"
    on public.diseases for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Outbreak Reports: All can read, officers can insert, admins can manage
create policy "Authenticated users can view outbreak reports"
    on public.outbreak_reports for select
    to authenticated
    using (true);

create policy "Officers can create outbreak reports"
    on public.outbreak_reports for insert
    to authenticated
    with check (auth.uid() = reported_by);

create policy "Officers can update own outbreak reports"
    on public.outbreak_reports for update
    to authenticated
    using (reported_by = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete outbreak reports"
    on public.outbreak_reports for delete
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Case Details: Same as outbreak reports
create policy "Authenticated users can view case details"
    on public.case_details for select
    to authenticated
    using (true);

create policy "Authenticated users can insert case details"
    on public.case_details for insert
    to authenticated
    with check (true);

create policy "Admins can manage case details"
    on public.case_details for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Weather Data: All can read, admins can manage
create policy "Authenticated users can view weather data"
    on public.weather_data for select
    to authenticated
    using (true);

create policy "Admins can manage weather data"
    on public.weather_data for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- NLP Signals: All can read, system/admins can insert
create policy "Authenticated users can view nlp signals"
    on public.nlp_signals for select
    to authenticated
    using (true);

create policy "Admins can manage nlp signals"
    on public.nlp_signals for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Alerts: All can read, admins can manage
create policy "Authenticated users can view alerts"
    on public.alerts for select
    to authenticated
    using (true);

create policy "Authenticated users can acknowledge alerts"
    on public.alerts for update
    to authenticated
    using (true);

create policy "Admins can manage alerts"
    on public.alerts for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- Predictions: All can read, admins can manage
create policy "Authenticated users can view predictions"
    on public.predictions for select
    to authenticated
    using (true);

create policy "Admins can manage predictions"
    on public.predictions for all
    to authenticated
    using (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.update_updated_at_column();

create trigger update_outbreak_reports_updated_at
    before update on public.outbreak_reports
    for each row
    execute function public.update_updated_at_column();

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (user_id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Health Official'));
    
    insert into public.user_roles (user_id, role)
    values (new.id, 'officer');
    
    return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- Enable realtime for critical tables
alter publication supabase_realtime add table public.alerts;
alter publication supabase_realtime add table public.outbreak_reports;
alter publication supabase_realtime add table public.nlp_signals;