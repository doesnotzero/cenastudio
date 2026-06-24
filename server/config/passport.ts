import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { db } from "../models/db.js";

interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  emails: [{ value: string }];
  photos: [{ value: string }];
}

// Configure GitHub Strategy for admin login
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
    },
    async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: any) => {
      try {
        // Check if user exists by GitHub ID
        let user = db
          .prepare("SELECT * FROM users WHERE github_id = ?")
          .get(profile.id) as any;

        if (user) {
          // User exists, return it
          return done(null, user);
        }

        // Check if user exists by email
        user = db
          .prepare("SELECT * FROM users WHERE email = ?")
          .get(profile.emails[0].value) as any;

        if (user) {
          // Link GitHub account to existing user
          db.prepare("UPDATE users SET github_id = ? WHERE id = ?").run(profile.id, user.id);
          user.github_id = profile.id;
          return done(null, user);
        }

        // Create new admin user from GitHub
        const result = db
          .prepare(
            `INSERT INTO users (email, name, github_id, role, created_at)
             VALUES (?, ?, ?, 'admin', datetime('now'))`,
          )
          .run(
            profile.emails[0].value,
            profile.displayName || profile.username,
            profile.id,
          );

        user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id: number, done) => {
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
