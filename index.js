require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const { MC_USER, MC_KEY, MC_LIST, MC_DC } = process.env;
  const MC_CREDENTIALS = Buffer.from(`${MC_USER}:${MC_KEY}`).toString('base64');
  const THRESHOLD = 2;
  const afterAtSign = /@([^"]+)/;
  const domainCounts = {};
  let omitList = [];
  try {
    console.log('Fetching lists...');
    const response = await fetch(
      `https://${MC_DC}.api.mailchimp.com/3.0/lists/${MC_LIST}/members?count=20000&fields=members.email_address`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${MC_CREDENTIALS}`,
        },
      },
    );

    console.log('Processing...');

    const data = await response.json();

    if (!data.members) {
      throw new Error(data.title);
    }

    const emails = data.members.map(member => member.email_address);

    const emailDomains = emails.map(email => {
      email = email.toLowerCase();
      return email.match(afterAtSign)[0];
    });

    console.log('Compiling domain counts...');

    emailDomains.forEach(domain => {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    });

    console.log('Compiling omit list...');

    Object.keys(domainCounts).forEach(domain => {
      if (domainCounts[domain] > THRESHOLD) {
        omitList.push(domain);
      }
    });

    console.log('Omit list compiled... Getting final list...');

    const finalList = emails
      .map(email => {
        const indexes = omitList.map(domain => {
          return email.indexOf(domain);
        });
        if (Math.max.apply(null, indexes) === -1) {
          return email;
        }
      })
      .filter(e => e !== undefined);

    fs.writeFile('list.csv', finalList.map(e => '\n' + e), 'utf8', err => {
      if (err) {
        throw new Error('Failed to write file');
      } else {
        console.log(`Saved ${finalList.length} records to list.csv!`);
      }
    });
  } catch (e) {
    console.log(e);
  }
})();
