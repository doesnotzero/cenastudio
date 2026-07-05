import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "../models/db.js";
import { getUserById, isAdminEmail, upsertOAuthUser } from "../services/authService.js";
import { prisma, shouldUsePrisma } from "../models/prisma.js";

interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  emails: [{ value: string }];
  photos: [{ value: string }];
}

export const isGitHubAuthConfigured = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// Configure GitHub for regular users and explicitly allowlisted admins.
if (githubClientId && githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
      },
      async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: any) => {
        try {
          const email = profile.emails[0]?.value;
          if (!email) throw new Error("GitHub profile did not provide an email");

          if (shouldUsePrisma) {
            const byGitHub = await prisma.user.findFirst({ where: { githubId: profile.id } });
            if (byGitHub) return done(null, await getUserById(Number(byGitHub.id)));
            const user = await upsertOAuthUser(email, profile.displayName || profile.username, {
              role: isAdminEmail(email) ? "admin" : "user",
            });
            await prisma.user.update({
              where: { id: BigInt(user.id) },
              data: { githubId: profile.id, avatarUrl: profile.photos?.[0]?.value || null },
            });
            return done(null, user);
          }
          const byGitHub = db.prepare("SELECT id FROM users WHERE github_id = ?").get(profile.id) as
            | { id: number }
            | undefined;
          if (byGitHub) return done(null, await getUserById(byGitHub.id));

          const user = await upsertOAuthUser(email, profile.displayName || profile.username, {
            role: isAdminEmail(email) ? "admin" : "user",
          });
          db.prepare("UPDATE users SET github_id = ?, avatar_url = ? WHERE id = ?").run(
            profile.id,
            profile.photos?.[0]?.value || null,
            user.id,
          );
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    if (shouldUsePrisma) {
      done(null, await getUserById(id));
      return;
    }
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Express.User | null;
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
