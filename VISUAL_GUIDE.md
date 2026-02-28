# 🎨 NextHire - Visual UI Guide

This document describes the visual layout and structure of each page in NextHire.

## 🎨 Color Palette

```
Primary (Blue/Indigo):
#3b82f6 - Main brand color
#2563eb - Darker shade
#1d4ed8 - Darkest shade

Success (Green):
#10b981 - Success states

Warning (Orange):
#f59e0b - Warnings

Error (Red):
#ef4444 - Errors

Info (Purple):
#8b5cf6 - Information
```

## 📱 Page Layouts

### 1. Landing Page (Public)

```
┌─────────────────────────────────────────────────────┐
│  🌐 Navbar (White, Transparent)                     │
│  Logo: NextHire          [Get Started] Button       │
├─────────────────────────────────────────────────────┤
│                                                      │
│         🎯 Hero Section (Gradient Background)       │
│                                                      │
│    AI-POWERED RECRUITMENT Badge                     │
│                                                      │
│    NextHire – AI-Powered                            │
│    Resume Screening                                 │
│    (Large, Bold Typography)                         │
│                                                      │
│    Subtext: Upload resumes and instantly...         │
│                                                      │
│    [Get Started →]  [Learn More]                    │
│                                                      │
│    ┌──────────────────────────────────┐             │
│    │  Illustration / Preview Image    │             │
│    │  (Cards/Dashboard Visual)        │             │
│    └──────────────────────────────────┘             │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│         📋 Features Section (White Background)      │
│                                                      │
│         Why Choose NextHire?                        │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │  ⚡      │  │  🛡️      │  │  📈      │             │
│  │Lightning │  │Accurate  │  │  Smart  │             │
│  │  Fast   │  │Reliable  │  │Analytics│             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                      │
├─────────────────────────────────────────────────────┤
│         🎉 CTA Section (Blue Gradient)              │
│         Ready to Transform Your Hiring?             │
│              [Start Free Today]                     │
├─────────────────────────────────────────────────────┤
│         📄 Footer (Dark Background)                 │
│         © 2026 NextHire. All rights reserved.       │
└─────────────────────────────────────────────────────┘
```

### 2. Dashboard (Protected)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar  │  Navbar + Main Content                  │
│           │                                          │
│  NextHire │  Welcome to NextHire      🌙 [Avatar]   │
│  Logo     │                                          │
│           │  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│ ───────   │  │📄  │ │🏆  │ │📈  │ │👥  │            │
│           │  │156 │ │84.5│ │89% │ │12  │            │
│ 📊 Dash   │  │Res │ │Avg │ │Mat │ │New │            │
│ 📤 Upload │  └────┘ └────┘ └────┘ └────┘            │
│ 📈 Analyt │                                          │
│ ⚙️  Sett  │  ┌─────────────────────────────┐        │
│           │  │🔍 Search  [Filter] [Sort]   │        │
│           │  └─────────────────────────────┘        │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ Table: All Resumes             │    │
│           │  ├──────┬────────┬──────┬────────┤    │
│           │  │Name  │Skills  │Score │Actions │    │
│           │  ├──────┼────────┼──────┼────────┤    │
│           │  │John  │Python  │ 85   │👁️ 🗑️  │    │
│           │  │Jane  │React   │ 78   │👁️ 🗑️  │    │
│           │  │Mike  │Java    │ 92   │👁️ 🗑️  │    │
│           │  └──────┴────────┴──────┴────────┘    │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

### 3. Upload Resume

