// const API_BASE_URL = 'http://localhost:5001/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://jan-justice-bancked.onrender.com/api';
export const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CustomField {
  id: string;
  label: string;
  fieldType: 'text' | 'number' | 'textarea' | 'richtext' | 'dropdown-single' | 'dropdown-multi';
  value: unknown;
  options?: string[];
  order: number;
  required?: boolean;
}

export interface TabSection {
  id: string;
  heading?: string;
  subheading?: string;
  order: number;
  contentType: 'fixed-field-map' | 'custom-fields';
  fixedFieldKey?: string;
  customFields?: CustomField[];
}

export interface JobTab {
  id: string;
  label: string;
  order: number;
  isDefault: boolean;
  sections: TabSection[];
}

export interface SidebarField {
  id: string;
  label: string;
  icon?: string;
  fieldType: 'text' | 'number' | 'salary-range' | 'experience-range' | 'dropdown-single';
  value: unknown;
  fixedFieldKey?: string;
  order: number;
  isDefault: boolean;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  department: string;
  description: string;
  detailedDescription?: string;
  responsibilities?: string[];
  qualifications?: string[];
  benefits?: string[];
  location?: string;
  workMode?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  experienceRequired?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  employmentType?: string;
  isActive?: boolean;
  applicationDeadline?: string;
  contactEmail?: string;
  contactPhone?: string;
  companyWebsite?: string;
  applyUrl?: string;
  numberOfOpenings?: number;
  education?: string;
  jobDescriptionPdf?: {
    url?: string;
    filename?: string;
    size?: number;
  };
  companyImage?: {
    url?: string;
    filename?: string;
    size?: number;
  };
  postDate?: string;
  tags?: string[];
  customInputs?: { label: string; value: string }[];
  tabs?: JobTab[];
  sidebarFields?: SidebarField[];
  createdAt?: string;
  updatedAt?: string;
}

export const jobApi = {
  // Get all jobs with optional filters (returns all, no pagination)
  async getJobs(filters?: {
    department?: string;
    company?: string;
    employmentType?: string;
  }): Promise<Job[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '999');

    if (filters?.department) queryParams.append('department', filters.department);
    if (filters?.company) queryParams.append('company', filters.company);
    if (filters?.employmentType) queryParams.append('employmentType', filters.employmentType);

    const url = `${API_BASE_URL}/jobs?${queryParams.toString()}`;

    const response = await fetch(url);
    const result: ApiResponse<Job[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch jobs');
    }

    return result.data || [];
  },

  // Get paginated jobs
  async getJobsPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<PaginatedJobs> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', String(params.page || 1));
    queryParams.append('limit', String(params.limit || 10));
    if (params.search?.trim()) queryParams.append('search', params.search.trim());

    const url = `${API_BASE_URL}/jobs?${queryParams.toString()}`;

    const response = await fetch(url);
    const result: ApiResponse<Job[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch jobs');
    }

    return {
      jobs: result.data || [],
      total: result.total || 0,
      page: result.page || 1,
      totalPages: result.totalPages || 1,
    };
  },

  // Get single job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    const result: ApiResponse<Job> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch job');
    }

    if (!result.data) {
      throw new Error('Job not found');
    }

    return result.data;
  },

  // Create new job
  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result: ApiResponse<Job> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create job');
    }

    if (!result.data) {
      throw new Error('Failed to create job');
    }

    return result.data;
  },

  // Update existing job
  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result: ApiResponse<Job> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update job');
    }

    if (!result.data) {
      throw new Error('Failed to update job');
    }

    return result.data;
  },

  // Delete job
  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete job');
    }
  },
};

export interface Module {
  title: string;
  lessons: string[];
}

export interface Instructor {
  name: string;
  title?: string;
  bio?: string;
  initials?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  image: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  certified: boolean;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  discount?: number;
  features?: string[];
  modules?: Module[];
  instructor?: Instructor;
  category: string;
  videoHours?: string;
  resources?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const courseApi = {
  // Get all courses with optional filters
  async getCourses(filters?: {
    category?: string;
    level?: string;
  }): Promise<Course[]> {
    const queryParams = new URLSearchParams();

    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.level) queryParams.append('level', filters.level);

    const url = `${API_BASE_URL}/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    const result: ApiResponse<Course[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch courses');
    }

    return result.data || [];
  },

  // Get single course by ID
  async getCourseById(id: string): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    const result: ApiResponse<Course> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch course');
    }

    if (!result.data) {
      throw new Error('Course not found');
    }

    return result.data;
  },

  // Create new course
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    const result: ApiResponse<Course> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create course');
    }

    if (!result.data) {
      throw new Error('Failed to create course');
    }

    return result.data;
  },

  // Update existing course
  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    const result: ApiResponse<Course> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update course');
    }

    if (!result.data) {
      throw new Error('Failed to update course');
    }

    return result.data;
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete course');
    }
  },
};

export interface Appointment {
  _id: string;
  serviceType: 'legal' | 'career';
  serviceTitle: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmationNumber: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AvailableSlots {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

export const appointmentApi = {
  // Get all appointments with optional filters
  async getAppointments(filters?: {
    status?: string;
    serviceType?: string;
    email?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Appointment[]> {
    const queryParams = new URLSearchParams();

    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.serviceType) queryParams.append('serviceType', filters.serviceType);
    if (filters?.email) queryParams.append('email', filters.email);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);

    const url = `${API_BASE_URL}/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url);
    const result: ApiResponse<Appointment[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch appointments');
    }

