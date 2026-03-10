#!/usr/bin/env node

/**
 * Re-verify all teams back to REGISTERED status (TypeScript)
 * Uses dotenv to read DIRECT_URL from .env
 * Restores database to state before payment verification accident
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface Team {
  id: string;
  teamName: string;
  email: string;
}

interface ReVerifyResult {
  updated: number;
  failed: number;
}

async function getUnverifiedTeams(): Promise<Team[]> {
  try {
    const result = await pool.query(
      `
      SELECT 
        u.id,
        u."teamName",
        u.email
      FROM "User" u
      JOIN "Paper" p ON u.id = p."userId"
      WHERE p.status = 'PAYMENT_VERIFICATION'
      ORDER BY u."teamName"
      `
    );

    return result.rows;
  } catch (error) {
    console.error('❌ Error querying teams:', (error as Error).message);
    return [];
  }
}

async function reVerifyTeamsBatch(teamIds: string[]): Promise<ReVerifyResult> {
  if (teamIds.length === 0) {
    return { updated: 0, failed: 0 };
  }

  try {
    const result = await pool.query(
      `
      UPDATE "Paper"
      SET 
        status = 'REGISTERED',
        "updatedAt" = NOW()
      WHERE "userId" = ANY($1) AND status = 'PAYMENT_VERIFICATION'
      `,
      [teamIds]
    );

    const updated = result.rowCount || 0;
    const failed = teamIds.length - updated;

    return { updated, failed };
  } catch (error) {
    console.error('❌ Error re-verifying teams:', (error as Error).message);
    return { updated: 0, failed: teamIds.length };
  }
}

async function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main(): Promise<void> {
  console.log('\n' + '='.repeat(100));
  console.log('🔄 RE-VERIFY ALL TEAMS (Restore to Previous State)');
  console.log('='.repeat(100));

  // Check if DIRECT_URL is set
  if (!process.env.DIRECT_URL) {
    console.error('\n❌ Error: DIRECT_URL not found in .env file');
    console.error('Please add DIRECT_URL to your .env file');
    process.exit(1);
  }

  // Get unverified teams
  console.log('\n📊 Finding all teams with PAYMENT_VERIFICATION status...');
  const teams = await getUnverifiedTeams();

  if (teams.length === 0) {
    console.log('✅ No teams found with PAYMENT_VERIFICATION status');
    console.log('   (All teams are already REGISTERED)');
    await pool.end();
    return;
  }

  console.log(`⚠️  Found ${teams.length} teams to re-verify:\n`);

  // Show first 10, then indicate more
  const displayCount = Math.min(10, teams.length);
  for (let i = 0; i < displayCount; i++) {
    const team = teams[i];
    console.log(
      `   ${String(i + 1).padStart(3, ' ')}. ${team.teamName.padEnd(40, ' ')} (${team.id})`
    );
  }

  if (teams.length > 10) {
    console.log(`   ... and ${teams.length - 10} more teams`);
  }

  // Confirm
  console.log('\n' + '='.repeat(100));

  if (process.argv.includes('--force') || process.argv.includes('-y')) {
    // Auto-confirm with --force or -y flag
    console.log(`\n✅ Auto-confirming (--force flag detected)...\n`);

    // Execute
    console.log(`🔄 Re-verifying ${teams.length} teams...\n`);
    const teamIds = teams.map((t) => t.id);
    const { updated, failed } = await reVerifyTeamsBatch(teamIds);

    console.log('\n' + '='.repeat(100));
    console.log('✅ RE-VERIFICATION COMPLETE');
    console.log('='.repeat(100));
    console.log(`  Successfully re-verified: ${updated}`);
    console.log(`  Failed: ${failed}`);
    console.log('\n  Status changed from: PAYMENT_VERIFICATION → REGISTERED');
    console.log('  Database is now back to state before you realized the accident');
    console.log('='.repeat(100) + '\n');
  } else {
    // Interactive mode - require user input
    const answer = await promptUser(
      `\n❓ Re-verify (set to REGISTERED) all ${teams.length} teams? (yes/no): `
    );

    if (answer.toLowerCase() !== 'yes') {
      console.log('❌ Cancelled - no changes made');
      await pool.end();
      return;
    }

    // Execute
    console.log(`\n🔄 Re-verifying ${teams.length} teams...\n`);
    const teamIds = teams.map((t) => t.id);
    const { updated, failed } = await reVerifyTeamsBatch(teamIds);

    console.log('\n' + '='.repeat(100));
    console.log('✅ RE-VERIFICATION COMPLETE');
    console.log('='.repeat(100));
    console.log(`  Successfully re-verified: ${updated}`);
    console.log(`  Failed: ${failed}`);
    console.log('\n  Status changed from: PAYMENT_VERIFICATION → REGISTERED');
    console.log('  Database is now back to state before you realized the accident');
    console.log('='.repeat(100) + '\n');
  }

  await pool.end();
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n❌ Process interrupted');
  await pool.end();
  process.exit(1);
});

main().catch(async (error) => {
  console.error('❌ Fatal error:', (error as Error).message);
  await pool.end();
  process.exit(1);
});