```
┌─────────────────────────────────────────────────────┐
│  Sidebar  │  Upload Resume                          │
│           │                                          │
│           │  Upload a resume to extract candidate   │
│           │  information using AI                    │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │                                 │    │
│           │  │        📤 Upload Icon           │    │
│           │  │                                 │    │
│           │  │  Drag & drop your resume here   │    │
│           │  │  or click to browse files       │    │
│           │  │                                 │    │
│           │  │  Supports PDF, DOCX, and TXT    │    │
│           │  │                                 │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │  File Preview:                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ 📄 resume.pdf  (125 KB)    ❌   │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │  Progress: ████████░░ 80%               │
│           │                                          │
│           │  [✅ Extract Data]                      │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

### 4. Results Display (After Upload)

```
┌─────────────────────────────────────────────────────┐
│  Sidebar  │  ✅ Resume parsed successfully!         │
│           │                       [Upload Another]   │
│           │                                          │
│           │  ┌─────┐  ┌─────┐  ┌─────┐             │
│           │  │👤   │  │🏆   │  │📊   │             │
│           │  │Name │  │Score│  │Match│             │
│           │  │John │  │ 85  │  │ 92% │             │
│           │  │Email│  │████ │  │ ⭕  │             │
│           │  │Phone│  └─────┘  └─────┘             │
│           │  └─────┘                                │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ 💼 Skills                       │    │
│           │  │ [Python] [React] [Node.js]      │    │
│           │  │ [AWS] [Docker] [ML]             │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │  ┌──────────┐  ┌──────────┐             │
│           │  │💼 Exp    │  │🎓 Edu    │             │
│           │  │Sr. SWE   │  │B.S. CS   │             │
│           │  │Tech Corp │  │MIT       │             │
│           │  └──────────┘  └──────────┘             │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

### 5. Analytics Page

```
┌─────────────────────────────────────────────────────┐
│  Sidebar  │  Analytics                              │
│           │  Insights and statistics from your       │
│           │  resume database                         │
│           │                                          │
│           │  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│           │  │156 │ │84.5│ │Pyth│ │89% │            │
│           │  │Res │ │Avg │ │Top │ │Mat │            │
│           │  └────┘ └────┘ └────┘ └────┘            │
│           │                                          │
│           │  ┌──────────────┐ ┌──────────────┐      │
│           │  │ Bar Chart    │ │ Pie Chart    │      │
│           │  │              │ │              │      │
│           │  │ Resume Score │ │ Skills Dist  │      │
│           │  │ Comparison   │ │              │      │
│           │  │     ▄        │ │    🥧       │      │
│           │  │   ▄ █  ▄     │ │              │      │
│           │  │ ▄ █ █  █ ▄   │ │              │      │
│           │  └──────────────┘ └──────────────┘      │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ Top Skills Breakdown            │    │
│           │  │ Python    ████████░░ 45         │    │
│           │  │ JavaScript ███████░░░ 38         │    │
│           │  │ React      ██████░░░░ 32         │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

### 6. Settings Page

```
┌─────────────────────────────────────────────────────┐
│  Sidebar  │  Settings                               │
│           │  Manage your account and preferences    │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ 👤 Profile Settings             │    │
│           │  │                                 │    │
│           │  │ Full Name: [HR Manager      ]   │    │
│           │  │ Email:     [hr@company.com  ]   │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ 🔔 Notifications                │    │
│           │  │                                 │    │
│           │  │ Push Notifications      [●─○]   │    │
│           │  │ Email Alerts            [●─○]   │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │  ┌─────────────────────────────────┐    │
│           │  │ 💾 Data Management              │    │
│           │  │                                 │    │
│           │  │ Auto Backup             [●─○]   │    │
│           │  │ Retention: [90 days ▼]          │    │
│           │  └─────────────────────────────────┘    │
│           │                                          │
│           │                    [💾 Save Changes]    │
│           │                                          │
└───────────┴──────────────────────────────────────────┘
```

## 🎭 Component Styles

### Cards
```
┌─────────────────────────┐
│  Icon  Title            │
│                         │
│  Content goes here      │
│                         │
└─────────────────────────┘

Style:
- Background: White (light) / Gray-800 (dark)
- Border Radius: 2xl (16px)
- Shadow: md
- Padding: 6 (24px)
- Border: 1px gray-100
```

### Buttons

**Primary Button:**
```
┌─────────────────┐
│  Get Started → │
└─────────────────┘

