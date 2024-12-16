import { ResumeFileRepository } from "./file/resume.file-repository";
import { ResumeRepository } from "./spi/resume.repository";

interface ResumeContactData {
  email: string;
  phone: string;
  github: string;
}

export interface ResumeData {
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
  contact?: ResumeContactData;
  lang: string;
}

export class ResumeService {
  constructor(
    private resumeRepository: ResumeRepository = new ResumeFileRepository(process.cwd(), "/data/")
  ) {}

  async loadResume(lang?: string): Promise<ResumeData> {
    const resume = await this.resumeRepository.getResumeByLang(lang ?? "en");
    if (resume == null) {
      throw new Error("Resume not found");
    }
    return resume;
  }

  async getImagePath(): Promise<string> {
    const imagePath = await this.resumeRepository.getImagePath();
    if (imagePath == null) {
      return await this.resumeRepository.getSampleImagePath();
    }
    return imagePath;
  }
}
