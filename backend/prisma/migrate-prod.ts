// Production migration script for Vercel
import { execSync } from 'child_process';

export default async function migrateProd() {
  try {
    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Run migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Production migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  migrateProd();
}