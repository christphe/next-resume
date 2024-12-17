import { usei18n } from "@/src/i18n/i18n";
import { ResumeData, ResumeService } from "@/src/resume/resume.service";
import {
  FlaskConicalIcon,
  GraduationCapIcon,
  HistoryIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import "./page.scss";
import { appContext } from "@/src/app";

interface ResumeProps {
  params: Promise<{ lang: string | "sample" }>;
}

export default async function Resume(props: ResumeProps) {
  const { lang } = await props.params;
  const resumeService = appContext.resumeService;

  let data: ResumeData;
  let resumeLang: string;
  let imagePath: string;
  if (lang !== "sample") {
    data = await resumeService.getResume(lang);
    imagePath = await resumeService.getImagePath();
  } else {
    data = await resumeService.getSampleResume();
    imagePath = await resumeService.getSampleImagePath();  
  }
  resumeLang = data.lang;


  const { t } = await usei18n(resumeLang);

  return (
    <div className="page">
      <div className="">
        <div className="flex flex-col">
          <div className="mt-[0.5cm] px-[1cm] py-[0.5cm] bg-[#e1e5f2ff] h-[128px] font-[400]">
            <div className="mb-[6px]">
              <span className="uppercase text-[3em]">{`${data.name.first} ${data.name.last}`}</span>
            </div>
            <div className="">
              <span className="uppercase text-[1.5em]">{data.position}</span>
            </div>
          </div>
          <div className="mugshot">
            <Image width={128} height={128} alt="photo" src={imagePath} />
          </div>
          <div className="content">
            <div className="flex flex-row flex-wrap">
              {data.contact && data.contact.email && (
                <div className="mt-1 px-1">
                  <MailIcon
                    width={14}
                    className="inline-block mr-1 mt-[-2px]"
                  />
                  {data.contact.email}
                </div>
              )}
              {data.contact && data.contact.email && (
                <div className="mt-1 px-1">
                  <PhoneIcon
                    width={14}
                    className="inline-block mr-1 mt-[-2px]"
                  />
                  {data.contact.phone}
                </div>
              )}
              <div className="mt-1 px-1">
                <HomeIcon width={14} className="inline-block mr-1 mt-[-2px]" />
                {data.location}
              </div>
            </div>
            <div className="about-section section">
              <div className="section-title headline">
                <UserIcon
                  width={20}
                  className="inline-block align-text-bottom mr-1"
                />
                {t("resume.aboutme")}
              </div>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: data.about }}
              ></div>
            </div>
            <div className="skills-section section">
              <div className="section-title headline">
                <FlaskConicalIcon
                  width={20}
                  className="inline-block align-text-bottom mr-1"
                />
                {t("resume.skills")}
              </div>
              <div className="section-content grid grid-cols-3">
                {data.skills.map((skill, index) => (
                  <div key={index} className="section-content__item">
                    <div>{skill.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="section experience-section">
              <div className="section-title headline">
                <HistoryIcon
                  width={20}
                  className="inline-block align-middle mr-1"
                />
                {t("resume.experience")}
              </div>
              <div className="section-content">
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className={`section-content__item item_${index}`}
                  >
                    <div className="section-title flex flex-row">
                      <div className="position flex-auto">
                        {exp.company} - {exp.position}
                      </div>
                      <div className="timeperiod flex-none text-right">
                        {exp.timeperiod}
                      </div>
                    </div>
                    <div className="section-content__text description ml-[0.5cm]">
                      <div
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="section">
              <div className="section-title headline">
                <GraduationCapIcon
                  width={20}
                  className="inline-block align-text-bottom mr-1"
                />
                {t("resume.education")}
              </div>
              <div className="section-content">
                {data.education.map((edu, index) => (
                  <div key={index} className="ml-[0.5cm]">
                    <div className="section-title flex flex-row">
                      <div className="degree flex-auto">
                        {edu.school} - {edu.degree}
                      </div>
                      <div className="timeperiod flex-none text-right">
                        {edu.timeperiod}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
