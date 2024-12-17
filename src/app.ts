import { ResumeFileRepository } from "./resume/file/resume.file-repository";
import { ResumeService } from "./resume/resume.service";

const resumeRepository = new ResumeFileRepository(process.cwd(), "/data/");

export const appContext = {
  resumeService: new ResumeService(resumeRepository),
};
