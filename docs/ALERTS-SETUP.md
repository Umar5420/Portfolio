# Instant inquiry alerts (email, Telegram, WhatsApp)

When someone submits the contact form, the API Worker saves it to the database **and** sends an alert.
Every channel is optional. Set up one or more. If none are set, nothing changes. If a channel fails, the visitor still sees success and the inquiry is still saved (check Admin → Inquiries).

Secrets are set on the **API Worker** (not Pages):

    npx wrangler secret put <NAME> --config wrangler.api.toml
    npx wrangler deploy --config wrangler.api.toml      # redeploy once after adding secrets

## 1. Email (Resend, free tier)
1. Create an account at resend.com and make an API key.
2. Set `RESEND_API_KEY` and `ALERT_EMAIL_TO` (the inbox that should receive alerts).
3. Without a verified domain, Resend only lets you send to the email you signed up with, which is fine for alerts to yourself. Optional: verify your domain and set `ALERT_EMAIL_FROM` to e.g. `Portfolio <alerts@yourdomain.com>`.
The alert's Reply-To is the visitor's email, so you can reply straight from your inbox.

## 2. Telegram (most reliable instant phone alert, free)
1. In Telegram, message @BotFather → `/newbot` → copy the token.
2. Send any message to your new bot, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` and copy `chat.id`.
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

## 3. WhatsApp (CallMeBot, free third-party)
1. Follow callmebot.com's WhatsApp instructions (you send a one-time activation message from your own number and receive an API key).
2. Set `CALLMEBOT_PHONE` (international format, digits only) and `CALLMEBOT_APIKEY`.
CallMeBot is an unofficial free service, so delivery is best-effort. Use Telegram or email as the dependable channel.

## Privacy note
Alerts pass the visitor's name, email, phone and message through the service you choose. Mention that in your privacy notice if you publish one.

## Test
Submit the form on your live site, then watch `npx wrangler tail --config wrangler.api.toml` for any "alert failed" lines.

## Your values (phase 20)
- `ALERT_EMAIL_TO` = `umarsadiq899@gmail.com`
- `CALLMEBOT_PHONE` = `923430329837` (plus the `CALLMEBOT_APIKEY` you receive from CallMeBot)
Until these secrets are set on the API Worker, the contact card's **WhatsApp** and **Email** buttons are the way to send a query straight to you: they open WhatsApp / your mail app with the visitor's message already written.
