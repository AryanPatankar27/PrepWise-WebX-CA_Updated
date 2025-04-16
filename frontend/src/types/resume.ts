// src/types/resume.ts
export interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    address?: string;
    summary?: string;
  }
  
  export interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    points: string[];
  }
  
  export interface Education {
    university: string;
    degree: string;
    startDate: string;
    endDate: string;
    location: string;
    gpa?: string;
    achievements?: string[];
  }
  
  export interface Skill {
    category: string;
    items: string[];
  }
  
  export interface Project {
    name: string;
    role?: string;
    description: string;
    technologies: string[];
    points: string[];
  }
  
  export interface ResumeData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    coursework?: { [key: string]: string[] };
    societies?: string[];
    links?: { platform: string; url: string }[];
  }