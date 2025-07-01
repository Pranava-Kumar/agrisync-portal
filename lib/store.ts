import { create } from 'zustand';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, getDoc, getDocs, writeBatch, addDoc, where, Timestamp } from 'firebase/firestore';

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

// Interface for raw data coming from Firestore, where dates might be Timestamps
interface RawTaskData extends Omit<Task, 'createdAt' | 'updatedAt' | 'subTasks'> {
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
  subTasks?: RawTaskData[];
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
  logout: () => void;
  checkAuthOnLoad: () => void;
  
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
    password: 'Pranava0901',
  },
  {
    id: 'arun-kumar',
    name: 'Arun Kumar',
    role: 'Robotics Engineer',
    specialization: 'Robotics',
    isLeader: false,
    isAuthenticated: false,
    password: 'Arun1234',
  },
  {
    id: 'mohana-divya',
    name: 'Mohana Divya',
    role: 'Electronics & Communication Engineer',
    specialization: 'ECE',
    isLeader: false,
    isAuthenticated: false,
    password: 'Mohana1234',
  },
  {
    id: 'dinesh-kumar',
    name: 'Dinesh Kumar',
    role: 'Software Engineer',
    specialization: 'CSE',
    isLeader: false,
    isAuthenticated: false,
    password: 'Dinesh1234',
  },
  {
    id: 'hitarthi-sharma',
    name: 'Hitarthi Sharma',
    role: 'Biotechnology Specialist',
    specialization: 'Biotechnology',
    isLeader: false,
    isAuthenticated: false,
    password: 'Hitarthi1234',
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

export const populateInitialTasks = async () => {
  const tasksCollection = collection(db, "tasks");
  const snapshot = await getDocs(tasksCollection);
  if (snapshot.empty) {
    const initialTasks = [
      {
        id: 'phase-1',
        title: 'Phase 1: Foundational Research & System Architecture',
        description: 'To establish a unified team understanding of the mission and to create the master architectural blueprint for both drones.',
        assignedTo: 'pranava-kumar',
        status: 'In Progress',
        priority: 'High',
        progress: 65,
        phase: 'Phase 1',
        createdAt: Timestamp.fromDate(new Date('2024-01-01')),
        updatedAt: Timestamp.now(),
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
            createdAt: Timestamp.fromDate(new Date('2024-01-01')),
            updatedAt: Timestamp.now(),
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
            createdAt: Timestamp.fromDate(new Date('2024-01-01')),
            updatedAt: Timestamp.now(),
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
            createdAt: Timestamp.fromDate(new Date('2024-01-01')),
            updatedAt: Timestamp.now(),
          },
        ],
      },
    ];

    const batch = writeBatch(db);
    initialTasks.forEach(task => {
      const docRef = doc(tasksCollection, task.id);
      batch.set(docRef, task);
    });
    await batch.commit();
    console.log("Initial tasks populated to Firestore.");
  } else {
    console.log("Tasks collection already exists in Firestore. Skipping initial population.");
  }
};

