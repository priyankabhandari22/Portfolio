const abusive = [
  "fuck", "shit", "asshole", "bastard", "bitch", "cunt", "dick",
  "piss", "slut", "whore", "damn", "motherfucker", "nazi", "retard",
  "kill yourself", "die", "take this site down", "hack", "dox",
  "terrorist", "scam", "fraud", "idiot", "moron", "stupid",
];

const relaxed = [
  "idiot", "moron", "stupid", "damn",
];

export function containsAbuse(text: string): string | undefined {
  const lower = text.toLowerCase().trim();
  for (const word of abusive) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) return "Inappropriate language detected";
  }
  return undefined;
}

export const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "sharklasers.com",
  "10minutemail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "trashmail.com", "maildrop.cc", "getnada.com",
  "temp-mail.org", "fakeinbox.com", "mytrashmail.com",
  "mailexpire.com", "mintemail.com", "spamgourmet.com",
  "dispostable.com", "mailcatch.com", "mailmoat.com",
  "tempinbox.com", "emailondeck.com", "inboxalias.com",
  "guerrillamail.org", "guerrillamail.net", "guerrillamail.biz",
  "mailmetrash.com", "thankyou2010.com", "trash2009.com",
  "mt2009.com", "trashymail.com", "tyldd.com",
  "uggsrock.com", "wegwerfmail.de", "wh4f.org",
  "whyspam.me", "willselfdestruct.com", "winemaven.info",
  "wronghead.com", "wuzup.net", "xagloo.com",
  "xemaps.com", "xents.com", "xmaily.com",
  "xoxy.net", "yogamaven.com", "yopmail.fr",
  "yopmail.net", "ypmail.webarnak.fr.eu.org",
  "yuurok.com", "zehnminutenmail.de", "zippymail.info",
  "zoaxe.com", "zoemail.org", "spambox.us",
  "maileater.com", "mailexpire.com", "mailline.net",
  "mailme.ir", "mailnator.com", "mailnull.com",
  "mailsac.com", "mailtothis.com", "mailexpire.com",
  "spam4.me", "spamfree24.org", "spam.la",
  "spamail.de", "spamarrest.com", "spamavert.com",
  "spambob.com", "spambog.com", "spambox.info",
  "spamcannon.com", "spamcero.com", "spamcon.org",
  "spamcorptastic.com", "spamcowboy.com", "spamday.com",
  "spamdecoy.net", "spamex.com", "spamfighter.com",
  "spamgourmet.com", "spamherelots.com", "spaminn.com",
  "spamkill.info", "spaml.com", "spamlot.net",
  "spamoff.xyz", "spamopedia.com", "spamout.net",
  "spamsentry.net", "spamserver.com", "spamserver.net",
  "spamserver.org", "spamserver.info", "spamserver.biz",
  "spamserver.us", "spamserver.co.uk", "spamserver.de",
  "spamserver.fr", "spamserver.it", "spamserver.es",
  "until.com",
]);