Style:
- Background: Primary-600 (#3b82f6)
- Text: White
- Border Radius: 2xl
- Padding: px-6 py-3
- Shadow: lg
- Hover: bg-primary-700, shadow-xl
```

**Secondary Button:**
```
┌─────────────────┐
│   Learn More   │
└─────────────────┘

Style:
- Background: White
- Text: Gray-700
- Border: 1px gray-300
- Border Radius: 2xl
- Hover: border-primary-500
```

### Input Fields
```
┌──────────────────────────┐
│ Enter text here...       │
└──────────────────────────┘

Style:
- Background: White
- Border: 1px gray-300
- Border Radius: xl
- Padding: px-4 py-3
- Focus: ring-2 ring-primary-500
```

### Skill Tags
```
[Python] [React] [Node.js]

Style:
- Background: Primary-50
- Text: Primary-700
- Border: 1px primary-200
- Border Radius: full (pill shape)
- Padding: px-4 py-2
```

### Progress Bars

**Linear:**
```
████████░░░░░░░░  85/100

Style:
- Background: Gray-200
- Fill: Primary-600 or Green-500
- Height: 2 (8px)
- Border Radius: full
- Transition: all duration-500
```

**Circular:**
```
    ⭕
   92%

Style:
- SVG circle with stroke
- Stroke: Primary-600
- Animated dashoffset
```

## 🌙 Dark Mode Differences

### Light Mode
- Background: Gray-50
- Cards: White
- Text: Gray-900
- Borders: Gray-200

### Dark Mode
- Background: Gray-900
- Cards: Gray-800
- Text: White
- Borders: Gray-700

Transition: `transition-colors duration-200`

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
- Single column layouts
- Stacked cards
- Hamburger menu (if needed)
- Full-width cards

Tablet (768px - 1023px):
- 2-column grids
- Sidebar collapses (optional)
- Adjusted spacing

Desktop (1024px+):
- Full sidebar visible
- 3-4 column grids
- Optimal spacing
- Hover effects enabled
```

## 🎨 Icons Used

All icons from **Lucide React**:

- `Briefcase` - Logo, experience
- `User` - Profile, candidate
- `Mail` - Email
- `Phone` - Phone number
- `Upload` - File upload
- `FileText` - Resume/document
- `Search` - Search functionality
- `Filter` - Filter options
- `Eye` - View details
- `Trash2` - Delete
- `Moon` / `Sun` - Dark mode toggle
- `Award` - Score, skills
- `GraduationCap` - Education
- `TrendingUp` - Analytics, trends
- `BarChart3` - Charts
- `Settings` - Settings
- `Shield` - Security
- `Bell` - Notifications
- `Database` - Data management
- `CheckCircle` - Success
- `XCircle` - Error
- `Loader` - Loading
- `ArrowRight` - Navigation
- `Sparkles` - AI/special features

## 🖼️ Visual Hierarchy

### Typography Scale
```
Hero Headline: text-7xl (72px) - Bold
Page Title:    text-3xl (30px) - Bold
Section Title: text-xl (20px) - Semibold
Card Title:    text-lg (18px) - Semibold
Body Text:     text-base (16px) - Regular
Small Text:    text-sm (14px) - Regular
```

### Spacing Scale
```
Tight:    gap-2  (8px)
Normal:   gap-4  (16px)
Relaxed:  gap-6  (24px)
Loose:    gap-8  (32px)
```

### Layout Grid
```
1 column:  grid-cols-1
2 columns: md:grid-cols-2
3 columns: lg:grid-cols-3
4 columns: lg:grid-cols-4
```

## 🎯 Visual Best Practices Used

✅ Consistent spacing (4, 6, 8)
✅ Rounded corners (2xl = 16px)
✅ Soft shadows (md, lg, xl)
✅ Clear visual hierarchy
✅ Proper color contrast
✅ Hover states on interactive elements
✅ Loading states for async actions
✅ Error states with red accent
✅ Success states with green accent
✅ Smooth transitions (200-500ms)
✅ Icon + text combinations
✅ Ample whitespace
✅ Consistent border widths

---

**This visual guide helps you understand the design system used throughout NextHire!**
