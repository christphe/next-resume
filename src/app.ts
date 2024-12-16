import { ResumeFileRepository } from "./resume/file/resume.file-repository";
import { ResumeService } from "./resume/resume.service";

const resumeRepository = new ResumeFileRepository();

export const appContext = {
  resumeService: new ResumeService(resumeRepository),
};
