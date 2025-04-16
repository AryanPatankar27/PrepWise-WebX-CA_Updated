import React, { useState, useRef } from 'react';
import { Eye, Pencil, Printer } from 'lucide-react';

interface ResumeData {
  personalInfo: {
    name: string;
    contacts: string[];
  };
  summary: string;
  skills: {
    automation: string[];
    languages: string[];
    policies: string[];
    testing: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    date: string;
    details: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    specialization: string;
  }>;
  certifications: Array<{
    name: string;
    details?: string;
  }>;
  projects: Array<{
    name: string;
    date: string;
    details: string[];
  }>;
}

const INITIAL_DATA = {
  personalInfo: {
    name: "John Doe",
    contacts: [
      "123-456-7890",
      "info@example.com",
      "linkedin.com/in/john",
      "github.com/john"
    ]
  },
  summary: "Simplified version of a monstrosity that I built back in college using current best practices.",
  skills: {
    automation: ["Saltstack", "Ansible", "Chef", "Puppet"],
    languages: ["Python", "Bash", "PHP", "Perl", "AWK", "Sed"],
    policies: ["Git", "SDLC", "PCI-DSS", "GDPR", "ITIL"],
    testing: ["Pytest", "Docker", "CircleCI", "Jenkins", "Jmeter"]
  },
  experience: [
    {
      company: "Consulting Corp",
      role: "DevOps Engineer (FTE Consultant)",
      date: "Jul 2015 - Jun 2023",
      details: [
        "Analyzed network traffic patterns to identify bottlenecks and optimize performance",
        "Implemented firewall rules to enhance network security and prevent unauthorized access",
        "Conducted regular security assessments and applied patches to secure systems",
        "Collaborated with cross-functional teams to streamline IT processes and improve efficiency"
      ]
    }
  ],
  education: [
    {
      school: "State University",
      degree: "Bachelor of Science",
      specialization: "Computer Information Systems, Network Security"
    }
  ],
  certifications: [
    {
      name: "CISSP - Certified Information Systems Security Professional"
    },
    {
      name: "CEH - Professional Cloud Architect"
    }
  ],
  projects: [
    {
      name: "Hospital / Health Center HR",
      date: "Mar 2015 - Present",
      details: [
        "Served as on-site scientific/affiliated patient representative",
        "Reviewed patient experiential terms for completeness, accuracy, and clarity",
        "Became familiar with industry standards and regulations (OMB/HIPAA)"
      ]
    }
  ]
};

const MinimalTemplate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleChange = (
    section: keyof ResumeData,
    field: string,
    value: any,
    index: number = -1
  ) => {
    setResumeData((prev) => {
      const newData = { ...prev };
      if (index !== -1) {
        (newData[section] as any)[index][field] = value;
      } else if (section === "personalInfo") {
        (newData.personalInfo as any)[field] = value;
      } else if (section === "skills") {
        (newData.skills as any)[field] = value;
      } else {
        (newData as any)[section] = value;
      }
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="print:hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6 flex gap-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? (
              <>
                <Eye className="h-5 w-5" /> Preview
              </>
            ) : (
              <>
                <Pencil className="h-5 w-5" /> Edit
              </>
            )}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Printer className="h-5 w-5" /> Save as PDF
          </button>
        </div>
      </div>

      <div ref={resumeRef} className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
        <div className="p-8 font-serif">
          <div className="mb-6 border-b border-gray-300 pb-4">
            <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
              {isEditing ? (
                <input
                  type="text"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => handleChange("personalInfo", "name", e.target.value)}
                  className="text-center w-full border-none focus:outline-none text-green-800"
                />
              ) : (
                resumeData.personalInfo.name
              )}
            </h1>
            <div className="flex justify-center gap-6 text-sm">
              {resumeData.personalInfo.contacts.map((contact, index) => (
                <span key={index} className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        const newContacts = [...resumeData.personalInfo.contacts];
                        newContacts[index] = e.target.value;
                        handleChange("personalInfo", "contacts", newContacts);
                      }}
                      className="text-center w-40 border-none focus:outline-none"
                    />
                  ) : (
                    contact
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Summary</h2>
            {isEditing ? (
              <textarea
                value={resumeData.summary}
                onChange={(e) => handleChange("summary", "", e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="text-gray-700">{resumeData.summary}</p>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Skills</h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(resumeData.skills).map(([category, items]) => (
                <div key={category} className="flex">
                  <span className="font-bold w-24 capitalize">{category}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={items.join(", ")}
                      onChange={(e) => {
                        const newSkills = { ...resumeData.skills };
                        (newSkills as any)[category] = e.target.value.split(", ");
                        handleChange("skills", category, (newSkills as any)[category]);
                      }}
                      className="flex-1 ml-2 border-none focus:outline-none"
                    />
                  ) : (
                    <span className="ml-2">{items.join(", ")}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <div className="font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleChange("experience", "company", e.target.value, index)}
                        className="border-none focus:outline-none font-bold"
                      />
                    ) : (
                      exp.company
                    )}
                  </div>
                  <div className="text-gray-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) => handleChange("experience", "date", e.target.value, index)}
                        className="text-right border-none focus:outline-none"
                      />
                    ) : (
                      exp.date
                    )}
                  </div>
                </div>
                <div className="italic mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => handleChange("experience", "role", e.target.value, index)}
                      className="border-none focus:outline-none italic w-full"
                    />
                  ) : (
                    exp.role
                  )}
                </div>
                <ul className="list-disc ml-5">
                  {exp.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => {
                            const newExp = [...resumeData.experience];
                            newExp[index].details[detailIndex] = e.target.value;
                            handleChange("experience", "details", newExp[index].details, index);
                          }}
                          className="border-none focus:outline-none w-full"
                        />
                      ) : (
                        detail
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Education</h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleChange("education", "school", e.target.value, index)}
                      className="border-none focus:outline-none font-bold w-full"
                    />
                  ) : (
                    edu.school
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={`${edu.degree} in ${edu.specialization}`}
                      onChange={(e) => {
                        const [degree, ...spec] = e.target.value.split(" in ");
                        const newEdu = [...resumeData.education];
                        newEdu[index].degree = degree;
                        newEdu[index].specialization = spec.join(" in ");
                        handleChange("education", "", newEdu);
                      }}
                      className="border-none focus:outline-none w-full"
                    />
                  ) : (
                    `${edu.degree} in ${edu.specialization}`
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange("certifications", "name", e.target.value, index)}
                    className="border-none focus:outline-none w-full"
                  />
                ) : (
                  cert.name
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <div className="font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleChange("projects", "name", e.target.value, index)}
                        className="border-none focus:outline-none font-bold"
                      />
                    ) : (
                      project.name
                    )}
                  </div>
                  <div className="text-gray-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.date}
                        onChange={(e) => handleChange("projects", "date", e.target.value, index)}
                        className="text-right border-none focus:outline-none"
                      />
                    ) : (
                      project.date
                    )}
                  </div>
                </div>
                <ul className="list-disc ml-5">
                  {project.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => {
                            const newProj = [...resumeData.projects];
                            newProj[index].details[detailIndex] = e.target.value;
                            handleChange("projects", "details", newProj[index].details, index);
                          }}
                          className="border-none focus:outline-none w-full"
                        />
                      ) : (
                        detail
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default  MinimalTemplate;