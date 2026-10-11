> **BrainSync Context Pumper** 🧠
> Dynamically loaded for active file: `src\components\ExperiencesAISection.tsx` (Domain: **Frontend (React/UI)**)

### 📐 Frontend (React/UI) Conventions & Fixes
- **[what-changed] 🟢 Edited src/components/SpotHotelsModal.tsx (10 changes, 86min)**: Active editing session on src/components/SpotHotelsModal.tsx.
10 content changes over 86 minutes.
- **[what-changed] 🟢 Edited src/components/TouristSpotToBooking.tsx (9 changes, 71min)**: Active editing session on src/components/TouristSpotToBooking.tsx.
9 content changes over 71 minutes.
- **[decision] Optimized Sparkles — fixes memory leak from uncleared timers**: -   Building2, Sparkles, Compass, Key, Star, ShieldCheck, 
+   Building2, Sparkles, Compass, Zap, Waves
-   Zap, Award, MapPin, CheckCircle2, HeartHandshake, Waves
+ } from "lucide-react";
- } from "lucide-react";
+ 
- 
+ interface StayBuddyLoaderProps {
- interface StayBuddyLoaderProps {
+   message?: string;
-   message?: string;
+   subtext?: string;
-   subtext?: string;
+ }
- }
+ 
- 
+ const STEPS = [
- const STEPS = [
+   {
-   {
+     title: "গ্লোবাল সার্ভারে কানেক্ট করা হচ্ছে...",
-     title: "গ্লোবাল সার্ভারে কানেক্ট করা হচ্ছে...",
+     titleEn: "Connecting to StayBuddy Network...",
-     titleEn: "Connecting to StayBuddy Network...",
+     icon: Compass,
-     icon: Compass,
+     color: "from-slate-600 to-slate-800"
-     badge: "NETWORK",
+   },
-     color: "from-cyan-500 to-blue-500"
+   {
-   },
+     title: "ভেরিফাইড ফাইভ স্টার হোটেল ও স্যুট খোঁজা হচ্ছে...",
-   {
+     titleEn: "Searching 5-Star Verified Stays & Luxury Suites...",
-     title: "ভেরিফাইড ফাইভ স্টার হোটেল ও স্যুট খোঁজা হচ্ছে...",
+     icon: Building2,
-     titleEn: "Searching 5-Star Verified Stays & Luxury Suites...",
+     color: "from-teal-500 to-teal-700"
-     icon: Building2,
+   },
-     badge: "VERIFIED",
+   {
-     color: "from-rose-500 to-pink-500"
+     title: "বেস্ট ডিসকাউন্ট ও স্পেশাল অফার ফিল্টার করা হচ্ছে...",
-   },
+     titleEn: "Applying Best Rates & Up to 50% Flash Sale Discounts...",
-   {
+     icon: Zap,
-     title: "বেস্ট ডিসকাউন্ট ও স্পেশাল অফার ফিল্টার করা হচ্ছে...",
+     color: "from-amber-500 to-orange-600"
-     titleEn: "Applying Best Rates & Up to 50% Flash Sale Discounts...",
+   },
-     icon: Zap,
+   {
-     badge: "OFFERS",
+     title: "স্মার্ট AI এক্সপেরিয়েন্স ও সার্ভিস তৈরি হচ্ছে...",
-     color: "from-amber-400 to-orange-500"
+     titleEn: "Personalizing Your Stay Experience...",
-   },
+     icon: Sparkles,
-   {
+     color: "from-indigo-500 to-purple-600"
-     title: "স্মার্ট AI এক্সপেরিয়েন্স ও সার্ভিস তৈরি হচ্ছে...",
+   }
-     tit
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [StayBuddyLoaderProps, STEPS, StayBuddyLoader, default]
- **[what-changed] 🟢 Edited src/pages/BecomeAHost.tsx (21 changes, 104min)**: Active editing session on src/pages/BecomeAHost.tsx.
21 content changes over 104 minutes.
- **[what-changed] 🟢 Edited src/pages/PropertyDetails.tsx (13 changes, 90min)**: Active editing session on src/pages/PropertyDetails.tsx.
13 content changes over 90 minutes.
- **[what-changed] 🟢 Edited src/pages/PropertyDetails.tsx (19 changes, 31min)**: Active editing session on src/pages/PropertyDetails.tsx.
19 content changes over 31 minutes.
- **[what-changed] 🟢 Edited src/pages/NationalProposal.tsx (11 changes, 183min)**: Active editing session on src/pages/NationalProposal.tsx.
11 content changes over 183 minutes.
- **[problem-fix] problem-fix in Index.tsx**: -                     }
+                         setLoading(false);
-                 })
+                     }
-                 .catch((err) => {
+                 });
-                     console.error("Failed to load initial data:", err);
+         };
-                 })
+         loadData();
-                 .finally(() => {
+         return () => { alive = false; };
-                     if (alive) setLoading(false);
+     }, []);
-                 });
+ 
-         };
+     if (loading) return (
-         loadData();
+         <div className="min-h-screen bg-background flex flex-col items-center justify-center">
-         return () => { alive = false; };
+             <Loader2 className="w-12 h-12 animate-spin text-[#FF385C] mb-4" />
-     }, []);
+             <p className="text-slate-500 font-medium">Loading amazing stays...</p>
- 
+         </div>
-     if (loading) return (
+     );
-         <div className="min-h-screen bg-background flex flex-col items-center justify-center">
+ 
-             <Loader2 className="w-12 h-12 animate-spin text-[#FF385C] mb-4" />
+     return (
-             <p className="text-slate-500 font-medium">Loading amazing stays...</p>
+         <div className="min-h-screen bg-[#FAFAFA]">
-         </div>
+             <Header />
-     );
+ 
- 
+             {/* ═══════════ HERO SECTION ═══════════ */}
-     return (
+             <section className="hero-section relative">
-         <div className="min-h-screen bg-[#FAFAFA]">
+                 {/* Background image with overlay */}
-             <Header />
+                 <div className="absolute inset-0">
- 
+                     <img
-             {/* ═══════════ HERO SECTION ═══════════ */}
+                         src={heroImg}
-             <section className="hero-section relative">
+                         alt="Hero"
-                 {/* Background image with overlay */}
+                         className="w-full 
… [diff truncated]

📌 IDE AST Context: Modified symbols likely include [Index, default]
