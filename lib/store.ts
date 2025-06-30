import { create } from 'zustand';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, getDoc, getDocs, writeBatch, addDoc, where } from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  role: string;
  specialization: string;
  isLeader: boolean;
  isAuthenticated: boolean;
  password?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'To Do' | 'In Progress' | 'Under Review' | 'Blocked' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  phase: string;
  subPhase?: string;
  subTasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl?: string;
  fileType: string;
}

export interface PasswordResetRequest {
  id: string;
  userId: string;
  userName: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  newPassword?: string;
}

interface AppState {
  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  registeredUsers: User[];
  passwordResetRequests: PasswordResetRequest[];
  
  // Tasks
  tasks: Task[];
  
  // Announcements
  announcements: Announcement[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Documents - Global storage for all users
  documents: Document[];
  
  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Password reset actions
  requestPasswordReset: (username: string, newPassword: string) => Promise<boolean>;
  approvePasswordReset: (requestId: string) => void;
  rejectPasswordReset: (requestId: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Announcement actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp'>) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  // Document actions - Global for all users
  addDocument: (document: Omit<Document, 'id' | 'fileUrl'>, file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}

// Only Pranava Kumar with his specific password
const INITIAL_USERS: User[] = [
  {
    id: 'pranava-kumar',
    name: 'Pranava Kumar',
    role: 'Team Lead & Integration Manager',
    specialization: 'IT',
    isLeader: true,
    isAuthenticated: false,
    password: 'Pranava123',
  },
  {
    id: 'arun-kumar',
    name: 'Arun Kumar',
    role: 'Robotics Engineer',
    specialization: 'Robotics',
    isLeader: false,
    isAuthenticated: false,
    password: 'Arun123',
  },
  {
    id: 'mohana-divya',
    name: 'Mohana Divya',
    role: 'Electronics & Communication Engineer',
    specialization: 'ECE',
    isLeader: false,
    isAuthenticated: false,
    password: 'Mohana123',
  },
  {
    id: 'dinesh-kumar',
    name: 'Dinesh Kumar',
    role: 'Software Engineer',
    specialization: 'CSE',
    isLeader: false,
    isAuthenticated: false,
    password: 'Dinesh123',
  },
  {
    id: 'hitarthi-sharma',
    name: 'Hitarthi Sharma',
    role: 'Biotechnology Specialist',
    specialization: 'Biotechnology',
    isLeader: false,
    isAuthenticated: false,
    password: 'Hitarthi123',
  },
];

// Initial documents that are visible to all users
const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'NIDAR Competition Rulebook',
    category: 'Competition',
    description: 'Official rulebook and guidelines for the NIDAR drone competition',
    fileName: 'NIDAR_Rulebook_2024.pdf',
    fileSize: '2.5 MB',
    uploadedBy: 'System',
    uploadedAt: new Date('2024-01-01'),
    fileType: 'application/pdf',
  },
];

// Complete NIDAR Competition Tasks - Updated with all 7 phases
const COMPLETE_NIDAR_TASKS: Task[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Foundational Research & System Architecture',
    description: 'To establish a unified team understanding of the mission and to create the master architectural blueprint for both drones.',
    assignedTo: 'pranava-kumar',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    phase: 'Phase 1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-1-1',
        title: 'Deep Dive & Mission Scenario Mapping',
        description: 'Create a Mission Flowchart and define Key Performance Parameters (KPPs).',
        assignedTo: 'pranava-kumar',
        status: 'Completed',
        priority: 'High',
        progress: 100,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-1-2',
        title: 'Precision Agriculture Research & Application Strategy',
        description: 'Research visual signatures of crop stress, determine optimal scanning & spraying patterns, and define the Data & Command Pipeline.',
        assignedTo: 'hitarthi-sharma',
        status: 'In Progress',
        priority: 'High',
        progress: 75,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-1-3',
        title: 'Finalize High-Level System Architecture',
        description: 'Create Mechanical Layout Diagram, Electrical Block Diagram, and Software & Data Flow Diagram.',
        assignedTo: 'pranava-kumar',
        status: 'In Progress',
        priority: 'High',
        progress: 40,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2: Detailed Design & Procurement',
    description: 'To convert the architectural blueprints into precise, validated, and manufacturable designs and to procure all necessary components.',
    assignedTo: 'arun-kumar',
    status: 'To Do',
    priority: 'High',
    progress: 0,
    phase: 'Phase 2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-2-1',
        title: 'Detailed CAD Modeling',
        description: 'Model all components, create full drone assemblies, design for manufacturing (DFM), and perform detailed CG analysis.',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-2-2',
        title: 'Detailed Electrical Schematics & Wiring Plan',
        description: 'Create pin-to-pin wiring diagrams, specify wire gauges and lengths, plan physical wire routing, and create a power budget.',
        assignedTo: 'mohana-divya',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-2-3',
        title: 'Finalize Component Procurement',
        description: 'Verify suppliers & place orders, and create & maintain a tracking sheet.',
        assignedTo: 'hitarthi-sharma',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-2-4',
        title: 'Detailed Software Architecture & Module Planning',
        description: 'Plan flight controller setup, companion computer (Pi) software, and Ground Station (GCS) UI/UX mockup.',
        assignedTo: 'dinesh-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Prototyping & Assembly',
    description: 'To translate the detailed digital designs (CAD models and electrical schematics) into two fully assembled, physical drones, ready for power-up and software configuration.',
    assignedTo: 'arun-kumar',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    phase: 'Phase 3',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-3-1',
        title: 'Frame & Propulsion System Assembly',
        description: 'Assemble the Main Frames, Mount Motors and ESCs, and Install Landing Gear.',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-3-2',
        title: 'Payload & Major Component Integration',
        description: 'Mount Flight Controllers and Companion Computers, and Mount Sensor & Camera Systems.',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-3-3',
        title: 'Power System Wiring',
        description: 'Install and Solder the PDB, Connect ESCs to PDB, and Connect the Power Module.',
        assignedTo: 'mohana-divya',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-3-4',
        title: 'Signal and Data Wiring',
        description: 'Connect ESCs to Flight Controller, Connect All Peripherals, and Wire Management.',
        assignedTo: 'mohana-divya',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-3-5',
        title: 'Final Assembly & Pre-Flight Checks',
        description: 'Install Propellers, Final Weight and Balance Check, and Create a Build Log.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Software Development & Integration',
    description: 'To breathe life into the assembled hardware by configuring firmware, developing custom software, and establishing robust communication links, transforming the physical drones into intelligent, mission-capable systems.',
    assignedTo: 'dinesh-kumar',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    phase: 'Phase 4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-4-1',
        title: 'Firmware Flashing and Initial Setup',
        description: 'Flash Firmware, Perform Mandatory Hardware Calibration, and Configure Airframe and Motor Layout.',
        assignedTo: 'dinesh-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 4',
        subPhase: 'Sub-Phase 4.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-4-2',
        title: 'Safety & Flight Mode Configuration',
        description: 'Configure Failsafes, Set Up Geofence, and Assign Flight Modes.',
        assignedTo: 'dinesh-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 4',
        subPhase: 'Sub-Phase 4.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-4-3',
        title: 'Companion Computer (Raspberry Pi) Software',
        description: 'Develop Vision Processing Script, Implement MAVLink Communication, and Integrate Geotagging Logic.',
        assignedTo: 'dinesh-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 4',
        subPhase: 'Sub-Phase 4.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-4-4',
        title: 'Ground Control Station (GCS) Implementation',
        description: 'Implement Mission Planning Interface, Develop the Live Data Dashboard, and Implement Geotag Visualization.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 4',
        subPhase: 'Sub-Phase 4.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-4-5',
        title: 'Establish Drone-to-GCS Link',
        description: 'Configure Telemetry Radios and perform End-to-End Data Test.',
        assignedTo: 'mohana-divya',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 4',
        subPhase: 'Sub-Phase 4.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-5',
    title: 'Phase 5: Testing & Refinement',
    description: 'To systematically and safely test every component and software function, identify and resolve all issues, and iteratively tune the drones performance to be robust, reliable, and optimized for the competition mission.',
    assignedTo: 'arun-kumar',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    phase: 'Phase 5',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-5-1',
        title: 'Bench & Safety Testing (Pre-Flight)',
        description: 'Full System Power & Communication Test, Motor & Propulsion System Verification, and Failsafe Functionality Test.',
        assignedTo: 'mohana-divya',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 5',
        subPhase: 'Sub-Phase 5.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-5-2',
        title: 'Initial Flight Testing & PID Tuning',
        description: 'First Hover Test and PID Tuning (Analyze Flight Logs, Iterative PID Adjustments).',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 5',
        subPhase: 'Sub-Phase 5.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-5-3',
        title: 'Scout Drone Sensor Validation',
        description: 'RTK Accuracy Test, Live Computer Vision Test, and Obstacle Avoidance Test.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 5',
        subPhase: 'Sub-Phase 5.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-5-4',
        title: 'Spraying Drone System Validation',
        description: 'In-Flight Spraying Test and Flow Rate Sensor Calibration.',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 5',
        subPhase: 'Sub-Phase 5.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-5-5',
        title: 'Full Autonomous Mission Rehearsal',
        description: 'Execute the Full Mission and Identify Bottlenecks and Refine Logic.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 5',
        subPhase: 'Sub-Phase 5.4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-6',
    title: 'Phase 6: Documentation & Presentation Preparation',
    description: 'To synthesize all the technical work, research, and testing data into polished, professional, and compelling documentation and presentations that meet all NIDAR requirements and effectively showcase the team\'s innovation and hard work.',
    assignedTo: 'hitarthi-sharma',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    phase: 'Phase 6',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-6-1',
        title: 'Technical Presentation Content Development',
        description: 'Design & Mechanical Sections, Electrical & Systems Sections, Software & Autonomy Sections, and Safety & Operations Sections.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 6',
        subPhase: 'Sub-Phase 6.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-6-2',
        title: 'Business Strategy Pitch Development',
        description: 'Market Research & Problem Definition, Develop the Value Proposition, and Create the Pitch Deck.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 6',
        subPhase: 'Sub-Phase 6.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-6-3',
        title: 'Documentation & Cost Sheet Finalization',
        description: 'Compile Final Cost Sheet and Collate All Project Documentation.',
        assignedTo: 'hitarthi-sharma',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 6',
        subPhase: 'Sub-Phase 6.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-6-4',
        title: 'Review, Refinement & Rehearsal',
        description: 'Internal Review & Feedback (Presentation Peer Review, Documentation Cross-Check) and Presentation Rehearsal (Timed Run-Throughs, Mock Q&A Session, Final Polish).',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 6',
        subPhase: 'Sub-Phase 6.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'phase-7',
    title: 'Phase 7: Final Competition Execution',
    description: 'To execute the competition plan with precision, professionalism, and composure, successfully passing all technical inspections and performing the mission to the best of the drones\' capabilities.',
    assignedTo: 'pranava-kumar',
    status: 'To Do',
    priority: 'Low',
    progress: 0,
    phase: 'Phase 7',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    subTasks: [
      {
        id: 'task-7-1',
        title: 'Pre-Competition Preparation (Week Before)',
        description: 'Create the Master Checklist (Develop the Packing List, Develop the On-Site Procedure Checklist) and Final System Freeze & Prep (Software Freeze, Hardware Check & Pack, Battery Charging Cycle).',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 7',
        subPhase: 'Sub-Phase 7.1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-7-2',
        title: 'Competition Day Execution - Setup & Pre-Flight Inspection',
        description: 'Station Setup, Drone Assembly & System Checks, Final Sensor Calibration, and Present for Pre-Flight Inspection.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 7',
        subPhase: 'Sub-Phase 7.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-7-3',
        title: 'Competition Day Execution - Final Mission Execution',
        description: 'Define Clear Roles, Execute the Mission, and Data Management.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 7',
        subPhase: 'Sub-Phase 7.2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'task-7-4',
        title: 'Post-Mission & Debrief',
        description: 'Secure Equipment and Team Debrief.',
        assignedTo: 'pranava-kumar',
        status: 'To Do',
        priority: 'Medium',
        progress: 0,
        phase: 'Phase 7',
        subPhase: 'Sub-Phase 7.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
      },
    ],
  },
];

