import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    "https://bwxhzglhvwjsyrbkghzn.supabase.co", // URL del proyecto
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eGh6Z2xodndqc3lyYmtnaHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMjEyNzMsImV4cCI6MjA4MDg5NzI3M30.ZSh6xhCG8jCXZwrB_iCcA5dOk8h9Y0OkXWj4nH1NGhM" // Clave de acceso
);