# TestLift (Next.js + Supabase + Anthropic + Stripe)

TestLift converts manual QA test case files (Excel/CSV/Word) into Selenium
scripts using AI.

Workflow:
1. Upload
2. Process
3. Review
4. Configure
5. Push
6. Complete

## Tech stack
- Next.js 15 (App Router)
- Supabase (Postgres + storage + edge function)
- Anthropic Claude API
- Stripe checkout/webhooks

## Environment variables
Copy `.env.example` to `.env.local` and populate:

```bash
cp .env.example .env.local
```

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (set to `https://testlift.dev` in production)
- `ANTHROPIC_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Local run
```bash
npm install
npm run dev
```

## Supabase setup
Project ref: `bceakoyhlyytqowvflsg`

### 1) Apply database migration
Run SQL in `supabase/migrations/202604150001_create_testlift_core.sql`.

### 2) Deploy edge function
Function path:
`supabase/functions/parse-test-cases/index.ts`

Deploy with Supabase CLI:
```bash
supabase functions deploy parse-test-cases
```

Set secrets for function execution:
```bash
supabase secrets set ANTHROPIC_API_KEY=...
supabase secrets set SUPABASE_ANON_KEY=...
```

## API routes included
- `POST /api/upload` → upload + parse + persist parsed results
- `POST /api/approve` → mark test case approved
- `POST /api/generate` → generate Selenium code
- `POST /api/push` → mark script pushed to repo
- `POST /api/stripe/checkout` → create Stripe checkout session
- `POST /api/stripe/webhook` → Stripe webhook receiver

## Notes
- The UI is at `/stage1` and supports `.xlsx`, `.csv`, `.docx`.
- Edge function authorization requires:
  - `Authorization: Bearer <NEXT_PUBLIC_SUPABASE_ANON_KEY>`
  - `apikey: <NEXT_PUBLIC_SUPABASE_ANON_KEY>`
