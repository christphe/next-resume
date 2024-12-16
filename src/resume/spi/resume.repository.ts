export interface ResumeContactDocument {
  email: string;
  phone: string;
  github: string;
}

export interface ResumeDocument {
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  about: string;
  position: string;
  location: string;
  experience: Array<{
    company: string;
    position: string;
    timeperiod: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    timeperiod: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  knowledge?: Array<string>;
  hobbies: Array<{
    name: string;
    iconClass: string;
  }>;
  contact?: ResumeContactDocument;
  lang: string;
}

export interface ResumeRepository {
  getResumeByLang(lang: string): Promise<ResumeDocument | null>;
  getSampleResume(): Promise<ResumeDocument>;
  getAllResumes(): Promise<ResumeDocument[]>;
  getImagePath(): Promise<string | null>;
  getSampleImagePath(): Promise<string>;
}
