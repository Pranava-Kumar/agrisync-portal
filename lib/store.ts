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
      console.log("Tasks fetched from Firestore:", tasks.length); // Added log
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