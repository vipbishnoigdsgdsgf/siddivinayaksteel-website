# 🔧 Siddi Vinayaka Steel - Admin System Guide

## 🔑 Admin Access

### Admin Login Credentials
- **Primary Admin**: `omprkashbishnoi2000@gmail.com` (Owner)
- **Additional Admins**: `vipbishnoi47@gmail.com`, `ramubishnoi47@gmail.com`

### How to Access Admin Panel

1. **Login Process**:
   - Go to `/login` page
   - Login with any of the admin email addresses
   - Use regular email/password or phone/OTP authentication
   - After successful login, navigate to `/admin`

2. **Direct Admin Access**:
   - URL: `https://your-domain.com/admin`
   - The system automatically checks if you're an admin
   - Non-admin users will be redirected to home page

## 📊 Admin Dashboard Features

### 1. Dashboard Tab
- **Overview Statistics**:
  - Total Projects count
  - Total Users count 
  - Meetings scheduled
  - Reviews received
- **Recent Projects Table**: Latest 5 projects
- **Recent Reviews**: Latest 5 user reviews
- **Demo Data**: Button to add 50 sample projects for testing

### 2. Meetings Tab
- **Create New Meetings**: Add consultation meetings
- **Edit Meetings**: Modify existing meeting details
- **Delete Meetings**: Remove meetings (with confirmation)
- **Meeting Fields**:
  - Title (e.g., "Steel Railing Consultation")
  - Date and Time
  - Location and Address
  - Available Spots
  - Description

### 3. Meeting Registrations Tab
- **View All Registrations**: See who registered for meetings
- **Registration Details**:
  - User name, email, phone
  - Company/organization
  - Project requirements
  - Registration status (pending/approved/rejected)
- **Status Management**: Approve or reject registrations

### 4. Users Tab *(Coming Soon)*
- User management features
- View user profiles
- User activity tracking

### 5. Projects Tab *(Coming Soon)*
- Project portfolio management
- Add/edit/delete projects
- Project categorization

### 6. Reviews Tab *(Coming Soon)*
- Review moderation
- Respond to user reviews
- Review analytics

### 7. Settings Tab *(Coming Soon)*
- System configuration
- Email templates
- Notification settings

## 🎯 Meeting Scheduling System

### How It Works
1. **Admin Creates Meeting**:
   - Go to Admin Panel → Meetings Tab
   - Click "Add Meeting"
   - Fill in meeting details
   - Set available spots

2. **Users Register**:
   - Users can register via `/register-meeting/:id` URL
   - Form captures user details and requirements
   - Registration creates entry in `meeting_registrations` table

3. **Admin Reviews Registrations**:
   - Go to Admin Panel → Registrations Tab
   - View all registration requests
   - Approve/reject registrations
   - Contact users directly

### Meeting Registration Flow
```
User sees meeting → Registers → Admin gets notification → Admin reviews → Admin contacts user
```

## 💻 Technical Details

### Database Tables
- `meetings`: Store meeting information
- `meeting_registrations`: Store user registrations
- `profiles`: User profile information
- `projects`: Project portfolio
- `reviews`: User reviews
- `admin_notifications`: Admin notifications

### Admin Email Notifications
When users register for meetings, admins receive notifications at:
- `omprkashbishnoi2000@gmail.com` (Primary)
- `vipbishnoi47@gmail.com`
- `ramubishnoi47@gmail.com`

## 🚀 Getting Started as Admin

### Step 1: First Login
1. Visit your website
2. Click "Login" 
3. Enter your admin email: `omprkashbishnoi2000@gmail.com`
4. Complete login (email/password or phone OTP)

### Step 2: Access Admin Panel
1. Navigate to `/admin` or use direct URL
2. You'll see the admin dashboard

### Step 3: Create Your First Meeting
1. Go to "Meetings" tab
2. Click "Add Meeting"
3. Example meeting:
   - **Title**: "Free Steel Railing Consultation"
   - **Date**: Tomorrow's date
   - **Time**: "10:00 AM - 5:00 PM"
   - **Location**: "Siddi Vinayaka Steel Office"
   - **Address**: "Chengicherla X Road, Peerzadiguda, Hyderabad"
   - **Spots**: 5
   - **Description**: "Free consultation for custom steel railing projects"

### Step 4: Share Meeting Link
- Meeting URL format: `/register-meeting/[meeting-id]`
- Share this with potential customers
- They can register and you'll get notified

## 📱 Customer Registration Process

### For Customers:
1. **Visit Meeting Registration**:
   - URL: `/register-meeting/[meeting-id]`
   - Can access from project pages or direct links

2. **Fill Registration Form**:
   - Name, email, phone (required)
   - Company name (optional)
   - Project requirements (optional)
   - Agree to terms and conditions

3. **Submit Request**:
   - Registration is saved to database
   - Admin gets notification
   - User sees confirmation message

### Registration Features:
- **Auto-fill for logged-in users**: Form pre-populates with user profile data
- **Guest registration**: Non-registered users can still register
- **Mobile responsive**: Works perfectly on all devices
- **Validation**: Proper form validation and error handling

## 🔧 Admin Management Features

### Meeting Management
- **Create unlimited meetings**
- **Schedule consultation appointments**
- **Track available spots**
- **Edit meeting details anytime**
- **Delete meetings (with confirmation)**

### Registration Management
- **View all registration requests**
- **Filter by status (pending/approved/rejected)**
- **See detailed user information**
- **Approve/reject registrations**
- **Direct contact information available**

### Notification System
- **Real-time admin notifications**
- **Email alerts for new registrations**
- **Dashboard notification counter**

## 🎨 Usage Examples

### Example 1: Weekly Consultation
```
Title: Weekly Steel Consultation
Date: Every Saturday
Time: 9:00 AM - 6:00 PM
Location: Main Office
Spots: 10
Description: Weekly consultation for all steel work projects
```

### Example 2: Railing Showcase
```
Title: Custom Railing Design Session
Date: Next Friday  
Time: 2:00 PM - 5:00 PM
Location: Workshop
Spots: 5
Description: See our latest railing designs and discuss your requirements
```

### Example 3: Project-Specific Meeting
```
Title: Residential Steel Work Consultation  
Date: Tomorrow
Time: 11:00 AM - 1:00 PM
Location: Client Site Visit
Spots: 1
Description: On-site consultation for residential steel railing project
```

## 🔐 Security Features

### Access Control
- Only whitelisted admin emails can access admin panel
- Automatic redirect for non-admin users
- Session-based authentication

### Data Protection  
- All admin actions are logged
- Secure database connections
- User data privacy compliance

## 📞 Support & Contact

### For Technical Issues:
- Check browser console for errors
- Ensure stable internet connection
- Contact system administrator

### For Business Support:
- **Primary Contact**: omprkashbishnoi2000@gmail.com
- **Phone**: +91 8080482079, +91 9326698359
- **Address**: Chengicherla X Road, Peerzadiguda, Hyderabad

---

## 🎯 Quick Start Checklist

- [ ] Login with admin credentials
- [ ] Access `/admin` panel  
- [ ] Create your first meeting
- [ ] Test registration process
- [ ] Check notifications tab
- [ ] Review registration requests
- [ ] Contact your first customer!

**Your admin system is fully functional and ready to help you manage customer consultations efficiently!**