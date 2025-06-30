export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  isLeader: boolean;
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
}

export interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: Date;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'pranava-kumar',
    name: 'Pranava Kumar',
    role: 'Team Lead & Integration Manager',
    specialization: 'IT',
    isLeader: true,
  },
  {
    id: 'arun-kumar',
    name: 'Arun Kumar',
    role: 'Hardware & Mechanical Lead',
    specialization: 'Robotics & Automation',
    isLeader: false,
  },
  {
    id: 'mohana-divya',
    name: 'Mohana Divya',
    role: 'Electrical & Electronics Lead',
    specialization: 'ECE',
    isLeader: false,
  },
  {
    id: 'dinesh-kumar',
    name: 'Dinesh Kumar',
    role: 'Software & Ground Station Lead',
    specialization: 'CSE',
    isLeader: false,
  },
  {
    id: 'hitarthi-sharma',
    name: 'Hitarthi Sharma',
    role: 'Documentation & Research Lead',
    specialization: 'Biotechnology',
    isLeader: false,
  },
];

export const projectTasks: Task[] = [
  {
    id: 'phase-1',
    title: 'Project Understanding & Refined Planning',
    description: 'Deeply understand the competition requirements, finalize the system architecture, and establish a detailed, actionable plan.',
    assignedTo: 'pranava-kumar',
    status: 'In Progress',
    priority: 'High',
    progress: 75,
    phase: 'Phase 1',
    subTasks: [
      {
        id: 'task-1-1',
        title: 'Deep Dive & Mission Scenario Mapping',
        description: 'Create mission flowchart and define key performance parameters',
        assignedTo: 'pranava-kumar',
        status: 'Completed',
        priority: 'High',
        progress: 100,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.1',
      },
      {
        id: 'task-1-2',
        title: 'Precision Agriculture Research & Application Strategy',
        description: 'Research visual signatures of crop stress and determine optimal scanning patterns',
        assignedTo: 'hitarthi-sharma',
        status: 'In Progress',
        priority: 'High',
        progress: 60,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.1',
      },
      {
        id: 'task-1-3',
        title: 'Finalize High-Level System Architecture',
        description: 'Create mechanical layout, electrical block diagram, and software flow diagram',
        assignedTo: 'pranava-kumar',
        status: 'In Progress',
        priority: 'High',
        progress: 40,
        phase: 'Phase 1',
        subPhase: 'Sub-Phase 1.1',
      },
    ],
  },
  {
    id: 'phase-2',
    title: 'Procurement & Software Architecture',
    description: 'Order all hardware while the detailed design is being finalized, and create a detailed software development plan.',
    assignedTo: 'hitarthi-sharma',
    status: 'To Do',
    priority: 'High',
    progress: 0,
    phase: 'Phase 2',
    subTasks: [
      {
        id: 'task-2-1',
        title: 'Finalize Component Procurement',
        description: 'Verify suppliers and place orders for all components',
        assignedTo: 'hitarthi-sharma',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.1',
      },
      {
        id: 'task-2-2',
        title: 'Detailed Software Architecture & Module Planning',
        description: 'Plan flight controller setup, companion computer software, and GCS UI/UX',
        assignedTo: 'dinesh-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 2',
        subPhase: 'Sub-Phase 2.2',
      },
    ],
  },
  {
    id: 'phase-3',
    title: 'Prototyping & Assembly',
    description: 'Translate detailed digital designs into two fully assembled, physical drones',
    assignedTo: 'arun-kumar',
    status: 'To Do',
    priority: 'Medium',
    progress: 0,
    phase: 'Phase 3',
    subTasks: [
      {
        id: 'task-3-1',
        title: 'Frame & Propulsion System Assembly',
        description: 'Assemble main frames, mount motors and ESCs, install landing gear',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.1',
      },
      {
        id: 'task-3-2',
        title: 'Payload & Major Component Integration',
        description: 'Mount flight controllers, companion computers, and sensor systems',
        assignedTo: 'arun-kumar',
        status: 'To Do',
        priority: 'High',
        progress: 0,
        phase: 'Phase 3',
        subPhase: 'Sub-Phase 3.1',
      },
    ],
  },
];

export const documents: Document[] = [
  {
    id: 'doc-1',
    title: 'NIDAR Competition Rulebook',
    category: 'Competition',
    description: 'Official rulebook and guidelines for the NIDAR drone competition',
    url: '#',
  },
  {
    id: 'doc-2',
    title: 'System Architecture Diagram',
    category: 'Technical',
    description: 'Complete system architecture showing both drones and ground station',
    url: '#',
  },
  {
    id: 'doc-3',
    title: 'Component Bill of Materials (BOM)',
    category: 'Technical',
    description: 'Detailed list of all components with specifications and costs',
    url: '#',
  },
  {
    id: 'doc-4',
    title: 'Flight Test Protocols',
    category: 'Testing',
    description: 'Standardized procedures for flight testing and validation',
    url: '#',
  },
  {
    id: 'doc-5',
    title: 'Safety Guidelines',
    category: 'Safety',
    description: 'Comprehensive safety protocols for drone operations',
    url: '#',
  },
];