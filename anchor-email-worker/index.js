import { PDFDocument, rgb, StandardFonts, PDFName, PDFArray, PDFString } from 'pdf-lib';

export default {
  // Cloudflare Workers handles Cron schedule events here
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleNotifications(env));
  },

  // Trigger notifications manually or handle API routes (like welcome emails)
  async fetch(request, env) {
    const url = new URL(request.url);

    // Setup CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/contact' && request.method === 'POST') {
        const { name, email, message } = await request.json();
        if (!name || !email || !message) {
          return new Response("name, email, and message are required", { status: 400, headers: corsHeaders });
        }
        const contactHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
              <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">New Contact Message</h2>
            </div>
            <p style="font-size: 15px; line-height: 1.6;"><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
            <p style="font-size: 15px; line-height: 1.6;"><strong>Message:</strong></p>
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; border: 1px solid #eaeaea; font-size: 14px; white-space: pre-wrap; line-height: 1.6; color: #1c1917;">${message}</div>
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
            <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent via Anchor Contact Form</p>
          </div>
        `;
        await sendEmail("anchor@biblescriptura.com", `New Contact Form Message from ${name}`, contactHtml, env.RESEND_API_KEY);
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/welcome' && request.method === 'POST') {
        const { userId, email, name } = await request.json();
        if (!email) {
          return new Response("Email is required", { status: 400, headers: corsHeaders });
        }
        await sendWelcomeEmail(email, name || "there", env.RESEND_API_KEY);
        if (userId) {
          await sendPushNotification(userId, "Welcome to Anchor!", "We are thrilled to welcome you to Anchor. Ready to begin your reading plan?", env);
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/plan-started' && request.method === 'POST') {
        const { userId, email, name, planName } = await request.json();
        if (!email || !planName) {
          return new Response("Email and planName are required", { status: 400, headers: corsHeaders });
        }
        await sendPlanStartedEmail(email, name || "there", planName, env.RESEND_API_KEY);
        if (userId) {
          await sendPushNotification(userId, "New reading plan started!", `You started ${planName}. Keep your streak alive!`, env);
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/group-joined' && request.method === 'POST') {
        const { userId, email, name, groupName } = await request.json();
        if (!email || !groupName) {
          return new Response("Email and groupName are required", { status: 400, headers: corsHeaders });
        }
        await sendGroupJoinedEmail(email, name || "there", groupName, env.RESEND_API_KEY);
        if (userId) {
          await sendPushNotification(userId, "Joined reading group!", `You joined the reading group: ${groupName}.`, env);
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/group-message-notification' && request.method === 'POST') {
        const { groupId, groupName, senderId, senderName, text } = await request.json();
        if (!groupId || !senderId || !text) {
          return new Response("groupId, senderId, and text are required", { status: 400, headers: corsHeaders });
        }

        // Get Google Access Token
        const token = await getGoogleAuthToken(env.FIREBASE_CLIENT_EMAIL, env.FIREBASE_PRIVATE_KEY);

        // Fetch all group members from Firestore REST API
        const projectId = env.FIREBASE_PROJECT_ID;
        const membersUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/groups/${groupId}/members`;
        const res = await fetch(membersUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const membersData = await res.json();
          const membersList = membersData.documents || [];
          const memberUids = membersList
            .map(doc => doc.name.split('/').pop())
            .filter(uid => uid !== senderId);

          if (memberUids.length > 0) {
            await sendPushNotification(memberUids, `${groupName} 💬`, `${senderName}: ${text}`, env);
          }
        } else {
          console.error(`Failed to fetch members for group ${groupId}:`, await res.text());
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/progress-report' && request.method === 'POST') {
        const { email, userId, name: reqName } = await request.json();
        if (!email || !userId) {
          return new Response("Email and userId are required", { status: 400, headers: corsHeaders });
        }

        // 1. Get Google Access Token
        const token = await getGoogleAuthToken(env.FIREBASE_CLIENT_EMAIL, env.FIREBASE_PRIVATE_KEY);

        // 2. Fetch User Doc
        const projectId = env.FIREBASE_PROJECT_ID;
        const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`;
        const res = await fetch(userUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) {
          return new Response("User not found in Firestore", { status: 404, headers: corsHeaders });
        }
        const userDoc = await res.json();
        const fields = userDoc.fields || {};

        // 3. Extract plan and stats
        const name = resolveUserName(fields, reqName || email);
        const activePlan = fields.activePlan?.mapValue?.fields;

        let planName = "Bible Reading Plan";
        let chaptersCompleted = 0;
        let currentStreak = 0;
        let totalChapters = 150;

        if (activePlan) {
          planName = activePlan.name?.stringValue || planName;
          const totalDays = parseInt(activePlan.totalDays?.integerValue || "50");
          totalChapters = totalDays * 3;

          const progressStats = activePlan.progressStats?.mapValue?.fields;
          if (progressStats) {
            chaptersCompleted = parseInt(progressStats.chaptersCompleted?.integerValue || "0");

            const completedDatesArray = progressStats.completedDates?.arrayValue?.values || [];
            const timezone = fields.timezone?.stringValue || "UTC";
            const currentUtcDate = new Date();
            const localTodayStr = getLocalDateString(timezone, currentUtcDate);
            const yesterdayUtcDate = new Date(currentUtcDate.getTime() - 24 * 60 * 60 * 1000);
            const localYesterdayStr = getLocalDateString(timezone, yesterdayUtcDate);
            currentStreak = calculateStreak(completedDatesArray, localTodayStr, localYesterdayStr);
          }
        }

        // 4. Generate PDF
        const pdfBytes = await buildPdfBuffer(name, chaptersCompleted, currentStreak, totalChapters);
        const base64Pdf = arrayBufferToBase64(pdfBytes);

        // 5. Send Progress Report Email with Attachment
        await sendProgressReportEmail(email, name, planName, chaptersCompleted, currentStreak, totalChapters, base64Pdf, env.RESEND_API_KEY);

        // Send Push Notification
        await sendPushNotification(userId, "Progress Report Generated", `Your progress report PDF has been sent to ${email}.`, env);

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Default fallback runs cron checks
      await handleNotifications(env);
      return new Response("Notifications check executed successfully.", { status: 200, headers: corsHeaders });
    } catch (err) {
      console.error(err);
      return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
    }
  }
};

async function handleNotifications(env) {
  // Verify secrets are present
  if (!env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY environment variables.");
  }

  const currentUtcDate = new Date();
  const projectId = env.FIREBASE_PROJECT_ID;
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;

  // 1. Get Google Access Token
  const token = await getGoogleAuthToken(env.FIREBASE_CLIENT_EMAIL, env.FIREBASE_PRIVATE_KEY);

  // 2. Fetch all users from Firestore
  const response = await fetch(firestoreUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    console.error("Failed to query Firestore users:", await response.text());
    return;
  }

  const data = await response.json();
  const users = data.documents || [];

  for (const userDoc of users) {
    const fields = userDoc.fields;
    if (!fields) continue;

    const email = fields.email?.stringValue;
    const timezone = fields.timezone?.stringValue;
    const userId = userDoc.name.split('/').pop();

    if (!email || !timezone) continue;

    const localHour = getLocalHour(timezone, currentUtcDate);
    const localDay = getLocalDayOfWeek(timezone, currentUtcDate);
    const localDateStr = getLocalDateString(timezone, currentUtcDate);

    // Read user preferences
    const settings = fields.emailSettings?.mapValue?.fields || {};
    const morningReminders = settings.morningReminders?.booleanValue !== false;
    const streakWarnings = settings.streakWarnings?.booleanValue !== false;
    const morningHour = parseInt(settings.morningHour?.integerValue || "7");
    const warningHour = parseInt(settings.warningHour?.integerValue || "21");

    const activePlan = fields.activePlan?.mapValue?.fields;

    // Case A: Send Morning Reading List
    const lastMorningReminderSentDate = fields.lastMorningReminderSentDate?.stringValue;
    if (morningReminders && localHour === morningHour && lastMorningReminderSentDate !== localDateStr) {
      await sendMorningReading(email, userId, projectId, env.RESEND_API_KEY, token, env);
      await markMorningReminderSent(userId, projectId, localDateStr, token);
    }

    // Case B: Send Evening Streak Warning
    const lastStreakWarningSentDate = fields.lastStreakWarningSentDate?.stringValue;
    const completedDatesArray = activePlan?.progressStats?.mapValue?.fields?.completedDates?.arrayValue?.values || [];
    const completedDates = completedDatesArray.map(v => v.stringValue).filter(Boolean);
    const readToday = completedDates.includes(localDateStr);

    if (streakWarnings && localHour === warningHour && lastStreakWarningSentDate !== localDateStr && !readToday) {
      await sendStreakWarning(email, userId, projectId, env.RESEND_API_KEY, token, env);
      await markStreakWarningSent(userId, projectId, localDateStr, token);
    }

    // Case C: Send Feedback Email (after 3 days of account creation at local 10 AM)
    const createdAtStr = fields.createdAt?.stringValue;
    const feedbackEmailSent = fields.feedbackEmailSent?.booleanValue === true;
    if (createdAtStr && !feedbackEmailSent && localHour === 10) {
      const createdAt = new Date(createdAtStr);
      const diffTime = currentUtcDate - createdAt;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays >= 3) {
        const name = resolveUserName(fields);
        await sendFeedbackEmail(email, name, env.RESEND_API_KEY);
        await sendPushNotification(userId, "How is your Anchor journey?", "We'd love to hear your thoughts and feedback!", env);
        await markFeedbackEmailSent(userId, projectId, token);
      }
    }

    // Case D: Weekly Progress Report (on Monday at local 9:00 AM)
    const lastWeeklyReportSent = fields.lastWeeklyReportSent?.stringValue;
    if (localDay === "Mon" && localHour === 9 && lastWeeklyReportSent !== localDateStr) {
      const name = resolveUserName(fields);

      let planName = "Bible Reading Plan";
      let chaptersCompleted = 0;
      let currentStreak = 0;
      let totalChapters = 150;

      if (activePlan) {
        planName = activePlan.name?.stringValue || planName;
        const totalDays = parseInt(activePlan.totalDays?.integerValue || "50");
        totalChapters = totalDays * 3;

        const progressStats = activePlan.progressStats?.mapValue?.fields;
        if (progressStats) {
          chaptersCompleted = parseInt(progressStats.chaptersCompleted?.integerValue || "0");

          const completedDatesArray = progressStats.completedDates?.arrayValue?.values || [];
          const yesterdayUtcDate = new Date(currentUtcDate.getTime() - 24 * 60 * 60 * 1000);
          const localYesterdayStr = getLocalDateString(timezone, yesterdayUtcDate);
          currentStreak = calculateStreak(completedDatesArray, localDateStr, localYesterdayStr);
        }
      }

      const pdfBytes = await buildPdfBuffer(name, chaptersCompleted, currentStreak, totalChapters);
      const base64Pdf = arrayBufferToBase64(pdfBytes);

      await sendWeeklyProgressReportEmail(email, name, planName, chaptersCompleted, currentStreak, totalChapters, base64Pdf, env.RESEND_API_KEY);
      await sendPushNotification(userId, "Weekly Progress Report", "Your weekly Bible progress report is ready and has been emailed to you.", env);
      await markWeeklyReportSent(userId, projectId, localDateStr, token);
    }

    // Case E: Re-engagement Email (sent at local 11:00 AM after 7 days of inactivity)
    const lastReengagementSentDate = fields.lastReengagementSentDate?.stringValue;
    if (localHour === 11 && lastReengagementSentDate !== localDateStr) {
      const completedDatesArray = activePlan?.progressStats?.mapValue?.fields?.completedDates?.arrayValue?.values || [];

      let lastActivityDate = null;
      if (completedDatesArray.length > 0) {
        const dates = completedDatesArray.map(v => v.stringValue).filter(Boolean);
        if (dates.length > 0) {
          dates.sort();
          lastActivityDate = new Date(dates[dates.length - 1]);
        }
      } else if (createdAtStr) {
        lastActivityDate = new Date(createdAtStr);
      }

      if (lastActivityDate) {
        const diffTime = currentUtcDate - lastActivityDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays >= 7) {
          const name = resolveUserName(fields);
          await sendReengagementEmail(email, name, env.RESEND_API_KEY);
          await sendPushNotification(userId, "We miss you on Anchor!", "Spend a few minutes in the Word today to restart your reading habit.", env);
          await markReengagementSent(userId, projectId, localDateStr, token);
        }
      }
    }

    // Case F: Celebratory Milestones (checked at local 12:00 PM)
    if (localHour === 12) {
      const lastStreakMilestoneSent = parseInt(fields.lastStreakMilestoneSent?.integerValue || "0");
      const planCompletionEmailSent = fields.planCompletionEmailSent?.booleanValue === true;

      if (activePlan) {
        const totalDays = parseInt(activePlan.totalDays?.integerValue || "0");
        const totalChapters = totalDays * 3;

        const progressStats = activePlan.progressStats?.mapValue?.fields;
        let chaptersCompleted = 0;
        let currentStreak = 0;

        if (progressStats) {
          chaptersCompleted = parseInt(progressStats.chaptersCompleted?.integerValue || "0");

          const completedDatesArray = progressStats.completedDates?.arrayValue?.values || [];
          const yesterdayUtcDate = new Date(currentUtcDate.getTime() - 24 * 60 * 60 * 1000);
          const localYesterdayStr = getLocalDateString(timezone, yesterdayUtcDate);
          currentStreak = calculateStreak(completedDatesArray, localDateStr, localYesterdayStr);
        }

        // 1. Plan Completion Celebration
        if (totalChapters > 0 && chaptersCompleted >= totalChapters && !planCompletionEmailSent) {
          const name = resolveUserName(fields);
          const planName = activePlan.name?.stringValue || "Bible Reading Plan";
          await sendPlanCompletionEmail(email, name, planName, env.RESEND_API_KEY);
          await sendPushNotification(userId, "Plan Completed! 🎓", `Congratulations! You have successfully completed "${planName}"!`, env);
          await markPlanCompletionSent(userId, projectId, token);
        }

        // 2. Streak Milestones (7, 30, 100 days)
        const milestones = [7, 30, 100];
        if (milestones.includes(currentStreak) && lastStreakMilestoneSent !== currentStreak) {
          const name = resolveUserName(fields);
          await sendStreakMilestoneEmail(email, name, currentStreak, env.RESEND_API_KEY);
          await sendPushNotification(userId, "New Streak Milestone! 🔥", `Incredible! You hit a ${currentStreak}-day reading streak!`, env);
          await markStreakMilestoneSent(userId, projectId, currentStreak, token);
        }
      }
    }
  }
}

// Calculates local hour for a given timezone string (e.g. Africa/Lagos)
function getLocalHour(timezone, date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    });
    return parseInt(formatter.format(date));
  } catch (err) {
    console.error(`Invalid timezone "${timezone}", fallback to UTC`);
    return date.getUTCHours();
  }
}

// Get short day of the week (e.g., "Mon", "Tue") in local timezone
function getLocalDayOfWeek(timezone, date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short'
    });
    return formatter.format(date);
  } catch (err) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getUTCDay()];
  }
}

// Get string date "YYYY-MM-DD" in local timezone
function getLocalDateString(timezone, date) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.format(date).split('/');
    return `${parts[2]}-${parts[0]}-${parts[1]}`;
  } catch (err) {
    return date.toISOString().split('T')[0];
  }
}

function calculateStreak(completedDatesArray, localTodayStr, localYesterdayStr) {
  const dates = completedDatesArray.map(v => v.stringValue).filter(Boolean);
  if (dates.length === 0) return 0;

  const uniqueDates = Array.from(new Set(dates)).sort().reverse();
  const mostRecent = uniqueDates[0];

  if (mostRecent !== localTodayStr && mostRecent !== localYesterdayStr) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = new Date(uniqueDates[i] + 'T12:00:00');
    const d2 = new Date(uniqueDates[i + 1] + 'T12:00:00');
    const diffTime = d1 - d2;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else if (diffDays === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

function resolveUserName(fields, fallbackName) {
  const fullName = fields.fullName?.stringValue?.trim();
  if (fullName) return fullName;

  const displayName = fields.displayName?.stringValue?.trim();
  if (displayName) return displayName;

  const email = fields.email?.stringValue?.trim();
  if (email) {
    return email.split('@')[0];
  }

  if (fallbackName) {
    if (fallbackName.includes('@')) {
      return fallbackName.split('@')[0];
    }
    return fallbackName;
  }

  return "User";
}

// Query Firestore for the user's active reading progress to build email template
async function sendMorningReading(email, userId, projectId, resendApiKey, authToken, env) {
  // Query User Doc details
  const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`;
  const res = await fetch(userUrl, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  if (!res.ok) return;

  const userDoc = await res.json();
  const activePlan = userDoc.fields?.activePlan?.mapValue?.fields;
  const planName = activePlan?.name?.stringValue || "Bible Reading Plan";

  const welcomeHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Daily Reading Reminder 🍞</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Good morning! It's time for today's Bible reading assignment in your plan: <strong>${planName}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6;">Spending time in the Word daily helps anchor your faith. Open your tracker to check off your chapters and build your streak!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Open Your Dashboard</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You can change notification preferences inside your account Settings page.</p>
    </div>
  `;

  await sendEmail(
    email,
    "Your Reading Bread for Today 🍞",
    welcomeHtml,
    resendApiKey
  );

  await sendPushNotification(userId, "Your Daily Reading Assignment 🍞", `It's time for today's Bible reading in "${planName}".`, env);
}

// Warning sent if the user hasn't finished reading today
async function sendStreakWarning(email, userId, projectId, resendApiKey, authToken, env) {
  // Query User Doc details
  const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}`;
  const res = await fetch(userUrl, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  });
  if (!res.ok) return;

  const userDoc = await res.json();
  const activePlan = userDoc.fields?.activePlan?.mapValue?.fields;

  const warningHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #ef4444; margin-top: 10px; font-weight: 800; font-size: 22px;">Keep your streak alive! 🔥</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">You haven't checked off your Bible reading assignments for today yet.</p>
      <p style="font-size: 15px; line-height: 1.6;">Don't let your habit slide! Log in before midnight to check off your chapters and protect your reading streak.</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.15);">Log Today's Reading</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #ef4444; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You can change notification preferences inside your account Settings page.</p>
    </div>
  `;

  await sendEmail(
    email,
    "Don't lose your streak! 🔥",
    warningHtml,
    resendApiKey
  );

  await sendPushNotification(userId, "Keep your streak alive! 🔥", "You haven't logged today's reading yet. Protect your reading streak!", env);
}

async function sendPushNotification(userIds, title, message, env) {
  if (!env.ONESIGNAL_APP_ID || !env.ONESIGNAL_REST_API_KEY) {
    console.warn("OneSignal credentials are not set in the worker environment.");
    return;
  }

  const externalIds = Array.isArray(userIds) ? userIds : [userIds];
  if (externalIds.length === 0) return;

  const url = 'https://onesignal.com/api/v1/notifications';
  const body = {
    app_id: env.ONESIGNAL_APP_ID,
    target_channel: 'push',
    include_aliases: {
      external_id: externalIds
    },
    headings: {
      en: title
    },
    contents: {
      en: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`Failed to send push notification to OneSignal:`, await response.text());
    } else {
      console.log(`Push notification successfully sent to ${externalIds.length} users`);
    }
  } catch (err) {
    console.error("Error sending push notification via OneSignal:", err);
  }
}

async function sendEmail(to, subject, htmlContent, resendApiKey, attachments = []) {
  const url = 'https://api.resend.com/emails';
  const body = {
    from: 'Anchor <reminders@anchor.biblescriptura.com>',
    to: to,
    subject: subject,
    html: htmlContent
  };

  if (attachments && attachments.length > 0) {
    body.attachments = attachments;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error(`Failed to send email to ${to}:`, await response.text());
  } else {
    console.log(`Email successfully sent to ${to}`);
  }
}

async function sendWelcomeEmail(email, name, resendApiKey) {
  const welcomeHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Welcome to Anchor!</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">We are thrilled to welcome you to Anchor — your personal Bible reading and progress tracker.</p>
      <p style="font-size: 15px; line-height: 1.6;">Our goal is to help you build a consistent Bible reading habit, set personal or group goals, and grow in your faith. Ready to begin?</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Get Started</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">If you have any questions or feedback, simply reply to this email. We'd love to hear from you!</p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you signed up for an account on Anchor.</p>
    </div>
  `;

  await sendEmail(email, "Welcome to Anchor!", welcomeHtml, resendApiKey);
}

async function sendPlanStartedEmail(email, name, planName, resendApiKey) {
  const planStartedHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">New plan started!</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">You have started your new personal reading plan: <strong>${planName}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6;">Building a daily habit of spending time in the Word anchors your faith and simplifies your spiritual progress. Log in daily to check off your chapters and keep your streak alive!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Open Your Dashboard</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you started a new reading plan on Anchor.</p>
    </div>
  `;

  await sendEmail(email, "New Reading Plan Started!", planStartedHtml, resendApiKey);
}

async function sendGroupJoinedEmail(email, name, groupName, resendApiKey) {
  const groupJoinedHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Joined a reading group!</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">You have joined the reading group: <strong>${groupName}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6;">Reading in community keeps us accountable and encouraged. Head over to your group space to track progress and discuss your daily reading together!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/group-management" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Manage Your Groups</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you joined a new group on Anchor.</p>
    </div>
  `;

  await sendEmail(email, `You joined the reading group "${groupName}"!`, groupJoinedHtml, resendApiKey);
}

async function sendFeedbackEmail(email, name, resendApiKey) {
  const feedbackHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">How is your Anchor journey?</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">You've been using Anchor for a few days now, and we hope it has helped you simplify and track your daily Bible reading progress.</p>
      <p style="font-size: 15px; line-height: 1.6;">We are constantly working to improve the platform, and we would love to hear your thoughts! What features do you love? Is there anything we could do better?</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="mailto:feedback@anchor.biblescriptura.com?subject=Anchor%20Feedback" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Share Your Feedback</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Simply click the button above to email us, or reply directly to this email to share your thoughts.</p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you signed up for an account on Anchor.</p>
    </div>
  `;

  await sendEmail(email, "How are you liking Anchor?", feedbackHtml, resendApiKey);
}

async function sendProgressReportEmail(email, name, planName, chaptersCompleted, currentStreak, totalChapters, base64Pdf, resendApiKey) {
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Your Bible Progress Report</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">Here is your personal reading progress analysis for your plan <strong>${planName}</strong>. We've attached a copy of this analysis as a PDF report for your records.</p>
      
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #eaeaea;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Summary Stats</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Chapters Completed:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #0f172a; text-align: right;">${chaptersCompleted} of ${totalChapters}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Current Streak:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #7c3aed; text-align: right;">${currentStreak} days 🔥</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">Please find the attached PDF progress report. If you have any feedback or questions, feel free to reply directly to this email.</p>
      
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you requested a progress report from your Anchor account.</p>
    </div>
  `;

  await sendEmail(
    email,
    'Your Anchor Bible Progress Report',
    emailHtml,
    resendApiKey,
    [
      {
        filename: name.replace(/\s+/g, '_') + '_Progress_Report.pdf',
        content: base64Pdf
      }
    ]
  );
}

async function sendWeeklyProgressReportEmail(email, name, planName, chaptersCompleted, currentStreak, totalChapters, base64Pdf, resendApiKey) {
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Weekly Progress Report</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">Happy Monday! Here is your automated weekly progress analysis for your active plan <strong>${planName}</strong>. We've attached your detailed progress analysis as a PDF.</p>
      
      <div style="background-color: #f8fafc; border-radius: 12px; padding: 15px; margin: 20px 0; border: 1px solid #eaeaea;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Weekly Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Chapters Completed:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #0f172a; text-align: right;">${chaptersCompleted} of ${totalChapters}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Current Streak:</td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: bold; color: #7c3aed; text-align: right;">${currentStreak} days 🔥</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 15px; line-height: 1.6;">Keep up the consistent discipline of spending time in the scriptures. It anchors your spiritual growth daily.</p>
      
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you signed up for weekly reports on Anchor.</p>
    </div>
  `;

  await sendEmail(
    email,
    'Your Weekly Anchor Progress Report',
    emailHtml,
    resendApiKey,
    [
      {
        filename: name.replace(/\s+/g, '_') + '_Weekly_Progress_Report.pdf',
        content: base64Pdf
      }
    ]
  );
}

async function sendReengagementEmail(email, name, resendApiKey) {
  const reengageHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">We miss you on Anchor!</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">We noticed you haven't checked off any Bible chapters in the last 7 days.</p>
      <p style="font-size: 15px; line-height: 1.6;">Building a consistent daily reading habit can be challenging, but every step counts. Just reading a single chapter today can kickstart your habit again!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Open Your Dashboard</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Let's get back in the Word and keep anchoring our lives in Truth.</p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you signed up for an account on Anchor.</p>
    </div>
  `;

  await sendEmail(email, "We miss you on Anchor!", reengageHtml, resendApiKey);
}

async function sendPlanCompletionEmail(email, name, planName, resendApiKey) {
  const completeHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #10b981; margin-top: 10px; font-weight: 800; font-size: 22px;">Congratulations! Plan Completed! 🎓</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">You did it! You have successfully completed your reading plan: <strong>${planName}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6;">Completing a Bible reading plan is a significant spiritual milestone and a testament to your discipline. We hope Anchor was a helpful guide along the way!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/plan-creation-wizard" style="display: inline-block; padding: 12px 28px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.15);">Start a New Plan</a>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Keep growing and diving into the scriptures.</p>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #10b981; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you completed your reading plan on Anchor.</p>
    </div>
  `;

  await sendEmail(email, "Congratulations! You completed your reading plan! 🎓", completeHtml, resendApiKey);
}

async function sendStreakMilestoneEmail(email, name, streakCount, resendApiKey) {
  const milestoneHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <img src="https://anchor.biblescriptura.com/anchor.png" alt="Anchor Logo" style="width: 48px; height: 48px; object-fit: contain;" />
        <h2 style="color: #7c3aed; margin-top: 10px; font-weight: 800; font-size: 22px;">Incredible! You hit a ${streakCount}-day streak! 🔥</h2>
      </div>
      <p style="font-size: 15px; line-height: 1.6;">Hi ${name},</p>
      <p style="font-size: 15px; line-height: 1.6;">Consistency is key! You have officially hit a reading streak of <strong>${streakCount} days</strong> on Anchor.</p>
      <p style="font-size: 15px; line-height: 1.6;">Keep up the daily habit of reading the Word. Keep that fire burning!</p>
      <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
        <a href="https://anchor.biblescriptura.com/daily-reading-dashboard" style="display: inline-block; padding: 12px 28px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.15);">Log Today's Reading</a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
      <p style="color: #78716c; font-size: 11px; text-align: center; line-height: 1.4; margin: 0;">Sent by Anchor, a product of <a href="https://biblescriptura.com" style="color: #7c3aed; text-decoration: underline; font-weight: 600;">Scriptura</a>. Bible progress, simplified.<br />You received this email because you signed up for an account on Anchor.</p>
    </div>
  `;

  await sendEmail(email, `Incredible! You hit a ${streakCount}-day reading streak! 🔥`, milestoneHtml, resendApiKey);
}
async function fetchImageBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image from ${url}`);
  return await res.arrayBuffer();
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function buildPdfBuffer(name, completedCount, streakDays, totalChapters) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const cleanName = name;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // 1. Fetch Logos
  let anchorImage, scripturaImage;
  try {
    const anchorBytes = await fetchImageBytes('https://anchor.biblescriptura.com/anchor.png');
    anchorImage = await pdfDoc.embedPng(anchorBytes);
  } catch (err) {
    console.error("Failed to load Anchor logo for PDF:", err);
  }

  try {
    const scripturaBytes = await fetchImageBytes('https://anchor.biblescriptura.com/scriptura.png');
    scripturaImage = await pdfDoc.embedPng(scripturaBytes);
  } catch (err) {
    console.error("Failed to load Scriptura logo for PDF:", err);
  }

  // 2. Background Watermark (Anchor Logo with low opacity in center)
  if (anchorImage) {
    const watermarkWidth = 200;
    const watermarkHeight = 200;
    page.drawImage(anchorImage, {
      x: (595.28 - watermarkWidth) / 2,
      y: (841.89 - watermarkHeight) / 2,
      width: watermarkWidth,
      height: watermarkHeight,
      opacity: 0.04
    });
  }

  // 3. Header Accent Bar
  page.drawRectangle({
    x: 40,
    y: 790,
    width: 515,
    height: 4,
    color: rgb(0.48, 0.22, 0.93)
  });

  // 4. Header Section
  if (anchorImage) {
    page.drawImage(anchorImage, {
      x: 40,
      y: 720,
      width: 44,
      height: 44
    });
  }

  page.drawText('Anchor Bible Tracker', {
    x: 95,
    y: 750,
    size: 18,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText('PROGRESS REPORT', {
    x: 95,
    y: 732,
    size: 11,
    font: helveticaBold,
    color: rgb(0.48, 0.22, 0.93)
  });

  page.drawText(dateStr, {
    x: 450,
    y: 750,
    size: 10,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4)
  });

  // 5. Divider
  page.drawRectangle({
    x: 40,
    y: 700,
    width: 515,
    height: 1,
    color: rgb(0.9, 0.9, 0.9)
  });

  // 6. User Information
  page.drawText('Report for:', {
    x: 40,
    y: 665,
    size: 10,
    font: helveticaFont,
    color: rgb(0.4, 0.4, 0.4)
  });

  page.drawText(cleanName, {
    x: 105,
    y: 665,
    size: 12,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText('Reading Achievements', {
    x: 40,
    y: 615,
    size: 14,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  // 7. Cards Layout (3 Columns)
  const drawCard = (x, y, w, h, bg, border, label, value, valColor) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: bg,
      borderColor: border,
      borderWidth: 1
    });

    page.drawText(label, {
      x: x + 12,
      y: y + h - 20,
      size: 9,
      font: helveticaBold,
      color: rgb(0.5, 0.5, 0.5)
    });

    page.drawText(value, {
      x: x + 12,
      y: y + 20,
      size: 16,
      font: helveticaBold,
      color: valColor
    });
  };

  const cardY = 510;
  const cardH = 80;
  const cardW = 158;

  // Streak Card (Purple)
  drawCard(
    40,
    cardY,
    cardW,
    cardH,
    rgb(0.98, 0.96, 0.99),
    rgb(0.9, 0.85, 0.96),
    'CURRENT STREAK',
    `${streakDays} days`,
    rgb(0.48, 0.22, 0.93)
  );

  // Chapters Completed Card (Green)
  drawCard(
    218,
    cardY,
    cardW,
    cardH,
    rgb(0.96, 0.99, 0.96),
    rgb(0.85, 0.95, 0.85),
    'CHAPTERS READ',
    `${completedCount} of ${totalChapters}`,
    rgb(0.1, 0.55, 0.25)
  );

  // Completion Percentage Card (Blue)
  const pct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;
  drawCard(
    397,
    cardY,
    cardW,
    cardH,
    rgb(0.96, 0.98, 0.99),
    rgb(0.85, 0.92, 0.98),
    'COMPLETION RATE',
    `${pct}%`,
    rgb(0.15, 0.45, 0.8)
  );

  // 8. Guidance / encouragement text
  page.drawText('Spiritual Disciplines', {
    x: 40,
    y: 440,
    size: 12,
    font: helveticaBold,
    color: rgb(0.1, 0.1, 0.1)
  });

  page.drawText('Spending time in the scriptures daily anchors your faith and simplifies your', {
    x: 40,
    y: 415,
    size: 10,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  page.drawText('spiritual progress. Keep building your daily discipline of studying the scriptures.', {
    x: 40,
    y: 398,
    size: 10,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3)
  });

  // 9. Footer Divider
  page.drawRectangle({
    x: 40,
    y: 120,
    width: 515,
    height: 1,
    color: rgb(0.9, 0.9, 0.9)
  });

  // 10. Footer Scriptura Branding
  if (scripturaImage) {
    const sWidth = 55;
    const sHeight = sWidth * (scripturaImage.height / scripturaImage.width);
    page.drawImage(scripturaImage, {
      x: 40,
      y: 80,
      width: sWidth,
      height: sHeight
    });
  }

  page.drawText('Anchor is a product of Scriptura — biblescriptura.com', {
    x: 40,
    y: 55,
    size: 8,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  });

  page.drawText('Bible progress, simplified.', {
    x: 455,
    y: 55,
    size: 8,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5)
  });

  // 11. Add Hyperlinks
  addHyperlink(pdfDoc, page, 'https://anchor.biblescriptura.com', [40, 720, 300, 770]);
  addHyperlink(pdfDoc, page, 'https://biblescriptura.com', [40, 50, 260, 110]);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function addHyperlink(pdfDoc, page, url, rect) {
  const { context } = pdfDoc;
  const pageNode = page.node;

  let annots = pageNode.lookup(PDFName.of('Annots'), PDFArray);
  if (!annots) {
    annots = context.obj([]);
    pageNode.set(PDFName.of('Annots'), annots);
  }

  const linkAnnotation = context.register(
    context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: rect,
      Border: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(url)
      }
    })
  );

  annots.push(linkAnnotation);
}

function escapePdfString(str) {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

// ── Firestore Update Helper Functions ──
async function updateUserField(userId, projectId, fieldsToUpdate, updateMaskPaths, authToken) {
  const mask = updateMaskPaths.map(p => `updateMask.fieldPaths=${p}`).join('&');
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?${mask}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: fieldsToUpdate
    })
  });
  if (!response.ok) {
    console.error(`Failed to update fields [${updateMaskPaths.join(', ')}] for user ${userId}:`, await response.text());
  }
}

async function markFeedbackEmailSent(userId, projectId, authToken) {
  await updateUserField(
    userId,
    projectId,
    { feedbackEmailSent: { booleanValue: true } },
    ["feedbackEmailSent"],
    authToken
  );
}

async function markWeeklyReportSent(userId, projectId, dateStr, authToken) {
  await updateUserField(
    userId,
    projectId,
    { lastWeeklyReportSent: { stringValue: dateStr } },
    ["lastWeeklyReportSent"],
    authToken
  );
}

async function markReengagementSent(userId, projectId, dateStr, authToken) {
  await updateUserField(
    userId,
    projectId,
    { lastReengagementSentDate: { stringValue: dateStr } },
    ["lastReengagementSentDate"],
    authToken
  );
}

async function markPlanCompletionSent(userId, projectId, authToken) {
  await updateUserField(
    userId,
    projectId,
    { planCompletionEmailSent: { booleanValue: true } },
    ["planCompletionEmailSent"],
    authToken
  );
}

async function markMorningReminderSent(userId, projectId, dateStr, authToken) {
  await updateUserField(
    userId,
    projectId,
    { lastMorningReminderSentDate: { stringValue: dateStr } },
    ["lastMorningReminderSentDate"],
    authToken
  );
}

async function markStreakWarningSent(userId, projectId, dateStr, authToken) {
  await updateUserField(
    userId,
    projectId,
    { lastStreakWarningSentDate: { stringValue: dateStr } },
    ["lastStreakWarningSentDate"],
    authToken
  );
}

async function markStreakMilestoneSent(userId, projectId, streakDays, authToken) {
  await updateUserField(
    userId,
    projectId,
    { lastStreakMilestoneSent: { integerValue: String(streakDays) } },
    ["lastStreakMilestoneSent"],
    authToken
  );
}

// ── JWT OAuth Helper for Google Service Accounts in Cloudflare Workers ──
async function getGoogleAuthToken(clientEmail, privateKey) {
  const cleanKey = privateKey
    .replace(/\\n/g, '\n')
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '');

  const keyBuffer = str2ab(atob(cleanKey));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' }
    },
    false,
    ['sign']
  );

  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const base64Header = b64(JSON.stringify(header));
  const base64Claim = b64(JSON.stringify(claim));
  const signInput = `${base64Header}.${base64Claim}`;

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signInput)
  );

  const jwt = `${signInput}.${b64(signature)}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const tokenData = await tokenResponse.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to generate Google OAuth token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function b64(input) {
  const str = typeof input === 'string' ? input : String.fromCharCode.apply(null, new Uint8Array(input));
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
