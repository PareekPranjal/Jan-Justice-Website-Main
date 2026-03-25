import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { appointmentApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const services = [
  {
    id: "legal",
    icon: "scale",
    title: "Legal Consultation",
    description: "Contract law, litigation, compliance.",
    price: 150,
  },
  {
    id: "career",
    icon: "trending_up",
    title: "Legal Career Coaching",
    description: "Resume review, interview prep, law career strategy.",
    price: 100,
  },
];

const allTimeSlots = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "01:30 PM",
  "03:00 PM",
  "04:30 PM",
];

const Appointment = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState("legal");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [emailToSearch, setEmailToSearch] = useState("");

  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Fetch user's appointments - only when emailToSearch has a value
  const { data: myAppointments = [], isLoading: isLoadingAppointments, refetch: refetchAppointments } = useQuery({
    queryKey: ['myAppointments', emailToSearch],
    queryFn: () => appointmentApi.getAppointments({ email: emailToSearch }),
    enabled: !!emailToSearch,
  });

  const handleSearchAppointments = () => {
    if (searchEmail.trim()) {
      setEmailToSearch(searchEmail.trim());
    }
  };

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: appointmentApi.createAppointment,
    onSuccess: (data) => {
      toast({
        title: "Appointment Booked!",
        description: `Your confirmation number is ${data.confirmationNumber}. We'll send details to ${clientEmail}`,
      });
      // Reset form
      setSelectedTime("");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: appointmentApi.cancelAppointment,
    onSuccess: () => {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      refetchAppointments();
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedServiceData) return;

    createAppointmentMutation.mutate({
      serviceType: selectedService as 'legal' | 'career',
      serviceTitle: selectedServiceData.title,
      servicePrice: selectedServiceData.price,
      appointmentDate: selectedDate.toISOString(),
      appointmentTime: selectedTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
    });
  };

  const handleCancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointmentMutation.mutate(id);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonth = selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const formatAppointmentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { variant: "default" | "secondary" | "destructive" | "outline", icon: any } } = {
      pending: { variant: "secondary", icon: AlertCircle },
      confirmed: { variant: "default", icon: CheckCircle2 },
      completed: { variant: "outline", icon: CheckCircle2 },
      cancelled: { variant: "destructive", icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Book Consultation | Jan Justice - Expert Legal Advice</title>
        <meta name="description" content="Schedule a professional legal consultation or career coaching session with experienced Indian law experts." />
      </Helmet>

      <div className="bg-background min-h-screen flex flex-col">
        <Header showBackLink />

        <main className="flex-grow flex flex-col">
          <div className="flex flex-1 justify-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full">
              <Tabs defaultValue="book" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="book">Book Appointment</TabsTrigger>
                  <TabsTrigger value="my-appointments">My Appointments</TabsTrigger>
                </TabsList>

                {/* Book Appointment Tab */}
                <TabsContent value="book">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column - Service Selection */}
                    <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in">
                      <div className="flex flex-col gap-3">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                          Book an Appointment
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black">
                          Schedule Your Legal Consultation
                        </h1>
                        <p className="text-muted-foreground text-lg">
                          Expert legal advice and law career guidance from experienced Indian legal professionals.
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-wide">1. Select Service</h3>

                        <RadioGroup value={selectedService} onValueChange={setSelectedService} className="space-y-4">
                          {services.map((service) => (
                            <label
                              key={service.id}
                              className={`flex cursor-pointer flex-col gap-4 rounded-xl border-2 p-5 relative transition-all ${
                                selectedService === service.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value={service.id} className="sr-only" />
                              <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                  <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center text-primary border border-border">
                                    <span className="material-symbols-outlined text-2xl">{service.icon}</span>
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-bold">{service.title}</h4>
                                    <p className="text-muted-foreground text-sm mt-1">{service.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="block text-2xl font-black">&#8377;{service.price}</span>
                                  <span className="text-xs font-bold text-muted-foreground">/ hour</span>
                                </div>
                              </div>
                              {selectedService === service.id && (
                                <div className="absolute top-5 right-5 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                                </div>
                              )}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Right Column - Calendar & Form */}
                    <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: "100ms" }}>
                      <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden flex flex-col h-full">
                        <div className="px-6 py-5 border-b border-border bg-secondary/50 flex justify-between items-center">
                          <h3 className="font-bold text-lg">2. Select Date & Time</h3>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Calendar */}
                            <div className="flex flex-col gap-4">
                              <p className="font-bold flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {currentMonth}
                              </p>
                              <div className="grid grid-cols-7 text-center gap-2">
                                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                                  <span key={i} className="text-xs font-bold text-muted-foreground">
                                    {day}
                                  </span>
                                ))}
                                {calendarDays.map((date, index) => {
                                  const isToday = date.toDateString() === new Date().toDateString();
                                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                                  return (
                                    <button
                                      key={index}
                                      onClick={() => !isPast && setSelectedDate(date)}
                                      disabled={isPast}
                                      className={`h-10 w-10 rounded-full text-sm transition-all flex flex-col items-center justify-center ${
                                        isSelected
                                          ? "bg-primary text-primary-foreground font-bold shadow-md"
                                          : isPast
                                          ? "text-muted-foreground/30 cursor-not-allowed"
                                          : isToday
                                          ? "border-2 border-primary hover:bg-primary/10"
                                          : "hover:bg-secondary"
                                      }`}
                                    >
                                      <span>{date.getDate()}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Time Slots */}
                            <div className="flex flex-col gap-2">
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {selectedDate ? formatAppointmentDate(selectedDate.toISOString()).split(',')[0] + ', ' + selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Select a date"}
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {allTimeSlots.map((time) => (
                                  <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    disabled={!selectedDate}
                                    className={`py-2.5 px-3 text-sm font-medium rounded-lg border transition-all ${
                                      selectedTime === time
                                        ? "bg-primary text-primary-foreground border-primary shadow-md font-bold flex justify-between items-center"
                                        : !selectedDate
                                        ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                                        : "border-border hover:border-primary hover:bg-primary/5"
                                    }`}
                                  >
                                    {time}
                                    {selectedTime === time && (
                                      <span className="material-symbols-outlined text-sm">check</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Contact Form */}
                          <div className="pt-6 border-t border-border">
                            <h3 className="font-bold text-lg mb-4">3. Your Details</h3>
                            <div className="flex flex-col gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  Full Name *
                                </Label>
                                <Input
                                  id="name"
                                  placeholder="Rahul Sharma"
                                  value={clientName}
                                  onChange={(e) => setClientName(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  Email Address *
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="rahul@example.com"
                                  value={clientEmail}
                                  onChange={(e) => setClientEmail(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Phone (Optional)
                                </Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  placeholder="+91 98765 43210"
                                  value={clientPhone}
                                  onChange={(e) => setClientPhone(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes" className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Additional Notes (Optional)
                                </Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Please describe your requirements or any specific topics you'd like to discuss..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  rows={3}
                                  maxLength={500}
                                />
                                <p className="text-xs text-muted-foreground">{notes.length}/500 characters</p>
                              </div>
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="w-full h-12 shadow-elevated"
                            onClick={handleBookAppointment}
                            disabled={createAppointmentMutation.isPending || !selectedDate || !selectedTime || !clientName || !clientEmail}
                          >
                            {createAppointmentMutation.isPending ? (
                              <>
                                <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                                Booking...
                              </>
                            ) : (
                              <>Confirm Booking (&#8377;{selectedServiceData?.price})</>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* My Appointments Tab */}
                <TabsContent value="my-appointments">
                  <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="bg-card rounded-2xl shadow-elevated border border-border overflow-hidden">
                      <div className="px-6 py-5 border-b border-border bg-secondary/50">
                        <h3 className="font-bold text-lg mb-4">Find Your Appointments</h3>
                        <div className="flex gap-3">
                          <Input
                            type="email"
                            placeholder="Enter your email address..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSearchAppointments();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleSearchAppointments}
                            disabled={!searchEmail.trim() || isLoadingAppointments}
                          >
                            {isLoadingAppointments ? (
                              <>
                                <span className="material-symbols-outlined animate-spin mr-2 text-sm">refresh</span>
                                Searching...
                              </>
                            ) : (
                              'Search'
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-6">
                        {!emailToSearch ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Enter your email address and click Search to view your appointments</p>
                          </div>
                        ) : isLoadingAppointments ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
                            <p>Loading appointments...</p>
                          </div>
                        ) : myAppointments.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No appointments found for this email address</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {myAppointments.map((appointment) => (
                              <div
                                key={appointment._id}
                                className="bg-secondary/30 rounded-xl p-5 border border-border hover:border-primary/50 transition-all"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="font-bold text-lg mb-1">{appointment.serviceTitle}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Confirmation: <span className="font-mono font-semibold">{appointment.confirmationNumber}</span>
                                    </p>
                                  </div>
                                  {getStatusBadge(appointment.status)}
                                </div>

                                <div className="grid md:grid-cols-2 gap-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>{appointment.appointmentTime}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-primary" />
                                    <span>{appointment.clientName}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-primary text-base font-bold">&#8377;</span>
                                    <span>&#8377;{appointment.servicePrice}</span>
                                  </div>
                                </div>

                                {appointment.notes && (
                                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-muted-foreground">
                                      <strong>Notes:</strong> {appointment.notes}
                                    </p>
                                  </div>
                                )}

                                {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment._id)}
                                    disabled={cancelAppointmentMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Appointment
                                  </Button>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Appointment;
