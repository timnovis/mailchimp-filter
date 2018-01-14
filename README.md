# Mailchimp Filter

Find interesting email addresses in your MailChimp lists.

What this script does:

1. Fetches the list of email addresses
2. Builds a list of domains
3. Omits email addresses with common domain names over the set threshold (default 2)
4. Leaves you with a list of interesting email addresses, having filtered out common ones such as gmail, hotmail, etc.

Useful for finding important people who might have signed up to your newsletter or service, who would otherwise go missed.

## How to use

1. Clone this repo and `cd` to it
2. `npm install` or `yarn`
3. Rename `.env.example` to `.env` and fill out the environment variables
4. `npm start` or `yarn start`
5. That's it. `list.csv` should have been written to in the same directory as the script.
