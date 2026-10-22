"""
Rainbow HR - Demo Data Seeder
=============================

Upayogam:
    python manage.py seed_demo_data

Ithu cheyyunnathu:
  1. Existing ella Job um Category um delete cheyyunnu (duplicate / pazhaya test data ozhivakkaan).
  2. Multi-industry Categories (Lucide icon identifiers sahitham) create cheyyunnu.
  3. Different industries-il ninnulla professional demo job posts create cheyyunnu
     (approval_status='Approved', is_active=True) - ava homepage-ilum
     job listing pages-ilum nalla pole kaanikkum.

    python manage.py seed_demo_data --keep-users
      -> poster accounts create cheyyilla; DB-il already ulla employer/staff-ne use cheyyum.
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from accounts.models import EmployerProfile, UserProfile
from jobs.models import Category, Job

User = get_user_model()

# Fallback demo accounts - DB-il employer/staff illenkil mathram create cheyyunnu.
DEMO_PASSWORD = 'Demo@12345'
DEMO_POSTERS = [
    ('demo_employer_tech', 'employer', "TechNova Solutions", 'IT & Software', 'Kochi'),
    ('demo_employer_care', 'employer', "Sunrise Health Group", 'Healthcare', 'Kozhikode'),
    ('demo_staff_hr', 'staff', None, None, None),
]

# (Category name, Lucide icon identifier)
CATEGORIES = [
    ('IT & Software', 'Code'),
    ('Healthcare & Nursing', 'HeartPulse'),
    ('Finance & Banking', 'TrendingUp'),
    ('Sales & Marketing', 'Briefcase'),
    ('Education & Teaching', 'GraduationCap'),
    ('Hospitality & Hotel Management', 'Utensils'),
    ('Logistics & Operations', 'Truck'),
    ('Human Resources', 'Users'),
]

# Oru job-inu vendi default aayi set cheyyunna perks.
DEFAULT_PERKS = {
    'leave_policy': '12 days paid leave / year',
    'provident_fund': True,
    'health_insurance': True,
}

# Demo job posts - elaa category-ilum 2 jobs vee-tham, 3 job types-um cover cheyyunnu.
DEMO_JOBS = [
    # --- IT & Software ---
    {
        'category': 'IT & Software',
        'title': 'Software Engineer',
        'company_name': 'TechNova Solutions',
        'location': 'Kochi',
        'job_type': 'Full-time',
        'salary_range': '₹45,000 - ₹75,000 / month',
        'qualification': 'B.Tech / B.E in Computer Science or equivalent',
        'experience_required': '2 - 5 years',
        'fresher_allowed': False,
        'description': (
            'We are looking for a Software Engineer to design, build and maintain '
            'scalable web applications. You will collaborate with product and design '
            'teams to ship reliable features, write clean testable code and take part '
            'in code reviews.'
        ),
        'requirements': (
            'Strong knowledge of JavaScript / Python\n'
            'Experience with React and REST APIs\n'
            'Understanding of relational databases and Git workflows\n'
            'Good problem solving and communication skills'
        ),
        'perks': {'travel_allowance': True},
        'has_incentives': True,
        'incentive_details': 'Performance bonus up to 10% of annual CTC',
    },
    {
        'category': 'IT & Software',
        'title': 'Full Stack Developer',
        'company_name': 'CloudSprint Technologies',
        'location': 'Remote',
        'job_type': 'Remote',
        'salary_range': '₹60,000 - ₹95,000 / month',
        'qualification': 'Any graduate with strong portfolio',
        'experience_required': '3+ years',
        'fresher_allowed': False,
        'description': (
            'Join our distributed engineering team to build end-to-end features across '
            'React frontends and Django services. This is a fully remote role with '
            'flexible working hours and a strong async culture.'
        ),
        'requirements': (
            'Hands-on experience with React, Django / DRF\n'
            'Comfortable with PostgreSQL and Docker\n'
            'Experience working in remote teams\n'
            'Self-driven with strong ownership'
        ),
        'perks': {'travel_allowance': False},
    },
    # --- Healthcare & Nursing ---
    {
        'category': 'Healthcare & Nursing',
        'title': 'Staff Nurse',
        'company_name': 'Sunrise Multispeciality Hospital',
        'location': 'Kozhikode',
        'job_type': 'Full-time',
        'salary_range': '₹22,000 - ₹32,000 / month',
        'qualification': 'GNM / B.Sc Nursing with valid Kerala Nursing Council registration',
        'experience_required': '0 - 2 years',
        'fresher_allowed': True,
        'description': (
            'Provide compassionate bedside care to patients in the inpatient department. '
            'Responsibilities include monitoring vitals, administering medication, '
            'assisting doctors during rounds and maintaining accurate patient records.'
        ),
        'requirements': (
            'Valid nursing registration certificate\n'
            'Willingness to work rotational shifts\n'
            'Good patient communication in Malayalam and English\n'
            'Basic computer literacy for record keeping'
        ),
        'perks': {'accommodation': True, 'food_provided': True},
    },
    {
        'category': 'Healthcare & Nursing',
        'title': 'Medical Lab Technician',
        'company_name': 'CareWell Diagnostics',
        'location': 'Thrissur',
        'job_type': 'Full-time',
        'salary_range': '₹18,000 - ₹26,000 / month',
        'qualification': 'DMLT / B.Sc MLT',
        'experience_required': '1 - 3 years',
        'fresher_allowed': True,
        'description': (
            'Perform routine and specialised laboratory investigations, maintain '
            'equipment calibration logs and ensure accurate reporting of test results '
            'to the consulting physician.'
        ),
        'requirements': (
            'Experience with haematology and biochemistry analysers\n'
            'Knowledge of quality control procedures\n'
            'Attention to detail and record accuracy'
        ),
        'perks': {'food_provided': True},
    },
    # --- Finance & Banking ---
    {
        'category': 'Finance & Banking',
        'title': 'Financial Analyst',
        'company_name': 'Meridian Capital Ltd',
        'location': 'Bangalore',
        'job_type': 'Full-time',
        'salary_range': '₹50,000 - ₹80,000 / month',
        'qualification': 'MBA Finance / CA Inter / CFA Level 1',
        'experience_required': '2 - 4 years',
        'fresher_allowed': False,
        'description': (
            'Analyse financial statements, build forecasting models and prepare '
            'investment summaries for the portfolio team. You will work closely with '
            'senior analysts to support client advisory mandates.'
        ),
        'requirements': (
            'Advanced Excel and financial modelling skills\n'
            'Strong understanding of valuation techniques\n'
            'Excellent written and verbal communication\n'
            'Attention to detail under tight deadlines'
        ),
        'perks': {'travel_allowance': True},
        'has_incentives': True,
        'incentive_details': 'Annual performance-linked bonus',
    },
    {
        'category': 'Finance & Banking',
        'title': 'Accounts Executive',
        'company_name': 'LedgerPro Financial Services',
        'location': 'Kochi',
        'job_type': 'Full-time',
        'salary_range': '₹25,000 - ₹38,000 / month',
        'qualification': 'B.Com with Tally ERP experience',
        'experience_required': '2 - 5 years',
        'fresher_allowed': False,
        'description': (
            'Manage day-to-day bookkeeping, GST filings, vendor reconciliation and '
            'monthly closing entries. Support the finance manager in preparing MIS '
            'reports for management review.'
        ),
        'requirements': (
            'Proficiency in Tally ERP 9 / Prime\n'
            'Working knowledge of GST and TDS compliance\n'
            'MS Excel skills (VLOOKUP, pivot tables)\n'
            'Organised and deadline driven'
        ),
        'perks': {'food_provided': True},
    },
    # --- Sales & Marketing ---
    {
        'category': 'Sales & Marketing',
        'title': 'Digital Marketing Manager',
        'company_name': 'Brandwave Media',
        'location': 'Remote',
        'job_type': 'Remote',
        'salary_range': '₹55,000 - ₹85,000 / month',
        'qualification': 'Any graduate with digital marketing certifications',
        'experience_required': '4+ years',
        'fresher_allowed': False,
        'description': (
            'Own the paid and organic growth strategy across Google, Meta and LinkedIn. '
            'You will plan campaigns, manage budgets, analyse funnel performance and '
            'lead a small content team.'
        ),
        'requirements': (
            'Proven track record managing performance marketing budgets\n'
            'Hands-on with Google Ads, Meta Business Suite and GA4\n'
            'Strong analytical and reporting skills\n'
            'Experience leading a team remotely'
        ),
        'perks': {'travel_allowance': False},
        'has_incentives': True,
        'incentive_details': 'Team performance incentive, reviewed quarterly',
    },
    {
        'category': 'Sales & Marketing',
        'title': 'Business Development Executive',
        'company_name': 'GrowFast Enterprises',
        'location': 'Kozhikode',
        'job_type': 'Full-time',
        'salary_range': '₹25,000 - ₹40,000 / month',
        'qualification': 'Any degree; MBA Marketing preferred',
        'experience_required': '1 - 3 years',
        'fresher_allowed': True,
        'description': (
            'Generate and qualify leads, conduct client meetings and close new business '
            'for our SME product line. A field-oriented role with clear growth into '
            'regional sales leadership.'
        ),
        'requirements': (
            'Confident in client-facing communication\n'
            'Two-wheeler with valid licence preferred\n'
            'Target driven mindset\n'
            'Fluency in Malayalam and English'
        ),
        'perks': {'travel_allowance': True, 'dearness_allowance': True},
        'has_incentives': True,
        'incentive_details': 'Attractive monthly incentive on every closed deal',
    },
    # --- Education & Teaching ---
    {
        'category': 'Education & Teaching',
        'title': 'High School Teacher (Mathematics)',
        'company_name': 'Bright Minds Public School',
        'location': 'Kannur',
        'job_type': 'Full-time',
        'salary_range': '₹28,000 - ₹42,000 / month',
        'qualification': 'B.Ed with M.Sc / B.Sc Mathematics',
        'experience_required': '2 - 6 years',
        'fresher_allowed': False,
        'description': (
            'Teach Mathematics to classes 8 to 10 following the state syllabus. '
            'Design lesson plans, assess student progress and coordinate with parents '
            'to support learning outcomes.'
        ),
        'requirements': (
            'B.Ed qualification is mandatory\n'
            'Strong classroom management skills\n'
            'Prior CBSE / State board teaching experience\n'
            'Patience and a mentoring approach'
        ),
        'perks': {'accommodation': True, 'food_provided': True},
    },
    {
        'category': 'Education & Teaching',
        'title': 'Spoken English Trainer',
        'company_name': 'LinguaEdge Academy',
        'location': 'Kochi',
        'job_type': 'Part-time',
        'salary_range': '₹15,000 - ₹25,000 / month',
        'qualification': 'Any graduate with CELTA / TEFL certification preferred',
        'experience_required': '1+ years',
        'fresher_allowed': True,
        'description': (
            'Conduct evening spoken English batches for working professionals and '
            'students. Sessions run four days a week with flexible scheduling for the '
            'right candidate.'
        ),
        'requirements': (
            'Neutral, clear English pronunciation\n'
            'Comfortable handling batches of 15 - 20 learners\n'
            'Available between 5 PM and 9 PM\n'
            'Friendly and encouraging teaching style'
        ),
        'perks': {},
    },
    # --- Hospitality & Hotel Management ---
    {
        'category': 'Hospitality & Hotel Management',
        'title': 'Hotel Manager',
        'company_name': 'The Backwater Grand',
        'location': 'Kovalam',
        'job_type': 'Full-time',
        'salary_range': '₹45,000 - ₹70,000 / month',
        'qualification': 'BHM / Diploma in Hotel Management',
        'experience_required': '5+ years',
        'fresher_allowed': False,
        'description': (
            'Lead the daily operations of a 60-room resort property. You will manage '
            'front office, housekeeping and F&B teams, drive occupancy targets and '
            'maintain guest satisfaction standards.'
        ),
        'requirements': (
            'Proven experience managing a hotel or resort property\n'
            'Strong team leadership and rostering skills\n'
            'Revenue and cost management exposure\n'
            'Excellent guest handling ability'
        ),
        'perks': {'accommodation': True, 'food_provided': True, 'health_insurance': True},
        'has_incentives': True,
        'incentive_details': 'Quarterly incentive linked to occupancy and guest ratings',
    },
    {
        'category': 'Hospitality & Hotel Management',
        'title': 'Front Office Executive',
        'company_name': 'Seaside Residency Hotel',
        'location': 'Kozhikode',
        'job_type': 'Full-time',
        'salary_range': '₹20,000 - ₹30,000 / month',
        'qualification': 'Any graduate; hospitality diploma preferred',
        'experience_required': '0 - 2 years',
        'fresher_allowed': True,
        'description': (
            'Be the first point of contact for our guests. Handle check-in and check-out, '
            'room reservations, guest queries and coordinate with housekeeping for '
            'smooth service delivery.'
        ),
        'requirements': (
            'Pleasant communication and presentable manner\n'
            'Willingness to work rotational shifts\n'
            'Basic knowledge of hotel booking software\n'
            'Malayalam, English and Hindi preferred'
        ),
        'perks': {'food_provided': True, 'accommodation': True},
    },
    # --- Logistics & Operations ---
    {
        'category': 'Logistics & Operations',
        'title': 'Delivery Operations Lead',
        'company_name': 'SwiftRoute Logistics',
        'location': 'Bangalore',
        'job_type': 'Full-time',
        'salary_range': '₹40,000 - ₹60,000 / month',
        'qualification': 'Any graduate; MBA Operations preferred',
        'experience_required': '3 - 6 years',
        'fresher_allowed': False,
        'description': (
            'Own last-mile delivery performance for the city cluster. Manage rider '
            'rostering, track SLA adherence, reduce delivery failures and drive '
            'cost-per-shipment improvements.'
        ),
        'requirements': (
            'Experience in last-mile or e-commerce operations\n'
            'Comfortable with operations dashboards and Excel\n'
            'Strong people management on the ground\n'
            'Ability to handle peak-season pressure'
        ),
        'perks': {'travel_allowance': True, 'provident_fund': True},
    },
    {
        'category': 'Logistics & Operations',
        'title': 'Warehouse Supervisor',
        'company_name': 'CargoLink Supply Chain',
        'location': 'Kollam',
        'job_type': 'Full-time',
        'salary_range': '₹25,000 - ₹35,000 / month',
        'qualification': 'Any degree / diploma',
        'experience_required': '2 - 4 years',
        'fresher_allowed': False,
        'description': (
            'Supervise inbound and outbound warehouse activities, maintain inventory '
            'accuracy, ensure safety compliance and coordinate dispatch schedules with '
            'the transport desk.'
        ),
        'requirements': (
            'Experience with warehouse management systems\n'
            'Knowledge of FIFO and stock rotation practices\n'
            'Ability to lead a shift team of 15+ staff\n'
            'Familiarity with safety norms'
        ),
        'perks': {'food_provided': True, 'travel_allowance': True},
    },
    # --- Human Resources ---
    {
        'category': 'Human Resources',
        'title': 'HR Executive',
        'company_name': 'PeopleFirst Consultancy',
        'location': 'Kochi',
        'job_type': 'Full-time',
        'salary_range': '₹30,000 - ₹45,000 / month',
        'qualification': 'MBA HR / MSW',
        'experience_required': '2 - 4 years',
        'fresher_allowed': False,
        'description': (
            'Handle end-to-end recruitment, onboarding, attendance and payroll inputs '
            'for client organisations. You will also support employee engagement '
            'initiatives and HR documentation.'
        ),
        'requirements': (
            'Experience with recruitment and onboarding cycles\n'
            'Knowledge of Kerala labour regulations and PF / ESI\n'
            'Good interpersonal and documentation skills\n'
            'Proficiency in MS Office'
        ),
        'perks': {'provident_fund': True},
    },
    {
        'category': 'Human Resources',
        'title': 'Talent Acquisition Specialist',
        'company_name': 'HireRight Staffing',
        'location': 'Remote',
        'job_type': 'Remote',
        'salary_range': '₹35,000 - ₹55,000 / month',
        'qualification': 'Any graduate; HR certification preferred',
        'experience_required': '3+ years',
        'fresher_allowed': False,
        'description': (
            'Partner with hiring managers to define role requirements, source candidates '
            'through multiple channels, run structured interviews and manage the offer '
            'to onboarding journey.'
        ),
        'requirements': (
            'Experience hiring for technical and non-technical roles\n'
            'Hands-on with Naukri, LinkedIn Recruiter and ATS tools\n'
            'Strong candidate assessment skills\n'
            'Comfortable working async in a remote setup'
        ),
        'perks': {},
        'has_incentives': True,
        'incentive_details': 'Per-joining incentive for hard-to-fill roles',
    },
]


class Command(BaseCommand):
    help = (
        'Delete all existing Jobs and Categories, then seed fresh multi-industry '
        'demo categories and approved demo job posts.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--keep-users',
            action='store_true',
            help='Poster accounts create cheyyilla; DB-il ulla employer/staff-ne mathram use cheyyum.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        # ---------- 1. Existing data clear cheyyunnu ----------
        old_jobs = Job.objects.count()
        old_categories = Category.objects.count()
        # Job delete cheyyumbol JobApplication / SavedJob / JobView (CASCADE) koode povum.
        Job.objects.all().delete()
        Category.objects.all().delete()
        self.stdout.write(
            self.style.WARNING(
                f'Cleared {old_jobs} job post(s) and {old_categories} category(ies).'
            )
        )

        # ---------- 2. Category-കൾ (Lucide icon identifiers sahitham) ----------
        categories = {}
        for name, icon in CATEGORIES:
            categories[name] = Category.objects.create(name=name, icon=icon)
        self.stdout.write(self.style.SUCCESS(f'Created {len(categories)} categories.'))

        # ---------- 3. Poster accounts ----------
        posters = self._get_posters(create=not options['keep_users'])

        # ---------- 4. Demo job posts ----------
        created = 0
        for index, spec in enumerate(DEMO_JOBS):
            spec = dict(spec)
            category_name = spec.pop('category')
            perks = {**DEFAULT_PERKS, **spec.pop('perks', {})}

            Job.objects.create(
                employer=posters[index % len(posters)],
                category=categories[category_name],
                approval_status='Approved',
                is_active=True,
                **perks,
                **spec,
            )
            created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Created {created} approved demo job posts across {len(categories)} categories.'
            )
        )
        self.stdout.write(
            'Posters used: ' + ', '.join(user.username for user in posters)
        )
        self.stdout.write(self.style.SUCCESS('Demo data seeding complete.'))

    # ------------------------------------------------------------------
    def _get_posters(self, create):
        """Employer / Staff accounts pick cheyyunnu. Aarume illenkil demo accounts undakkunnu."""
        profiles = (
            UserProfile.objects.filter(role__in=['employer', 'staff'])
            .select_related('user')
            .order_by('id')
        )
        posters = [profile.user for profile in profiles]

        if posters:
            return posters

        if not create:
            raise CommandError(
                'No employer/staff accounts found. Run without --keep-users to create demo ones.'
            )

        self.stdout.write(
            self.style.WARNING('No employer/staff found - creating demo poster accounts.')
        )
        for username, role, company_name, industry, location in DEMO_POSTERS:
            user, created_user = User.objects.get_or_create(username=username)
            if created_user:
                user.set_password(DEMO_PASSWORD)
                user.email = f'{username}@example.com'
                user.save()

            UserProfile.objects.get_or_create(user=user, defaults={'role': role})
            if role == 'employer' and company_name:
                EmployerProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'company_name': company_name,
                        'industry': industry,
                        'company_location': location,
                    },
                )
            posters.append(user)

        self.stdout.write(
            self.style.WARNING(f'Demo poster password: {DEMO_PASSWORD}')
        )
        return posters