export const useAppStore = create<AppState>()((set, get) => {
  populateInitialTasks();

  // Helper function to safely convert Firestore Timestamps or other date-like values to Date objects
  const convertToDate = (value: Timestamp | Date | string | number): Date => {
    if (value instanceof Timestamp) {
      return value.toDate();
    }
    if (value instanceof Date) {
      return value;
    }
    // Attempt to parse if it's a string or other primitive
    return new Date(value);
  };

  // Firestore collections
  const tasksCollection = collection(db, "tasks");
  const announcementsCollection = collection(db, "announcements");
  const chatMessagesCollection = collection(db, "chatMessages");
  const documentsCollection = collection(db, "documents");

  // Set up real-time listeners
  // Tasks Listener
  onSnapshot(query(tasksCollection, orderBy("createdAt")), (snapshot) => {
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data() as RawTaskData;
      const createdAt = convertToDate(data.createdAt);
      const updatedAt = convertToDate(data.updatedAt);

      const subTasks = data.subTasks ? (data.subTasks as Task[]).map((subtaskData: Task) => {
        const subtaskCreatedAt = convertToDate(subtaskData.createdAt);
        const subtaskUpdatedAt = convertToDate(subtaskData.updatedAt);
        return {
          ...subtaskData,
          createdAt: subtaskCreatedAt,
          updatedAt: subtaskUpdatedAt,
        } as Task;
      }) : [];

      return {
        ...data,
        id: doc.id,
        createdAt,
        updatedAt,
        subTasks,
      } as Task;
    });
    set({ tasks });
    console.log("Tasks fetched from Firestore:", tasks.length);
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
        const authenticatedUser = { ...user, isAuthenticated: true };
        set({ currentUser: authenticatedUser, isAuthenticated: true });

        // Set expiration for 3 days
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 3);

        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        localStorage.setItem('sessionExpiration', expirationTime.toISOString());
        return true;
      }
      return false;
    },

    logout: () => {
      set({ currentUser: null, isAuthenticated: false });
      localStorage.removeItem('currentUser');
      localStorage.removeItem('sessionExpiration');
    },

    checkAuthOnLoad: () => {
      if (typeof window !== 'undefined') { // Ensure localStorage is available
        const storedUser = localStorage.getItem('currentUser');
        const storedExpiration = localStorage.getItem('sessionExpiration');

        if (storedUser && storedExpiration) {
          const expirationTime = new Date(storedExpiration);
          if (expirationTime > new Date()) {
            set({ currentUser: JSON.parse(storedUser), isAuthenticated: true });
          } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionExpiration');
          }
        }
      }
    },

    // Task actions
    addTask: async (taskData) => {
      const newTask = {
        ...taskData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await addDoc(tasksCollection, newTask);
    },

    updateTask: async (id, updates) => {
      const state = get();
      const currentUser = state.currentUser;
      const taskRef = doc(db, "tasks", id);
      const taskSnap = await getDoc(taskRef);

      if (taskSnap.exists()) {
        const task = taskSnap.data() as Task;
        const canUpdate = currentUser?.isLeader || currentUser?.id === task.assignedTo;
        if (canUpdate) {
          await updateDoc(taskRef, { ...updates, updatedAt: Timestamp.now() });
        }
      } else {
        for (const parentTask of state.tasks) {
          if (parentTask.subTasks?.some(sub => sub.id === id)) {
            const parentTaskRef = doc(db, "tasks", parentTask.id);
            const updatedSubTasks = parentTask.subTasks.map(sub => {
              if (sub.id === id) {
                const canUpdate = currentUser?.isLeader || currentUser?.id === sub.assignedTo;
                if (canUpdate) {
                  return { ...sub, ...updates, updatedAt: Timestamp.now() };
                }
              }
              return sub;
            });
            await updateDoc(parentTaskRef, { subTasks: updatedSubTasks, updatedAt: Timestamp.now() });
            break;
          }
        }
      }
    },

    deleteTask: async (id) => {
      const state = get();
      const currentUser = state.currentUser;
      
      if (!currentUser?.isLeader) return;

      const taskRef = doc(tasksCollection, id);
      const taskSnap = await getDoc(taskRef);

      if (taskSnap.exists()) {
        await deleteDoc(taskRef);
      } else {
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

    // Document actions
    addDocument: async (documentData, file) => {
      try {
        const storageRef = ref(storage, `documents/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(snapshot.ref);

        const newDocument = {
          ...documentData,
          fileUrl: fileUrl,
          uploadedAt: Timestamp.now(),
        };
        await addDoc(documentsCollection, newDocument);
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    },

    deleteDocument: async (id) => {
      const state = get();
      const documentToDelete = state.documents.find(doc => doc.id === id);

      if (documentToDelete && documentToDelete.fileUrl) {
        try {
          const url = new URL(documentToDelete.fileUrl);
          const path = decodeURIComponent(url.pathname.split('/o/')[1]);
          const fileRef = ref(storage, path);
          await deleteObject(fileRef);
          await deleteDoc(doc(documentsCollection, id));
        } catch (error) {
          console.error("Error deleting document from storage:", error);
        }
      } else {
        await deleteDoc(doc(documentsCollection, id));
      }
    },
  };
});

export const getTeamMembers = () => {
  const state = useAppStore.getState();
  return state.registeredUsers;
};