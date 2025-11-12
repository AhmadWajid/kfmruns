# UCLA MSA Thursday Isha Ride Matching System

A community-driven ride-sharing platform for the UCLA Muslim Student Association to facilitate transportation to King Fahad Mosque for Thursday Isha prayers.

## 🕌 Features

- **Smart Matching**: Automatic matching based on pickup location and timing preferences
- **Driver Registration**: Easy form for drivers to offer rides
- **Rider Registration**: Simple form for riders to request transportation
- **Real-time Dashboard**: Live view of current matches and availability
- **Admin Panel**: Full management interface for ride coordination
- **Mobile-responsive**: Optimized for mobile devices
- **Islamic Design**: Culturally appropriate design with Arabic text and Islamic elements

## 🏗️ Architecture

### Server Actions Approach
This application uses **Next.js Server Actions** instead of traditional API routes, providing:

✅ **Better Performance**: Server-side execution with no API overhead  
✅ **Type Safety**: End-to-end TypeScript with server actions  
✅ **Simpler Architecture**: No separate API routes needed  
✅ **Better DX**: Direct function calls instead of fetch requests  
✅ **Automatic Optimization**: Next.js handles caching and optimization  
✅ **Progressive Enhancement**: Works without JavaScript enabled

### File Structure
```
src/
├── lib/
│   ├── actions/           # Server actions (replaces API routes)
│   │   ├── drivers.ts     # Driver CRUD operations
│   │   ├── riders.ts      # Rider CRUD operations
│   │   ├── dashboard.ts   # Dashboard data with matching
│   │   └── auth.ts        # Authentication actions
│   ├── supabase.ts        # Database client
│   ├── auth.ts            # Authentication utilities
│   └── utils.ts           # Helper functions
├── components/ui/          # Shadcn/ui components
└── types/api.ts           # TypeScript interfaces
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the SQL schema from `src/lib/supabase.ts` in your Supabase SQL editor
   - Get your project URL and anon key

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

### Main Pages
- **Landing Page** (`/`) - Entry point with Islamic greeting and action buttons
- **Driver Registration** (`/driver`) - Form for drivers to offer rides
- **Rider Registration** (`/rider`) - Form for riders to request rides
- **Public Dashboard** (`/dashboard`) - Live view of drivers, matches, and unmatched riders
- **Admin Panel** (`/admin`) - Full management interface (password protected)

### Server Actions (lib/actions/)
- `getDrivers()` - Fetch all drivers
- `createDriver()` - Create new driver
- `deleteDriver()` - Delete driver
- `getRiders()` - Fetch all riders
- `createRider()` - Create new rider
- `deleteRider()` - Delete rider
- `getDashboardData()` - Get dashboard with smart matching
- `loginAdmin()` - Admin authentication
- `logoutAdmin()` - Admin logout
- `verifyAdmin()` - Authentication verification

## 🗄️ Database Schema

The application uses two main tables:

### Drivers Table
```sql
CREATE TABLE drivers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  seats_available INT NOT NULL CHECK (seats_available > 0),
  pickup_area TEXT NOT NULL,
  time_preference TEXT NOT NULL CHECK (time_preference IN ('leave_early', 'stay_after', 'flexible')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Riders Table
```sql
CREATE TABLE riders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  seats_needed INT DEFAULT 1 CHECK (seats_needed > 0),
  pickup_area TEXT NOT NULL,
  time_preference TEXT NOT NULL CHECK (time_preference IN ('leave_early', 'stay_after', 'flexible')),
  notes TEXT,
  driver_id INT REFERENCES drivers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Pickup Areas

The system supports these UCLA pickup locations:
- Ackerman Turnaround
- Hilgard & Westholme
- Bruin Plaza
- Strathmore & Gayley
- Levering & Strathmore
- Weyburn & Kinross
- Westwood Village (Broxton Garage)
- De Neve Turnaround
- Rieber Turnaround
- Hedrick Turnaround
- Saxon Turnaround
- Engineering IV Turnaround
- Parking Lot 36 (Sunset Village)
- Sunset & Hilgard
- Other (custom location)

## ⏰ Time Preferences

- **Leave Early**: Right after prayer
- **Stay After**: Socialize/food
- **Flexible**: Either works

## 🔧 Smart Matching Algorithm

The system automatically matches riders with drivers based on:

1. **Location Priority**: Same pickup area first
2. **Time Compatibility**: Matching time preferences
3. **Seat Availability**: Ensuring sufficient seats
4. **Auto-assignment**: Automatically assigns riders when new drivers register

## 🎨 Design Features

### Islamic Design Elements
- Arabic text with proper RTL support
- Islamic color scheme (blues, golds, greens)
- Mosque emoji (🕌) and Islamic symbols
- Islamic greetings and duas
- Culturally appropriate language and tone

### Mobile-First Design
- Responsive grid layouts
- Touch-friendly buttons
- Optimized form inputs
- Fast loading and smooth animations

## 🔐 Admin Access

The admin panel is password-protected. Default password is `password` (hashed with bcrypt).

To change the admin password:
1. Generate a new hash: `bcrypt.hashSync('your_new_password', 10)`
2. Update the `ADMIN_PASSWORD_HASH` environment variable
or node scripts/generate-password.js "your-new-password"

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push
## 🔮 Future Enhancements

### Potential Features
1. **SMS Notifications**: Twilio integration for ride confirmations
2. **Email Reminders**: Automated reminders for Thursday prayers
3. **Calendar Integration**: Google Calendar events
4. **Rating System**: Driver/rider feedback
5. **Recurring Rides**: Weekly ride scheduling
6. **Group Management**: Multiple pickup locations
7. **Analytics Dashboard**: Usage statistics and insights

### Technical Improvements
1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: PWA capabilities
3. **Push Notifications**: Browser notifications
4. **Advanced Matching**: Machine learning algorithms
5. **Multi-language**: Arabic/English support

## 🤝 Contributing

This project is designed for the UCLA Muslim Student Association community. Contributions are welcome!

## 📝 License

This project is built for the UCLA Muslim Student Association community.

## 🆘 Support

For support or questions, contact the UCLA MSA leadership team.

---

**بارك الله فيكم** - May Allah bless you

Built with ❤️ for the Muslim community at UCLA# kfmruns
