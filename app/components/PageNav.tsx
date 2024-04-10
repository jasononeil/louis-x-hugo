import { Link } from "@remix-run/react";
export interface PageNav {
  backTo: string;
  nextTo: string;
  backText?: string;
  nextText?: string;
}

export default function PageNav({ backTo, nextTo, backText, nextText }: PageNav) {
  return (
    <div className="flex">
      <Link to={backTo} className="border border-solid border-black p-1 mx-1">
        &lt;-- Back {backText && backText}
      </Link>
      <Link to={nextTo} className="border border-solid border-black p-1 mx-1">
        Next {nextText && nextText} --&gt;
      </Link>
    </div>
  );
}