    return result.data || [];
  },

  // Get single appointment by ID
  async getAppointmentById(id: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
    const result: ApiResponse<Appointment> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch appointment');
    }

    if (!result.data) {
      throw new Error('Appointment not found');
    }

    return result.data;
  },

  // Get appointment by confirmation number
  async getAppointmentByConfirmation(confirmationNumber: string): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/confirmation/${confirmationNumber}`);
    const result: ApiResponse<Appointment> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch appointment');
    }

    if (!result.data) {
      throw new Error('Appointment not found');
    }

    return result.data;
  },

  // Get available time slots for a date
  async getAvailableSlots(date: string): Promise<AvailableSlots> {
    const response = await fetch(`${API_BASE_URL}/appointments/availability/${date}`);
    const result: ApiResponse<AvailableSlots> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch available slots');
    }

    if (!result.data) {
      throw new Error('No availability data found');
    }

    return result.data;
  },

  // Create new appointment
  async createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const result: ApiResponse<Appointment> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create appointment');
    }

    if (!result.data) {
      throw new Error('Failed to create appointment');
    }

    return result.data;
  },

  // Update existing appointment
  async updateAppointment(id: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const result: ApiResponse<Appointment> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update appointment');
    }

    if (!result.data) {
      throw new Error('Failed to update appointment');
    }

    return result.data;
  },

  // Cancel appointment
  async cancelAppointment(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to cancel appointment');
    }
  },
};

export interface Stats {
  jobs: {
    total: number;
    display: string;
  };
  courses: {
    total: number;
    display: string;
  };
  rating: {
    value: number;
    display: string;
  };
  successRate: {
    value: number;
    display: string;
  };
  students: {
    total: number;
    display: string;
  };
  appointments: {
    total: number;
    display: string;
  };
}

export const statsApi = {
  // Get homepage statistics
  async getStats(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`);
    const result: ApiResponse<Stats> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch statistics');
    }

    if (!result.data) {
      throw new Error('No statistics data found');
    }

    return result.data;
  },
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  company?: string;
  avatar?: string;
  bio?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStats {
  coursesCompleted: number;
  applicationsSent: number;
  consultations: number;
  certificates: number;
}

export interface SavedJob extends Job {
  savedAt: string;
  savedJobId: string;
}

export interface EnrolledCourse extends Course {
  progress: number;
  enrollmentStatus: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  enrolledAt: string;
  completedAt?: string;
  enrollmentId: string;
}

export const userApi = {
  // Get user profile by email
  async getUserProfile(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile/${encodeURIComponent(email)}`);
    const result: ApiResponse<User> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user profile');
    }

    if (!result.data) {
      throw new Error('User not found');
    }

    return result.data;
  },

  // Create or update user profile
  async createOrUpdateProfile(userData: Partial<User> & { email: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to save profile');
    }

    if (!result.data) {
      throw new Error('Failed to save profile');
    }

    return result.data;
  },

  // Get user statistics
  async getUserStats(email: string): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/users/stats/${encodeURIComponent(email)}`);
    const result: ApiResponse<UserStats> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user statistics');
    }

    if (!result.data) {
      throw new Error('Statistics not found');
    }

    return result.data;
  },

  // Get user's saved jobs
  async getSavedJobs(email: string): Promise<SavedJob[]> {
    const response = await fetch(`${API_BASE_URL}/users/saved-jobs/${encodeURIComponent(email)}`);
    const result: ApiResponse<SavedJob[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch saved jobs');
    }

    return result.data || [];
  },

  // Save a job
  async saveJob(email: string, jobId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/saved-jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, jobId }),
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to save job');
    }
  },

  // Unsave a job
  async unsaveJob(savedJobId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/saved-jobs/${savedJobId}`, {
      method: 'DELETE',
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to remove job');
    }
  },

  // Get user's course enrollments
  async getCourseEnrollments(email: string): Promise<EnrolledCourse[]> {
    const response = await fetch(`${API_BASE_URL}/users/enrollments/${encodeURIComponent(email)}`);
    const result: ApiResponse<EnrolledCourse[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch course enrollments');
    }

    return result.data || [];
  },

  // Enroll in a course
  async enrollInCourse(email: string, courseId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, courseId }),
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to enroll in course');
    }
  },

  // Update course progress
  async updateCourseProgress(enrollmentId: string, progress: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/enrollments/${enrollmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });

    const result: ApiResponse<never> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update progress');
    }
  },
};
