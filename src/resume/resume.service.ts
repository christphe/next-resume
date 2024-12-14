import { promises as fs } from "fs";
import yaml from "js-yaml";

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
  constructor(private readonly basePath: string = process.cwd()) {}

  private getFilePath(lang?: string): string {
    // TODO: sanitize lang with zod ?
    if (lang != null && !/^[a-z][a-z]$/.test(lang)) {
      throw new Error(`Invalid language code : ${lang}`);
    }

    return `/public/data/data-${lang || "en"}.yml`;
  }

  private async checkFileExists(filePath: string): Promise<boolean> {
    const fileStats = await fs.stat(this.basePath + filePath).catch(() => null);
    return fileStats?.isFile() ?? false;
  }

  private async ensureFilePath(lang?: string): Promise<string> {
    let filePath = this.getFilePath(lang);

    if (await this.checkFileExists(filePath)) {
      return filePath;
    }
    // Fallback to default language
    filePath = this.getFilePath();

    if (await this.checkFileExists(filePath)) {
      return filePath;
    }
    return "/public/data/example.data.yml";
  }

  async loadResume(lang?: string): Promise<ResumeData> {
    const filePath = await this.ensureFilePath(lang);

    const text = await fs.readFile(this.basePath + filePath, "utf8");
    const data = yaml.load(text) as Omit<ResumeData, "contact">;
    let contactFilePath = "/public/data/contact.yml";
    if (!(await this.checkFileExists(contactFilePath))) {
      contactFilePath = "/public/data/example.contact.yml";
    }
    const contact = yaml.load(
      await fs.readFile(this.basePath + contactFilePath, "utf8")
    ) as ResumeContactData;
    return { ...data, contact };
  }

  async getImagePath(): Promise<string> {
    const filePath = "/img/id.jpg";

    if (await this.checkFileExists("/public/" + filePath)) {
      return filePath;
    }
    return "/img/id-default.jpg";
  }
}
