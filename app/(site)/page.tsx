import Image from "next/image";
import FeedbackForm from "./components/feedback-form";

export default function Home() {
  return (
    <div className="container mt-20">
      <div>
        <FeedbackForm />
      </div>
    </div>
  );
}
