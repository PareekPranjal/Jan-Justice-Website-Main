import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    title: "Career Coaching",
    description: "Resume review, interview prep, strategy.",
    price: 100,
  },
];

const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

const Appointment = () => {
  const [selectedService, setSelectedService] = useState("legal");
  const [selectedDate, setSelectedDate] = useState(5);
  const [selectedTime, setSelectedTime] = useState("01:00 PM");

  const selectedServiceData = services.find((s) => s.id === selectedService);

  return (
    <>
      <Helmet>
        <title>Book Consultation | LegalConnect - Expert Legal Advice</title>
        <meta name="description" content="Schedule a professional legal consultation or career coaching session. Expert guidance at your convenience." />
      </Helmet>
      
      <div className="bg-background min-h-screen flex flex-col">
        <Header title="LegalConnect" showBackLink />
        
        <main className="flex-grow flex flex-col">
          <div className="flex flex-1 justify-center py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column - Service Selection */}
              <div className="lg:col-span-5 flex flex-col gap-8 animate-fade-in">
                <div className="flex flex-col gap-3">
                  <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                    Book an Appointment
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black">
                    Schedule Your Professional Consultation
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Expert legal advice and career guidance at your convenience.
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
                            <span className="block text-2xl font-black">${service.price}</span>
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
                        <p className="font-bold">October 2024</p>
                        <div className="grid grid-cols-7 text-center gap-2">
                          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <span key={i} className="text-xs font-bold text-muted-foreground">
                              {day}
                            </span>
                          ))}
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((day) => (
                            <button
                              key={day}
                              onClick={() => setSelectedDate(day)}
                              disabled={day === 7 || day === 14}
                              className={`h-9 w-9 rounded-full text-sm transition-all ${
                                selectedDate === day
                                  ? "bg-primary text-primary-foreground font-bold shadow-md"
                                  : day === 7 || day === 14
                                  ? "text-muted-foreground/50 line-through cursor-not-allowed"
                                  : "hover:bg-secondary"
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Time Slots */}
                      <div className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm mb-2">
                          {selectedDate && `Thursday, Oct ${selectedDate}th`}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-3 text-sm font-medium rounded border transition-all ${
                                selectedTime === time
                                  ? "bg-primary text-primary-foreground border-primary shadow-md font-bold flex justify-between items-center"
                                  : "border-border hover:border-primary"
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
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (Optional)</Label>
                          <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                        </div>
                      </div>
                    </div>
                    
                    <Button size="lg" className="w-full h-12 shadow-elevated">
                      Confirm Booking (${selectedServiceData?.price})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Appointment;
