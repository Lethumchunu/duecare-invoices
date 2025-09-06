import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utbiwofgoechbvpohawq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0Yml3b2Znb2VjaGJ2cG9oYXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5OTk2ODUsImV4cCI6MjA2NzU3NTY4NX0.N9KGSShQ7pHx0st6MnmLGaaat57oFwZbLsU95erPqlM';

export const supabase = createClient(supabaseUrl, supabaseKey);
