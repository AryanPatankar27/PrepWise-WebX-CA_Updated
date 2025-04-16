import React, { useState, useEffect } from "react";

// Define types for the Resume data structure
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  points: string[];
}

interface Project {
  name: string;
  role?: string;
  points: string[];
}

interface Education {
  university: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: string;
}

interface SkillGroup {
  category: string;
  items: string[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: SkillGroup[];
  societies: string[];
  coursework: { [key: string]: string[] };
  links: { [key: string]: string };
}

interface ProfessionalTemplateProps {
  data: ResumeData;
  isEditable: boolean;
}

const ProfessionalTemplates: React.FC<ProfessionalTemplateProps> = ({
  data,
  isEditable,
}) => {
  const [editableData, setEditableData] = useState<ResumeData>(data);

  useEffect(() => {
    setEditableData(data); // Update state if incoming data changes
  }, [data]);

  const handleChange = (
    section: string,
    field: string,
    value: any,
    index: number = -1
  ) => {
    setEditableData((prevData) => {
      const newData = { ...prevData };

      if (section === "experience") {
        if (index !== -1) {
          newData.experience[index][field] = value;
        }
      } else if (section === "projects") {
        if (index !== -1) {
          newData.projects[index][field] = value;
        }
      } else if (section === "education") {
        if (index !== -1) {
          newData.education[index][field] = value;
        }
      } else if (section === "skills") {
        newData.skills[index].items = value
          .split(",")
          .map((item: string) => item.trim());
      } else if (section === "societies") {
        newData.societies = value.split(",").map((item: string) => item.trim());
      } else if (section === "coursework") {
        newData.coursework[field] = value
          .split(",")
          .map((item: string) => item.trim());
      } else if (section === "personalInfo") {
        newData.personalInfo[field] = value;
      } else if (section === "links") {
        newData.links[field] = value;
      }
      return newData;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white font-[Georgia]">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isEditable ? (
            <input
              type="text"
              value={editableData.personalInfo.name}
              onChange={(e) =>
                handleChange("personalInfo", "name", e.target.value)
              }
              className="text-center"
            />
          ) : (
            editableData.personalInfo.name
          )}
        </h1>
        <div className="text-sm">
          {isEditable ? (
            <input
              type="text"
              value={editableData.personalInfo.email}
              onChange={(e) =>
                handleChange("personalInfo", "email", e.target.value)
              }
              className="text-center"
            />
          ) : (
            editableData.personalInfo.email
          )}
          {" | "}
          {isEditable ? (
            <input
              type="text"
              value={editableData.personalInfo.phone}
              onChange={(e) =>
                handleChange("personalInfo", "phone", e.target.value)
              }
              className="text-center"
            />
          ) : (
            editableData.personalInfo.phone
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Experience Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Experience
            </h2>
            {editableData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">
                      {isEditable ? (
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleChange(
                              "experience",
                              "company",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        exp.company
                      )}
                    </div>
                    <div className="italic">
                      {isEditable ? (
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            handleChange(
                              "experience",
                              "position",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        exp.position
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {isEditable ? (
                      <input
                        type="text"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const [start, end] = e.target.value.split(" - ");
                          handleChange("experience", "startDate", start, index);
                          handleChange("experience", "endDate", end, index);
                        }}
                      />
                    ) : (
                      `${exp.startDate} - ${exp.endDate}`
                    )}
                    <div>
                      {isEditable ? (
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) =>
                            handleChange(
                              "experience",
                              "location",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        exp.location
                      )}
                    </div>
                  </div>
                </div>
                <ul className="list-disc ml-6 space-y-1">
                  {exp.points.map((point, pointIndex) => (
                    <li key={pointIndex}>
                      {isEditable ? (
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...exp.points];
                            newPoints[pointIndex] = e.target.value;
                            handleChange(
                              "experience",
                              "points",
                              newPoints,
                              index
                            );
                          }}
                        />
                      ) : (
                        point
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Projects Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Projects
            </h2>
            {editableData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="font-bold flex justify-between">
                  {isEditable ? (
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) =>
                        handleChange("projects", "name", e.target.value, index)
                      }
                    />
                  ) : (
                    project.name
                  )}
                  {isEditable ? (
                    <input
                      type="text"
                      value={project.role || ""}
                      onChange={(e) =>
                        handleChange("projects", "role", e.target.value, index)
                      }
                      className="italic"
                    />
                  ) : (
                    project.role
                  )}
                </div>
                <ul className="list-disc ml-6 space-y-1">
                  {project.points.map((point, pointIndex) => (
                    <li key={pointIndex}>
                      {isEditable ? (
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newPoints = [...project.points];
                            newPoints[pointIndex] = e.target.value;
                            handleChange(
                              "projects",
                              "points",
                              newPoints,
                              index
                            );
                          }}
                        />
                      ) : (
                        point
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column */}
        <div>
          {/* Education Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Education
            </h2>
            {editableData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-bold">
                      {isEditable ? (
                        <input
                          type="text"
                          value={edu.university}
                          onChange={(e) =>
                            handleChange(
                              "education",
                              "university",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        edu.university
                      )}
                    </div>
                    <div>
                      {isEditable ? (
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleChange(
                              "education",
                              "degree",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        edu.degree
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {isEditable ? (
                      <input
                        type="text"
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={(e) => {
                          const [start, end] = e.target.value.split(" - ");
                          handleChange("education", "startDate", start, index);
                          handleChange("education", "endDate", end, index);
                        }}
                      />
                    ) : (
                      `${edu.startDate} - ${edu.endDate}`
                    )}
                    <div>
                      {isEditable ? (
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) =>
                            handleChange(
                              "education",
                              "location",
                              e.target.value,
                              index
                            )
                          }
                        />
                      ) : (
                        edu.location
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
          {/* Other Sections */}
          {/* You can add skills, societies, coursework, and links here */}
          {/* Skills Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Skills
            </h2>
            {editableData.skills.map((skillGroup, index) => (
              <div key={index} className="mb-4">
                <div className="font-bold">{skillGroup.category}</div>
                <div>
                  {isEditable ? (
                    <input
                      type="text"
                      value={skillGroup.items.join(", ")}
                      onChange={(e) =>
                        handleChange("skills", "items", e.target.value, index)
                      }
                      className="w-full"
                    />
                  ) : (
                    skillGroup.items.join(", ")
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Societies Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Societies & Activities
            </h2>
            <div>
              {isEditable ? (
                <input
                  type="text"
                  value={editableData.societies.join(", ")}
                  onChange={(e) =>
                    handleChange("societies", "", e.target.value)
                  }
                  className="w-full"
                />
              ) : (
                editableData.societies.join(", ")
              )}
            </div>
          </section>

          {/* Coursework Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Relevant Coursework
            </h2>
            {Object.entries(editableData.coursework).map(
              ([subject, courses], index) => (
                <div key={index} className="mb-2">
                  <div className="font-bold">{subject}</div>
                  <div>
                    {isEditable ? (
                      <input
                        type="text"
                        value={courses.join(", ")}
                        onChange={(e) =>
                          handleChange("coursework", subject, e.target.value)
                        }
                        className="w-full"
                      />
                    ) : (
                      courses.join(", ")
                    )}
                  </div>
                </div>
              )
            )}
          </section>

          {/* Links Section */}
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-300">
              Links
            </h2>
            {Object.entries(editableData.links).map(([platform, url]) => (
              <div key={platform} className="flex justify-between mb-2">
                <span className="font-bold">{platform}</span>
                <div className="w-1/2">
                  {isEditable ? (
                    <input
                      type="text"
                      value={url.toString()}
                      onChange={(e) =>
                        handleChange("links", platform, e.target.value)
                      }
                      className="w-full"
                    />
                  ) : (
                    <a
                      href={url.toString()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {url.toString()}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplates;