export const useAppStore = create<AppState>()(
  (set, get) => {
    // Firestore collections
    const tasksCollection = collection(db, "tasks");
    const announcementsCollection = collection(db, "announcements");
    const chatMessagesCollection = collection(db, "chatMessages");
    const documentsCollection = collection(db, "documents");

    // Set up real-time listeners
    // Tasks Listener
    onSnapshot(query(tasksCollection, orderBy("createdAt")), (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        subTasks: doc.data().subTasks ? doc.data().subTasks.map((subtask: any) => ({
          ...subtask,
          createdAt: subtask.createdAt.toDate(),
          updatedAt: subtask.updatedAt.toDate(),
        })) : [],
      })) as Task[];
      set({ tasks });
    });

    // Announcements Listener
    onSnapshot(query(announcementsCollection, orderBy("timestamp", "desc")), (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Announcement[];
      set({ announcements });
    });

    // Chat Messages Listener
    onSnapshot(query(chatMessagesCollection, orderBy("timestamp")), (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as ChatMessage[];
      set({ chatMessages });
    });

    // Documents Listener
    onSnapshot(query(documentsCollection, orderBy("uploadedAt", "desc")), (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as Document[];
      set({ documents });
    });

    return {
      currentUser: null,
      isAuthenticated: false,
      registeredUsers: INITIAL_USERS,
      passwordResetRequests: [],
      tasks: [],
      announcements: [],
      chatMessages: [],
      documents: [],

      // Authentication actions
      login: async (username: string, password: string) => {
        const state = get();
        const user = state.registeredUsers.find(u => 
          u.name.toLowerCase().replace(/\s+/g, '') === username.toLowerCase().replace(/\s+/g, '') ||
          u.id === username.toLowerCase().replace(/\s+/g, '-')
        );
        
        if (user && user.password === password) {
          set({ 
            currentUser: { ...user, isAuthenticated: true }, 
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },

      register: async (name: string, password: string) => {
        const state = get();
        const userId = name.toLowerCase().replace(/\s+/g, '-');
        
        // Check if user already exists
        const existingUser = state.registeredUsers.find(u => 
          u.name.toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, '') ||
          u.id === userId
        );
        
        if (existingUser) {
          return false; // User already exists
        }

        const newUser: User = {
          id: userId,
          name,
          role: 'Team Member', // Default role
          specialization: 'General', // Default specialization
          isLeader: false, // New users are not leaders by default
          isAuthenticated: false,
          password: password,
        };

        set(state => ({
          registeredUsers: [...state.registeredUsers, newUser]
        }));

        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Password reset actions
      requestPasswordReset: async (username: string, newPassword: string) => {
        const state = get();
        const user = state.registeredUsers.find(u => 
          u.name.toLowerCase().replace(/\s+/g, '') === username.toLowerCase().replace(/\s+/g, '') ||
          u.id === username.toLowerCase().replace(/\s+/g, '-')
        );
        
        if (!user) {
          return false; // User not found
        }

        // Check if there's already a pending request for this user
        const existingRequest = state.passwordResetRequests.find(req => 
          req.userId === user.id && req.status === 'pending'
        );
        
        if (existingRequest) {
          return false; // Already has a pending request
        }

        const newRequest: PasswordResetRequest = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          requestedAt: new Date(),
          status: 'pending',
          newPassword: newPassword,
        };

        set(state => ({
          passwordResetRequests: [...state.passwordResetRequests, newRequest]
        }));

        return true;
      },

      approvePasswordReset: (requestId: string) => {
        const state = get();
        const request = state.passwordResetRequests.find(req => req.id === requestId);
        
        if (request && request.status === 'pending' && request.newPassword) {
          // Update the user's password
          set(state => ({
            registeredUsers: state.registeredUsers.map(user =>
              user.id === request.userId 
                ? { ...user, password: request.newPassword }
                : user
            ),
            passwordResetRequests: state.passwordResetRequests.map(req =>
              req.id === requestId 
                ? { ...req, status: 'approved' as const }
                : req
            )
          }));
        }
      },

      rejectPasswordReset: (requestId: string) => {
        set(state => ({
          passwordResetRequests: state.passwordResetRequests.map(req =>
            req.id === requestId 
              ? { ...req, status: 'rejected' as const }
              : req
          )
        }));
      },

      // Task actions
      addTask: async (taskData) => {
        const newTask = {
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addDoc(tasksCollection, newTask);
      },

      updateTask: async (id, updates) => {
        const state = get();
        const currentUser = state.currentUser;
        
        const taskRef = doc(tasksCollection, id);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          const task = taskSnap.data() as Task;
          const canUpdate = currentUser?.isLeader || currentUser?.id === task.assignedTo;

          if (canUpdate) {
            await updateDoc(taskRef, { ...updates, updatedAt: new Date() });
          } else if (task.subTasks) {
            const updatedSubTasks = task.subTasks.map((subtask: any) => {
              if (subtask.id === id && (currentUser?.isLeader || currentUser?.id === subtask.assignedTo)) {
                return { ...subtask, ...updates, updatedAt: new Date() };
              }
              return subtask;
            });
            await updateDoc(taskRef, { subTasks: updatedSubTasks, updatedAt: new Date() });
          }
        } else {
          // If it's a subtask, find its parent and update
          const parentTaskQuery = query(tasksCollection, where("subTasks", "array-contains", { id: id }));
          const parentTaskSnapshot = await getDocs(parentTaskQuery);

          if (!parentTaskSnapshot.empty) {
            const parentTaskDoc = parentTaskSnapshot.docs[0];
            const parentTask = parentTaskDoc.data() as Task;
            const parentTaskRef = doc(tasksCollection, parentTaskDoc.id);

            const updatedSubTasks = parentTask.subTasks?.map((subtask: any) => {
              if (subtask.id === id && (currentUser?.isLeader || currentUser?.id === subtask.assignedTo)) {
                return { ...subtask, ...updates, updatedAt: new Date() };
              }
              return subtask;
            });
            await updateDoc(parentTaskRef, { subTasks: updatedSubTasks, updatedAt: new Date() });
          }
        }
      },

      deleteTask: async (id) => {
        const state = get();
        const currentUser = state.currentUser;
        
        // Only admin can delete tasks
        if (!currentUser?.isLeader) return;

        const taskRef = doc(tasksCollection, id);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
          await deleteDoc(taskRef);
        } else {
          // If it's a subtask, find its parent and update
          const parentTaskQuery = query(tasksCollection, where("subTasks", "array-contains", { id: id }));
          const parentTaskSnapshot = await getDocs(parentTaskQuery);

          if (!parentTaskSnapshot.empty) {
            const parentTaskDoc = parentTaskSnapshot.docs[0];
            const parentTask = parentTaskDoc.data() as Task;
            const parentTaskRef = doc(tasksCollection, parentTaskDoc.id);

            const updatedSubTasks = parentTask.subTasks?.filter(subtask => subtask.id !== id);
            await updateDoc(parentTaskRef, { subTasks: updatedSubTasks, updatedAt: new Date() });
          }
        }
      },

      // Announcement actions
      addAnnouncement: async (announcementData) => {
        const newAnnouncement = {
          ...announcementData,
          timestamp: new Date(),
        };
        await addDoc(announcementsCollection, newAnnouncement);
      },

      deleteAnnouncement: async (id) => {
        await deleteDoc(doc(announcementsCollection, id));
      },

      // Chat actions
      addChatMessage: async (messageData) => {
        const newChatMessage = {
          ...messageData,
          timestamp: new Date(),
        };
        await addDoc(chatMessagesCollection, newChatMessage);
      },

      clearChat: async () => {
        const snapshot = await getDocs(chatMessagesCollection);
        const batch = writeBatch(db);
        snapshot.docs.forEach((d) => {
          batch.delete(d.ref);
        });
        await batch.commit();
      },

      // Document actions - Global storage accessible to all users
      addDocument: async (documentData, file) => {
        try {
          const storageRef = ref(storage, `documents/${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const fileUrl = await getDownloadURL(snapshot.ref);

          const newDocument = {
            ...documentData,
            fileUrl: fileUrl,
            uploadedAt: new Date(),
          };
          await addDoc(documentsCollection, newDocument);
        } catch (error) {
          console.error("Error uploading document:", error);
          // Optionally, handle the error in the UI
        }
      },

      deleteDocument: async (id) => {
        const state = get();
        const documentToDelete = state.documents.find(doc => doc.id === id);

        if (documentToDelete && documentToDelete.fileUrl) {
          try {
            // Extract the path from the fileUrl
            const url = new URL(documentToDelete.fileUrl);
            const path = decodeURIComponent(url.pathname.split('/o/')[1]);
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
            await deleteDoc(doc(documentsCollection, id));
          } catch (error) {
            console.error("Error deleting document from storage:", error);
            // Optionally, handle the error in the UI
          }
        } else {
          await deleteDoc(doc(documentsCollection, id));
        }
      },
    };
  }
);

export const getTeamMembers = () => {
  const state = useAppStore.getState();
  return state.registeredUsers;
};