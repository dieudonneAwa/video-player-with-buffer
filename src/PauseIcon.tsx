import React from "react";

export default function Pause({
  fill = "#fff",
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect x="7" y="6" width="3" height="12" rx="1.5" fill={fill} />
      <rect
        opacity="0.5"
        x="14"
        y="6"
        width="3"
        height="12"
        rx="1.5"
        fill={fill}
      />
    </svg>
  );
}
