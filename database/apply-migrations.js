/**
 * Smart Bus AI — Supabase Migration Setup Script
 *
 * Applies all database migrations and seeds to your Supabase project.
 * Run with: node database/apply-migrations.js
 *
 * Requires environment variables:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service_role key
 *
 * Get your service_role key from: https://supabase.com/dashboard/project/_/settings/api
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables.');
  console.error('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Get your service_role key from Supabase Dashboard > Settings > API');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, 'migrations');
const seedsDir = path.join(__dirname, 'seeds');

async function executeSql(sql, label) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${label} failed: ${response.status} ${text}`);
  }
}

async function executeSqlDirect(sql, label) {
  // Supabase doesn't have an exec_sql RPC by default, so we use the SQL Editor API
  // This requires the service_role key
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'X-Supabase-Client-Telemetry-Remove-If-Unknown': 'true',
    },
    body: JSON.stringify({ query: sql }),
  });

  // If direct SQL execution isn't available, log instructions
  if (!response.ok) {
    console.warn(`⚠️  Could not execute SQL directly for ${label}.`);
    console.warn('   You will need to run this SQL manually in the Supabase SQL Editor.');
    console.warn('   SQL file content has been printed below.\n');
    console.log('--- SQL for ' + label + ' ---');
    console.log(sql);
    console.log('--- End SQL ---\n');
    return false;
  }
  return true;
}

async function applyFiles(dir, label) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  console.log(`\n📁 Applying ${label} (${files.length} files)`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`  ⏳ ${file}...`);

    try {
      await executeSql(sql, file);
      console.log(`  ✅ ${file}`);
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
      // Continue with other files
    }
  }
}

async function enableRealtime() {
  console.log('\n📡 Enabling Realtime on buses table...');
  const sql = `
-- Enable realtime replication on the buses table
-- This allows the passenger app to receive live location updates
INSERT INTO realtime.schema_mappings (server, schema_name, table_name, enabled)
VALUES ('realtime', 'public', 'buses', true)
ON CONFLICT (server, schema_name, table_name)
DO UPDATE SET enabled = true;
  `;

  try {
    await executeSql(sql, 'Enable Realtime');
    console.log('  ✅ Realtime enabled on buses table');
  } catch (err) {
    console.warn('  ⚠️  Could not enable realtime automatically.');
    console.warn('   Manual step: Go to Supabase Dashboard > Database > Replication');
    console.warn('   and add public.buses to supabase_realtime');
  }
}

async function main() {
  console.log('🚀 Smart Bus AI — Supabase Migration Setup');
  console.log(`   Project: ${SUPABASE_URL}`);

  // Apply migrations
  await applyFiles(migrationsDir, 'migrations');

  // Apply seeds
  await applyFiles(seedsDir, 'seeds');

  // Enable realtime
  await enableRealtime();

  console.log('\n✅ Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Verify tables in Supabase Dashboard > Table Editor');
  console.log('   2. Check Realtime is enabled in Database > Replication');
  console.log('   3. Start services: npm run dev');
  console.log('   4. Test API: curl http://localhost:3001/api/v1/buses');
}

main().catch(err => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
