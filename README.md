This is next resume, a project very heavily inspired by [salomonelli/best-resume-ever](https://github.com/salomonelli/best-resume-ever).

It is a modern web application built with Next.js that allows users to create and customize their resumes. The project leverages Tailwind CSS for styling and Puppeteer for exporting resumes to PDF format. Users can edit their resume data in YAML files, making it easy to manage and update their information.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/resume/en/two-pages](http://localhost:3000/resume/en/two-pages) with your browser to see the result.


## Fill data

# Documentation on Editing Resume Data

To edit the resume data, follow these steps:

1. **Copy Example Data Files**:
    - Copy the `example.data.yml` file to a new file named `data-[lang].yml`, where `[lang]` is the language code you want to use (e.g., `data-en.yml` for English, `data-fr.yml` for French).
    - Copy the `example.contact.yml` file to a new file named `contact.yml`. if you don't, no contact information will be displayed (useful for public resume to avoid scraping)

2. **Edit the Information**:
    - Open the newly created `data-[lang].yml` file and update the resume information as needed. This file contains the main content of the resume, such as work experience, education, skills, and other relevant sections.
    - Open the `contact.yml` file and update the contact information. This file contains personal details such as name, email, phone number, and address.
    - Copy your photo as `id.jpg` in the `public/img` folder.


By following these steps, you can customize the resume data to fit your specific needs.

## Export

if server is started, you can run `npm run pdf`, else, run `npm run export`.
Pdf files will be generated in the `pdf` directory.

