Motivator Telegram Bot Mini Project:
- Next.js + TypeScript + Vercel Cron + Telegram Bot API -

A simple, serverless app that sends you motivational messages directly to your Telegram 3× per day.
Built using Next.js API routes and Vercel Cron, this project demonstrates automation, API integration, and cloud deployment.

Features:
*Automated messages — scheduled 3 times a day
*Telegram integration — instant, free notifications to your phone
*No repeats — avoids sending the same quote twice in a row
*Secure — secrets stored in .env.local and Vercel env vars
*Serverless — deploys on Vercel with zero maintenance

How It Works:

You create a Telegram bot using @BotFather and get a bot token.

You message your bot once → Telegram assigns your unique chat ID.

The app uses that token + chat ID to send messages with Telegram’s API.

Vercel Cron Jobs trigger /api/cron 3× daily (9 AM, 1 PM, 6 PM PT).

Each trigger picks a random motivational quote and sends it to you.

Setup
1. Clone and install
git clone https://github.com/yourusername/motivator-telegram.git
cd motivator-telegram
npm install

2. Create a Telegram Bot

In Telegram, search for @BotFather.

Run /newbot, follow the prompts, and copy your bot token.

Send your bot any message (like “hi”).

Open this URL in your browser:

https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates


Copy the "chat":{"id": ...} number — that’s your chat ID.

3. Configure environment variables

Create a file called .env.local:

TELEGRAM_BOT_TOKEN=123456:ABCDEF...
TELEGRAM_CHAT_ID=987654321
TARGET_NAME=Saul

4. Run locally
npm run dev


Then visit:

http://localhost:3000/api/send

Boom, done.