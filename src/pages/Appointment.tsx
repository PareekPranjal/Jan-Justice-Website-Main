import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { appointmentApi, settingsApi, type Appointment } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar, Clock, User, Mail, Phone, FileText,
  CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Scale, TrendingUp, Loader2, Check, ArrowRight, ArrowLeft, CalendarCheck,
  LogIn, CalendarDays, UserCheck, MessageSquare, RefreshCw, Tag,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "legal" as const,
    title: "Legal Consultation",
    description: "Contract law, litigation, compliance & family law matters.",
    Icon: Scale,
  },
  {
    id: "career" as const,
    title: "Career Coaching",
    description: "Resume review, interview prep & law career strategy.",
    Icon: TrendingUp,
  },
];

const ALL_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Date & Time" },
  { id: 3, label: "Details" },
  { id: 4, label: "Review" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ds: string) {
  return new Date(ds).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function toDateStr(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const map: Record<Appointment["status"], { label: string; cls: string }> = {
    pending:   { label: "Pending — Awaiting Approval",   cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    confirmed: { label: "Confirmed — Appointment Fixed", cls: "bg-green-50 text-green-700 border-green-200" },
    completed: { label: "Completed",                     cls: "bg-blue-50 text-blue-700 border-blue-200" },
    cancelled: { label: "Cancelled",                     cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const c = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
      {c.label}
    </span>
  );
}

// ─── Calendar sub-component (reused for booking + reschedule) ────────────────

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}

function CalendarPicker({ selectedDate, onSelect }: CalendarPickerProps) {
  const todayMidnight = new Date(); todayMidnight.setHours(0, 0, 0, 0);
  const [calMonth, setCalMonth] = useState(selectedDate?.getMonth() ?? todayMidnight.getMonth());
  const [calYear, setCalYear]   = useState(selectedDate?.getFullYear() ?? todayMidnight.getFullYear());

  const daysInMonth    = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

  const isDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day); d.setHours(0, 0, 0, 0);
    return d < todayMidnight || d.getDay() === 0;
  };
  const isSelected = (day: number) =>
    !!selectedDate && selectedDate.getDate() === day &&
    selectedDate.getMonth() === calMonth && selectedDate.getFullYear() === calYear;
  const isToday = (day: number) =>
    new Date(calYear, calMonth, day).toDateString() === todayMidnight.toDateString();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">{MONTH_NAMES[calMonth]} {calYear}</span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-1">
        {DAY_NAMES.map(d => (
          <span key={d} className="text-xs font-medium text-gray-400 pb-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center gap-y-1">
        {Array.from({ length: firstDayOfMonth }, (_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const today    = isToday(day);
          return (
            <button
              key={day}
              onClick={() => !disabled && onSelect(new Date(calYear, calMonth, day))}
              disabled={disabled}
              className={`mx-auto h-8 w-8 rounded-full text-xs transition-all ${
                selected  ? "bg-primary text-white font-bold shadow"
                : disabled ? "text-gray-300 cursor-not-allowed"
                : today   ? "border-2 border-primary text-primary font-semibold hover:bg-primary/10"
                :            "hover:bg-primary/10 text-gray-700"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-2">Sundays unavailable.</p>
    </div>
  );
}

// ─── Reschedule Modal ─────────────────────────────────────────────────────────

interface RescheduleModalProps {
  appt: Appointment;
  onClose: () => void;
  onSaved: () => void;
}

function RescheduleModal({ appt, onClose, onSaved }: RescheduleModalProps) {
  const { toast } = useToast();
  const [newDate, setNewDate]   = useState<Date | null>(null);
  const [newTime, setNewTime]   = useState("");

  const dateStr = newDate ? toDateStr(newDate) : "";

  const { data: availability, isLoading: loadingSlots } = useQuery({
    queryKey: ["availability", dateStr],
    queryFn: () => appointmentApi.getAvailableSlots(dateStr),
    enabled: !!dateStr,
  });

  const rescheduleMutation = useMutation({
    mutationFn: () =>
      appointmentApi.updateAppointment(appt._id, {
        appointmentDate: newDate!.toISOString(),
        appointmentTime: newTime,
      }),
    onSuccess: () => {
      toast({ title: "Appointment Rescheduled", description: "Your new date and time have been saved." });
      onSaved();
    },
    onError: (err: Error) => {
      toast({ title: "Failed to Reschedule", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Reschedule Appointment</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-mono">{appt.confirmationNumber}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-500">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current slot info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            <span className="font-semibold">Current slot:</span>{" "}
            {formatDate(appt.appointmentDate)} at {appt.appointmentTime}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CalendarPicker
              selectedDate={newDate}
              onSelect={d => { setNewDate(d); setNewTime(""); }}
            />

            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-primary" />
                {newDate
                  ? newDate.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
                  : "Select a date first"}
              </h3>
              {!newDate ? (
                <div className="flex items-center justify-center h-32 text-sm text-gray-400 border-2 border-dashed rounded-xl">
                  Pick a date to see slots
                </div>
              ) : loadingSlots ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {ALL_SLOTS.map(slot => {
                    const isBooked = availability?.bookedSlots.includes(slot);
                    const chosen   = newTime === slot;
                    return (
                      <button
                        key={slot}
                        disabled={!!isBooked}
                        onClick={() => setNewTime(slot)}
                        className={`py-2.5 px-2 text-sm rounded-lg border transition-all ${
                          isBooked ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                          : chosen  ? "bg-primary text-white border-primary font-semibold shadow"
                          :           "border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700"
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-xs">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => rescheduleMutation.mutate()}
              disabled={!newDate || !newTime || rescheduleMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {rescheduleMutation.isPending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                : <><CalendarCheck className="h-4 w-4" /> Confirm Reschedule</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guest Landing Page ───────────────────────────────────────────────────────

function GuestLanding() {
  const HOW_IT_WORKS = [
    { Icon: CalendarDays, title: "Pick a Service",     desc: "Choose Legal Consultation or Career Coaching based on your needs." },
    { Icon: Clock,        title: "Select Date & Time", desc: "Browse available slots and pick what works for you." },
    { Icon: UserCheck,    title: "Submit Request",     desc: "Fill your details and send the booking request to admin." },
    { Icon: MessageSquare, title: "Get Confirmed",     desc: "Admin approves your slot and you're ready to connect." },
  ];

  return (
    <>
      <Helmet>
        <title>Consultancy | Jan Justice</title>
        <meta name="description" content="Book a legal or career consultation with Jan Justice experts." />
      </Helmet>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow px-4 py-14">
          <div className="max-w-3xl mx-auto space-y-14">

            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Calendar className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Book a Consultation</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Get expert guidance from experienced Indian legal professionals.
              </p>

              {/* Login CTA */}
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  to="/login"
                  state={{ from: "/appointment" }}
                  className="flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  Login to Book Appointment
                </Link>
                <span className="text-sm text-gray-400">Don't have an account?</span>
              </div>
              <div>
                <Link
                  to="/login"
                  state={{ from: "/appointment" }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Create an account →
                </Link>
              </div>
            </div>

            {/* Services preview */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">What We Offer</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {SERVICES.map(({ Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 p-5 bg-white border rounded-xl shadow-soft"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-900">{title}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Book Now</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">How It Works</h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {HOW_IT_WORKS.map(({ Icon, title, desc }, i) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4">
              <p className="text-gray-700 font-medium">Ready to get started?</p>
              <Link
                to="/login"
                state={{ from: "/appointment" }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Login & Book Now
              </Link>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AppointmentPage() {
  const { user } = useAuth();

  // Show guest page if not logged in — no hooks dependency on user
  if (!user) return <GuestLanding />;

  return <AuthenticatedBooking user={user} />;
}

// ─── Authenticated Booking ────────────────────────────────────────────────────

function AuthenticatedBooking({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"book" | "my-appointments">("book");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form
  const [serviceType,    setServiceType]    = useState<"legal" | "career">("legal");
  const [selectedDate,   setSelectedDate]   = useState<Date | null>(null);
  const [selectedTime,   setSelectedTime]   = useState("");
  const [customTime,      setCustomTime]      = useState("");
  const [customTimeError, setCustomTimeError] = useState("");
  const [useCustomTime,   setUseCustomTime]   = useState(false);
  const [clientName,     setClientName]     = useState(`${user.firstName} ${user.lastName}`);
  const [clientEmail,    setClientEmail]    = useState(user.email);
  const [clientPhone,    setClientPhone]    = useState("");
  const [notes,          setNotes]          = useState("");
  const [transactionId,  setTransactionId]  = useState("");

  // Coupon
  const [couponCode,     setCouponCode]     = useState("");
  const [couponApplied,  setCouponApplied]  = useState<{ code: string; discountType: "percent" | "fixed"; discountValue: number } | null>(null);
  const [couponError,    setCouponError]    = useState("");
  const [couponLoading,  setCouponLoading]  = useState(false);

  // Errors
  const [nameError,  setNameError]  = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [utrError,   setUtrError]   = useState("");

  // Success
  const [booked, setBooked] = useState<Appointment | null>(null);

  // Reschedule
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);

  // ─── Queries ───────────────────────────────────────────────────────────────

  const { data: pubSettings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn:  settingsApi.getPublicSettings,
    staleTime: 5 * 60 * 1000,
  });

  const fee = pubSettings?.consultationFee ?? 500;
  const upiId = pubSettings?.upiId || "yourname@upi";
  const upiQrUrl = pubSettings?.upiQrUrl || "";

  const finalPrice = couponApplied
    ? couponApplied.discountType === "percent"
      ? Math.max(0, fee - Math.round((fee * couponApplied.discountValue) / 100))
      : Math.max(0, fee - couponApplied.discountValue)
    : fee;

  const dateStr = selectedDate ? toDateStr(selectedDate) : "";

  const { data: availability, isLoading: loadingSlots } = useQuery({
    queryKey: ["availability", dateStr],
    queryFn:  () => appointmentApi.getAvailableSlots(dateStr),
    enabled:  !!dateStr,
  });

  const { data: myAppts = [], isLoading: loadingMyAppts } = useQuery({
    queryKey: ["myAppointments", user.email],
    queryFn:  () => appointmentApi.getAppointments({ email: user.email }),
  });

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: appointmentApi.createAppointment,
    onSuccess: (data) => {
      setBooked(data);
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
    onError: (err: Error) => {
      toast({ title: "Booking Failed", description: err.message, variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: appointmentApi.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      toast({ title: "Appointment Cancelled", description: "Your appointment has been cancelled." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  // Validates "H:MM AM/PM" or "HH:MM AM/PM" — hours 1-12, minutes 00-59
  const VALID_TIME = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM|am|pm)$/;
  const isCustomTimeValid = !useCustomTime || VALID_TIME.test(customTime.trim());

  const service = SERVICES.find(s => s.id === serviceType)!;
  const activeTime = useCustomTime ? customTime.trim().toUpperCase() : selectedTime;

  const validateDetails = () => {
    let ok = true;
    if (!clientName.trim())                                { setNameError("Name is required");           ok = false; } else setNameError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) { setEmailError("Valid email required");       ok = false; } else setEmailError("");
    if (!clientPhone.trim())                               { setPhoneError("Phone number is required");  ok = false; } else setPhoneError("");
    if (!notes.trim())                                     { setNotesError("Please describe your requirements"); ok = false; } else setNotesError("");
    return ok;
  };

  const validateUtr = () => {
    if (!transactionId.trim()) { setUtrError("UTR / Transaction ID is required after payment"); return false; }
    setUtrError("");
    return true;
  };

  const handleNext = () => {
    if (step === 3 && !validateDetails()) return;
    setStep(s => (s + 1) as typeof step);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Enter a coupon code"); return; }
    setCouponLoading(true); setCouponError("");
    try {
      const result = await settingsApi.validateCoupon(couponCode.trim());
      setCouponApplied(result);
      setCouponError("");
    } catch (err: unknown) {
      setCouponError(err instanceof Error ? err.message : "Invalid coupon");
      setCouponApplied(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleBook = () => {
    if (!validateUtr()) return;
    createMutation.mutate({
      serviceType,
      serviceTitle:    service.title,
      servicePrice:    finalPrice,
      appointmentDate: selectedDate!.toISOString(),
      appointmentTime: activeTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
      transactionId:   transactionId.trim(),
    });
  };

  // ─── Success screen ────────────────────────────────────────────────────────

  if (booked) {
    return (
      <>
        <Helmet><title>Booking Confirmed | Jan Justice</title></Helmet>
        <div className="bg-background min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-start justify-center px-4 py-12">
            <div className="max-w-lg w-full">
              <div className="bg-white border rounded-2xl p-8 text-center shadow-soft space-y-5">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Booking Request Sent!</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Awaiting admin approval.</p>
                </div>
                <div className="bg-gray-50 border rounded-xl divide-y text-left">
                  {[
                    { label: "Confirmation #", value: booked.confirmationNumber, mono: true  },
                    { label: "Service",        value: booked.serviceTitle,       mono: false },
                    { label: "Date",           value: formatDate(booked.appointmentDate), mono: false },
                    { label: "Time",           value: booked.appointmentTime,    mono: false },
                    { label: "Fee",            value: `₹${booked.servicePrice ?? fee}`, mono: false },
                    { label: "UTR / Txn ID",   value: booked.transactionId || "—", mono: true },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-medium ${mono ? "font-mono text-primary" : "text-gray-800"}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <span className="text-gray-500">Status</span>
                    <StatusBadge status={booked.status} />
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800 text-left">
                  <AlertCircle className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                  Admin will review and confirm your slot. Track in <strong>My Appointments</strong>.
                </div>
                <button
                  onClick={() => { setBooked(null); setStep(1); setSelectedDate(null); setSelectedTime(""); setCustomTime(""); setUseCustomTime(false); setNotes(""); setTransactionId(""); setCouponCode(""); setCouponApplied(null); setActiveTab("my-appointments"); }}
                  className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  View My Appointments
                </button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // ─── Main page ─────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Book Consultation | Jan Justice</title>
        <meta name="description" content="Book a legal or career consultation." />
      </Helmet>

      {/* Reschedule modal — rendered at root so it overlays everything */}
      {reschedulingAppt && (
        <RescheduleModal
          appt={reschedulingAppt}
          onClose={() => setReschedulingAppt(null)}
          onSaved={() => {
            setReschedulingAppt(null);
            queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
          }}
        />
      )}

      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow px-4 py-10">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Page header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Book a Consultation</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Choose a service, pick a slot, and we'll confirm your booking.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["book", "my-appointments"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "book" ? "Book Appointment" : "My Appointments"}
                  {tab === "my-appointments" && myAppts.length > 0 && (
                    <span className="h-5 min-w-5 px-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      {myAppts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ═══ BOOK TAB ════════════════════════════════════════════════════ */}
            {activeTab === "book" && (
              <div className="bg-white border rounded-2xl overflow-hidden shadow-soft">
                {/* Step indicator */}
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="flex items-center">
                    {STEPS.map((s, i) => (
                      <div key={s.id} className="flex items-center flex-1 min-w-0">
                        <div className="flex items-center gap-2 shrink-0">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            step > s.id ? "bg-primary text-white" : step === s.id ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                          }`}>
                            {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
                          </div>
                          <span className={`text-xs font-medium hidden sm:block ${step === s.id ? "text-primary" : "text-gray-400"}`}>
                            {s.label}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? "bg-primary" : "bg-gray-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">

                  {/* Step 1 — Service */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <h2 className="text-base font-semibold text-gray-800">Choose a Service</h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {SERVICES.map(({ id, title, description, Icon }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setServiceType(id)}
                            className={`text-left p-5 border-2 rounded-xl transition-all ${
                              serviceType === id ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/40"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                serviceType === id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                              }`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm">{title}</span>
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Book Now</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{description}</p>
                              </div>
                            </div>
                            {serviceType === id && (
                              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                                <Check className="h-3.5 w-3.5" /> Selected
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end pt-1">
                        <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          Next <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Date & Time */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-base font-semibold text-gray-800">Pick a Date & Time</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <CalendarPicker
                          selectedDate={selectedDate}
                          onSelect={d => { setSelectedDate(d); setSelectedTime(""); }}
                        />
                        <div>
                          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
                            <Clock className="h-4 w-4 text-primary" />
                            {selectedDate
                              ? selectedDate.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })
                              : "Select a date first"}
                          </h3>
                          {!selectedDate ? (
                            <div className="flex items-center justify-center h-36 text-sm text-gray-400 border-2 border-dashed rounded-xl">
                              Pick a date to see available slots
                            </div>
                          ) : loadingSlots ? (
                            <div className="flex items-center justify-center h-36">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                {ALL_SLOTS.map(slot => {
                                  const isBooked = availability?.bookedSlots.includes(slot);
                                  const isChosen = !useCustomTime && selectedTime === slot;
                                  return (
                                    <button
                                      key={slot}
                                      disabled={!!isBooked}
                                      onClick={() => { setSelectedTime(slot); setUseCustomTime(false); }}
                                      className={`py-2.5 px-2 text-sm rounded-lg border transition-all ${
                                        isBooked ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                                        : isChosen ? "bg-primary text-white border-primary font-semibold shadow"
                                        :            "border-gray-200 hover:border-primary hover:bg-primary/5 text-gray-700"
                                      }`}
                                    >
                                      {slot}
                                      {isBooked && <span className="block text-xs" style={{ textDecoration: "none" }}>Booked</span>}
                                    </button>
                                  );
                                })}
                              </div>
                              {/* Custom time option */}
                              <div className={`border rounded-lg p-3 space-y-2 transition-all ${useCustomTime ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={useCustomTime}
                                    onChange={e => { setUseCustomTime(e.target.checked); if (!e.target.checked) { setCustomTime(""); setCustomTimeError(""); } }}
                                    className="accent-primary"
                                  />
                                  <span className="text-xs font-medium text-gray-700">Request a custom time</span>
                                </label>
                                {useCustomTime && (
                                  <div className="space-y-1">
                                    <input
                                      type="text"
                                      value={customTime}
                                      onChange={e => {
                                        const val = e.target.value;
                                        setCustomTime(val);
                                        if (val.trim() && !VALID_TIME.test(val.trim())) {
                                          setCustomTimeError("Use format like 11:00 AM or 2:30 PM (hours 1–12)");
                                        } else {
                                          setCustomTimeError("");
                                        }
                                      }}
                                      placeholder="e.g. 11:00 AM or 2:30 PM"
                                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                                        customTimeError ? "border-red-400 bg-red-50" : "border-primary/30"
                                      }`}
                                    />
                                    {customTimeError && (
                                      <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3 shrink-0" /> {customTimeError}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between pt-1">
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button
                          onClick={() => setStep(3)}
                          disabled={!selectedDate || (!useCustomTime && !selectedTime) || (useCustomTime && (!customTime.trim() || !isCustomTimeValid))}
                          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Details */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Your Details</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Pre-filled from your account. Edit if needed.</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              value={clientName}
                              onChange={e => { setClientName(e.target.value); setNameError(""); }}
                              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${nameError ? "border-red-400" : "border-gray-200"}`}
                            />
                          </div>
                          {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
                        </div>
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="email"
                              value={clientEmail}
                              onChange={e => { setClientEmail(e.target.value); setEmailError(""); }}
                              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${emailError ? "border-red-400" : "border-gray-200"}`}
                            />
                          </div>
                          {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                        </div>
                        {/* Phone — required */}
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                          <div className="relative max-w-xs">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="tel"
                              value={clientPhone}
                              onChange={e => { setClientPhone(e.target.value); setPhoneError(""); }}
                              placeholder="+91 98765 43210"
                              className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${phoneError ? "border-red-400" : "border-gray-200"}`}
                            />
                          </div>
                          {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                        </div>
                      </div>
                      {/* Notes — required */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Notes / Requirements <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <textarea
                            value={notes}
                            onChange={e => { setNotes(e.target.value); setNotesError(""); }}
                            maxLength={500}
                            rows={3}
                            placeholder="Describe your issue, question, or topics to discuss..."
                            className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none ${notesError ? "border-red-400" : "border-gray-200"}`}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {notesError ? <p className="text-xs text-red-500">{notesError}</p> : <span />}
                          <p className="text-xs text-gray-400">{notes.length}/500</p>
                        </div>
                      </div>
                      <div className="flex justify-between pt-1">
                        <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          Review Booking <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4 — Review */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Pay & Confirm</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Complete payment and enter your UTR to confirm the booking.</p>
                      </div>

                      {/* Booking summary */}
                      <div className="bg-gray-50 border rounded-xl divide-y">
                        {[
                          { label: "Service", value: service.title },
                          { label: "Date",    value: selectedDate?.toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" }) },
                          { label: "Time",    value: activeTime },
                          { label: "Name",    value: clientName },
                          { label: "Email",   value: clientEmail },
                          { label: "Phone",   value: clientPhone },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between px-4 py-3 text-sm">
                            <span className="text-gray-500">{label}</span>
                            <span className="font-medium text-gray-800">{value}</span>
                          </div>
                        ))}
                        <div className="px-4 py-3 text-sm">
                          <span className="text-gray-500 block mb-1">Notes</span>
                          <span className="text-gray-700">{notes}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 text-sm">
                          <span className="text-gray-500">Consultation Fee</span>
                          <div className="flex items-center gap-2">
                            {couponApplied && (
                              <span className="line-through text-gray-400">₹{fee}</span>
                            )}
                            <span className="font-bold text-gray-900">₹{finalPrice}</span>
                            {couponApplied && (
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                {couponApplied.discountType === "percent"
                                  ? `${couponApplied.discountValue}% off`
                                  : `₹${couponApplied.discountValue} off`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Coupon code */}
                      <div className="border border-gray-200 rounded-xl p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" /> Have a Discount Coupon?
                        </p>
                        {couponApplied ? (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-mono font-semibold flex-1">
                              <Check className="h-4 w-4" /> {couponApplied.code} applied
                            </span>
                            <button
                              onClick={() => { setCouponApplied(null); setCouponCode(""); }}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                              placeholder="Enter coupon code"
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                            <button
                              onClick={applyCoupon}
                              disabled={couponLoading || !couponCode.trim()}
                              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                              {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                            </button>
                          </div>
                        )}
                        {couponError && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> {couponError}
                          </p>
                        )}
                      </div>

                      {/* UPI Payment section */}
                      <div className="border-2 border-primary/20 rounded-xl overflow-hidden">
                        <div className="bg-primary/5 px-4 py-3 border-b border-primary/10">
                          <p className="text-sm font-semibold text-gray-800">Step 1 — Pay ₹{finalPrice} via UPI</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Scan with GPay, PhonePe, Paytm or any UPI app
                          </p>
                        </div>

                        <div className="p-4 flex flex-col sm:flex-row items-center gap-6">
                          <div className="shrink-0 flex flex-col items-center gap-2">
                            <div className="h-36 w-36 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-white overflow-hidden">
                              {upiQrUrl ? (
                                <img src={upiQrUrl} alt="UPI QR Code" className="h-32 w-32 object-contain" />
                              ) : (
                                <div className="flex flex-col items-center gap-1 text-center p-2">
                                  <span className="text-2xl">📱</span>
                                  <span className="text-[10px] text-gray-400 leading-tight">QR not set yet</span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">Scan & Pay ₹{finalPrice}</span>
                          </div>

                          <div className="flex-1 space-y-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Or pay directly to UPI ID</p>
                              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-2">
                                <span className="font-mono font-semibold text-gray-900 flex-1">{upiId}</span>
                                <button
                                  type="button"
                                  onClick={() => navigator.clipboard?.writeText(upiId)}
                                  className="text-xs text-primary font-medium hover:underline shrink-0"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <ul className="space-y-1 text-xs text-gray-500">
                              <li>✓ Pay exactly <strong className="text-gray-700">₹{finalPrice}</strong></li>
                              <li>✓ Use your registered name or email as remark</li>
                              <li>✓ Note the <strong className="text-gray-700">UTR / Transaction ID</strong> from your payment app</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* UTR input */}
                      <div className="border-2 border-primary/20 rounded-xl p-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-800">Step 2 — Enter UTR / Transaction ID</p>
                        <p className="text-xs text-muted-foreground">
                          Find it in your UPI app under payment history (e.g. <span className="font-mono">4234XXXXXXXX</span>)
                        </p>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={e => { setTransactionId(e.target.value); setUtrError(""); }}
                          placeholder="e.g. 423456789012"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${utrError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                        />
                        {utrError && (
                          <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" /> {utrError}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between pt-1">
                        <button
                          onClick={() => setStep(3)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button
                          onClick={handleBook}
                          disabled={createMutation.isPending}
                          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {createMutation.isPending
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</>
                            : <><CalendarCheck className="h-4 w-4" /> Submit Booking</>
                          }
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ═══ MY APPOINTMENTS TAB ═════════════════════════════════════════ */}
            {activeTab === "my-appointments" && (
              <div className="space-y-4">
                {loadingMyAppts ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : myAppts.length === 0 ? (
                  <div className="bg-white border rounded-2xl p-12 text-center shadow-soft">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 text-sm">No appointments yet.</p>
                    <button
                      onClick={() => setActiveTab("book")}
                      className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book Your First Appointment
                    </button>
                  </div>
                ) : (
                  myAppts.map(appt => (
                    <div key={appt._id} className="bg-white border rounded-xl p-5 space-y-3 shadow-soft">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-gray-900">{appt.serviceTitle}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{appt.confirmationNumber}</p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </div>

                      {/* Date + time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          {formatDate(appt.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          {appt.appointmentTime}
                        </div>
                      </div>

                      {appt.status === "confirmed" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-sm text-green-700 flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>Your appointment is confirmed! Our team will contact you shortly.</span>
                        </div>
                      )}

                      {appt.notes && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500">
                          <strong>Notes:</strong> {appt.notes}
                        </div>
                      )}

                      {/* Actions — only for pending or confirmed */}
                      {(appt.status === "pending" || appt.status === "confirmed") && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => setReschedulingAppt(appt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/15 transition-colors"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this appointment?")) {
                                cancelMutation.mutate(appt._id);
                              }
                            }}
                            disabled={cancelMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
