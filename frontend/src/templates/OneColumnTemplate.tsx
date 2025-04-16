import React from "react";

interface ResumeData {
  personalInfo: {
    name: string;
    contacts: string[];
  };
  summary: string;
  skills: {
    [key: string]: string[];
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
  }>;
  projects: Array<{
    name: string;
    date: string;
    details: string[];
  }>;
}

interface ResumeTemplateProps {
  data: ResumeData;
  isEditable: boolean;
  onDataChange: (updatedData: ResumeData) => void;
}

const DEFAULT_DATA: ResumeData = {
  personalInfo: {
    name: "Your Name",
    contacts: ["Email", "Phone", "LinkedIn"],
  },
  summary: "Write your professional summary here...",
  skills: {
    technical: ["Skill 1", "Skill 2", "Skill 3"],
    soft: ["Soft Skill 1", "Soft Skill 2"],
  },
  experience: [
    {
      company: "Company Name",
      role: "Your Role",
      date: "Start Date - End Date",
      details: ["Achievement 1", "Achievement 2"],
    },
  ],
  education: [
    {
      school: "University Name",
      degree: "Your Degree",
      specialization: "Your Specialization",
    },
  ],
  certifications: [
    { name: "Certification 1" },
    { name: "Certification 2" },
  ],
  projects: [
    {
      name: "Project Name",
      date: "Project Date",
      details: ["Project Detail 1", "Project Detail 2"],
    },
  ],
};

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({
  data,
  isEditable,
  onDataChange,
}) => {
  const mergedData: ResumeData = {
    ...DEFAULT_DATA,
    ...data,
    personalInfo: {
      ...DEFAULT_DATA.personalInfo,
      ...data?.personalInfo,
    },
    skills: {
      ...DEFAULT_DATA.skills,
      ...data?.skills,
    },
  };

  const handleChange = (
    section: keyof ResumeData,
    field: string,
    value: any,
    index?: number
  ) => {
    const updatedData = { ...mergedData };

    if (section === "personalInfo") {
      if (field === "contacts" && Array.isArray(value)) {
        updatedData.personalInfo.contacts = value;
      } else {
        updatedData.personalInfo = {
          ...updatedData.personalInfo,
          [field]: value,
        };
      }
    } else if (section === "skills") {
      const skillsArray =
        typeof value === "string"
          ? value.split(",").map((item) => item.trim()).filter((item) => item)
          : Array.isArray(value)
          ? value
          : [];
      updatedData.skills = {
        ...updatedData.skills,
        [field]: skillsArray,
      };
    } else if (index !== undefined && Array.isArray(updatedData[section])) {
      const sectionArray = [...updatedData[section]];
      sectionArray[index] = {
        ...sectionArray[index],
        [field]: value,
      };
      updatedData[section] = sectionArray;
    } else {
      updatedData[section] = value;
    }

    onDataChange(updatedData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 font-serif">
        {/* Personal Info Section */}
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
            {isEditable ? (
              <input
                type="text"
                value={mergedData.personalInfo.name}
                onChange={(e) =>
                  handleChange("personalInfo", "name", e.target.value)
                }
                className="text-center w-full border-none focus:outline-none text-green-800"
              />
            ) : (
              mergedData.personalInfo.name
            )}
          </h1>
          <div className="flex justify-center gap-6 text-sm">
            {mergedData.personalInfo.contacts.map((contact, index) => (
              <span key={index} className="text-gray-600">
                {isEditable ? (
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      const newContacts = [...mergedData.personalInfo.contacts];
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

        {/* Summary Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-800 mb-2">Summary</h2>
          {isEditable ? (
            <textarea
              value={mergedData.summary}
              onChange={(e) => handleChange("summary", "", e.target.value)}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-700">{mergedData.summary}</p>
          )}
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-green-800 mb-2">Skills</h2>
          {Object.entries(mergedData.skills || {}).map(([category, skillList]) => (
            <div key={category} className="mb-3">
              <h3 className="font-semibold text-gray-700 capitalize mb-1">
                {category}
              </h3>
              {isEditable ? (
                <input
                  type="text"
                  value={Array.isArray(skillList) ? skillList.join(", ") : ""}
                  onChange={(e) =>
                    handleChange("skills", category, e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder={`Enter ${category} skills, separated by commas`}
                />
              ) : (
                <p className="text-gray-600">
                  {Array.isArray(skillList) ? skillList.join(", ") : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
