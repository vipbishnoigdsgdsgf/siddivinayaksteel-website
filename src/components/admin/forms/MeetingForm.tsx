
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MeetingFormData {
  title: string;
  date: Date;
  time: string;
  location: string;
  address?: string;
  spots: number;
  description?: string;
}

interface MeetingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MeetingFormData) => Promise<void>;
  initialData?: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    address?: string;
    spots: number;
    description?: string;
  };
}

export function MeetingForm({ open, onClose, onSubmit, initialData }: MeetingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MeetingFormData>({
    defaultValues: initialData ? {
      ...initialData,
      // Convert string date to Date object
      date: new Date(initialData.date),
    } : {
      title: "",
      date: new Date(),
      time: "",
      location: "",
      address: "",
      spots: 0,
      description: "",
    },
  });

  const handleSubmit = async (data: MeetingFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting meeting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-dark-200 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Meeting" : "Create New Meeting"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Meeting title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      className="rounded-md border-gray-800"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <div className="flex items-center">
                    <Clock className="absolute ml-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input className="pl-10" type="time" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <div className="flex items-center">
                    <MapPin className="absolute ml-3 h-4 w-4 text-gray-400" />
                    <FormControl>
                      <Input className="pl-10" placeholder="Meeting location" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Detailed address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Spots</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional details about the meeting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update Meeting" : "Create Meeting"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
