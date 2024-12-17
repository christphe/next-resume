import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResumeService } from "./resume.service";
import { ResumeDocument, ResumeRepository } from "./spi/resume.repository";

const mockResumeData = {
  name: { first: "John", last: "Doe" },
  about: "Software Developer",
  position: "Full Stack Developer",
  location: "New York",
  experience: [
    {
      company: "Company A",
      position: "Developer",
      timeperiod: "Jan 2020 - Present",
      description: "Developing software",
    },
  ],
  education: [
    {
      school: "University A",
      degree: "BSc Computer Science",
      timeperiod: "2015 - 2019",
    },
  ],
  skills: [{ name: "JavaScript", level: 5 }],
  hobbies: [{ name: "Reading", iconClass: "icon-reading" }],
  lang: "en",
};

const mockImagePath = "/images/profile.jpg";
const mockSampleImagePath = "/images/sample.jpg";

class MockResumeRepository implements ResumeRepository {
  async getSampleResume(): Promise<ResumeDocument> {
    throw new Error("Method not implemented.");
  }
  async getAllResumes(): Promise<ResumeDocument[]> {
    throw new Error("Method not implemented.");
  }
  getResumeByLang = vi.fn().mockResolvedValue(mockResumeData);
  getImagePath = vi.fn().mockResolvedValue(mockImagePath);
  getSampleImagePath = vi.fn().mockResolvedValue(mockSampleImagePath);
}

describe("ResumeService", () => {
  let resumeService: ResumeService;
  let mockResumeRepository: MockResumeRepository;

  beforeEach(() => {
    mockResumeRepository = new MockResumeRepository();
    resumeService = new ResumeService(mockResumeRepository);
  });

  it("should load resume data", async () => {
    const resume = await resumeService.getResume("en");
    expect(resume).toEqual(mockResumeData);
    expect(mockResumeRepository.getResumeByLang).toHaveBeenCalledWith("en");
  });

  it("should throw an error if resume not found", async () => {
    mockResumeRepository.getResumeByLang.mockResolvedValueOnce(null);
    await expect(resumeService.getResume("en")).rejects.toThrow(
      "Resume not found"
    );
  });

  it("should return image path", async () => {
    const imagePath = await resumeService.getImagePath();
    expect(imagePath).toBe(mockImagePath);
    expect(mockResumeRepository.getImagePath).toHaveBeenCalled();
  });

  it("should return sample image path if image path is null", async () => {
    mockResumeRepository.getImagePath.mockResolvedValueOnce(null);
    const imagePath = await resumeService.getImagePath();
    expect(imagePath).toBe(mockSampleImagePath);
    expect(mockResumeRepository.getSampleImagePath).toHaveBeenCalled();
  });
});
