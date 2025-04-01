import { FC } from "react";
import Image from "next/image";

interface InfoCardProps {
  image: {
    url: string;
  };
  title: string;
  mentor: string;
  mentorLink?: string;
  description: string;
  level?: string;
  classModel?: string;
  target?: string;
  requirements?: string;
  projects?: string;
  homework?: string;
  highlight?: string;
  additionalInfo?: string;
}

const InfoCard: FC<InfoCardProps> = ({
  image,
  title,
  description,
  mentor,
  mentorLink,
  level,
  classModel,
  target,
  requirements,
  projects,
  homework,
  highlight,
  additionalInfo,
}) => {
  return (
    <div className="bg-[#022C7D] p-4 rounded-lg flex flex-col items-center w-full max-w-sm">
      <div className="relative w-full h-56">
        <Image
          src={image.url}
          alt={title}
          fill
          className="object-cover rounded-lg border-[5px] border-[#FF6D3A]"
        />
      </div>

      <h3 className="text-[#FF6D3A] text-3xl font-gilroy-extrabold mb-4 mt-4">
        {title}
      </h3>

      {/* Scrollable content area */}
      <div className="w-full mt-2 space-y-4 font-gilroy-medium text-white text-[19px] overflow-y-auto max-h-[500px] pr-2">
        {mentor && (
          <div className="flex flex-row gap-2">
            <p className="flex items-center gap-2">
              🕯️ Mentor(a):
              {mentorLink ? (
                <a
                  className="underline text-[#FFA500] flex items-center gap-2"
                  href={mentorLink}
                  target="_blank"
                >
                  {mentorLink.includes("instagram") && (
                    <Image
                      src="https://escola.nitro.academy/wp-content/uploads/2025/03/ig.svg"
                      alt={title}
                      width={20}
                      height={20}
                    />
                  )}
                  {mentor}
                </a>
              ) : (
                <p>{mentor}</p>
              )}
            </p>
          </div>
        )}
        <p className="font-gilroy-regular">{description}</p>
        {level && <p>{level}</p>}
        {classModel && <p>{classModel}</p>}
        {target && <p>{target}</p>}
        {requirements && <p>{requirements}</p>}
        {projects && <p>{projects}</p>}
        {homework && <p>{homework}</p>}
        {highlight && <p>{highlight}</p>}
        {additionalInfo && <p>{additionalInfo}</p>}
      </div>
    </div>
  );
};

export default InfoCard;
