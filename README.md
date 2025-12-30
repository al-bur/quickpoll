# QuickPoll

A minimalist, real-time polling application. Create instant polls and share them with anyone.

## Features

- **Instant Creation** - Create a poll in seconds, no account needed
- **Real-time Results** - Watch votes come in live
- **Easy Sharing** - Share via link, works on any device
- **Auto Expiration** - Set polls to close automatically

## Tech Stack

- Next.js 14
- Tailwind CSS
- Supabase (Database + Realtime)
- Framer Motion
- ReactBits components

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your Supabase credentials
4. Run the development server: `npm run dev`

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
