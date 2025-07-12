# Quick Fix Guide: Email Confirmation Issue

## 🚀 **Step 1: Go to Supabase Dashboard**
1. Open your browser
2. Go to [supabase.com](https://supabase.com)
3. Sign in to your account
4. Select your project

## 🔧 **Step 2: Run SQL Command**
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New Query"**
3. Copy and paste this exact SQL command:

```sql
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'ayush.pradhan6620@gmail.com';
```

4. Click **"Run"** button
5. You should see a success message

## 🧪 **Step 3: Test Login**
1. Go back to your app: `http://localhost:5173/test-auth`
2. Try logging in with your email and password
3. You should see: "✅ Login successful! Welcome Ayush Pradhan"

## 🔍 **Alternative: Check User Status**
If you want to see if your user exists, run this SQL:

```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'ayush.pradhan6620@gmail.com';
```

## 🎯 **Expected Results**
- ✅ User should be confirmed
- ✅ Login should work immediately
- ✅ No more "Invalid login credentials" errors

## 🆘 **If Still Not Working**
1. Try this SQL to confirm ALL users:
```sql
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
```

2. Or disable email confirmation in Supabase Dashboard:
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"

## 📝 **What This Does**
- Sets the `email_confirmed_at` timestamp for your user
- Allows login without email confirmation
- Bypasses the email verification requirement 