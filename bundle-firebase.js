// bundle-firebase.js
import * as esbuild from 'esbuild';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

esbuild
  .build({
    entryPoints: ['public/javascripts/firebase.js'],
    outfile: 'public/javascripts/firebase.bundle.js',
    bundle: true,
    platform: 'browser',
    format: 'esm',
    sourcemap: true,
    define: {
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      'process.env.FIREBASE_DATABASE_URL': JSON.stringify(process.env.FIREBASE_DATABASE_URL)
    }
  })
  .then(() => {
    console.log('Bundling complete: public/javascripts/firebase.bundle.js');
  })
  .catch((error) => {
    console.error('Bundling failed:', error);
    process.exit(1);
  });