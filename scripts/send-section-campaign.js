// scripts/send-section-campaign.js
import fetch from "node-fetch";

// load env
const API_KEY = process.env.MAILCHIMP_API_KEY;
const LIST_ID = process.env.MAILCHIMP_LIST_ID;
const DC = API_KEY.split("-")[1];
const GROUP_CAT = process.env.GROUP_CATEGORY_ID;
const SECTION = process.argv[2];         // e.g. "Gaming"
const OPTION_ID = process.argv[3];       // e.g. "1"
const POST_TITLE = process.argv[4];      // e.g. "My New Post"
const POST_URL   = process.argv[5];      // full URL to the post

if (!SECTION || !OPTION_ID) {
  console.error("Usage: node send-section-campaign.js <SectionName> <OptionID> <PostTitle> <PostURL>");
  process.exit(1);
}

async function run() {
  // 1) Create the campaign
  const createRes = await fetch(`https://${DC}.api.mailchimp.com/3.0/campaigns`, {
    method: "POST",
    headers: {
      "Authorization": `apikey ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "regular",
      recipients: {
        list_id: LIST_ID,
        segment_opts: {
          match: "all",
          conditions: [
            {
              condition_type: "Interests",
              field: "interests",
              op: "interestcontains",
              value: OPTION_ID
            }
          ]
        }
      },
      settings: {
        subject_line: `New on ${SECTION}: ${POST_TITLE}`,
        title:        `${SECTION}-${Date.now()}`,
        from_name:    "Your Name",
        reply_to:     "you@yourdomain.com"
      }
    })
  });
const campaignData = await createRes.json();

if (!campaignData.id) {
  console.error("Failed to create campaign", campaignData);
  process.exit(1);
}

const campaign_id = campaignData.id;


  // 2) Set the campaign content
  const htmlContent = `
    <h1>${POST_TITLE}</h1>
    <p>A new ${SECTION} post just went live! <a href="${POST_URL}">Read it here →</a></p>
  `;
  await fetch(`https://${DC}.api.mailchimp.com/3.0/campaigns/${campaign_id}/content`, {
    method: "PUT",
    headers: {
      "Authorization": `apikey ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ html: htmlContent })
  });

  // 3) Send it
  await fetch(`https://${DC}.api.mailchimp.com/3.0/campaigns/${campaign_id}/actions/send`, {
    method: "POST",
    headers: { "Authorization": `apikey ${API_KEY}` }
  });

  console.log(`Sent campaign ${campaign_id} for ${SECTION}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
