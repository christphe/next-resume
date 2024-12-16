import * as fs from "fs";
import yaml from "js-yaml";
import {
  ResumeContactDocument,
  ResumeDocument,
  ResumeRepository,
} from "../spi/resume.repository";

export class ResumeFileRepository implements ResumeRepository {
  constructor(
    private readonly basePath: string = process.cwd(),
    private readonly resumesDir = "/data/"
  ) {}

  private getFilePath(lang?: string): string {
    // TODO: sanitize lang with zod ?
    if (lang != null && !/^[a-z][a-z]$/.test(lang)) {
      throw new Error(`Invalid language code : ${lang}`);
    }

    return `/${this.resumesDir}/data-${lang || "en"}.yml`;
  }

  private async checkFileExists(filePath: string): Promise<boolean> {
    const fileStats = await fs.promises
      .stat(this.basePath + filePath)
      .catch(() => null);
    return fileStats?.isFile() ?? false;
  }

  private async ensureFilePath(lang?: string): Promise<string | null> {
    let filePath = this.getFilePath(lang);

    if (await this.checkFileExists(filePath)) {
      return filePath;
    }
    // Fallback to default language
    filePath = this.getFilePath();

    if (await this.checkFileExists(filePath)) {
      return filePath;
    }
    return null;
  }

  async getResumeByLang(lang?: string): Promise<ResumeDocument | null> {
    const filePath = await this.ensureFilePath(lang);
    let contactFilePath = `${this.resumesDir}/contact.yml`;

    if (filePath == null) {
      return null;
    }

    return this.loadResume(filePath, contactFilePath);
  }

  async getAllResumes(): Promise<ResumeDocument[]> {
    throw new Error("Not implemented");
  }

  private async loadResume(
    dataPath: string,
    contactFilePath: string
  ): Promise<ResumeDocument> {
    const text = await fs.promises.readFile(this.basePath + dataPath, "utf8");
    const data = yaml.load(text) as Omit<ResumeDocument, "contact">;
    if (await this.checkFileExists(contactFilePath)) {
      const contact = yaml.load(
        await fs.promises.readFile(this.basePath + contactFilePath, "utf8")
      ) as ResumeContactDocument;
      return { ...data, contact };
    }
    return data;
  }

  async getSampleResume(): Promise<ResumeDocument> {
    return this.loadResume(
      `${this.resumesDir}/example.data.yml`,
      `${this.resumesDir}/example.contact.yml`
    );
  }

  async getImagePath(): Promise<string | null> {
    const filePath = "/img/id.jpg";

    if (await this.checkFileExists("/public/" + filePath)) {
      return filePath;
    }
    return null;
  }
  async getSampleImagePath(): Promise<string> {
    return "/img/id-default.jpg";
  }
}
